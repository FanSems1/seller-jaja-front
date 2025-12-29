import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('auth_token');
  
  // Cek apakah token expired (8 jam)
  if (authToken) {
    const tokenData = JSON.parse(localStorage.getItem('auth_token_time'));
    if (tokenData) {
      const currentTime = new Date().getTime();
      const tokenTime = tokenData.timestamp;
      const eightHours = 8 * 60 * 60 * 1000; // 8 jam dalam milidetik
      
      // Jika sudah lebih dari 8 jam, hapus token dan redirect ke login
      if (currentTime - tokenTime > eightHours) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token_time');
        return <Navigate to="/auth/sign-in" replace />;
      }
    }
  }
  
  // Jika tidak ada token, redirect ke login
  if (!authToken) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  // Jika ada token dan belum expired, tampilkan halaman
  return children;
};

export default ProtectedRoute;
