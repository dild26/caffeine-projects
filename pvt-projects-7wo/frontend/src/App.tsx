import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LoginButton from './components/LoginButton';
import ProfileSetup from './components/ProfileSetup';
import Board from './components/Board';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted">
          <Header>
            <LoginButton />
          </Header>
          <main className="flex flex-1 items-center justify-center px-4">
            <div className="max-w-md text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Welcome to TaskFlow</h1>
                <p className="text-lg text-muted-foreground">
                  Your personal project board for organizing tasks efficiently
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <p className="mb-4 text-sm text-muted-foreground">
                  Sign in to access your private task board and start organizing your projects
                </p>
                <LoginButton />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4">
          <ProfileSetup />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted">
        <Header>
          <LoginButton />
        </Header>
        <main className="flex-1 px-4 py-8">
          <Board />
        </main>
        <Footer />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
