import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Admin Login | ApeWada",
  description: "Sign in to ApeWada Admin Portal",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-200">
            AW
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ApeWada Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage the platform
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-gray-400 mt-8">
          {/* © {new Date().getFullYear()} ApeWada. All rights reserved. */}
        </p>
      </div>
    </div>
  );
}
