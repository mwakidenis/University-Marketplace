
import React from 'react';
import AuthForm from '@/components/AuthForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 dark:border-gray dark:text-gray-300">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-marketplace-purple">Kuza<span className="text-gray-900 dark:text-white">Market</span></h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in or create an account to continue</p>
        </div>
        
        <Alert variant="destructive" className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            New users must sign up before logging in. If you've already signed up, please ensure 
            you're using the correct email and password.
          </AlertDescription>
        </Alert>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
