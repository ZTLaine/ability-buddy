'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { ResetPasswordFormSchema } from '@/lib/schemas/auth';
import { useModalHeight } from '@/hooks/use-modal-height';
import { createModalConfig, modalTitleStyles } from '@/lib/modal-config';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export default function ResetPasswordModal({ isOpen, onClose, token }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const router = useRouter();
  const modalHeight = useModalHeight({ 
    isOpen, 
    dependencies: [error, success, tokenValid] 
  });

  // Validate token on component mount
  useEffect(() => {
    if (token && isOpen) {
      validateToken();
    }
  }, [token, isOpen]);

  const validateToken = async () => {
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
        setError(data.message || 'This password reset link has expired or is invalid. Please request a new one.');
      }
    } catch (error) {
      setTokenValid(false);
      setError('Unable to verify reset token. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate form data (frontend validation)
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
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setSuccess(false);
    setTokenValid(null);
    onClose();
  };

  if (success) {
    const modalConfig = createModalConfig(modalHeight, 'reset-password');
    
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className={modalConfig.content.className}
          style={modalConfig.content.style}
        >
          <DialogHeader className={modalConfig.header.className}>
            <DialogTitle className={modalTitleStyles.reset}>
              Password Reset Successful
            </DialogTitle>
          </DialogHeader>
          <div className={modalConfig.body.className}>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#4CAF50]">
                <CheckCircle size={20} />
                <span>Your password has been successfully reset!</span>
              </div>
              <p className="text-sm text-gray-600">
                You can now log in with your new password. This dialog will close automatically.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const modalConfig = createModalConfig(modalHeight, 'reset-password');
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={modalConfig.content.className}
        style={modalConfig.content.style}
      >
        <DialogHeader className={modalConfig.header.className}>
          <DialogTitle className={modalTitleStyles.reset}>
            Reset Your Password
          </DialogTitle>
        </DialogHeader>
        
        <div className={modalConfig.body.className}>
          {tokenValid === false ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 border-gray-300 focus:border-[#00796B] focus:ring-[#00796B]"
                    placeholder="Enter your new password"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters with a number and symbol
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 border-gray-300 focus:border-[#00796B] focus:ring-[#00796B]"
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 