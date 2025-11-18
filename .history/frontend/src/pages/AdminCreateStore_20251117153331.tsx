// frontend/src/pages/AdminCreateStore.tsx
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Card from "../components/ui/card";
import axios from "axios";
import Layout from "../components/Layout";

const schema = yup
  .object({
    name: yup.string().required("Name is required").min(2).max(200),
    email: yup.string().email("Invalid email").nullable().default(""),
    address: yup.string().max(400).nullable().default(""),
    owner_id: yup.string().nullable().default(""),
  })
  .required();

type Form = {
  name: string;
  email: string | null;
  address: string | null;
  owner_id: string | null;
};

export default function AdminCreateStore() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: yupResolver(schema as any),
    defaultValues: { name: "", email: "", address: "", owner_id: "" },
  });

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      const payload = {
        name: data.name,
        email: data.email ? data.email : undefined,
        address: data.address ? data.address : undefined,
        owner_id: data.owner_id ? data.owner_id : undefined,
      };

      await api.post("/stores", payload);
      toast.success("Store created");
      navigate("/admin/stores", {
        state: { message: "Store created successfully" },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMsg =
          err.response?.data?.error || err.response?.data || err.message;
        toast.error(String(serverMsg));
        console.error("Create store error response:", err.response);
      } else {
        toast.error("Failed to create store");
        console.error("Create store unexpected error:", err);
      }
    }
  };

  return (
    <Layout
    <div className="max-w-md mx-auto p-6">
      <Card>
        <h2 className="text-2xl mb-4">Create Store</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <div className="text-red-600 text-sm">
                {(errors.name as any).message}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm block mb-1">Email</label>
            <Input {...register("email")} />
            {errors.email && (
              <div className="text-red-600 text-sm">
                {(errors.email as any).message}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm block mb-1">Address</label>
            <Input {...register("address")} />
          </div>

          <div>
            <label className="text-sm block mb-1">
              Owner user id (optional)
            </label>
            <Input {...register("owner_id")} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
