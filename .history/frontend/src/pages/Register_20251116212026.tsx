// frontend/src/pages/Register.tsx
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    name: yup.string().required().min(20).max(60),
    email: yup.string().email().required(),
    password: yup.string().required(),
    address: yup.string().optional().default(""),
  })
  .required();

type Form = yup.InferType<typeof schema>;

export default function Register() {
  const { register: doRegister, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      await doRegister(data);
      navigate("/stores");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <h2 className="text-2xl mb-4">Register</h2>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm">Full name</label>
            <Input {...register("name")} />
            {errors.name && (
              <div className="text-red-600 text-sm">{errors.name.message}</div>
            )}
          </div>

          <div>
            <label className="text-sm">Email</label>
            <Input {...register("email")} />
            {errors.email && (
              <div className="text-red-600 text-sm">{errors.email.message}</div>
            )}
          </div>

          <div>
            <label className="text-sm">Password</label>
            <Input {...register("password")} type="password" />
            {errors.password && (
              <div className="text-red-600 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm">Address (optional)</label>
            <Input {...register("address")} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
