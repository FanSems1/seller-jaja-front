import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import React from 'react'
import MaskedNumber from '../penghasilan-toko/MaskedNumber';
import PenghasilanDariPesanan from '../saldo-toko/tab-saldo-toko/PenghasilanDariPesanan';
import PenarikanSaldo from '../saldo-toko/tab-saldo-toko/PenarikanSaldo';
import { Button, Tabs, Tag } from 'antd';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'Penghasilan Dari Pesanan',
      children: <PenghasilanDariPesanan />,
    },
    {
      key: '2',
      label: 'Penarikan Saldo',
      children: <PenarikanSaldo/>,
    },
   
   
  ];

function Saldo() {
  return (
      <div className=" mb-8 ">
       
       
             <Card>
               <div className='w-full flex pl-5 pt-5 pr-5 '>
                 <div className='w-1/2'>
                   <h1 className=" text-2xl font-bold text-start">
                     PENGHASILAN TOKO
                   </h1>
                   <p>Informasi Penghasilan</p>
                 </div>
       
                
               </div>
       
               <hr className="mt-5" />
       <CardBody>
        


            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-white border rounded-lg p-4 shadow-sm'>
                <div className='text-sm text-gray-500'>Saldo</div>
                <div className='mt-2 text-2xl font-semibold text-gray-900'>Rp 1.629.233</div>
                <div className='mt-3'>
                  <Button className='h-10 bg-indigo-600 text-white rounded-md'>Tarik Saldo</Button>
                </div>
              </div>

              <div className='bg-white border rounded-lg p-4 shadow-sm'>
                <div className='text-sm text-gray-500'>Penarikan Diproses</div>
                <div className='mt-2 text-2xl font-semibold text-gray-900'>Rp 11.000</div>
                <div className='text-sm text-gray-500 mt-1'>Dalam antrian pencairan</div>
              </div>

              <div className='bg-white border rounded-lg p-4 shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                  <div className='min-w-0'>
                    <div className='text-sm text-gray-500'>Rekening Bank Saya</div>
                    <div className='text-base font-medium text-gray-900 mt-1 truncate'>PT. BANK MANDIRI (PERSERO) TBK.</div>
                    <div className='text-sm text-gray-700 mt-1 flex items-center gap-3 flex-wrap'>
                      <MaskedNumber number="12341587" />
                      <span className='text-sm text-gray-500 whitespace-nowrap'>• FEBRIANSYAH ADI PUTR</span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2 ml-0 sm:ml-4 flex-wrap justify-end'>
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 whitespace-nowrap'>UTAMA</span>
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-600 text-white whitespace-nowrap'>Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>

           
       </CardBody>
      </Card>

       <Card className='mt-5'>
                <div className='w-full flex pl-5 pt-5 pr-5 '>
             <div className='w-1/2'>
               <h1 className=" text-2xl font-bold text-start">
                 TRANSAKSI TERAKHIR 
               </h1>
               
             </div>
   
            
           </div>
   
           <hr className="mt-5" />
                <CardBody>
                    <Tabs
                            defaultActiveKey="1"
                            items={items.map((item) => ({
                            ...item,
                            label: (
                                <span className="tab-label text-lg font-bold">
                                {item.label}
                                </span>
                            ),
                            }))}
                            onChange={onChange}
                            
                            tabBarStyle={{ marginBottom: '0' }}
                            renderTabBar={(props, DefaultTabBar) => (
                            <DefaultTabBar {...props} className="custom-tab-bar bg-[#f3f4f7] rounded-lg pt-3 pb-3 pl-4 "  />
                            )}
                        />
                </CardBody>
              </Card>
    </div>
  )
}

export default Saldo
