import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { signIn, confirmSignIn, getCurrentUser, fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { AuthError } from 'aws-amplify/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FormState = {
  username: string;
  password: string;
};

const LoginCognito = () => {
  const { login, isAuthenticated } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState<FormState>({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [enableRedirect, setEnableRedirect] = useState<boolean>(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please fill in all fields');
      }

      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;
        const userAttributes = await fetchUserAttributes();

        if (!idToken) {
          throw new Error('No ID token found in session');
        }

        await login(currentUser, idToken.toString(), userAttributes, session);

        const redirectUrl = idToken.payload.website as string || currentUser.signInDetails?.loginId || '';

        if (redirectUrl && enableRedirect) {
          let absoluteUrl = `${redirectUrl}/?code=${idToken.payload.jti}`;
          if (redirectUrl.includes('.') && !redirectUrl.includes('://')) {
            absoluteUrl = `https://${redirectUrl}/?code=${idToken.payload.jti}`;
          }
        }
        navigate('/league');
      } else {
        handleAuthNextStep(nextStep);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.name === 'UserNotFoundException' || err.name === 'NotAuthorizedException') {
        setShowSignUpDialog(true);
      } else if (err.name === 'NewPasswordRequired') {
        navigate('/updatepassword', { state: { email } });
      } else if (err instanceof Error) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } else {
        setError('An unknown error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthNextStep = (nextStep: any) => {
    switch (nextStep.signInStep) {
      case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
        navigate('/updatepassword', { state: { email } });
        break;
      case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
        setError('MFA code required. Please implement MFA flow.');
        break;
      case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
        setError('SMS verification required. Please implement SMS flow.');
        break;
      default:
        setError('Additional verification required.');
    }
  };




  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Welcome </h1>
            <p className="text-gray-600 mt-2">Sign in to your NBA Simulator account</p>
          </div>

          <Card className="border-gray-200 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-gray-800">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-800">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">
                  {error}
                </div>
              )}
              <AlertDialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Account not found</AlertDialogTitle>
                    <AlertDialogDescription>
                      The email or password you entered is incorrect. {/* Would you like to create a new account? */}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* <AlertDialogAction onClick={() => navigate('/adminpanel/login/signup')}>Sign Up</AlertDialogAction> */}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 text-gray-800">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 text-gray-100"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 text-gray-800">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        handleChange(e)
                      }}
                      className="pl-10 pr-10 text-gray-100"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-3 w-4" /> : <Eye className="h-3 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-navy-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                <Button type="button" className="w-full bg-navy-600 hover:bg-navy-700" onClick={() => { navigate("/signup") }}>
                  Sign Up
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Animation */}
      <div className="hidden lg:flex lg:w-1/2 casino-gradient flex items-center justify-center p-8 relative overflow-hidden">
        <div className="text-center text-white z-10">
          <div className="relative">
            {/* Animated Casino Elements */}
            <div className="mb-6">
              {/* <img
                src="/src/singlegame_image.png" // ⬅️ Replace with actual logo path
                alt="CasinoVizion Logo"
                className="h-24 w-24 mx-auto"
              /> */}
            </div>

            <h2 className="text-4xl font-bold mb-4">NBA Simulation Platform</h2>
            <p className="text-xl mb-8 opacity-90">
              Professional  Simulator
            </p>

            <div className="basketball-to-chart">
              {/* <div className="ball">
                <div className="curve left"></div>
                <div className="curve right"></div>
              </div> */}

              <div className="basketball">
                <div className="ball">
                  <div className="lines"></div>
                </div>

              </div>
              {/* <div className="chart">
                <div className="y-axis"></div>
                <div className="x-axis"></div>
                <div className="bars">
                  <div className="bar bar1"></div>
                  <div className="bar bar2"></div>
                  <div className="bar bar3"></div>
                </div>
              </div> */}
            </div>

            {/* Floating Cards Animation */}
            {/* <div className="relative h-32">
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 animate-pulse">
                <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-maroon-600 transform rotate-12">
                  PlayerA
                </div>
              </div>
              <div className="absolute left-1/2 top-4 transform -translate-x-1/2 animate-pulse delay-1000">
                <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-red-600 transform -rotate-12">
                  playerB
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-casino-gold opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 -right-20 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-casino-gold opacity-5 rounded-full animate-pulse delay-1500"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="border border-white animate-pulse"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCognito;
