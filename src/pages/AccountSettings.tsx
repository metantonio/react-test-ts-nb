import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { User, Mail, Lock, Shield, Bell } from 'lucide-react';

const AccountSettings = () => {
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    return (
        <div className="container mx-auto max-w-4xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
                <p className="text-muted-foreground">Manage your account details and security preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Sidebar Navigation (Simple for now) */}
                <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-primary font-semibold">
                        <User className="mr-2 h-4 w-4" />
                        General Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                        <Lock className="mr-2 h-4 w-4" />
                        Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </Button>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-6">
                    {/* Profile Card */}
                    <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="username" defaultValue="metantonio" className="pl-10" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" defaultValue="antonio@example.com" disabled className="pl-10" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    {/* Password Section */}
                    <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Change your password to keep your account secure.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isChangingPassword ? (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current">Current Password</Label>
                                        <Input id="current" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new">New Password</Label>
                                        <Input id="new" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm">Confirm New Password</Label>
                                        <Input id="confirm" type="password" />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Change your password and other security settings.</p>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {isChangingPassword ? (
                                <>
                                    <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                                    <Button variant="outline">Update Password</Button>
                                </>
                            ) : (
                                <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                                    Change Password
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Account Security (Placeholder) */}
                    <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5 text-primary" />
                                Security Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                                    <p className="text-xs text-muted-foreground">Not enabled</p>
                                </div>
                                <Button size="sm" variant="secondary">Enable</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
