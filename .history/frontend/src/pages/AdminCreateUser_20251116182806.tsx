import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const schema = yup.object({
  name: yup.string().min(20).max(60).required(),
  email: yup.string().email().required(),
  password: yup.string().matches(passwordRegex).required(),
  address: yup.string().max(400).optional(),
  role: yup.string().oneOf(["admin", "user", "store_owner"]).required(),
});

type Form = yup.InferType<typeof schema>;

export default function AdminCreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: yupResolver(schema) });
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      // send to admin endpoint
      const res = await api.post("/admin/users", data);
      toast.success("User created");
      // optionally navigate to admin user list
      navigate("/admin/users");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = err as any;
        toast.error(e.response?.data?.error || "Failed to create user");
      } else {
        toast.error("Failed to create user");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Create User (Admin)</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block">Full Name</label>
        <input {...register("name")} className="border p-2 w-full rounded" />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <label className="block mt-3">Email</label>
        <input {...register("email")} className="border p-2 w-full rounded" />
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

        <label className="block mt-3">Address</label>
        <input {...register("address")} className="border p-2 w-full rounded" />

        <label className="block mt-3">Role</label>
        <select {...register("role")} className="border p-2 w-full rounded">
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
          <option value="admin">Admin</option>
        </select>

        <div className="mt-4 flex gap-2">
          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
