import { Link, Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    LayoutDashboard,
    Compass,
    Library,
    Users,
    Calendar,
    Info,
    Settings,
    Menu,
    X,
    LogIn,
    LogOut,
    BookOpen
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetAllNavigationItemsSorted } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

// Map icon names to components (fallback mapping)
const iconMap: Record<string, any> = {
    'Home': Home,
    'Dashboard': LayoutDashboard,
    'Explore': Compass,
    'Resources': Library,
    'Instructors': Users,
    'Appointments': Calendar,
    'About': Info,
    'Contact': BookOpen,
};

export default function FuturisticLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const { identity, login, clear, loginStatus } = useInternetIdentity();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { data: allNavItems, isLoading: navLoading } = useGetAllNavigationItemsSorted();

    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';

    const handleAuth = async () => {
        if (isAuthenticated) {
            await clear();
            queryClient.clear();
            navigate({ to: '/' });
        } else {
            try {
                await login();
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.message === 'User is already authenticated') {
                    await clear();
                    setTimeout(() => login(), 300);
                }
            }
        }
    };

    // Get public menu items from backend or fallback
    const navItems = allNavItems?.filter(item =>
        item.isPublic && item.type === 'menu'
    ).map(item => ({
        to: item.url,
        label: item.navLabel,
        icon: iconMap[item.navLabel] || BookOpen // Fallback icon
    })) || [
            { to: '/', label: 'Home', icon: Home },
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/explore', label: 'Explore', icon: Compass },
            { to: '/resources', label: 'Resources', icon: Library },
            { to: '/instructors', label: 'Instructors', icon: Users },
            { to: '/about', label: 'About', icon: Info },
        ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden flex relative selection:bg-primary/30 font-sans">
            <Toaster />

            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Glass Sidebar (Desktop) */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden md:flex flex-col w-24 hover:w-64 transition-[width] duration-300 group z-50 h-screen fixed left-0 top-0 border-r border-white/10 bg-black/5 backdrop-blur-xl shadow-2xl"
            >
                <div className="flex items-center justify-center h-20 border-b border-white/10 group-hover:justify-start group-hover:px-6 overflow-hidden">
                    <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                        E
                    </div>
                    <span className="ml-4 font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent whitespace-nowrap">
                        E-Tutorials
                    </span>
                </div>

                <nav className="flex-1 py-8 flex flex-col gap-2 px-2 overflow-y-auto overflow-x-hidden scrollbar-none">
                    {navLoading ? (
                        [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl bg-primary/5" />)
                    ) : (
                        navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                activeProps={{ className: "bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] shadow-primary/10" }}
                                className="flex items-center p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 group/link relative overflow-hidden"
                            >
                                <item.icon className="w-6 h-6 min-w-[24px]" />
                                <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">
                                    {item.label}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </Link>
                        ))
                    )}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    {/* Auth Button */}
                    <button
                        onClick={handleAuth}
                        disabled={isLoggingIn}
                        className={cn(
                            "flex items-center justify-center group-hover:justify-start p-3 rounded-xl transition-all duration-200 w-full overflow-hidden",
                            isAuthenticated ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                    >
                        {isLoggingIn ? (
                            <div className="w-6 h-6 min-w-[24px] border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isAuthenticated ? (
                            <LogOut className="w-6 h-6 min-w-[24px]" />
                        ) : (
                            <LogIn className="w-6 h-6 min-w-[24px]" />
                        )}
                        <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </span>
                    </button>

                    <div className="flex items-center justify-center group-hover:justify-start p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer w-full overflow-hidden">
                        <Settings className="w-6 h-6 min-w-[24px] text-muted-foreground" />
                        <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-muted-foreground whitespace-nowrap">
                            Settings
                        </span>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    E
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-accent/10">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 top-16 bg-background z-40 p-4 space-y-2 overflow-y-auto"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/10 transition-colors border border-transparent hover:border-accent/20"
                            >
                                <item.icon className="w-5 h-5 text-primary" />
                                <span className="font-medium text-lg">{item.label}</span>
                            </Link>
                        ))}

                        <button
                            onClick={() => { handleAuth(); setIsOpen(false); }}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-lg transition-colors border border-transparent w-full mt-4",
                                isAuthenticated ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-primary/10 text-primary border-primary/20"
                            )}
                        >
                            {isAuthenticated ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                            <span className="font-medium text-lg">{isAuthenticated ? 'Logout' : 'Login'}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-24 relative z-10 p-4 md:p-8 pt-20 md:pt-8 min-h-screen overflow-x-hidden">
                <motion.div
                    key={location.pathname} // Triggers animation on route change
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-7xl mx-auto h-full"
                >
                    <Outlet />
                </motion.div>
            </main>

        </div>
    );
}
