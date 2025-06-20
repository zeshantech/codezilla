"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SpinnerBackdrop } from "./ui/spinner";
import UnAuthenticatedComponent from "./UnAuthenticatedComponent";
import { useUser } from "@auth0/nextjs-auth0";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <SpinnerBackdrop />;
  }

  return user ? children : <UnAuthenticatedComponent />;
};

export default ProtectedRoute;
