import React from 'react'
import BG from "../../assets/register/Background.png"
import Atas from "../../assets/register/AtasKanan.png"
import Bawah from "../../assets/register/AtasKanan.png"
import Register from "../../assets/register/Register.png"
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'



function Validasi_Register() {
    const navigate = useNavigate();
          
    const handleRegister = () => {
      navigate('/auth/register');
    }

  return (
    <section className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }}>
      <div className='relative'>
        <div className='text-[#65B0C9] font-semibold text-xl flex justify-center '>
            Buka Toko Jaja.id-mu Sekarang!      
        </div>
        <br />
        <div>
            <img src={Register} alt="" className='w-[535px]'/>
        </div>
        <br />
        <br />
        <div className='flex justify-center items-center'>
            <Button onClick={handleRegister} className='h-12 text-lg text-white bg-[#65B0C9] w-[70%]'>
                Buka Toko Sekarang
            </Button>
        </div>
      </div>
    </section>
  )
}

export default Validasi_Register
