// frontend/src/pages/ChangePassword.tsx
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";
import Layout from "../components/Layout";

type Form = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>();
  const toast = useToast();

  const onSubmit = async (data: Form) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    try {
      await api.post("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated");
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        toast.error(err.response?.data?.error || "Failed to change password");
      else toast.error("Failed to change password");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto border ">
        <div className="card p-6">
          <h2 className="text-2xl mb-4">Change password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="text-sm">Current password</label>
              <Input
                {...register("currentPassword", { required: true })}
                type="password"
              />
              {errors.currentPassword && (
                <div className="text-red-500 text-sm">Required</div>
              )}
            </div>

            <div>
              <label className="text-sm">New password</label>
              <Input
                {...register("newPassword", { required: true, minLength: 8 })}
                type="password"
              />
              {errors.newPassword && (
                <div className="text-red-500 text-sm">
                  At least 8 characters
                </div>
              )}
            </div>

            <div>
              <label className="text-sm">Confirm new password</label>
              <Input
                {...register("confirmPassword", { required: true })}
                type="password"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                Update password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
