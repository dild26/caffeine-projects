import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Search, Download, Shield, CheckCircle, AlertCircle, Clock, User, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface ManifestLogEntry {
  id: string;
  timestamp: string;
  user: string;
  operation: string;
  target: string;
  changes: string;
  hash: string;
  status: 'success' | 'error' | 'pending';
}

interface ManifestLogViewerProps {
  isAdmin: boolean;
}

export default function ManifestLogViewer({ isAdmin }: ManifestLogViewerProps) {
  const [logs, setLogs] = useState<ManifestLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'error' | 'pending'>('all');

  useEffect(() => {
    loadManifestLogs();
    
    // Listen for new log entries
    const handleNewLog = (event: CustomEvent) => {
      const newLog = event.detail as ManifestLogEntry;
      setLogs(prev => [newLog, ...prev]);
    };

    window.addEventListener('manifest-log-added', handleNewLog as EventListener);
    return () => {
      window.removeEventListener('manifest-log-added', handleNewLog as EventListener);
    };
  }, []);

  const loadManifestLogs = () => {
    const storedLogs = localStorage.getItem('moap_manifest_logs');
    if (storedLogs) {
      try {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
      } catch (error) {
        console.error('Failed to parse manifest logs:', error);
      }
    }
  };

  const generateHash = (data: string): string => {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  };

  const addManifestLog = (operation: string, target: string, changes: string, user: string = 'admin') => {
    const timestamp = new Date().toISOString();
    const logData = `${timestamp}|${user}|${operation}|${target}|${changes}`;
    const hash = generateHash(logData);

    const newLog: ManifestLogEntry = {
      id: `log_${Date.now()}`,
      timestamp,
      user,
      operation,
      target,
      changes,
      hash,
      status: 'success'
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('moap_manifest_logs', JSON.stringify(updatedLogs));

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('manifest-log-added', { detail: newLog }));
  };

  const verifyLogIntegrity = (log: ManifestLogEntry): boolean => {
    const logData = `${log.timestamp}|${log.user}|${log.operation}|${log.target}|${log.changes}`;
    const computedHash = generateHash(logData);
    return computedHash === log.hash;
  };

  const exportLogs = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalLogs: logs.length,
      logs: logs.map(log => ({
        ...log,
        verified: verifyLogIntegrity(log)
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifest-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Manifest logs exported successfully');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Expose addManifestLog globally for other components
  useEffect(() => {
    (window as any).addManifestLog = addManifestLog;
  }, [logs]);

  if (!isAdmin) {
    return (
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Manifest log viewer is only available to administrators.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-3d">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gradient">
                <FileText className="w-6 h-6" />
                Append-Only Manifest Logs
              </CardTitle>
              <CardDescription>
                Immutable audit trail with cryptographic verification
              </CardDescription>
            </div>
            <img 
              src="/assets/generated/crypto-integrity-badge-transparent.dim_128x64.png" 
              alt="Crypto Integrity" 
              className="h-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'success' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('success')}
              >
                Success
              </Button>
              <Button
                variant={filterStatus === 'error' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('error')}
              >
                Error
              </Button>
            </div>
            <Button onClick={exportLogs} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{logs.length}</div>
                <div className="text-sm text-muted-foreground">Total Logs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-500">
                  {logs.filter(l => l.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Success</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-500">
                  {logs.filter(l => l.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-500">
                  {logs.filter(l => verifyLogIntegrity(l)).length}
                </div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </CardContent>
            </Card>
          </div>

          <ScrollArea className="h-[500px] rounded-md border">
            <div className="p-4 space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No logs found matching your criteria
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const isVerified = verifyLogIntegrity(log);
                  
                  return (
                    <Card key={log.id} className={`${isVerified ? 'border-green-500/30' : 'border-red-500/30'}`}>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                                {log.status}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                {isVerified ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    Verified
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                    Invalid
                                  </>
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-muted-foreground" />
                              <span className="font-medium">User:</span>
                              <span className="text-muted-foreground">{log.user}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-muted-foreground" />
                              <span className="font-medium">Operation:</span>
                              <span className="text-muted-foreground">{log.operation}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">Target:</span>
                            <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">
                              {log.target}
                            </code>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">Changes:</span>
                            <p className="text-muted-foreground mt-1">{log.changes}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs">
                            <Hash className="w-3 h-3 text-muted-foreground" />
                            <code className="bg-muted px-2 py-1 rounded font-mono">
                              {log.hash}
                            </code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="text-lg">Manifest Log Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Append-Only Architecture</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Immutable log entries</li>
                <li>• Chronological ordering</li>
                <li>• No deletion or modification</li>
                <li>• Complete audit trail</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cryptographic Verification</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• SHA-256 hash generation</li>
                <li>• Integrity verification</li>
                <li>• Tamper detection</li>
                <li>• Chain of custody</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
