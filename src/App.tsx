import "./App.css";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import HomeView from "@/views/Home";
import TestView from "@/views/Test";

export default function App() {
  return (
    <DatabaseProvider>
      <Router>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/test" element={<TestView />} />
          </Routes>
        </DefaultLayout>
      </Router>
    </DatabaseProvider>
  );
}
