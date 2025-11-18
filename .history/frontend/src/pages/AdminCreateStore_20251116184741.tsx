// frontend/src/pages/AdminCreateStore.tsx
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup
  .object({
    name: yup.string().required().min(2).max(200),
    email: yup.string().email().optional().nullable(),
    address: yup.string().max(400).optional().nullable(),
    owner_id: yup.string().optional().nullable(),
  })
  .required();

type Form = yup.InferType<typeof schema>;

export default function AdminCreateStore() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", address: "", owner_id: "" },
  });

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      await api.post("/stores", data);
      toast.success("Store created");
      navigate("/admin/stores");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Failed to create store");
      } else {
        toast.error("Failed to create store");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Create Store</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block">Name</label>
        <input {...register("name")} className="border p-2 w-full rounded" />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <label className="block mt-3">Email</label>
        <input {...register("email")} className="border p-2 w-full rounded" />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}

        <label className="block mt-3">Address</label>
        <textarea
          {...register("address")}
          className="border p-2 w-full rounded"
          rows={2}
        />

        <label className="block mt-3">Owner user id (optional)</label>
        <input
          {...register("owner_id")}
          className="border p-2 w-full rounded"
        />

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
