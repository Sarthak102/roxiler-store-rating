// frontend/src/pages/Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

      // read persisted user from localStorage (AuthProvider persists it)
      let storedUser: any = null;
      try {
        storedUser = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        storedUser = null;
      }

      // if admin -> go to admin dashboard; otherwise go to stores
      if (storedUser?.role === "admin") {
        navigate("/admin"); // <-- adjust to your admin dashboard route if different
      } else {
        navigate("/stores");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Login failed");
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block">Email</label>
        <input
          {...register("email")}
          type="email"
          className="border p-2 w-full rounded"
        />

        <label className="block mt-3">Password</label>
        <input
          {...register("password")}
          type="password"
          className="border p-2 w-full rounded"
        />

        <button
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
