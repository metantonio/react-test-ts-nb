// src/components/layouts/DashboardLayout.jsx
import { AppSidebar } from "./AppSidebar";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useUser();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-end p-4 bg-white border-b">
          <Button onClick={logout}>Logout</Button>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
