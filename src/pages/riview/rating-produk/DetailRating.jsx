import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'
import React from 'react'
import Gambar1 from '../../../assets/dashboard/BolaTesting.png'
import Gambar2 from '../../../assets/JajaAuto.png'
import { PencilSquareIcon, StarIcon } from '@heroicons/react/24/solid';
import { Button, Input } from 'antd';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

const daftarRating = [
    {
        produk: 'Bola Testing',
        harga:'2.000',
        kategori: 'Art Shop',
        rating: '5',
        jumlah_ulasan: '4',
        images: Gambar1,
        users: '@ZATATECH',
        komentar: 'Barang Sesuai Pesanan,Respon Penjual Cepat,Pengiriman Cepat'
    },
    {
        produk: 'Bola Testing',
        harga:'2.000',
        kategori: 'Art Shop',
        rating: '5',
        jumlah_ulasan: '4',
        images: Gambar1,
        users: '@ZATATECH',
        komentar: 'Barang Sesuai Pesanan,Respon Penjual Cepat,Pengiriman Cepat'
    },
    {
        produk: 'Bola Testing',
        harga:'2.000',
        kategori: 'Art Shop',
        rating: '3',
        jumlah_ulasan: '4',
        images: Gambar1,
        users: '@ZATATECH',
        komentar: 'Barang Sesuai Pesanan,Respon Penjual Cepat,Pengiriman Cepat'
    },
   
]

const RatingCell = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const renderStars = () => {
        let stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={i} className="w-6 h-6 text-yellow-500" />);
        }
        if (hasHalfStar) {
            stars.push(<StarIcon key="half" className="w-6 h-6 text-yellow-500" />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="w-6 h-6 text-gray-300" />);
        }
        return stars;
    };

    return (
        <td className="mt-2 flex">
            {renderStars()}
        </td>
    );
};

function DetailRating() {
  return (
    <div className="mt-12 mb-8 ">
      <Card>
          <CardHeader 
              variant="gradient" 
              className={`bg-gradient-to-b ${gradientColors} mb-8 p-6 text-center`}
          >
              <Typography className='text-white font-bold text-lg' variant="h6" color="white">
                  Detail Rating
              </Typography>
          </CardHeader>
          <CardBody>
          <div>
                        <div className='w-full '>
                            <div className='w-full flex justify-end '>
                                <div>
                                    Search : <Input placeholder='Search' className='h-10' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
            <div className='w-full flex space-x-2'>
                <div className='w-1/2'>
                    <div className='w-full flex space-x-6'>
                        <div className='w-1/2 bg-gray-300 rounded-md'>
                            <div className='p-2'>
                                <img src={Gambar1}  alt="" />
                            </div>
                        </div>
                        <div className='w-1/2'>
                            <div className='text-[#64b0c9] text-xl font-bold'>
                                Bola Testing
                            </div>
                            <div className='w-full flex'>
                                <div className='font-bold text-gray-500 text-3xl mt-2'>
                                    5.0
                                </div>
                                <div className='text-gray-500 flex justify-end items-end'>
                                    /5.0
                                </div>
                                <div className='pl-2 flex justify-end items-end'>
                                    <StarIcon className='w-5 h-5 text-yellow-500'/>
                                    <StarIcon className='w-5 h-5 text-yellow-500'/>
                                    <StarIcon className='w-5 h-5 text-yellow-500'/>
                                    <StarIcon className='w-5 h-5 text-yellow-500'/>
                                    <StarIcon className='w-5 h-5 text-yellow-500'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <div className='w-full'>
                       
                    {/* tabel */}
                        <div className='mb-5'>
                        <table className="w-full table-auto border-collapse overflow-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                <td colSpan={5} className='px-4 py-4'></td>
                                </tr>
                            </thead>
                            <tbody>
                                {daftarRating.map((ratings, index) => (
                                <tr key={index}>
                                    <td className="border-x px-4 py-2 flex justify-start items-start">{index + 1}</td>
                                    <td className="border-x px-4 py-2">
                                        <div className='w-full flex space-x-4'>
                                            <div className='flex justify-start items-start'>
                                                <img src={ratings.images} className='w-14 h-14' alt="" />
                                            </div>
                                            <div>
                                                <h1>User</h1>
                                                <div >
                                                    <RatingCell rating={ratings.rating} />
                                                </div>
                                                <div className='flex space-x-2'>
                                                    <div className='text-red-500 cursor-pointer'>
                                                        {ratings.users}
                                                    </div>
                                                    <div >
                                                        {ratings.komentar}
                                                    </div>
                                                </div>
                                                
                                                <div className='flex space-x-5 mt-4'>
                                                    <div className='flex justify-center items-center'>
                                                        <img src={Gambar2} alt="" className='h-4 w-12' />
                                                    </div>
                                                    <div className='text-lg'>
                                                        Balasan Anda
                                                        <p className='text-sm'>
                                                            <button className='bg-transparent border px-4 h-8 mt-1 rounded-md border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500'>
                                                                Tanggapi
                                                            </button>
                                                        </p>
                                                    </div>
                                                </div>
                                                </div>
                                            </div> 
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


          </CardBody>
        </Card>
    </div>
  )
}

export default DetailRating
