import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Settings, LayoutDashboard, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

type Page = "dashboard" | "agents" | "chat";

const Navbar = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  useEffect(() => {
    if (location.pathname.startsWith("/agents")) {
      setCurrentPage("agents");
    } else if (location.pathname.startsWith("/chat")) {
      setCurrentPage("chat");
    } else {
      setCurrentPage("dashboard");
    }
  }, [location.pathname]);

  return (
    <header className="border-b bg-blue-600 shadow-md">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Agent Management Platform
              </h1>
              <p className="text-blue-100 text-sm">
                Manage agents, monitor performance, and chat in one place.
              </p>
            </div>
          </div>
          <nav className="self-start lg:self-auto">
            <Tabs
              value={currentPage}
              onValueChange={(v) => setCurrentPage(v as Page)}
            >
              <TabsList className="bg-blue-700 border-2 border-blue-500 p-1">
                <TabsTrigger
                  value="dashboard"
                  asChild
                  className="gap-2 text-blue-100 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-4"
                >
                  <NavLink to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                </TabsTrigger>
                <TabsTrigger
                  value="agents"
                  asChild
                  className="gap-2 text-blue-100 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-4"
                >
                  <NavLink to="/agents" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configurations
                  </NavLink>
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  asChild
                  className="gap-2 text-blue-100 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-4"
                >
                  <NavLink to="/chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </NavLink>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

