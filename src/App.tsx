import "./App.css";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import HomeView from "@/views/Home";
import TestView from "@/views/Test";
import RollCallView from "@/views/RollCall";
import ScoreView from "@/views/Score";
import TimerView from "@/views/Timer";
import CountdownView from "@/views/Countdown";
import RankingListView from "@/views/RankingList";
import SettingsView from "@/views/Settings";

export default function App() {
  return (
    <DatabaseProvider>
      <Router>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/test" element={<TestView />} />
            <Route path="/roll-call" element={<RollCallView />} />
            <Route path="/score" element={<ScoreView />} />
            <Route path="/timer" element={<TimerView />} />
            <Route path="/countdown" element={<CountdownView />} />
            <Route path="/ranking-list" element={<RankingListView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </DefaultLayout>
      </Router>
    </DatabaseProvider>
  );
}
