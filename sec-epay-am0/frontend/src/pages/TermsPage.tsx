import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetCurrentTermsVersion, useGetAllTermsVersions, useGetActiveAdminNotices } from '../hooks/useQueries';
import { FileText, History, Bell, AlertTriangle, Info, Scale } from 'lucide-react';
import type { TermsVersion, AdminNotice } from '../backend';

export default function TermsPage() {
  const { data: currentTerms, isLoading: currentLoading } = useGetCurrentTermsVersion();
  const { data: allVersions, isLoading: versionsLoading } = useGetAllTermsVersions();
  const { data: activeNotices, isLoading: noticesLoading } = useGetActiveAdminNotices();

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getNoticeIcon = (type: AdminNotice['noticeType']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'legal':
        return <Scale className="h-5 w-5 text-warning" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getNoticeVariant = (type: AdminNotice['noticeType']) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'legal':
        return 'default';
      case 'info':
      default:
        return 'default';
    }
  };

  if (currentLoading || versionsLoading || noticesLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading terms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <FileText className="mr-3 h-10 w-10 text-primary" />
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Legal terms and conditions for using Secoinfi ePay platform
          </p>
        </div>

        {activeNotices && activeNotices.length > 0 && (
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <Bell className="mr-2 h-6 w-6 text-primary" />
              Important Notices
            </h2>
            {activeNotices.map((notice) => (
              <Alert key={Number(notice.id)} variant={getNoticeVariant(notice.noticeType)}>
                <div className="flex items-start">
                  {getNoticeIcon(notice.noticeType)}
                  <div className="ml-3 flex-1">
                    <AlertTitle className="flex items-center justify-between">
                      {notice.title}
                      <Badge variant={notice.requiresAcceptance ? 'destructive' : 'secondary'} className="ml-2">
                        {notice.requiresAcceptance ? 'Action Required' : 'Informational'}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      <p className="whitespace-pre-wrap">{notice.body}</p>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Effective: {formatDate(notice.effectiveDate)}
                      </p>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Current Terms
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              Version History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {currentTerms ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentTerms.title}</CardTitle>
                      <CardDescription>
                        Version {Number(currentTerms.version)} • Effective {formatDate(currentTerms.effectiveDate)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {currentTerms.criticalUpdate && (
                        <Badge variant="destructive">Critical Update</Badge>
                      )}
                      <Badge variant="outline">v{Number(currentTerms.version)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">{currentTerms.content}</div>
                    </div>

                    {currentTerms.changelog && (
                      <>
                        <Separator className="my-6" />
                        <div>
                          <h3 className="text-lg font-semibold mb-3">What's Changed</h3>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {currentTerms.changelog}
                          </div>
                        </div>
                      </>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Terms Available</CardTitle>
                  <CardDescription>
                    Terms of Service have not been published yet.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>
                  All previous versions of our Terms of Service
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allVersions && allVersions.length > 0 ? (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {allVersions
                        .sort((a, b) => Number(b.version) - Number(a.version))
                        .map((version) => (
                          <div key={Number(version.id)} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold">{version.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Version {Number(version.version)} • {formatDate(version.effectiveDate)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {version.criticalUpdate && (
                                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                                )}
                                {currentTerms && version.id === currentTerms.id && (
                                  <Badge variant="default" className="text-xs">Current</Badge>
                                )}
                              </div>
                            </div>

                            {version.changelog && (
                              <div className="mb-3">
                                <h4 className="text-sm font-semibold mb-1">Changes:</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {version.changelog}
                                </p>
                              </div>
                            )}

                            <details className="mt-3">
                              <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                View Full Terms
                              </summary>
                              <div className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap border-l-2 border-border pl-4">
                                {version.content}
                              </div>
                            </details>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No version history available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
