// frontend/src/pages/Login.tsx

import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type Form = { email: string; password: string };

export default function Login() {
  const { login, loading } = useAuth();
  const { register, handleSubmit } = useForm<Form>();
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password);
      navigate("/stores");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Login failed");
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
