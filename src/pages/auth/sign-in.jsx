import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ENDPOINTS } from "../../configs/api";
import Swal from 'sweetalert2';
import All from "../../assets/login/All.png"
import Logo from "../../assets/login/LogoJaja.png"
import Saller from "../../assets/login/shop.png"
import Forgot from "../../assets/dompetku/Forgot.png"


export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Login gagal. Periksa email atau password.");
      }
      const data = await res.json();

      // Cek apakah user adalah buyer dan belum punya toko
      if (data.user && data.user.role === 'buyer' && !data.user.toko) {
        setLoading(false);
        await Swal.fire({
          icon: 'warning',
          title: 'Akses Ditolak',
          html: `
    <div style="text-align: center;">
      <p style="margin-bottom: 15px;">Anda belum memiliki toko.</p>
      <p>Silahkan buka toko Anda terlebih dahulu di <strong>jaja.id</strong> untuk mengakses <strong>Seller Center</strong>.</p>
    </div>
  `,
          showCancelButton: true,
          confirmButtonText: 'Buka Toko di Jaja.id',
          cancelButtonText: 'Tutup',

          buttonsStyling: false,
          customClass: {
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            window.open('https://jaja.id', '_blank');
          }
        });

        return;
      }

      // Simpan token dengan timestamp untuk auto-expire 8 jam
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_token_time", JSON.stringify({ timestamp: new Date().getTime() }));
      }

      // Simpan data user
      if (data.user) {
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      // Redirect ke dashboard/home
      navigate("/dashboard/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="min-h-screen flex items-center justify-center bg-[#56b4e6] py-8">

      <div className="bg-white rounded-[2rem] mx-4 p-6 flex gap-6 max-w-6xl w-full items-center">
        <div className="w-1/2 hidden lg:block max-h-[70vh] overflow-hidden rounded-2xl">
          <img
            src={All}
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-6">
          <div className="text-center">
            <div className="flex justify-center items-center mb-10">
              <img src={Logo} alt="" className="w-40 h-20 object-contain" />
            </div>
            <div className=" text-[#6A6A6A] mb-4 text-xl">Welcome to</div>
            <div className="flex justify-center items-center space-x-6">
              <img src={Saller} alt="" className="w-10 h-8" /> <span>
                <i className="font-bold text-3xl">Seller</i> <i className="text-3xl ">Center</i>
              </span>
            </div>
          </div>

          <form className="mt-6 mb-2 mx-auto w-72 max-w-screen-lg lg:w-10/12" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
              <div className="relative mb-3">
                <input
                  type="text"
                  className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                  id="exampleFormControlInput2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="exampleFormControlInput2"
                  className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                >
                  Email
                </label>
              </div>
              <div className="relative mb-3">
                <input
                  type="password"
                  className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                  id="exampleFormControlInput2"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="exampleFormControlInput2"
                  className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                >
                  Password
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 text-center text-red-600 text-sm">{error}</div>
            )}
            <Button className="mt-6 bg-[#56b4e6] h-10" fullWidth type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </Button>




            <div className="flex justify-center items-center mt-6">
              <div className="text-center text-sm text-[#BEBEBE]">
                Copyright © 2024 All Right Reserved Jaja ID.
              </div>
            </div>
          </form>

        </div>
      </div>

    </section>
  );
}

export default SignIn;
