import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft, History, CreditCard, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DigitalWallet = () => {
    const transactions = [
        { id: 1, type: 'credit', title: 'Top-up from Card', amount: '$50.00', date: '2023-11-20', status: 'Completed' },
        { id: 2, type: 'debit', title: 'Game Entry Fee', amount: '$5.00', date: '2023-11-19', status: 'Completed' },
        { id: 3, type: 'debit', title: 'Season Pass Purchase', amount: '$15.00', date: '2023-11-18', status: 'Pending' },
    ];

    return (
        <div className="container mx-auto max-w-5xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Digital Wallet</h2>
                    <p className="text-muted-foreground">Manage your credits and transaction history.</p>
                </div>
                <Button className="w-fit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Credits
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Balance and Cards */}
                <div className="space-y-6">
                    {/* Main Balance Card */}
                    <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10">
                            <Wallet className="h-40 w-40 rotate-12" />
                        </div>
                        <CardHeader>
                            <CardDescription className="text-primary-foreground/70">Current Balance</CardDescription>
                            <CardTitle className="text-4xl font-black">$245.80</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <div className="rounded-lg bg-white/10 p-2 text-primary">
                                    <ArrowDownLeft className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Earned</p>
                                    <p className="text-sm font-semibold">+$120.00</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Payment Methods</CardTitle>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-black/20">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">VISA •••• 4242</p>
                                        <p className="text-[10px] text-muted-foreground">Expires 12/25</p>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Transactions */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>Track your spending and earnings.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <History className="mr-2 h-4 w-4" />
                                Full History
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-1">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full",
                                                tx.type === 'credit' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                {tx.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{tx.title}</p>
                                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                "text-sm font-bold",
                                                tx.type === 'credit' ? "text-green-500" : "text-foreground"
                                            )}>
                                                {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">{tx.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" className="w-full text-xs" size="sm">
                                View all transactions
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DigitalWallet;
