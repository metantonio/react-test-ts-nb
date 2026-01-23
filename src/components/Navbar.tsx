import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Trophy,
    CalendarDays,
    BookOpen,
    LogOut,
    User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    user: any;
    goLoginPage: () => void;
    isLoading: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
    activeView,
    setActiveView,
    user,
    goLoginPage,
    isLoading,
}) => {
    const navItems = [
        { id: 'full-season', label: 'Full Season', icon: CalendarDays },
        { id: 'single-game', label: 'Single Game', icon: Trophy },
        { id: 'instructions', label: 'Info', icon: BookOpen },
    ];

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
                <div className="mx-4 mt-4">
                    <div className="flex h-16 items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-6 backdrop-blur-md shadow-lg dark:border-white/10 dark:bg-black/20">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                NBA <span className="text-primary">SIM</span>
                            </h1>

                            <div className="flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        onClick={() => setActiveView(item.id)}
                                        className={cn(
                                            "relative h-10 px-4 transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/5 font-medium",
                                            activeView === item.id
                                                ? "text-primary bg-white/10 dark:bg-white/5"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {item.label}
                                        {activeView === item.id && (
                                            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold">{user?.name || 'User'}</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Premium Account</span>
                            </div>

                            <div className="h-10 w-px bg-white/20 dark:bg-white/10" />

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goLoginPage}
                                disabled={isLoading}
                                className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Top Header (iOS Style) */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border/40 bg-background/60 px-6 backdrop-blur-xl md:hidden">
                <h1 className="text-lg font-bold tracking-tight">NBA Simulation</h1>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground">{user?.name}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserIcon className="h-4 w-4" />
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Tab Bar (iOS Style) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
                <div className="flex h-20 items-center justify-around border-t border-border/40 bg-background/80 px-4 pb-6 pt-2 backdrop-blur-xl">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300 touch-none",
                                activeView === item.id ? "text-primary scale-110" : "text-muted-foreground scale-100"
                            )}
                        >
                            <div className={cn(
                                "flex h-10 w-16 items-center justify-center rounded-full transition-colors duration-300",
                                activeView === item.id ? "bg-primary/10" : "bg-transparent"
                            )}>
                                <item.icon className={cn("h-6 w-6", activeView === item.id ? "stroke-[2.5px]" : "stroke-[2px]")} />
                            </div>
                            <span className="text-[10px] font-medium leading-none">{item.label}</span>
                        </button>
                    ))}

                    <button
                        onClick={goLoginPage}
                        className="flex flex-col items-center gap-1 text-muted-foreground transition-all active:scale-95"
                    >
                        <div className="flex h-10 w-16 items-center justify-center">
                            <LogOut className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-medium leading-none">Exit</span>
                    </button>
                </div>
            </nav>

            {/* Spacers to prevent content from being hidden under navbars */}
            <div className="h-20 md:h-24" aria-hidden="true" />
        </>
    );
};

export default Navbar;
