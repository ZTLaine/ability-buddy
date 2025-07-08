'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/custom-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { AlertCircle, CheckCircle, Eye, EyeOff, X } from 'lucide-react';
import { ResetPasswordFormSchema } from '@/lib/schemas/auth';

interface ResetPasswordFormProps {
  readonly token: string;
  readonly onClose: () => void;
}

// Success component to reduce complexity
const SuccessCard = ({ onClose }: { onClose: () => void }) => (
  <div className="w-full max-w-md">
    <Card className="bg-white border-[#B39DDB]/30 shadow-lg transform-none transition-none hover:transform-none">
      <CardHeader className="bg-white border-b border-[#B39DDB]/30 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-4 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl font-bold text-[#00796B]">
          Password Reset Successful
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#4CAF50]">
            <CheckCircle size={20} />
            <span>Your password has been successfully reset!</span>
          </div>
          <p className="text-sm text-gray-600">
            You can now log in with your new password. Redirecting to main page...
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
          >
            Go to Main Page
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Loading component to reduce complexity
const LoadingCard = ({ onClose }: { onClose: () => void }) => (
  <div className="w-full max-w-md">
    <Card className="bg-white border-[#B39DDB]/30 border-2 shadow-lg transform-none transition-none hover:transform-none rounded-lg">
      <CardHeader className="bg-white border-b border-[#B39DDB]/30 relative rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-4 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl font-bold text-[#00796B]">
          Reset Your Password
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00796B]"></div>
          <p className="text-sm text-gray-600">Verifying reset link...</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Error component to reduce complexity
const ErrorCard = ({ error, onClose }: { error: string; onClose: () => void }) => (
  <div className="w-full max-w-md">
    <Card className="bg-white border-[#B39DDB]/30 border-2 shadow-lg transform-none transition-none hover:transform-none rounded-lg">
      <CardHeader className="bg-white border-b border-[#B39DDB]/30 relative rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-4 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl font-bold text-[#00796B]">
          Reset Your Password
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-red-50 p-3 rounded-lg flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            onClick={onClose}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
          >
            Go to Main Page
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Password input component to reduce complexity
const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggleShow,
  placeholder,
  isLoading,
  showHint = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder: string;
  isLoading: boolean;
  showHint?: boolean;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-[#00796B] font-medium">
      {label}
    </Label>
    <div className="relative">
      <CustomInput
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="pr-10 border-[#B39DDB] rounded-lg focus:border-[#00796B] focus:ring-[#00796B]"
        placeholder={placeholder}
        disabled={isLoading}
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={onToggleShow}
        disabled={isLoading}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
    {showHint && (
      <p className="text-xs text-gray-500">
        Password must be at least 8 characters with a number and symbol
      </p>
    )}
  </div>
);

export default function ResetPasswordForm({ token, onClose }: Readonly<ResetPasswordFormProps>) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  const handleClose = () => {
    window.location.href = '/';
  };

  const validateToken = async () => {
    setIsValidatingToken(true);
    try {
      const response = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setTokenValid(true);
      } else {
        const data = await response.json();
        setTokenValid(false);
        setError(data.message ?? 'This password reset link has expired or is invalid. Please request a new one.');
      }
    } catch (err) {
      console.error('Token validation error:', err);
      setTokenValid(false);
      setError('Unable to verify reset token. Please try again.');
    } finally {
      setIsValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const validatedFormData = ResetPasswordFormSchema.parse({ password, confirmPassword });

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: validatedFormData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        setError(data.message ?? 'Failed to reset password');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        console.error('Password reset error:', err);
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Validate token on component mount
  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  // Early returns to reduce cognitive complexity
  if (success) {
    return <SuccessCard onClose={handleClose} />;
  }

  if (isValidatingToken) {
    return <LoadingCard onClose={handleClose} />;
  }

  if (tokenValid === false) {
    return <ErrorCard error={error} onClose={handleClose} />;
  }

  return (
    <div className="w-full max-w-md">
      <Card className="bg-white border-[#B39DDB]/30 border-2 shadow-lg transform-none transition-none hover:transform-none rounded-lg">
        <CardHeader className="bg-white border-b border-[#B39DDB]/30 relative rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-[#00796B]">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="password"
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              onToggleShow={() => setShowPassword(!showPassword)}
              placeholder="Enter your new password"
              isLoading={isLoading}
              showHint={true}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPassword={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirm your new password"
              isLoading={isLoading}
            />

            {error && (
              <div className="bg-red-50 p-3 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 