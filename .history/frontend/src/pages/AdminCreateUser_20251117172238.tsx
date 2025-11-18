import React from "react";
import { useForm } from "react-hook-form";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { createUser } from "../services/adminService";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";

export default function AdminCreateUser() {
  const { register, handleSubmit } = useForm();
  const toast = useToast();

  const onSubmit = async (data: any) => {
    try {
      await createUser(data);
      toast.success("User created");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to create user");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6">
        <Card className="p-6">
          <h2 className="text-2xl mb-4">Create user</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="text-sm">Name</label>
              <Input {...register("name", { required: true })} />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <Input {...register("email", { required: true })} />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <Input type="password" {...register("password", { required: true })} />
            </div>
            <div>
              <label className="text-sm">Address</label>
              <Input {...register("address")} />
            </div>
            <div>
              <label className="text-sm">Role</label>
              <select {...register("role")} className="w-full rounded border px-3 py-2">
                <option value="user">User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}