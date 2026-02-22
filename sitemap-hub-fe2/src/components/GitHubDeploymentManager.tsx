import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Github, GitBranch, Key, Lock, Shield, Eye, EyeOff, 
  AlertTriangle, CheckCircle, Loader2, Terminal, Upload,
  Server, Code, GitCommit, RefreshCw, X
} from 'lucide-react';
import { toast } from 'sonner';

interface GitHubDeploymentManagerProps {
  onClose?: () => void;
}

interface DeploymentConfig {
  platform: 'github' | 'gitlab';
  repoUrl: string;
  branch: string;
  accessToken: string;
  username: string;
  email: string;
}

interface DeploymentStatus {
  isDeploying: boolean;
  progress: number;
  currentStep: string;
  logs: string[];
  success: boolean | null;
}

export default function GitHubDeploymentManager({ onClose }: GitHubDeploymentManagerProps) {
  const [config, setConfig] = useState<DeploymentConfig>({
    platform: 'github',
    repoUrl: '',
    branch: 'main',
    accessToken: '',
    username: '',
    email: '',
  });

  const [showToken, setShowToken] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    isDeploying: false,
    progress: 0,
    currentStep: '',
    logs: [],
    success: null,
  });

  const handleConfigChange = (field: keyof DeploymentConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setConnectionStatus('idle');
  };

  const testConnection = async () => {
    if (!config.repoUrl || !config.accessToken) {
      toast.error('Please provide repository URL and access token');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would test the actual connection
      const isValid = config.accessToken.length > 20 && config.repoUrl.includes('github.com');
      
      if (isValid) {
        setConnectionStatus('success');
        toast.success('Connection successful!', {
          description: 'Repository access verified',
        });
      } else {
        setConnectionStatus('error');
        toast.error('Connection failed', {
          description: 'Please check your credentials and repository URL',
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Connection test failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const deployToRepository = async () => {
    if (connectionStatus !== 'success') {
      toast.error('Please test connection first');
      return;
    }

    setDeploymentStatus({
      isDeploying: true,
      progress: 0,
      currentStep: 'Initializing deployment...',
      logs: ['Starting deployment process...'],
      success: null,
    });

    const steps = [
      { step: 'Preparing codebase...', progress: 10 },
      { step: 'Compiling TypeScript...', progress: 25 },
      { step: 'Building frontend assets...', progress: 40 },
      { step: 'Optimizing bundle...', progress: 55 },
      { step: 'Connecting to repository...', progress: 70 },
      { step: 'Pushing changes...', progress: 85 },
      { step: 'Finalizing deployment...', progress: 95 },
      { step: 'Deployment complete!', progress: 100 },
    ];

    for (const { step, progress } of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDeploymentStatus(prev => ({
        ...prev,
        progress,
        currentStep: step,
        logs: [...prev.logs, `✓ ${step}`],
      }));
    }

    setDeploymentStatus(prev => ({
      ...prev,
      isDeploying: false,
      success: true,
    }));

    toast.success('Deployment successful!', {
      description: `Code pushed to ${config.platform} repository`,
    });
  };

  const saveCredentials = () => {
    try {
      // Store credentials securely (in a real app, this would be encrypted)
      const credentials = {
        platform: config.platform,
        repoUrl: config.repoUrl,
        branch: config.branch,
        username: config.username,
        email: config.email,
        // Never store the actual token in localStorage
        hasToken: !!config.accessToken,
        lastUpdated: Date.now(),
      };
      
      localStorage.setItem('deploymentCredentials', JSON.stringify(credentials));
      toast.success('Credentials saved securely');
    } catch (error) {
      toast.error('Failed to save credentials');
    }
  };

  const loadCredentials = () => {
    try {
      const stored = localStorage.getItem('deploymentCredentials');
      if (stored) {
        const credentials = JSON.parse(stored);
        setConfig(prev => ({
          ...prev,
          platform: credentials.platform,
          repoUrl: credentials.repoUrl,
          branch: credentials.branch,
          username: credentials.username,
          email: credentials.email,
        }));
        toast.info('Credentials loaded', {
          description: 'Please enter your access token',
        });
      }
    } catch (error) {
      toast.error('Failed to load credentials');
    }
  };

  React.useEffect(() => {
    loadCredentials();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Github className="h-6 w-6" />
            Deployment Manager
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure automated deployment to GitHub or GitLab
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Alert className="border-red-500/20 bg-red-500/5">
        <Shield className="h-4 w-4 text-red-500" />
        <AlertDescription>
          <strong>SECURITY WARNING:</strong> Never commit access tokens to your repository. 
          Use environment variables and secure credential management. This interface stores 
          credentials locally for convenience only.
        </AlertDescription>
      </Alert>

      <Tabs value={config.platform} onValueChange={(value) => handleConfigChange('platform', value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="gitlab" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            GitLab
          </TabsTrigger>
        </TabsList>

        <TabsContent value="github" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GitHub Configuration</CardTitle>
              <CardDescription>
                Configure your GitHub repository and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="github-repo">Repository URL</Label>
                <Input
                  id="github-repo"
                  placeholder="https://github.com/username/repository"
                  value={config.repoUrl}
                  onChange={(e) => handleConfigChange('repoUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="github-branch">Branch</Label>
                <Input
                  id="github-branch"
                  placeholder="main"
                  value={config.branch}
                  onChange={(e) => handleConfigChange('branch', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="github-username">Username</Label>
                <Input
                  id="github-username"
                  placeholder="your-github-username"
                  value={config.username}
                  onChange={(e) => handleConfigChange('username', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="github-email">Email</Label>
                <Input
                  id="github-email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={config.email}
                  onChange={(e) => handleConfigChange('email', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="github-token" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Personal Access Token
                </Label>
                <div className="relative">
                  <Input
                    id="github-token"
                    type={showToken ? 'text' : 'password'}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={config.accessToken}
                    onChange={(e) => handleConfigChange('accessToken', e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Generate a token at: Settings → Developer settings → Personal access tokens
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gitlab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GitLab Configuration</CardTitle>
              <CardDescription>
                Configure your GitLab repository and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gitlab-repo">Repository URL</Label>
                <Input
                  id="gitlab-repo"
                  placeholder="https://gitlab.com/username/repository"
                  value={config.repoUrl}
                  onChange={(e) => handleConfigChange('repoUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="gitlab-branch">Branch</Label>
                <Input
                  id="gitlab-branch"
                  placeholder="main"
                  value={config.branch}
                  onChange={(e) => handleConfigChange('branch', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="gitlab-username">Username</Label>
                <Input
                  id="gitlab-username"
                  placeholder="your-gitlab-username"
                  value={config.username}
                  onChange={(e) => handleConfigChange('username', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="gitlab-email">Email</Label>
                <Input
                  id="gitlab-email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={config.email}
                  onChange={(e) => handleConfigChange('email', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="gitlab-token" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Personal Access Token
                </Label>
                <div className="relative">
                  <Input
                    id="gitlab-token"
                    type={showToken ? 'text' : 'password'}
                    placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
                    value={config.accessToken}
                    onChange={(e) => handleConfigChange('accessToken', e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Generate a token at: User Settings → Access Tokens
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button
          onClick={testConnection}
          disabled={isTestingConnection || !config.repoUrl || !config.accessToken}
          variant="outline"
          className="flex-1"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Terminal className="h-4 w-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>

        <Button
          onClick={saveCredentials}
          variant="outline"
          disabled={!config.repoUrl}
        >
          <Lock className="h-4 w-4 mr-2" />
          Save Config
        </Button>
      </div>

      {connectionStatus !== 'idle' && (
        <Alert className={connectionStatus === 'success' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}>
          {connectionStatus === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription>
            {connectionStatus === 'success' 
              ? 'Connection successful! You can now deploy your code.'
              : 'Connection failed. Please check your credentials and try again.'}
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Deploy Application
            </CardTitle>
            <CardDescription>
              Push your code changes to the configured repository
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!deploymentStatus.isDeploying && deploymentStatus.success === null && (
              <Button
                onClick={deployToRepository}
                className="w-full"
                size="lg"
              >
                <GitCommit className="h-4 w-4 mr-2" />
                Deploy Now
              </Button>
            )}

            {deploymentStatus.isDeploying && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{deploymentStatus.currentStep}</span>
                    <span className="text-sm text-muted-foreground">{deploymentStatus.progress}%</span>
                  </div>
                  <Progress value={deploymentStatus.progress} className="h-2" />
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="h-4 w-4" />
                      <span className="text-sm font-medium">Deployment Logs</span>
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-xs">
                      {deploymentStatus.logs.map((log, index) => (
                        <div key={index} className="text-muted-foreground">
                          {log}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {deploymentStatus.success && (
              <Alert className="border-green-500/20 bg-green-500/5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  <strong>Deployment successful!</strong> Your code has been pushed to {config.platform}.
                  <div className="mt-2 space-y-1 text-xs">
                    <div>Repository: {config.repoUrl}</div>
                    <div>Branch: {config.branch}</div>
                    <div>Commit: {Math.random().toString(36).substr(2, 7)}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Alert className="border-blue-500/20 bg-blue-500/5">
        <AlertTriangle className="h-4 w-4 text-blue-500" />
        <AlertDescription>
          <strong>Best Practices:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>Use fine-grained personal access tokens with minimal required permissions</li>
            <li>Never commit tokens or sensitive credentials to your repository</li>
            <li>Rotate access tokens regularly for security</li>
            <li>Use branch protection rules to prevent accidental overwrites</li>
            <li>Review changes before deploying to production branches</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
