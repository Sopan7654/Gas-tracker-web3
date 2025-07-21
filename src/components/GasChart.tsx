import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGasStore, GasPoint } from '@/stores/gasStore';

interface GasChartProps {
  chainName: 'ethereum' | 'polygon' | 'arbitrum';
}

export const GasChart = ({ chainName }: GasChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  
  const chains = useGasStore((state) => state.chains);
  const chain = chains[chainName];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      timeScale: {
        borderColor: '#6b7280',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#6b7280',
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !chain.history.length) return;

    // Convert gas history to candlestick data (15-minute intervals)
    const candlestickData: CandlestickData[] = [];
    const intervalMs = 15 * 60 * 1000; // 15 minutes
    
    // Group data by 15-minute intervals
    const groupedData: { [key: number]: GasPoint[] } = {};
    
    chain.history.forEach((point) => {
      const intervalStart = Math.floor(point.timestamp / intervalMs) * intervalMs;
      if (!groupedData[intervalStart]) {
        groupedData[intervalStart] = [];
      }
      groupedData[intervalStart].push(point);
    });

    // Convert to candlestick format
    Object.entries(groupedData).forEach(([timestamp, points]) => {
      if (points.length === 0) return;
      
      const gasPrices = points.map(p => p.totalGas);
      candlestickData.push({
        time: (parseInt(timestamp) / 1000) as any,
        open: gasPrices[0],
        high: Math.max(...gasPrices),
        low: Math.min(...gasPrices),
        close: gasPrices[gasPrices.length - 1],
      });
    });

    seriesRef.current.setData(candlestickData);
  }, [chain.history]);

  const getChainGradient = (chainName: string) => {
    switch (chainName) {
      case 'ethereum': return 'from-blue-500/10 to-blue-600/5';
      case 'polygon': return 'from-purple-500/10 to-purple-600/5';
      case 'arbitrum': return 'from-cyan-500/10 to-cyan-600/5';
      default: return 'from-gray-500/10 to-gray-600/5';
    }
  };

  return (
    <Card className="elevated-card p-6 relative overflow-hidden group">
      {/* Chain gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getChainGradient(chainName)} transition-opacity opacity-50 group-hover:opacity-70`} />
      
      {/* Enhanced header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-foreground">{chain.name}</h3>
          <Badge variant="outline" className="text-xs">
            OHLC Chart
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>15-minute intervals</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chart-up" />
            <span>Price Up</span>
            <div className="w-2 h-2 rounded-full bg-chart-down" />
            <span>Price Down</span>
          </div>
        </div>
      </div>
      
      {/* Chart container with enhanced styling */}
      <div className="relative z-10">
        <div ref={chartContainerRef} className="w-full rounded-lg" />
      </div>
      
      {/* Loading overlay */}
      {!chain.isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <div className="text-muted-foreground font-medium">Connecting to {chain.name}...</div>
          </div>
        </div>
      )}
    </Card>
  );
};