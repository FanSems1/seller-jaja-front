import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import DetailPesanan from './pages/penjualan/DetailPesanan';
import EditProduk from './pages/produk/daftar-produk/EditProduk';
import DetailProduk from './pages/produk/DetailProduk';
import DetailVoucher from './pages/promosi/DetailVoucher';
import TambahVoucher from './pages/promosi/TambahVoucher';
import DetailRating from './pages/riview/rating-produk/DetailRating';
import SaldoToko from './pages/dompetku/saldo-toko/SaldoToko';
import PrintInvoice from './pages/penjualan/PrintInvoice';
import { SignIn, SignUp } from './pages/auth';
import ForgotPassword from './pages/auth/forgot-password';
import Register from './pages/auth/Register';
import Validasi_Register from './pages/auth/Validasi_Register';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }>
  <Route path='pejualan/pesanan/detail-pesanan/:id' element={<DetailPesanan/>}/>
  <Route path='produk/detail/:id' element={<DetailProduk />} />
  <Route path='produk/daftar-produk/edit-produk/:id' element={<EditProduk/>}/>
        <Route path='promosi/DaftarPromosi/EditDetailPromosi' element={<DetailVoucher/>}/>
        <Route path='promosi/daftarr-promosi/tambah-promosi' element={<TambahVoucher/>}/>
        <Route path='review/rating-produk/DetailRating' element={<DetailRating/>}/>
        <Route path='dompetku/saldo-toko' element={<SaldoToko />} />
      </Route>
      <Route path="/auth/*" element={<Auth />} />
  {/* Direct print route: accessible in a new tab */}
  <Route path="/pejualan/print-invoice/:id" element={<PrintInvoice />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/validasi-register" element={<Validasi_Register />} />
      <Route path="/auth/forgort-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
