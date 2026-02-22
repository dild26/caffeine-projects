import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserRole, useGetCallerUserProfile } from '@/hooks/useQueries';
import { 
  Home, 
  Info, 
  Phone, 
  LayoutDashboard, 
  Globe, 
  CreditCard, 
  Users, 
  Shield,
  Heart,
  BarChart3,
  Download,
  Monitor,
  Eye,
  Database,
  LogIn,
  LogOut,
  User,
  CheckSquare,
  X,
  AlertTriangle,
  RefreshCw,
  Wrench,
  FolderOpen,
  PackagePlus,
  Search,
  Wifi,
  WifiOff,
  Activity,
} from 'lucide-react';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel' | 'feature-checklist' | 'diagnostics' | 'catalogs' | 'catalog-builder';

interface MenuItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth: boolean;
  adminOnly?: boolean;
}

interface AppSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onClose?: () => void;
  onOpenSearchMenu?: () => void;
}

interface CachedUserData {
  profile: any;
  role: string;
  timestamp: number;
}

const publicMenuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home, requiresAuth: false },
  { id: 'about', label: 'About Us', icon: Info, requiresAuth: false },
  { id: 'contact', label: 'Contact Us', icon: Phone, requiresAuth: false },
  { id: 'sitemaps', label: 'Sitemaps', icon: Globe, requiresAuth: false },
  { id: 'subscription', label: 'Subscription', icon: CreditCard, requiresAuth: false },
  { id: 'gods-eye', label: "God's Eye Summary", icon: Eye, requiresAuth: false },
  { id: 'catalogs', label: 'Catalogs', icon: FolderOpen, requiresAuth: false },
];

const userMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
  { id: 'referrals', label: 'Referrals', icon: Users, requiresAuth: true },
];

const adminMenuItems: MenuItem[] = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3, requiresAuth: true, adminOnly: true },
  { id: 'exports', label: 'Exports', icon: Download, requiresAuth: true, adminOnly: true },
  { id: 'monitoring', label: 'Monitoring', icon: Monitor, requiresAuth: true, adminOnly: true },
  { id: 'diagnostics', label: 'Diagnostics', icon: Wrench, requiresAuth: true, adminOnly: true },
  { id: 'catalog-builder', label: 'Catalog Builder', icon: PackagePlus, requiresAuth: true, adminOnly: true },
  { id: 'admin-panel', label: 'Admin Panel', icon: Database, requiresAuth: true, adminOnly: true },
  { id: 'feature-checklist', label: 'Feature Checklist', icon: CheckSquare, requiresAuth: true, adminOnly: true },
  { id: 'admin', label: 'Admin', icon: Shield, requiresAuth: true, adminOnly: true },
];

// Network connectivity monitor
function useNetworkMonitor() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Ping test every 30 seconds
    const pingInterval = setInterval(async () => {
      const start = Date.now();
      try {
        await fetch('/health-check', { method: 'HEAD', cache: 'no-cache' });
        setResponseTime(Date.now() - start);
      } catch {
        setResponseTime(null);
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(pingInterval);
    };
  }, []);

  return { isOnline, responseTime };
}

