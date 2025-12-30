import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import All from "../../assets/login/All.png"
import BG from "../../assets/register/Background.png"
import Logo from "../../assets/login/LogoJaja.png"
import Saller from "../../assets/login/shop.png"
import Forgot from "../../assets/dompetku/Forgot.png"
import Registers from "../../assets/register/Register.png"


function Register() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }}>

      <div className="  m-10 p-5 flex gap-4">
        <div className="w-[70%] h-full hidden lg:block ">
          <div className='text-[#65B0C9] font-semibold text-3xl flex justify-center pt-[12rem] '>
            Buka Toko Jaja.id-mu Sekarang!
          </div>
          <br />
          <div className="flex justify-center items-center">
            <img
              src={Registers}
              className="h-full w-[80%] object-cover rounded-3xl flex justify-center items-center"
            />
          </div>
        </div>
        <div className="w-[30%] bg-white shadow-2xl lg:w-3/5 ">
          <div className="text-start  p-10">
            <div className=" text-[#6A6A6A] mb-4 text-lg">Hallo, <span className="text-[#65B0C9]">
              Tasya ID!</span> Ayo mulai buka tokomu!</div>

            <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-full">
              <div className="mb-1 flex flex-col gap-6">
                <div className="relative mb-3">
                  <input
                    type="text"
                    className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                    id="exampleFormControlInput2"
                    placeholder="Nama Toko Anda"
                  />
                  <label
                    htmlFor="exampleFormControlInput2"
                    className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                  >
                    Nama Toko Anda
                  </label>
                </div>


                <div className="w-full flex space-x-5">
                  <div className="w-1/2">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                        id="exampleFormControlInput2"
                        placeholder="Masukkan Provinsi Anda"
                      />
                      <label
                        htmlFor="exampleFormControlInput2"
                        className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                      >
                        Provinsi
                      </label>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                        id="exampleFormControlInput2"
                        placeholder="Masukkan Kota/Kabupaten Anda"
                      />
                      <label
                        htmlFor="exampleFormControlInput2"
                        className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                      >
                        Kota/Kabupaten
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full flex space-x-5">
                  <div className="w-1/2">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                        id="exampleFormControlInput2"
                        placeholder="Masukkan Kecamatan Anda"
                      />
                      <label
                        htmlFor="exampleFormControlInput2"
                        className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                      >
                        Kecamatan
                      </label>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                        id="exampleFormControlInput2"
                        placeholder="Masukkan Kelurahan Anda"
                      />
                      <label
                        htmlFor="exampleFormControlInput2"
                        className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                      >
                        Kelurahan
                      </label>
                    </div>
                  </div>
                </div>

                <div className="relative mb-3">
                  <input
                    type="number"
                    className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                    id="exampleFormControlInput2"
                    placeholder="Kode Pos"
                  />
                  <label
                    htmlFor="exampleFormControlInput2"
                    className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                  >
                    Kode Pos
                  </label>
                </div>

                <div className="relative mb-3">
                  <input
                    type="text"
                    className="peer block w-full h-[8rem] min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                    id="exampleFormControlInput2"
                    placeholder="Alamat"
                  />
                  <label
                    htmlFor="exampleFormControlInput2"
                    className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-2px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                  >
                    Alamat
                  </label>
                </div>

                <div className="relative mb-3">
                  <input
                    type="number"
                    className="peer block w-full min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                    id="exampleFormControlInput2"
                    placeholder="Greeting Message"
                  />
                  <label
                    htmlFor="exampleFormControlInput2"
                    className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-3px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                  >
                    Greeting Message
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    className="peer block w-full h-[8rem] min-h-[auto] rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 peer-focus:text-primary placeholder-opacity-0 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary border border-[#56b4e6]"
                    id="exampleFormControlInput2"
                    placeholder="Deskripsi Toko"
                  />
                  <label
                    htmlFor="exampleFormControlInput2"
                    className="text-lg font-semibold bg-white pointer-events-none absolute left-3 top-[-2px] mb-0 max-w-[90%] truncate origin-[0_0] pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary dark:text-neutral-400 dark:peer-focus:text-primary -translate-y-[1.15rem] scale-[0.8]"
                  >
                    Deskripsi Toko
                  </label>
                </div>

                <div className="flex justify-start items-center">
                  <Checkbox />
                  <div>
                    <span>Saya setuju dengan
                      <span className="text-[#fcb439] ml-1">
                        syarat dan ketentuan
                      </span>
                      <span className="ml-1">
                        serta
                      </span>
                      <span className="text-[#fcb439] ml-1">
                        kebijakan privasi
                      </span>
                      <span className="ml-1">
                        jaja.id
                      </span>
                    </span>
                  </div>
                </div>



              </div>

              <Button className="mt-6 bg-[#56b4e6] h-12" fullWidth >
                Login
              </Button>
            </form>
          </div>


        </div>
      </div>

    </section>
  )
}

export default Register
