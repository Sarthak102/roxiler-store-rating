// frontend/src/pages/AdminDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <p>Admin metrics and management pages will be implemented here.</p>
      // frontend/src/pages/AdminDashboard.tsx (add buttons) import {Link} from
      "react-router-dom";
      {/* inside component JSX */}
      <div className="flex gap-3">
        <Link
          to="/admin/create-user"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Create User
        </Link>
        <Link
          to="/admin/create-store"
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Create Store
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
