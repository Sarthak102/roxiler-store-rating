// frontend/src/pages/Register.tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  // treat address as always present but can be ""
  address: string;
};

const schema: yup.ObjectSchema<RegisterFormData> = yup
  .object({
    name: yup
      .string()
      .required("Name required")
      .min(20, "Minimum 20 characters")
      .max(60, "Maximum 60 characters"),
    email: yup.string().required("Email required").email("Invalid email"),
    password: yup
      .string()
      .required("Password required")
      .matches(
        passwordRegex,
        "Password must be 8–16 chars, include uppercase and special char"
      ),
    address: yup.string().max(400, "Max 400 characters").default(""),
  })
  .required();

export default function Register() {
  const { register: doRegister, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: { address: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // send empty string as undefined if you want to treat empty as "no address"
      const payload = {
        ...data,
        address: data.address || undefined,
      };
      await doRegister(payload);
      navigate("/stores");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Registration failed");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block">Full name</label>
        <input {...register("name")} className="border p-2 w-full rounded" />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <label className="block mt-3">Email</label>
        <input
          {...register("email")}
          type="email"
          className="border p-2 w-full rounded"
        />
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

        <label className="block mt-3">Address (optional)</label>
        <textarea
          {...register("address")}
          className="border p-2 w-full rounded"
          rows={3}
        />
        {errors.address && (
          <p className="text-red-600">{errors.address.message}</p>
        )}

        <button
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
