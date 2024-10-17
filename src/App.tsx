import "./App.css";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

export default function App() {
  return (
    <DatabaseProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </DatabaseProvider>
  );
}
