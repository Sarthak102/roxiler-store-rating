import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Layout from "../components//Layout";
import Card from "../../components/ui/card";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { createUser } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import axios from "axios";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

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
  } = useForm<FormValues>({
    defaultValues: { role: "user" },
  });

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      await createUser(data);
      toast.success("User created");
      navigate("/admin/users");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Create user error:", err.response);

        const backendErrors = err.response?.data?.errors;

        if (Array.isArray(backendErrors)) {
          backendErrors.forEach((e: string) => toast.error(e));
        } else {
          toast.error(err.response?.data?.error || "Failed to create user");
        }
      } else {
        toast.error("Failed to create user");
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Create User</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="text-sm block mb-1">Name</label>
              <Input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 20,
                    message: "Name must be at least 20 characters long",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm block mb-1">Email</label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm block mb-1">Password</label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passwordRegex,
                    message:
                      "Password must contain: 1 uppercase + 1 special character. Length 8–16.",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm block mb-1">Address</label>
              <Input {...register("address")} />
            </div>

            {/* ROLE */}
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
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
