import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AgentConfigurations = lazy(() => import("@/pages/AgentConfigurations"));
const Chat = lazy(() => import("@/pages/Chat"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <div style={{ padding: 24 }}>
        <h2>Something went wrong.</h2>
        <p>Check the browser console for details.</p>
      </div>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      { path: "agents", element: <AgentConfigurations /> },
      { path: "chat", element: <Chat /> },
      { path: "*", element: <div>404 – Not Found</div> },
    ],
  },
]);
