import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SpinnerBackdrop } from "./ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      login(window.location.href);
    }
  }, [loading, authenticated, router]);

  if (loading) {
    return <SpinnerBackdrop />;
  }

  return authenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
