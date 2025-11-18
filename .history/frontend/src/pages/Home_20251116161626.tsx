// frontend/src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Store Rating App</h1>
      <p className="mb-4">
        Welcome! You can register, log in, browse stores and rate them.
      </p>

      <div className="flex gap-3">
        <Link
          to="/register"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;