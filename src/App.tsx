import "./App.css";
import { DatabaseProvider } from "@/providers/database-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

export default function App() {
  return (
    <DatabaseProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </DatabaseProvider>
  );
}
