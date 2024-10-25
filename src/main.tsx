import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { usePluginStore } from "@/stores/plugin-store";

// 初始化插件
usePluginStore.getState().initPlugins();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
