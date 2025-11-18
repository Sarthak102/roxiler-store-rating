// frontend/src/pages/Login.tsx
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/button";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const { login, loading } = useAuth();
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate("/"); // RoleRedirect will decide where to go
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Login failed");
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm px-8 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6 text-sm font-medium">
          <button className="px-4 py-1 rounded-full border border-gray-900 bg-gray-900 text-white">
            Login
          </button>
          <Link
            to="/register"
            className="px-4 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">
              Email address
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Enter your email address"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-800">
                Password
              </label>
              <span className="text-xs text-gray-500 cursor-default">
                Forgot password?
              </span>
            </div>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded-lg text-sm"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Don&apos;t have an account yet?{" "}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
