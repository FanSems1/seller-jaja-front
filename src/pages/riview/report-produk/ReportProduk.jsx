import React from 'react'
import Gambar1 from "../../../assets/dashboard/BolaTesting.png"
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'
import { Button, Input, Tag } from 'antd';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

function ReportProduk() {
    const daftarReportProduk = [
        {
            produk: 'Bola Testing',
            images: Gambar1,
            jumlah_report: '2',
            laporan: 'Barangnya Rusak ka, dari awal saya unboxing'
        },
    ]
  return (
     <div className=" mb-8 ">
   
   
         <Card>
           <div className='w-full flex pl-5 pt-5 pr-5 '>
             <div className='w-1/2'>
               <h1 className=" text-2xl font-bold text-start">
                 REPORT PRODUK
               </h1>
               
             </div>
   
            
           </div>
   
           <hr className="mt-5" />
          <CardBody>
          <div>
                <h1 className='text-2xl font-bold'>
                    Daftar Report Produk
                </h1>
                <br />
                <div className='w-full flex'>
                    <div className='w-1/6'>
                        <div className='flex'>
                            
                            <div className='text-5xl text-gray-600 flex justify-center items-end font-bold pl-6'>0</div>
                            <div className='text-lg text-gray-600 flex justify-center items-end pl-2'>
                                x dilaporkan 
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br />
            <hr />
            <br />

                <>
                    <div>
                        <div className='w-full '>
                            <div className='w-full flex justify-end '>
                                <div>
                                    Search : <Input placeholder='Search' className='h-10' />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                <br />

                <div className='mb-5'>
                <table className="w-full table-auto border-collapse overflow-auto">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border text-center w-20 ">No.</th>
                      <th className="border px-4 py-2">Produk</th>
                      <th className="border px-4 py-2">Jumlah Report</th>
                      <th className="border px-4 py-2 w-[20rem]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftarReportProduk.map((produks, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-100">
                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                        <td className="border px-4 py-2">
                            <div className='w-full flex space-x-4'>
                                <div className='flex justify-center items-center'>
                                    <img src={produks.images} className='w-14 h-14' alt="" />
                                </div>
                                <div className='flex justify-center items-center'>
                                    <p className='text-[#64b0c9] font-bold text-xl '>
                                        {produks.produk}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className="border px-4 py-2">
                            <div className='flex justify-center'>
                                <div>
                                Jumlah Produk : {produks.jumlah_report}
                                    <p>
                                            <Tag color='red'>
                                                {produks.laporan}
                                            </Tag>
                                    </p>
                                </div>
                            </div>
                        </td>
                       <td className='border px-4 py-2 text-center'>
                        <Button className='bg-blue-500 text-white'>
                            Detail
                        </Button>
                       </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


          </CardBody>
        </Card>
    </div>
  )
}

export default ReportProduk
