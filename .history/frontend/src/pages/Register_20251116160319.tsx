// frontend/src/pages/Register.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const schema = yup.object({
  name: yup.string().required("Name required").min(20).max(60),
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup
    .string()
    .matches(
      passwordRegex,
      "Password must be 8-16 chars, include uppercase and special char"
    )
    .required(),
  address: yup.string().max(400).optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function Register() {
  const { register: doRegister, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await doRegister(data);
      navigate("/stores"); // or wherever makes sense
    } catch (err: any) {
      alert(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block">Full name</label>
        <input {...register("name")} className="border p-2 w-full rounded" />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <label className="block mt-3">Email</label>
        <input
          {...register("email")}
          type="email"
          className="border p-2 w-full rounded"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}

        <label className="block mt-3">Password</label>
        <input
          {...register("password")}
          type="password"
          className="border p-2 w-full rounded"
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}

        <label className="block mt-3">Address (optional)</label>
        <textarea
          {...register("address")}
          className="border p-2 w-full rounded"
          rows={3}
        />

        <button
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
