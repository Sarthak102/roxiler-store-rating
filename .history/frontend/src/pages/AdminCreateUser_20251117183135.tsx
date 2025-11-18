import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { createUser } from "../services/adminService";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

type FormValues = {
  name: string;
  email: string;
  password: string;
  address?: string;
  role?: "user" | "store_owner" | "admin";
};

export default function AdminCreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { role: "user" },
  });
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      await createUser(data);
      toast.success("User created");
      reset();
      navigate("/admin/users");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Failed to create user");
      } else {
        toast.error("Failed to create user");
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Create user</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm block mb-1">Name</label>
              <Input {...register("name", { required: "Name is required" })} />
              {errors.name && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm block mb-1">Email</label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm block mb-1">Password</label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password required",
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              {errors.password && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm block mb-1">Address</label>
              <Input {...register("address")} />
            </div>

            <div>
              <label className="text-sm block mb-1">Role</label>
              <select
                {...register("role")}
                className="w-full rounded border px-3 py-2"
              >
                <option value="user">User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create user"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
