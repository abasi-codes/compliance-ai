'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-50 text-danger-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />
      </div>

      <div>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          required
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={isLoading}
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Create one
        </Link>
      </p>
    </form>
  );
}