// Advanced caching with fallback
function useCachedUserData() {
  const [cachedData, setCachedData] = useState<CachedUserData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cachedUserData');
      if (stored) {
        const parsed = JSON.parse(stored);
        const age = Date.now() - parsed.timestamp;
        // Cache valid for 1 hour
        if (age < 60 * 60 * 1000) {
          setCachedData(parsed);
        }
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
  }, []);

  const updateCache = (profile: any, role: string) => {
    try {
      const data: CachedUserData = {
        profile,
        role,
        timestamp: Date.now(),
      };
      localStorage.setItem('cachedUserData', JSON.stringify(data));
      setCachedData(data);
    } catch (error) {
      console.error('Cache write error:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem('cachedUserData');
      setCachedData(null);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  };

  return { cachedData, updateCache, clearCache };
}

// Retry mechanism with exponential backoff
function useRetryableQuery<T>(
  queryFn: () => Promise<T>,
  options: { maxRetries?: number; initialDelay?: number } = {}
) {
  const { maxRetries = 3, initialDelay = 1000 } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = async () => {
    setIsLoading(true);
    setError(null);
    let lastError: Error | null = null;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await queryFn();
        setData(result);
        setRetryCount(0);
        setIsLoading(false);
        return result;
      } catch (err) {
        lastError = err as Error;
        setRetryCount(i + 1);
        
        if (i < maxRetries) {
          const delay = initialDelay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    setError(lastError);
    setIsLoading(false);
    throw lastError;
  };

  return { data, error, isLoading, retryCount, execute };
}

function SafeMenuItem({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: MenuItem; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  try {
    const Icon = item.icon;
    return (
      <div key={item.id} className="w-full">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start hover:bg-accent/50 transition-colors group ${
            isActive ? 'bg-primary text-primary-foreground shadow-md' : ''
          }`}
          onClick={onClick}
        >
          <Icon className="h-4 w-4 flex-shrink-0 mr-3" />
          <span className="truncate flex-1 text-left">{item.label}</span>
          {item.adminOnly && (
            <Badge variant="secondary" className="ml-auto text-xs flex-shrink-0">
              Admin
            </Badge>
          )}
        </Button>
      </div>
    );
  } catch (error) {
    console.error('MenuItem render error:', error);
    return (
      <div key={item.id} className="w-full p-2 text-xs text-muted-foreground">
        Error: {item.label}
      </div>
    );
  }
}

function SafeMenuSection({ 
  items, 
  title, 
  currentPage, 
  onNavigate, 
  isAuthenticated, 
  isAdmin 
}: {
  items: MenuItem[];
  title?: string;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}) {
  try {
    const filteredItems = items.filter(item => {
      if (item.adminOnly && !isAdmin) return false;
      if (item.requiresAuth && !isAuthenticated) return false;
      return true;
    });

    if (filteredItems.length === 0) {
      return null;
    }

    return (
      <div key={title || 'section'} className="space-y-1">
        {title && (
          <div key="title" className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}
        
        <div key="items" className="space-y-1 px-2">
          {filteredItems.map((item) => (
            <SafeMenuItem
              key={item.id}
              item={item}
              isActive={currentPage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Menu section render error:', error);
    return (
      <div key={title || 'error'} className="p-2">
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Menu section error: {title || 'Unknown'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

export default function AppSidebar({ currentPage, onNavigate, onClose, onOpenSearchMenu }: AppSidebarProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userRole, error: roleError, isLoading: roleLoading, refetch: refetchRole } = useGetCallerUserRole();
  const { data: userProfile, error: profileError, isLoading: profileLoading, refetch: refetchProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const { isOnline, responseTime } = useNetworkMonitor();
  const { cachedData, updateCache, clearCache } = useCachedUserData();

  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState<number>(0);

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin' || cachedData?.role === 'admin';
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const hasError = roleError || profileError;
  const isLoadingData = roleLoading || profileLoading;

  // Update cache when data loads successfully
  useEffect(() => {
    if (userProfile && userRole && !hasError) {
      updateCache(userProfile, userRole);
    }
  }, [userProfile, userRole, hasError]);

  // Clear cache on logout
  useEffect(() => {
    if (!isAuthenticated) {
      clearCache();
    }
  }, [isAuthenticated]);

  // Auto-retry mechanism with exponential backoff
  useEffect(() => {
    if (hasError && autoRetryEnabled && isAuthenticated && isOnline) {
      const now = Date.now();
      const timeSinceLastRetry = now - lastRetryTime;
      const backoffDelay = Math.min(1000 * Math.pow(2, retryAttempts), 30000);

      if (timeSinceLastRetry > backoffDelay && retryAttempts < 5) {
        const timer = setTimeout(async () => {
          console.log(`Auto-retry attempt ${retryAttempts + 1}/5`);
          setLastRetryTime(now);
          setRetryAttempts(prev => prev + 1);
          
          try {
            await Promise.all([refetchRole(), refetchProfile()]);
            setRetryAttempts(0); // Reset on success
          } catch (error) {
            console.error('Auto-retry failed:', error);
          }
        }, backoffDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [hasError, autoRetryEnabled, isAuthenticated, isOnline, retryAttempts, lastRetryTime]);

  const handleAuth = async () => {
    try {
      if (isAuthenticated) {
        await clear();
        queryClient.clear();
        clearCache();
      } else {
        await login();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleNavigation = (page: Page) => {
    try {
      onNavigate(page);
      if (onClose && window.innerWidth < 1024) {
        onClose();
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleManualRetry = async () => {
    setRetryAttempts(0);
    setLastRetryTime(Date.now());
    try {
      await Promise.all([refetchRole(), refetchProfile()]);
    } catch (error) {
      console.error('Manual retry failed:', error);
    }
  };

  // Connectivity indicator
  const ConnectivityIndicator = () => (
    <div className="flex items-center gap-2 px-3 py-2 text-xs">
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span className="text-muted-foreground">
            Online {responseTime !== null && `(${responseTime}ms)`}
          </span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-500" />
          <span className="text-muted-foreground">Offline</span>
        </>
      )}
    </div>
  );

  // Error state with fallback navigation
  if (hasError && !isLoadingData && !cachedData) {
    return (
      <div className="w-64 h-full bg-card border-r border-border/50 backdrop-blur-sm flex flex-col">
        <div key="header" className="p-4 border-b border-border/50 flex items-center justify-between">
          <span className="text-sm font-medium">SitemapAI</span>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div key="content" className="flex-1 p-4 flex flex-col justify-center">
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">
                  Connection Issue
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  {!isOnline 
                    ? 'No internet connection detected. Please check your network.'
                    : `Unable to load user data (Attempt ${retryAttempts}/5). Auto-retry in progress...`
                  }
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleManualRetry}
                    disabled={!isOnline}
                    className="flex-1"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="flex-1"
                  >
                    Reload
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  <span>Auto-retry: {autoRetryEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <div key="fallback-nav" className="p-4 border-t border-border/50 space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Quick Navigation:</p>
          {publicMenuItems.slice(0, 4).map(item => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.id)}
              className="w-full justify-start"
            >
              <item.icon className="h-3 w-3 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        <ConnectivityIndicator />
      </div>
    );
  }

  // Use cached data if available during loading
  const displayProfile = userProfile || cachedData?.profile;
  const displayRole = userRole || cachedData?.role;
  const displayIsAdmin = displayRole === 'admin';

  return (
    <div className="w-64 h-full bg-card/50 border-r border-border/50 backdrop-blur-sm flex flex-col">
      <div key="header" className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigation('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity group flex-1"
          >
            <div className="relative flex-shrink-0">
              <Globe className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate w-full">
                SitemapAI
              </span>
              <span className="text-xs text-muted-foreground truncate w-full">
                Intelligence Platform
              </span>
            </div>
          </button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div key="content" className="flex-1 overflow-y-auto py-4">
        {onOpenSearchMenu && (
          <div className="px-4 mb-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onOpenSearchMenu}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">Search menu...</span>
              <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
            </Button>
          </div>
        )}

        <SafeMenuSection
          items={publicMenuItems}
          title="Navigation"
          currentPage={currentPage}
          onNavigate={handleNavigation}
          isAuthenticated={isAuthenticated}
          isAdmin={displayIsAdmin}
        />

        {isAuthenticated && (
          <div className="mt-6">
            <div className="mx-4 border-t border-border/30 mb-4" />
            <SafeMenuSection
              items={userMenuItems}
              title="User Features"
              currentPage={currentPage}
              onNavigate={handleNavigation}
              isAuthenticated={isAuthenticated}
              isAdmin={displayIsAdmin}
            />
          </div>
        )}

        {displayIsAdmin && (
          <div className="mt-6">
            <div className="mx-4 border-t border-border/30 mb-4" />
            <SafeMenuSection
              items={adminMenuItems}
              title="Admin Tools"
              currentPage={currentPage}
              onNavigate={handleNavigation}
              isAuthenticated={isAuthenticated}
              isAdmin={displayIsAdmin}
            />
          </div>
        )}
      </div>

      <div key="footer" className="p-4 space-y-4 border-t border-border/50">
        {isAuthenticated && displayProfile && (
          <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayProfile.name}</p>
              <p className="text-xs text-muted-foreground truncate">{displayProfile.email}</p>
            </div>
            
            {displayIsAdmin && (
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                Admin
              </Badge>
            )}
          </div>
        )}

        <Button
          onClick={handleAuth}
          disabled={disabled}
          variant={isAuthenticated ? "outline" : "default"}
          className={`w-full ${!isAuthenticated ? "neon-glow" : ""} transition-all duration-200 group`}
          size="sm"
        >
          {isAuthenticated ? (
            <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
          ) : (
            <LogIn className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
          )}
          <span className="truncate">{text}</span>
        </Button>
        
        <ConnectivityIndicator />
        
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
          <div className="flex items-center justify-center space-x-1 flex-wrap">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 flex-shrink-0" />
            <span>using</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium transition-colors"
            >
              caffeine.ai
            </a>
          </div>
          <div className="mt-1 text-muted-foreground/70">
            © 2025 SitemapAI Platform
          </div>
        </div>
      </div>
    </div>
  );
}
