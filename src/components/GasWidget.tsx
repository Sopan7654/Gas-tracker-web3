import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGasStore } from '@/stores/gasStore';
import { Activity, Zap, TrendingUp } from 'lucide-react';

interface GasWidgetProps {
  chainName: 'ethereum' | 'polygon' | 'arbitrum';
}

export const GasWidget = ({ chainName }: GasWidgetProps) => {
  const chains = useGasStore((state) => state.chains);
  const chain = chains[chainName];

  const getChainColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'ethereum': return 'chain-ethereum';
      case 'polygon': return 'chain-polygon';
      case 'arbitrum': return 'chain-arbitrum';
      default: return 'bg-muted';
    }
  };

  const getChainGradient = (name: string) => {
    switch (name.toLowerCase()) {
      case 'ethereum': return 'bg-gradient-to-br from-blue-500/20 to-blue-600/20';
      case 'polygon': return 'bg-gradient-to-br from-purple-500/20 to-purple-600/20';
      case 'arbitrum': return 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20';
      default: return 'bg-gradient-to-br from-gray-500/20 to-gray-600/20';
    }
  };

  const getChainLayer = (name: string) => {
    switch (name.toLowerCase()) {
      case 'ethereum': return '1';
      case 'polygon': return '2';
      case 'arbitrum': return '2';
      default: return '?';
    }
  };

  const formatGwei = (value: number) => {
    return value.toFixed(2);
  };

  const getStatusColor = () => {
    if (!chain.isConnected) return 'text-red-500';
    if (Date.now() - chain.lastUpdate > 30000) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="metric-card elevated-card p-6 relative overflow-hidden group">
      {/* Chain gradient background */}
      <div className={`absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10 ${getChainGradient(chain.name)}`} />
      
      {/* Chain accent border */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${getChainColor(chain.name)} transition-all group-hover:h-2`} />
      
      {/* Header with status */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`status-indicator w-3 h-3 rounded-full ${chain.isConnected ? 'status-online bg-success' : 'status-offline bg-error'}`} />
          <div>
            <h3 className="text-xl font-bold text-foreground">{chain.name}</h3>
            <p className="text-xs text-muted-foreground">Layer {getChainLayer(chain.name)}</p>
          </div>
        </div>
        <Badge 
          variant={chain.isConnected ? 'default' : 'destructive'} 
          className="text-xs font-medium"
        >
          {chain.isConnected ? 'LIVE' : 'OFFLINE'}
        </Badge>
      </div>

      {/* Main gas price display */}
      <div className="relative z-10 space-y-6">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-foreground gradient-text">
              {formatGwei(chain.baseFee + chain.priorityFee)}
            </span>
            <span className="text-lg text-muted-foreground font-medium">gwei</span>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            ≈ ${((chain.baseFee + chain.priorityFee) * 2000 * 21000 / 1e9).toFixed(4)} USD per transaction
          </div>
        </div>

        {/* Gas breakdown with enhanced styling */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 text-center rounded-lg transition-all hover:scale-105">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Base Fee</span>
            </div>
            <div className="text-xl font-bold text-foreground">{formatGwei(chain.baseFee)}</div>
            <div className="text-xs text-muted-foreground">Network cost</div>
          </div>
          
          <div className="glass-card p-4 text-center rounded-lg transition-all hover:scale-105">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground font-medium">Priority Fee</span>
            </div>
            <div className="text-xl font-bold text-foreground">{formatGwei(chain.priorityFee)}</div>
            <div className="text-xs text-muted-foreground">Speed boost</div>
          </div>
        </div>

        {/* Enhanced status footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${getStatusColor()}`} />
            <span className="text-xs text-muted-foreground">
              {chain.lastUpdate > 0 ? `Updated ${new Date(chain.lastUpdate).toLocaleTimeString()}` : 'Connecting...'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success font-medium">Real-time</span>
          </div>
        </div>
      </div>
    </Card>
  );
};