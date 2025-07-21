import { create } from 'zustand';
import { ethers } from 'ethers';

export interface GasPoint {
  timestamp: number;
  baseFee: number;
  priorityFee: number;
  totalGas: number;
}

export interface ChainData {
  name: string;
  baseFee: number;
  priorityFee: number;
  history: GasPoint[];
  isConnected: boolean;
  lastUpdate: number;
}

export interface GasStore {
  mode: 'live' | 'simulation';
  chains: {
    ethereum: ChainData;
    polygon: ChainData;
    arbitrum: ChainData;
  };
  usdPrice: number;
  simulationAmount: string;
  providers: {
    ethereum: ethers.JsonRpcProvider | null;
    polygon: ethers.JsonRpcProvider | null;
    arbitrum: ethers.JsonRpcProvider | null;
  };
  
  // Actions
  setMode: (mode: 'live' | 'simulation') => void;
  updateChainData: (chain: keyof GasStore['chains'], data: Partial<ChainData>) => void;
  updateUsdPrice: (price: number) => void;
  setSimulationAmount: (amount: string) => void;
  initializeProviders: () => void;
  startGasTracking: () => void;
  stopGasTracking: () => void;
  addGasPoint: (chain: keyof GasStore['chains'], point: GasPoint) => void;
}

const RPC_ENDPOINTS = {
  ethereum: 'https://eth.drpc.org',
  polygon: 'https://polygon.drpc.org',
  arbitrum: 'https://arbitrum.drpc.org',
};

const UNISWAP_V3_POOL = '0x88e6A0c2dDD26FEeFb64F039a2c41296FcB3f5640';

let gasTrackingInterval: NodeJS.Timeout;

export const useGasStore = create<GasStore>((set, get) => ({
  mode: 'live',
  chains: {
    ethereum: {
      name: 'Ethereum',
      baseFee: 0,
      priorityFee: 0,
      history: [],
      isConnected: false,
      lastUpdate: 0,
    },
    polygon: {
      name: 'Polygon',
      baseFee: 0,
      priorityFee: 0,
      history: [],
      isConnected: false,
      lastUpdate: 0,
    },
    arbitrum: {
      name: 'Arbitrum',
      baseFee: 0,
      priorityFee: 0,
      history: [],
      isConnected: false,
      lastUpdate: 0,
    },
  },
  usdPrice: 0,
  simulationAmount: '0.5',
  providers: {
    ethereum: null,
    polygon: null,
    arbitrum: null,
  },

  setMode: (mode) => set({ mode }),

  updateChainData: (chain, data) => 
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: { ...state.chains[chain], ...data },
      },
    })),

  updateUsdPrice: (price) => set({ usdPrice: price }),

  setSimulationAmount: (amount) => set({ simulationAmount: amount }),

  initializeProviders: () => {
    const providers = {
      ethereum: new ethers.JsonRpcProvider(RPC_ENDPOINTS.ethereum),
      polygon: new ethers.JsonRpcProvider(RPC_ENDPOINTS.polygon),
      arbitrum: new ethers.JsonRpcProvider(RPC_ENDPOINTS.arbitrum),
    };
    
    set({ providers });
  },

  startGasTracking: async () => {
    const { providers, updateChainData, addGasPoint } = get();
    
    const fetchGasData = async () => {
      try {
        for (const [chainName, provider] of Object.entries(providers)) {
          if (!provider) continue;
          
          try {
            const feeData = await provider.getFeeData();
            const block = await provider.getBlock('latest');
            
            if (feeData && block) {
              const baseFee = Number(ethers.formatUnits(feeData.gasPrice || 0, 'gwei'));
              const priorityFee = Number(ethers.formatUnits(feeData.maxPriorityFeePerGas || 0, 'gwei'));
              const totalGas = baseFee + priorityFee;
              
              updateChainData(chainName as keyof GasStore['chains'], {
                baseFee,
                priorityFee,
                isConnected: true,
                lastUpdate: Date.now(),
              });
              
              const gasPoint: GasPoint = {
                timestamp: Date.now(),
                baseFee,
                priorityFee,
                totalGas,
              };
              
              addGasPoint(chainName as keyof GasStore['chains'], gasPoint);
            }
          } catch (error) {
            console.error(`Error fetching gas data for ${chainName}:`, error);
            updateChainData(chainName as keyof GasStore['chains'], {
              isConnected: false,
            });
          }
        }
        
        // Fetch ETH/USD price from a simple API (fallback since Uniswap parsing is complex)
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
          const data = await response.json();
          get().updateUsdPrice(data.ethereum.usd);
        } catch (error) {
          console.error('Error fetching USD price:', error);
        }
        
      } catch (error) {
        console.error('Error in gas tracking:', error);
      }
    };
    
    // Initial fetch
    await fetchGasData();
    
    // Set up interval for every 6 seconds
    gasTrackingInterval = setInterval(fetchGasData, 6000);
  },

  stopGasTracking: () => {
    if (gasTrackingInterval) {
      clearInterval(gasTrackingInterval);
    }
  },

  addGasPoint: (chain, point) => 
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: {
          ...state.chains[chain],
          history: [...state.chains[chain].history.slice(-100), point], // Keep last 100 points
        },
      },
    })),
}));