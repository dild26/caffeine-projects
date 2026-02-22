import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BroadcastMessage {
  id: string;
  operation: string;
  targetApp: string;
  timestamp: number;
  status: 'pending' | 'broadcasting' | 'confirmed' | 'failed';
  signature: string;
  merkleRoot: string;
  confirmations: number;
  totalApps: number;
}

const MOCK_MESSAGES: BroadcastMessage[] = [
  {
    id: '1',
    operation: 'CREATE_PAGE',
    targetApp: 'SECoin',
    timestamp: Date.now() - 60000,
    status: 'confirmed',
    signature: 'sig_a1b2c3d4',
    merkleRoot: 'root_e5f6g7h8',
    confirmations: 7,
    totalApps: 7,
  },
  {
    id: '2',
    operation: 'UPDATE_PAGE',
    targetApp: 'SitemapAi',
    timestamp: Date.now() - 30000,
    status: 'broadcasting',
    signature: 'sig_i9j0k1l2',
    merkleRoot: 'root_m3n4o5p6',
    confirmations: 4,
    totalApps: 7,
  },
];

export default function SignedMessageBus() {
  const [messages, setMessages] = useState<BroadcastMessage[]>(MOCK_MESSAGES);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.status === 'broadcasting' && msg.confirmations < msg.totalApps) {
            return {
              ...msg,
              confirmations: Math.min(msg.confirmations + 1, msg.totalApps),
              status: msg.confirmations + 1 === msg.totalApps ? 'confirmed' : 'broadcasting',
            };
          }
          return msg;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <Card className="card-3d card-3d-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gradient flex items-center gap-2">
              <Send className="w-6 h-6 text-primary" />
              Signed Message Bus
            </CardTitle>
            <CardDescription>
              Atomic broadcast with confirmation tracking and rollback capability
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map(msg => {
          const progress = (msg.confirmations / msg.totalApps) * 100;
          
          return (
            <div key={msg.id} className="card-3d p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {msg.status === 'confirmed' && <CheckCircle className="w-5 h-5 text-success" />}
                  {msg.status === 'broadcasting' && <Clock className="w-5 h-5 text-primary animate-pulse" />}
                  {msg.status === 'failed' && <XCircle className="w-5 h-5 text-destructive" />}
                  {msg.status === 'pending' && <Clock className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <div className="font-semibold">{msg.operation}</div>
                    <div className="text-sm text-muted-foreground">Target: {msg.targetApp}</div>
                  </div>
                </div>
                <Badge variant={
                  msg.status === 'confirmed' ? 'default' :
                  msg.status === 'broadcasting' ? 'secondary' :
                  msg.status === 'failed' ? 'destructive' : 'outline'
                }>
                  {msg.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Broadcast Progress</span>
                  <span className="font-semibold">{msg.confirmations} / {msg.totalApps} apps</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="card-3d p-2 rounded">
                  <div className="text-muted-foreground">Signature</div>
                  <div className="font-mono">{msg.signature}</div>
                </div>
                <div className="card-3d p-2 rounded">
                  <div className="text-muted-foreground">Merkle Root</div>
                  <div className="font-mono">{msg.merkleRoot}</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          );
        })}

        <div className="card-3d p-4 rounded-lg bg-muted/50">
          <h4 className="font-semibold mb-2 text-sm">Message Bus Properties:</h4>
          <ul className="text-xs space-y-1 ml-4 list-disc text-muted-foreground">
            <li>All messages cryptographically signed with admin credentials</li>
            <li>Atomic updates to spec.ml/.yaml files across all apps</li>
            <li>Confirmation tracking ensures all apps receive updates</li>
            <li>Automatic rollback on any failure during broadcast</li>
            <li>Complete audit trail with timestamps and proofs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
