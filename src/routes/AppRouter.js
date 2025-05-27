import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import MatchStudio from "../pages/MatchStudio";
import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        <Route path="/match-studio" element={<MatchStudio />} />
        <Route path="/match-studio/:matchId" element={<MatchStudio />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRouter;
