import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "@/components/share/error-page";
import Root from "@/routes/root";
import HomeView from "@/routes/_tabs/home";
import RollCallView from "@/routes/_tabs/roll-call";
import ScoreView from "@/routes/_tabs/score";
import TimerView from "@/routes/_tabs/timer";
import CountdownView from "@/routes/_tabs/countdown";
import RankingListView from "@/routes/_tabs/ranking-list";
import SettingsView from "@/routes/_tabs/settings";
import TestView from "@/routes/test";
import LoginView from "@/routes/login";

export default createBrowserRouter([
  {
    path: "/test",
    element: <TestView />,
  },
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage className="h-screen" desc="找不到页面" />,
    children: [
      {
        path: "/",
        element: <HomeView />,
      },
      {
        path: "roll-call",
        element: <RollCallView />,
      },
      {
        path: "score",
        element: <ScoreView />,
      },
      {
        path: "timer",
        element: <TimerView />,
      },
      {
        path: "countdown",
        element: <CountdownView />,
      },
      {
        path: "ranking-list",
        element: <RankingListView />,
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginView />,
  },
]);
