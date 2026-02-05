'use client';

import { useState } from 'react';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { changePassword } from '@/lib/api/auth';
import { useAuth } from '@/lib/auth';

export default function SecuritySettingsPage() {
  const { getAccessToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError('Not authenticated');
      return;
    }

    setIsSaving(true);

    try {
      await changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-50 text-danger-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success-50 text-success-700 text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              Password changed successfully
            </div>
          )}

          <div>
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              helperText="Must be at least 8 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <h3 className="font-medium text-neutral-900 mb-2">Password Requirements</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li className="flex items-center gap-2">
                <span
                  className={
                    newPassword.length >= 8 ? 'text-success-600' : 'text-neutral-400'
                  }
                >
                  {newPassword.length >= 8 ? '✓' : '○'}
                </span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={
                    newPassword === confirmPassword && newPassword.length > 0
                      ? 'text-success-600'
                      : 'text-neutral-400'
                  }
                >
                  {newPassword === confirmPassword && newPassword.length > 0
                    ? '✓'
                    : '○'}
                </span>
                Passwords match
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
              leftIcon={<Lock className="h-4 w-4" />}
            >
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
