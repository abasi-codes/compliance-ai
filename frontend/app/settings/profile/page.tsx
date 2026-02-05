'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Save, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getUserProfile, updateUserProfile, type UserProfile } from '@/lib/api/users';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      const updates: { name?: string; email?: string } = {};
      if (name !== profile?.name) updates.name = name;
      if (email !== profile?.email) updates.email = email;

      if (Object.keys(updates).length > 0) {
        const updated = await updateUserProfile(updates);
        setProfile(updated);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
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
              Profile updated successfully
            </div>
          )}

          <div>
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              required
            />
          </div>

          <div>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Account Status</p>
                <p className="text-sm text-neutral-500">
                  Member since {profile ? new Date(profile.created_at).toLocaleDateString() : ''}
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-success-50 text-success-700">
                Active
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-700">Roles</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile?.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700"
                  >
                    {role.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
