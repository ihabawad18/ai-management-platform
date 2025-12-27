import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { AgentsProvider } from "@/contexts/AgentsContext";
import { ConversationsProvider } from "@/contexts/ConversationsContext";

function App() {
  return (
    <AgentsProvider>
      <ConversationsProvider>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ConversationsProvider>
    </AgentsProvider>
  );
}

export default App;
