import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { useGetSystemStats } from '../hooks/useQueries';

export type SystemStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage';

interface SystemHealthIndicatorProps {
  showBanner?: boolean;
}

export default function SystemHealthIndicator({ showBanner = true }: SystemHealthIndicatorProps) {
  const { actor, isFetching } = useActor();
  const { data: stats, isError } = useGetSystemStats();
  const [status, setStatus] = useState<SystemStatus>('operational');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const checkHealth = () => {
      if (!actor || isFetching) {
        setStatus('degraded');
      } else if (isError) {
        setStatus('partial_outage');
      } else if (stats) {
        setStatus('operational');
      }
      setLastCheck(new Date());
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [actor, isFetching, isError, stats]);

  const getStatusConfig = () => {
    switch (status) {
      case 'operational':
        return {
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-500/10',
          label: 'All Systems Operational',
          variant: 'default' as const,
        };
      case 'degraded':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          label: 'Degraded Performance',
          variant: 'secondary' as const,
        };
      case 'partial_outage':
        return {
          icon: AlertCircle,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-500/10',
          label: 'Partial Outage',
          variant: 'destructive' as const,
        };
      case 'major_outage':
        return {
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-500/10',
          label: 'Major Outage',
          variant: 'destructive' as const,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (!showBanner && status === 'operational') {
    return null;
  }

  if (!showBanner) {
    return (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      </div>
    );
  }

  if (status === 'operational') {
    return null;
  }

  return (
    <Alert className={`${config.bgColor} border-2`}>
      <Icon className={`h-4 w-4 ${config.color}`} />
      <AlertTitle className="font-semibold">{config.label}</AlertTitle>
      <AlertDescription>
        {status === 'degraded' && (
          <p>Some features may be slower than usual. We're working to restore full performance.</p>
        )}
        {status === 'partial_outage' && (
          <p>Some features are currently unavailable. Our team is working on a fix.</p>
        )}
        {status === 'major_outage' && (
          <p>The platform is experiencing significant issues. Please check back shortly.</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Last checked: {lastCheck.toLocaleTimeString()}
        </p>
      </AlertDescription>
    </Alert>
  );
}
