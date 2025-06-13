import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />

        {children}

        <AppFooter />
      </div>
    </ProtectedRoute>
  );
}
