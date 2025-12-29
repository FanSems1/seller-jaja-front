import React from 'react'
import Gambar1 from "../../../../assets/dompetku/penghasilandaripesanan.jpg"
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'
import { Button, Input, Tag } from 'antd';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

const daftarReportProduk = [
  {
      produk: 'Bola Testing',
      
      invoice: '#INV-202406047093',
      tanggal: '2024-06-04',
      tipe: 'Penghasilan dari Pesanan',
      status: 'Selesai',
      jumlah: '13.000',
      name: 'jaja tet'

  },
  {
      produk: 'Bola Testing',
      
      invoice: '#INV-202406047093',
      tanggal: '2024-06-04',
      tipe: 'Penghasilan dari Pesanan',
      status: 'Selesai',
      jumlah: '13.000',
      name: 'jaja tet'

  },
  {
      produk: 'Bola Testing',
      
      invoice: '#INV-202406047093',
      tanggal: '2024-06-04',
      tipe: 'Penghasilan dari Pesanan',
      status: 'Selesai',
      jumlah: '13.000',
      name: 'jaja tet'

  },
]

function PenghasilanDariPesanan() {
  // helper: parse string like '13.000' or '13000' to number
  const parseAmount = (val) => {
    if (val == null) return 0;
    try {
      // remove non-digit characters
      const digits = String(val).replace(/[^0-9-]/g, '');
      return Number(digits) || 0;
    } catch (e) {
      return 0;
    }
  };

  const formatNumber = (v) => {
    try {
      return Number(v).toLocaleString('id-ID');
    } catch (e) {
      return String(v);
    }
  };
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

              <div className='mb-5 overflow-auto'>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border px-4 py-2">No</th>
                    <th className="border px-4 py-2">Tanggal</th>
                    <th className="border px-4 py-2">Jenis Transaksi</th>
                    <th className="border px-4 py-2">Debet</th>
                    <th className="border px-4 py-2">Kredit</th>
                    <th className="border px-4 py-2">Saldo</th>
                    <th className="border px-4 py-2">Referensi</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // compute running balance
                    let running = 0;
                    return daftarReportProduk.map((produks, index) => {
                      const amount = parseAmount(produks.jumlah);
                      // For this dataset, assume 'tipe' indicates credit (penghasilan) and others may be debet
                      const isCredit = (produks.tipe || '').toLowerCase().includes('penghasilan') || (produks.jenis || '') === 'credit';
                      const debitVal = isCredit ? 0 : amount;
                      const creditVal = isCredit ? amount : 0;
                      running = running + creditVal - debitVal;

                      return (
                        <tr key={index} className="odd:bg-white even:bg-gray-100">
                          <td className="border px-4 py-4 text-center">{index + 1}</td>
                          <td className="border px-4 py-4 text-center">{produks.tanggal}</td>
                          <td className="border px-4 py-4">
                            <div className='flex items-center space-x-3'>
                              <img src={Gambar1} className='w-10 h-10 rounded-md' alt="" />
                              <div>
                                <div className='text-sm font-semibold text-gray-800'>{produks.tipe}</div>
                                <div className='text-xs text-gray-500'>{produks.name} • {produks.produk}</div>
                              </div>
                            </div>
                          </td>
                          <td className="border px-4 py-4 text-right text-sm text-red-600">{debitVal ? `-${formatNumber(debitVal)}` : ''}</td>
                          <td className="border px-4 py-4 text-right text-sm text-green-600">{creditVal ? `+${formatNumber(creditVal)}` : ''}</td>
                          <td className="border px-4 py-4 text-right text-sm font-medium">{formatNumber(running)}</td>
                          <td className="border px-4 py-4 text-center text-sm text-blue-600">{produks.invoice}</td>
                          <td className='border px-4 py-4 text-center text-sm'>{produks.status}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>


        </CardBody>
      </Card>
  </div>
  )
}

export default PenghasilanDariPesanan
