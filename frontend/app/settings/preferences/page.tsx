'use client';

import { useState, useEffect } from 'react';
import { Bell, Monitor, Sun, Moon, Save, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getUserPreferences, updateUserPreferences, type UserPreferences } from '@/lib/api/users';
import { cn } from '@/lib/utils';

export default function PreferencesSettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const data = await getUserPreferences();
      setPreferences(data);
      setTheme(data.theme);
      setEmailNotifications(data.email_notifications);
      setItemsPerPage(data.items_per_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
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
      const updates: {
        theme?: 'light' | 'dark' | 'system';
        email_notifications?: boolean;
        items_per_page?: number;
      } = {};

      if (theme !== preferences?.theme) updates.theme = theme;
      if (emailNotifications !== preferences?.email_notifications)
        updates.email_notifications = emailNotifications;
      if (itemsPerPage !== preferences?.items_per_page)
        updates.items_per_page = itemsPerPage;

      if (Object.keys(updates).length > 0) {
        const updated = await updateUserPreferences(updates);
        setPreferences(updated);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const themeOptions = [
    { value: 'system', label: 'System', icon: Monitor },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ];

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-50 text-danger-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-success-50 text-success-700 text-sm">
          Preferences updated successfully
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value as typeof theme)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        isSelected ? 'text-primary-600' : 'text-neutral-500'
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isSelected ? 'text-primary-700' : 'text-neutral-700'
                      )}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-neutral-900">Email Notifications</p>
              <p className="text-sm text-neutral-500">
                Receive email updates about assessment progress and approvals
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-11 h-6 rounded-full transition-colors',
                  emailNotifications ? 'bg-primary-500' : 'bg-neutral-300'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform',
                    'absolute top-0.5',
                    emailNotifications ? 'translate-x-5.5' : 'translate-x-0.5'
                  )}
                  style={{
                    transform: emailNotifications
                      ? 'translateX(22px)'
                      : 'translateX(2px)',
                  }}
                />
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Select
              label="Items per page"
              value={String(itemsPerPage)}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              options={[
                { value: '10', label: '10 items' },
                { value: '25', label: '25 items' },
                { value: '50', label: '50 items' },
                { value: '100', label: '100 items' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
