import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import Nav from "../components/Partials/Nav";
import { Outlet, useNavigate } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useAdminContext } from "../../api/context/AdminContext";
import { ThemeProvider  } from '../components/theme-provider'
import TextFillLoading from "../components/ui/TextFillLoading";
import DashboardFooter from "@/components/Partials/DashboardFooter";

function DashboardLayout() {
  const {
    authenticated, 
} = useAdminContext();
const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    if (authenticated === true) {
      const timer = setTimeout(() => setIsLoading(false), 2700);
      return () => clearTimeout(timer);
    } else if (authenticated === false) {
      navigate('/login');
    }
}, [authenticated]);

if (isLoading) {
    return (
        <div className="h-screen w-full flex justify-center items-center">
            <TextFillLoading  />
        </div>
    );
}
  return (
   
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-gray-50 dark:bg-slate-900 min-h-screen w-full relative flex flex-col justify-between">
        <Nav />
        <Outlet />
        <DashboardFooter />
      </main>
      <Toaster />
    </SidebarProvider>
    </ThemeProvider>
  );
}

export default DashboardLayout;
