import { Button } from '@/components/ui/button';
import { auth } from '@/services/auth-service';
import useAuthStore from '@/stores/auth-store';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated, setIsAuthenticated, setAccessToken } =
    useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const token = await auth(username, password);
        setIsAuthenticated(true);
        setAccessToken(token);
    } catch(e) {
      toast.error(`Login failed. ${e}`);
      return;
    }
    navigate('/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    window.location.reload();
  };

  if (isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-blue-900">
            Already Logged In
          </h1>
          <p className="mb-6 text-center text-gray-600">
            You are already logged in. Would you like to log out?
          </p>
          <Button
            type="button"
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-900">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username field */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login button */}
          <Button type="submit" className="w-full bg-blue-600">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
