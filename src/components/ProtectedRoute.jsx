import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem('auth_token');
      const authUser = localStorage.getItem('auth_user');

      // Jika tidak ada token, redirect ke login
      if (!authToken) {
        setShouldRedirect(true);
        setIsChecking(false);
        return;
      }

      // Cek apakah token expired (8 jam)
      const tokenData = JSON.parse(localStorage.getItem('auth_token_time'));
      if (tokenData) {
        const currentTime = new Date().getTime();
        const tokenTime = tokenData.timestamp;
        const eightHours = 8 * 60 * 60 * 1000;

        if (currentTime - tokenTime > eightHours) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token_time');
          setShouldRedirect(true);
          setIsChecking(false);
          return;
        }
      }

      // Cek apakah user adalah buyer dan belum punya toko
      if (authUser) {
        try {
          const user = JSON.parse(authUser);
          if (user.role === 'buyer' && !user.toko) {
            // Clear auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token_time');

            // Show SweetAlert2 warning
            await Swal.fire({
              icon: 'warning',
              title: 'Akses Ditolak',
              html: `
                <div style="text-align: center;">
                  <p style="margin-bottom: 15px;">Anda belum memiliki toko.</p>
                  <p>Silahkan buka toko Anda terlebih dahulu di <strong>jaja.id</strong> untuk mengakses <strong>Seller Center</strong>.</p>
                </div>
              `,
              confirmButtonText: 'Buka Toko di Jaja.id',
              confirmButtonColor: '#56b4e6',
              showCancelButton: true,
              cancelButtonText: 'Kembali ke Login',
              cancelButtonColor: '#6c757d',
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                // Redirect ke jaja.id untuk buka toko
                window.open('https://jaja.id', '_blank');
              }
              navigate('/auth/sign-in', { replace: true });
            });

            return;
          }
        } catch (e) {
          console.error('Error parsing auth_user:', e);
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [navigate]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56b4e6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
