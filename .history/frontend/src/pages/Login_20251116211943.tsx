// frontend/src/pages/Login.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";

type LoginForm = { email: string; password: string };

export default function Login() {
  const { login, loading, user } = useAuth();
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/stores", { replace: true });
    }
  }, [user]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      // login triggers persisted user; PublicRoute/App will redirect
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <h2 className="text-2xl mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <Input {...register("email")} type="email" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input {...register("password")} type="password" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
