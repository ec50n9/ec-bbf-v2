import "./App.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./routes/router";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
