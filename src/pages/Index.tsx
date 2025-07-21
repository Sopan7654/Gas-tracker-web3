import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGasStore } from '@/stores/gasStore';
import { GasWidget } from '@/components/GasWidget';
import { GasChart } from '@/components/GasChart';
import { WalletSimulator } from '@/components/WalletSimulator';
import { Activity, BarChart3, Wallet, Zap } from 'lucide-react';

const Index = () => {
  const { 
    initializeProviders, 
    startGasTracking, 
    stopGasTracking, 
    mode,
    chains 
  } = useGasStore();

  useEffect(() => {
    // Initialize providers and start tracking when component mounts
    initializeProviders();
    startGasTracking();

    // Cleanup on unmount
    return () => {
      stopGasTracking();
    };
  }, [initializeProviders, startGasTracking, stopGasTracking]);

  const connectedChains = Object.values(chains).filter(chain => chain.isConnected).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-info/3" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8 py-12 md:py-16">
            <div className="flex flex-col items-center gap-6 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-float">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-2xl blur-xl animate-pulse-slow" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black gradient-text leading-tight tracking-tight">
                  Web3 Gas Tracker
                </h1>
                <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto" />
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                  Professional cross-chain gas analytics with real-time monitoring, 
                  intelligent predictions, and seamless wallet integration
                </p>
              </div>
            </div>
            
            {/* Status Dashboard */}
            <div className="flex items-center justify-center gap-6 flex-wrap mt-8">
              <div className="glass-card px-6 py-3 rounded-full">
                <div className="flex items-center gap-3">
                  <div className="status-indicator status-online w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm font-medium text-foreground">
                    {connectedChains}/3 Networks Active
                  </span>
                </div>
              </div>
              
              <Badge 
                variant={mode === 'live' ? 'default' : 'secondary'} 
                className="px-4 py-2 text-sm font-medium"
              >
                <Activity className="w-4 h-4 mr-2" />
                {mode === 'live' ? 'Live Trading Mode' : 'Simulation Mode'}
              </Badge>
              
              <div className="glass-card px-4 py-2 rounded-full">
                <span className="text-sm text-muted-foreground">
                  Updated every 6 seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gas Metrics Dashboard */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-primary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">Live Gas Metrics</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GasWidget chainName="ethereum" />
              <GasWidget chainName="polygon" />
              <GasWidget chainName="arbitrum" />
            </div>
        </div>

        {/* Advanced Analytics Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-primary rounded-full" />
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Price Analytics & Trends</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              <Badge variant="outline" className="text-xs">
                15min intervals
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <GasChart chainName="ethereum" />
              <GasChart chainName="polygon" />
              <GasChart chainName="arbitrum" />
            </div>
        </div>

        {/* Transaction Simulator */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-primary rounded-full" />
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Smart Transaction Simulator</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              <Badge variant="outline" className="text-xs">
                Real-time estimates
              </Badge>
            </div>
            <WalletSimulator />
        </div>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="elevated-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real-Time Infrastructure</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div>
                  <span className="font-medium text-foreground">Native RPC Integration</span>
                  <p className="text-muted-foreground">Direct blockchain connections for accurate gas prices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div>
                  <span className="font-medium text-foreground">WebSocket Streaming</span>
                  <p className="text-muted-foreground">6-second refresh intervals with live updates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-info mt-2" />
                <div>
                  <span className="font-medium text-foreground">Multi-Chain Support</span>
                  <p className="text-muted-foreground">Ethereum, Polygon, and Arbitrum networks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chart-neutral mt-2" />
                <div>
                  <span className="font-medium text-foreground">Price Oracle Integration</span>
                  <p className="text-muted-foreground">CoinGecko API for USD conversions</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="elevated-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Advanced Features</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div>
                  <span className="font-medium text-foreground">Interactive Charts</span>
                  <p className="text-muted-foreground">Professional candlestick visualizations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div>
                  <span className="font-medium text-foreground">Smart Simulation</span>
                  <p className="text-muted-foreground">Real-time transaction cost estimates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-info mt-2" />
                <div>
                  <span className="font-medium text-foreground">Cross-Chain Analysis</span>
                  <p className="text-muted-foreground">Compare costs across multiple networks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chart-neutral mt-2" />
                <div>
                  <span className="font-medium text-foreground">Historical Data</span>
                  <p className="text-muted-foreground">Trend analysis with 15-minute intervals</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Technology Stack Footer */}
        <div className="glass-card p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold text-foreground mb-4">Built with Modern Web3 Stack - Sopan Bharkad</h4>
            {/* <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">React 18</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Ethers.js v6</Badge>
              <Badge variant="outline">Zustand</Badge>
              <Badge variant="outline">Lightweight Charts</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Vite</Badge>
            </div> */}
            <p className="mt-4 text-muted-foreground">
              Professional-grade Web3 application demonstrating real-time blockchain data integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
