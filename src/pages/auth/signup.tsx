import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, confirmSignUp, resendSignUpCode, SignUpOutput } from "aws-amplify/auth";
import ConfirmationForm from "./ConfirmationForm";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const SignUpStep = {
  CONFIRM_SIGN_UP: "CONFIRM_SIGN_UP",
};

interface IForm {
  username: string;
  email: string;
  address: string;
  phone: string;
  website: string;
  givenName: string;
  middleName: string;
  familyName: string;
  birthdate: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [form, setForm] = useState<IForm>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    address: "",
    phone: "",
    website: "",
    givenName: "",
    middleName: "",
    familyName: "",
    birthdate: "",
  });
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationCode(e.target.value);
    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      throw new Error("Email is required");
    }

    //const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
    const emailRegex = /^[^+@]+@[^@]+$/;
    if (!emailRegex.test(form.email)) {
      throw new Error("Please enter a valid email address with @ and without +");
    }

    /* const usernameRegex = /^[a-zA-Z0-9_@.]+$/;
    if (!usernameRegex.test(form.email)) {
      throw new Error(
        "Username can only contain letters, numbers, and underscores, and @"
      );
    } */

    if (form.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      validateForm();

      const { isSignUpComplete, nextStep }: SignUpOutput = await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            given_name: form.givenName,
            family_name: form.familyName,
            name: form.givenName,
            "custom:string": "",
          },
        },
      });

      if (isSignUpComplete) {
        setSuccess("Account created successfully! You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        if (nextStep.signUpStep === SignUpStep.CONFIRM_SIGN_UP) {
          setShowConfirmation(true);
          setSuccess(
            "Account created! Please check your email for the confirmation code."
          );
        }
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message || "Signup failed. Please try again.");
      } else {
        setError("An unknown error occurred during signup.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!confirmationCode.trim()) {
        throw new Error("Please enter the confirmation code");
      }

      const { isSignUpComplete } = await confirmSignUp({
        username: form.email,
        confirmationCode: confirmationCode.trim(),
      });

      if (isSignUpComplete) {
        setSuccess("Email confirmed successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err: unknown) {
      console.error("Confirmation error:", err);
      if (err instanceof Error) {
        setError(
          err.message || "Confirmation failed. Please check the code and try again."
        );
      } else {
        setError("An unknown error occurred during confirmation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      await resendSignUpCode({
        username: form.email,
      });
      setSuccess("Confirmation code resent! Please check your email.");
    } catch (err: unknown) {
      console.error("Resend code error:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to resend code. Please try again.");
      } else {
        setError("An unknown error occurred while resending the code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <ConfirmationForm
        email={form.email}
        error={error}
        success={success}
        confirmationCode={confirmationCode}
        isLoading={isLoading}
        handleCodeChange={handleCodeChange}
        handleConfirmSignUp={handleConfirmSignUp}
        handleResendCode={handleResendCode}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg mx-4 sm:mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="mb-4 text-red-500 bg-red-100 p-3 rounded dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-green-500 bg-green-100 p-3 rounded dark:bg-green-900 dark:text-green-200">
                {success}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="givenName">Given Name</Label>
                    <Input
                        id="givenName"
                        name="givenName"
                        value={form.givenName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="familyName">Family Name</Label>
                    <Input
                        id="familyName"
                        name="familyName"
                        value={form.familyName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <small className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </small>
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;

