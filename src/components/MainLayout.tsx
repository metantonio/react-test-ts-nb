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
        
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
