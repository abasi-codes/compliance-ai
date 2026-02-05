'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { RegisterForm } from '@/components/auth';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl gradient-primary shadow-lg mb-4">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Create an account</h1>
          <p className="mt-2 text-neutral-600">Get started with Compliance AI</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
