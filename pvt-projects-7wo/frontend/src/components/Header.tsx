import { useState } from 'react';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import ThemeToggle from './ThemeToggle';
import SchemaLogsDialog from './SchemaLogsDialog';
import { Button } from './ui/button';
import { Database } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const [schemaLogsOpen, setSchemaLogsOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border/50 shadow-sm overflow-hidden p-1">
              <img src="/assets/logo.png" alt="TaskFlow Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
              {userProfile && (
                <p className="text-sm text-muted-foreground">Welcome, {userProfile.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSchemaLogsOpen(true)}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                Schema Logs
              </Button>
            )}
            <ThemeToggle />
            {children}
          </div>
        </div>
      </header>

      {isAdmin && (
        <SchemaLogsDialog open={schemaLogsOpen} onOpenChange={setSchemaLogsOpen} />
      )}
    </>
  );
}
