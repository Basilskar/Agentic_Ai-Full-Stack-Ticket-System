import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // For protected routes, redirect to login if not authenticated
    if (protectedRoute && !token) {
      navigate("/login");
      return;
    }

    // For public routes (like login/signup), redirect to home if already logged in
    if (!protectedRoute && token) {
      navigate("/");
      return;
    }

    setLoading(false);
  }, [navigate, protectedRoute]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return children;
}

export default CheckAuth;
