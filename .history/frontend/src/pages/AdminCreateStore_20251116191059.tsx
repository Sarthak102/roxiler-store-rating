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
    name: yup.string().required("Name is required").min(2).max(200),
    // keep fields present in type (can be empty string)
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
    resolver: yupResolver(schema as any), // yup types are sometimes broad; this keeps TS happy
    defaultValues: { name: "", email: "", address: "", owner_id: "" },
  });

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      // normalize empty strings to null where appropriate
      const payload = {
        name: data.name,
        email: data.email ? data.email : undefined,
        address: data.address ? data.address : undefined,
        owner_id: data.owner_id ? data.owner_id : undefined,
      };
      console.log(
        "Submitting store, token:",
        localStorage.getItem("accessToken")
      );
      await api.post("/stores", payload);
      toast.success("Store created");
      navigate("/admin/stores");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // if server returned JSON error
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
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
