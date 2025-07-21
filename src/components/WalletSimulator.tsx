import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGasStore } from '@/stores/gasStore';
import { Calculator, DollarSign } from 'lucide-react';

const GAS_LIMIT_TRANSFER = 21000;

export const WalletSimulator = () => {
  const { 
    chains, 
    usdPrice, 
    simulationAmount, 
    setSimulationAmount, 
    mode, 
    setMode 
  } = useGasStore();

  const calculateCost = (chainName: keyof typeof chains) => {
    const chain = chains[chainName];
    const amount = parseFloat(simulationAmount) || 0;
    
    // Gas cost in ETH
    const gasCostWei = (chain.baseFee + chain.priorityFee) * GAS_LIMIT_TRANSFER / 1e9; // Convert gwei to ETH
    const gasCostUsd = gasCostWei * usdPrice;
    
    // Transaction value in USD
    const transactionValueUsd = amount * usdPrice;
    
    // Total cost
    const totalCostUsd = gasCostUsd + transactionValueUsd;
    
    return {
      gasCostEth: gasCostWei,
      gasCostUsd,
      transactionValueUsd,
      totalCostUsd,
    };
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Wallet Simulator</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === 'live' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('live')}
          >
            Live Mode
          </Button>
          <Button
            variant={mode === 'simulation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('simulation')}
          >
            Simulation
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">
            Transaction Amount (ETH)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.5"
            value={simulationAmount}
            onChange={(e) => setSimulationAmount(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-muted-foreground">
            ETH Price: ${usdPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Cross-Chain Cost Comparison</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 text-muted-foreground">Network</th>
                <th className="text-right p-2 text-muted-foreground">Gas Cost</th>
                <th className="text-right p-2 text-muted-foreground">Tx Value</th>
                <th className="text-right p-2 text-muted-foreground">Total Cost</th>
                <th className="text-center p-2 text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(chains).map(([chainName, chain]) => {
                const costs = calculateCost(chainName as keyof typeof chains);
                const isConnected = chain.isConnected;
                
                return (
                  <tr key={chainName} className="border-b border-border/50">
                    <td className="p-2 font-medium text-foreground">
                      {chain.name}
                    </td>
                    <td className="p-2 text-right font-mono">
                      {isConnected ? (
                        <div>
                          <div>${costs.gasCostUsd.toFixed(4)}</div>
                          <div className="text-xs text-muted-foreground">
                            {costs.gasCostEth.toFixed(8)} ETH
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="p-2 text-right font-mono">
                      {isConnected && simulationAmount ? (
                        <div>${costs.transactionValueUsd.toFixed(2)}</div>
                      ) : (
                        <span className="text-muted-foreground">$0.00</span>
                      )}
                    </td>
                    <td className="p-2 text-right font-mono font-bold">
                      {isConnected && simulationAmount ? (
                        <div className="text-primary">
                          ${costs.totalCostUsd.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                        {isConnected ? 'Live' : 'Offline'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};