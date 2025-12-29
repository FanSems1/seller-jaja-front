import React from 'react'
import Gambar1 from "../../../../assets/dompetku/saldo.png"
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'
import { Button, Input, Tag } from 'antd';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

const daftarReportProduk = [
  {
      
      tanggal: '2022-10-19',
      nomor_referensi : '7yJQVOBYYeChOxnswY',
      norek: '9999 1587',
      tipe: 'Penghasilan dari Pesanan',
      status: 'Menunggu',
      jumlah: '11.000',
      name: 'FEBRIANSYAH ADI PUTR',
      deskripsi : 'tes tarik saldo',
      biaya_admin : '0'


  },
  {
      
      tanggal: '2022-09-22',
      nomor_referensi : 'S93NQXLUotgNzFxCne',
      norek: '9999 1587',
      tipe: 'Penghasilan dari Pesanan',
      status: 'Berhasil',
      jumlah: '10.000',
      name: 'FEBRIANSYAH ADI PUTR',
      deskripsi : 'tes tarik saldo',
      biaya_admin : '0',
      tanggal_disetujui : '2022-09-22',


  },
 
]

function PenarikanSaldo() {
  return (
    <div className="mt-5 mb-8 ">
    <Card>
        
        <CardBody>
       

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
                    <th className="border text-center ">Tanggal</th>
                    <th className="border px-4 py-2">Tipe | Deskripsi</th>
                    <th className="border px-4 py-2">Jumlah</th>
                    <th className="border px-4 py-2 w-[20rem]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarReportProduk.map((produks, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-100">
                      <td className="border px-4 py-10 text-center">{produks.tanggal}</td>
                      <td className="border px-4 py-10">
                          <div className='w-full flex space-x-7 justify-center'>
                              <div className='flex justify-center items-center'>
                                  <img src={Gambar1} className='w-14 h-14 rounded-md' alt="" />
                              </div>
                              <div className=' '>
                                  <p className='text-[#6c757d] font-bold text-base '>
                                    Nomor Referensi : {produks.nomor_referensi}
                                  </p>
                                  <p className='text-[#64b0c9] font-bold text-lg cursor-pointer '>
                                      {produks.invoice}
                                  </p>
                                  <p className='text-[#6c757d] text-sm'>
                                    {produks.norek.length >= 4 ? `****${produks.norek.slice(4)}` : produks.norek} - {produks.name} | {produks.deskripsi}
                                  </p>
                              </div>
                          </div>
                      </td>
                      <td className="border px-4 py-10">
                          <div className='flex justify-center'>
                              <div className='text-red-500 text-lg'>
                                - Rp{produks.jumlah}
                                <p>
                                  - Rp{produks.biaya_admin} <span className='ml-1 text-[#6c757d]'>(Biaya Admin)</span>
                                </p>
                              </div>
                          </div>
                      </td>
                     <td className='border px-4 py-10 '>
                          <div>
                            <Tag color={produks.status === 'Berhasil' ? '#43d39e' : '#898989'} className='text-sm'>
                              {produks.status}
                            </Tag>
                            {produks.status === 'Berhasil' && (
                              <p className='text-[#6c757d] text-lg'>
                                Disetujui: <span className='text-[#6c757d] font-bold'>{produks.tanggal_disetujui}</span>
                              </p>
                            )}
                          </div>
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

export default PenarikanSaldo
