// src/layout/Auth.jsx
import React from "react";
import { Outlet } from "react-router-dom";

export function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
}

export default Auth;
