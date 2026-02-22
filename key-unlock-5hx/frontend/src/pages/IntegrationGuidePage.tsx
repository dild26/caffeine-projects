import { useGetIntegrationDocs } from '../hooks/useAppQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Copy, CheckCircle2, BookOpen, Settings, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export default function IntegrationGuidePage() {
  const { data: integrationDocs = [], isLoading } = useGetIntegrationDocs();
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-lg w-1/3"></div>
            <div className="h-6 bg-muted rounded-lg w-2/3"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Integration Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Complete documentation for connecting your SECOINFI apps to the Key-Unlock Auth system with ready-to-use code snippets and templates.
          </p>
        </div>

        {/* Overview Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Start Overview
            </CardTitle>
            <CardDescription>
              Follow these steps to integrate any SECOINFI app with the centralized authentication system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Add Login Button</h3>
                    <p className="text-sm text-muted-foreground">
                      Implement a login button that redirects to the central auth server
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Handle OAuth Callback</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a callback route to exchange authorization codes for tokens
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Set Secure Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure HttpOnly, SameSite=strict cookies scoped to your subdomain
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Redirect to Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      After successful authentication, redirect users to your app dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App-Specific Integration Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              App-Specific Integration
            </CardTitle>
            <CardDescription>
              Select your app to view tailored integration instructions and code snippets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={integrationDocs[0]?.appName || 'MOAP'} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {integrationDocs.map((doc) => (
                  <TabsTrigger key={doc.appName} value={doc.appName}>
                    {doc.appName}
                  </TabsTrigger>
                ))}
              </TabsList>

              {integrationDocs.map((doc) => (
                <TabsContent key={doc.appName} value={doc.appName} className="space-y-6">
                  {/* Environment Variables */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">Environment Variables</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add these variables to your <code className="px-2 py-1 bg-muted rounded text-xs">.env</code> file:
                    </p>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="space-y-2 font-mono text-sm">
                          <div className="flex items-center justify-between">
                            <span>AUTH_BASE={doc.envVariables.authBase}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`AUTH_BASE=${doc.envVariables.authBase}`, `${doc.appName}-auth-base`)}
                            >
                              {copiedSnippet === `${doc.appName}-auth-base` ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>CLIENT_ID={doc.envVariables.clientId}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`CLIENT_ID=${doc.envVariables.clientId}`, `${doc.appName}-client-id`)}
                            >
                              {copiedSnippet === `${doc.appName}-client-id` ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>CALLBACK_URI={doc.envVariables.callbackUri}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`CALLBACK_URI=${doc.envVariables.callbackUri}`, `${doc.appName}-callback-uri`)}
                            >
                              {copiedSnippet === `${doc.appName}-callback-uri` ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>COOKIE_DOMAIN={doc.envVariables.cookieDomain}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`COOKIE_DOMAIN=${doc.envVariables.cookieDomain}`, `${doc.appName}-cookie-domain`)}
                            >
                              {copiedSnippet === `${doc.appName}-cookie-domain` ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>SESSION_SECRET={doc.envVariables.sessionSecret}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`SESSION_SECRET=${doc.envVariables.sessionSecret}`, `${doc.appName}-session-secret`)}
                            >
                              {copiedSnippet === `${doc.appName}-session-secret` ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  {/* Integration Steps */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">Integration Steps</h3>
                    </div>
                    <div className="space-y-3">
                      {doc.integrationSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Badge variant="outline" className="flex-shrink-0 mt-1">
                            {index + 1}
                          </Badge>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Code Snippets */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">Code Snippets</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ready-to-use code for your <strong>{doc.appName}</strong> application:
                    </p>
                    <div className="space-y-4">
                      {doc.codeSnippets.map((snippet, index) => (
                        <Card key={index} className="bg-muted/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <ScrollArea className="w-full">
                                <pre className="font-mono text-sm whitespace-pre-wrap break-all">
                                  {snippet}
                                </pre>
                              </ScrollArea>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(snippet, `${doc.appName}-snippet-${index}`)}
                                className="flex-shrink-0"
                              >
                                {copiedSnippet === `${doc.appName}-snippet-${index}` ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Callback Route */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Callback Route</h3>
                    <p className="text-sm text-muted-foreground">
                      Your app should handle OAuth callbacks at:
                    </p>
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <code className="font-mono text-sm font-semibold text-primary">
                            {doc.callbackRoute}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(doc.callbackRoute, `${doc.appName}-callback-route`)}
                          >
                            {copiedSnippet === `${doc.appName}-callback-route` ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Security Best Practices */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong>HttpOnly Cookies:</strong> Always set cookies with the HttpOnly flag to prevent XSS attacks
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong>SameSite=strict:</strong> Use SameSite=strict to prevent CSRF attacks
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Subdomain Scoping:</strong> Scope cookies to your specific subdomain to prevent cross-site access
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong>PKCE Verification:</strong> Always validate PKCE verifiers to ensure secure token exchange
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Session Management:</strong> Store session data securely and implement proper timeout mechanisms
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              If you encounter any issues during integration, please contact our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="/faq">View FAQ</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
