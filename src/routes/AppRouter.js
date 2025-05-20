import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </MainLayout>
  );
};

export default AppRouter;
