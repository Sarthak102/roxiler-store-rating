
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/button";
import api from "../services/api"; 
import axios from "axios";

type RegisterForm = {
  name: string;
  email: string;
  address?: string;
  password: string;
};

export default function Register() {
  const { login, loading } = useAuth();
  const { register, handleSubmit } = useForm<RegisterForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      // ✅ this now hits https://roxiler-store-rating-ruki.onrender.com/api/auth/register
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address || null,
        role: "user",
      });

      // login still uses the same api client under the hood
      await login(data.email, data.password);
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Registration failed");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm px-8 py-8">
        <div className="flex justify-center gap-2 mb-6 text-sm font-medium">
          <Link
            to="/login"
            className="px-4 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Login
          </Link>
          <button className="px-4 py-1 rounded-full border border-gray-900 bg-gray-900 text-white">
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">
              Full name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            />
          </div>

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
            <label className="text-sm font-medium text-gray-800">Address</label>
            <input
              {...register("address")}
              type="text"
              placeholder="Your address (optional)"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Create a password"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded-lg text-sm"
          >
            {loading ? "Creating account..." : "Create an account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
