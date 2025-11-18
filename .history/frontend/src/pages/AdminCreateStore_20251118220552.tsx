import React, { useEffect, useState } from "react";
import Layout from "../components//Layout";
import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Card from "../components/ui/card";
import { createStore, getStoreOwners } from "../services/adminService";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  email?: string;
  address?: string;
  owner_id?: string | null;
};

export default function AdminCreateStore() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [owners, setOwners] = useState<
    { id: string; name: string; email: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const ownersList = await getStoreOwners();
        setOwners(ownersList);
      } catch (err) {
        console.error("Failed to fetch store owners", err);
      }
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await createStore(data);
      toast.success("Store created successfully!");
    } catch {
      toast.error("Failed to create store");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        <Card className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold">Create Store</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label>Name</label>
              <Input {...register("name", { required: true })} />
              {errors.name && <p className="text-red-500">Name is required</p>}
            </div>

            <div>
              <label>Email</label>
              <Input {...register("email")} type="email" />
            </div>

            <div>
              <label>Address</label>
              <Input {...register("address")} />
            </div>

            <div>
              <label>Store Owner</label>
              <select
                {...register("owner_id")}
                className="border p-2 rounded w-full"
              >
                <option value="">No owner assigned</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} — {o.email}
                  </option>
                ))}
              </select>
            </div>

            <Button className="w-full" type="submit">
              Create Store
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
