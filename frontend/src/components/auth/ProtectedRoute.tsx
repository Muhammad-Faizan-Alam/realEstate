import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  element: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // Still loading user info
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // Not logged in or unauthorized
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  // Authorized — render the protected page
  return element;
};

export default ProtectedRoute;