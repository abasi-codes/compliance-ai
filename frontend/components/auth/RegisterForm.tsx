'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth';

export function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          leftIcon={<User className="h-4 w-4" />}
          required
          autoComplete="name"
        />
      </div>

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
          placeholder="At least 8 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          required
          autoComplete="new-password"
        />
      </div>

      <div>
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          leftIcon={<Lock className="h-4 w-4" />}
          required
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={isLoading}
      >
        Create account
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
