import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface RangeProgressBarProps {
  currentValue: number;
  maxValue: number;
  label?: string;
  color?: 'maroon' | 'blue';
  showPercentage?: boolean;
  className?: string;
}

export default function RangeProgressBar({
  currentValue,
  maxValue,
  label,
  color = 'blue',
  showPercentage = true,
  className = '',
}: RangeProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  
  // Calculate percentage with safety checks
  const percentage = maxValue > 0 ? Math.min(100, Math.max(0, (currentValue / maxValue) * 100)) : 0;

  // Smooth animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(percentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  const colorClass = color === 'maroon' 
    ? 'bg-gradient-to-r from-red-900 to-red-700' 
    : 'bg-gradient-to-r from-blue-600 to-blue-400';

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && (
            <span className="font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {label}
            </span>
          )}
          {showPercentage && (
            <Badge variant="outline" className="font-mono">
              {displayProgress.toFixed(1)}%
            </Badge>
          )}
        </div>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>{currentValue}</span>
          <span>{maxValue}</span>
        </div>
      )}
    </div>
  );
}
