import React from 'react'
import PenghasilanDariPesanan from './tab-saldo-toko/PenghasilanDariPesanan';
import PenarikanSaldo from './tab-saldo-toko/PenarikanSaldo';
import { Card, CardBody } from '@material-tailwind/react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Button, Tabs, Tag } from 'antd';
import MaskedNumber from '../penghasilan-toko/MaskedNumber';

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
  

function SaldoToko() {
  return (
    <div className='mt-10'>
      <Card>
        <div className='w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Saldo Toko</h1>
            <p className='text-sm text-gray-500'>Ringkasan saldo dan riwayat transaksi toko Anda</p>
          </div>

          <div className='mt-4 sm:mt-0 flex items-center space-x-3'>
            <div className='text-right'>
              <div className='text-sm text-gray-500'>Saldo tersedia</div>
              <div className='text-xl font-semibold text-gray-900'>Rp 1.629.233</div>
            </div>
            <Button className='h-10 bg-indigo-600 text-white rounded-md'>Tarik Saldo</Button>
          </div>
        </div>

        <CardBody>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-white border rounded-lg p-4 shadow-sm'>
              <div className='text-sm text-gray-500'>Pending</div>
              <div className='mt-2 text-2xl font-semibold text-gray-900'>Rp 1.204.693</div>
              <div className='text-sm text-gray-500 mt-1'>Total menunggu pencairan</div>
            </div>

            <div className='bg-white border rounded-lg p-4 shadow-sm'>
              <div className='text-sm text-gray-500'>Penarikan Diproses</div>
              <div className='mt-2 text-2xl font-semibold text-gray-900'>Rp 11.000</div>
              <div className='text-sm text-gray-500 mt-1'>Dalam antrian pencairan</div>
            </div>

            <div className='bg-white border rounded-lg p-4 shadow-sm'>
              <div className='text-sm text-gray-500'>Rekening Bank</div>
              <div className='mt-2 text-base font-medium text-gray-900'>PT. BANK MANDIRI (PERSERO) TBK.</div>
              <div className='text-sm text-gray-700 mt-1'>
                <MaskedNumber number="12341587" /> • FEBRIANSYAH ADI PUTRA
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className='mt-8'>
        <Card>
          <div className='w-full flex items-center justify-between p-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>Transaksi Terakhir</h2>
              <p className='text-sm text-gray-500'>Riwayat transaksi terbaru toko</p>
            </div>
            <div>
              <Button className='h-10 bg-white border text-gray-700'>Lihat semua</Button>
            </div>
          </div>

          <CardBody>
            <Tabs
              defaultActiveKey="1"
              items={items.map((item) => ({
                ...item,
                label: <span className="tab-label text-base font-semibold">{item.label}</span>,
              }))}
              onChange={onChange}
              tabBarStyle={{ marginBottom: 0 }}
              renderTabBar={(props, DefaultTabBar) => (
                <DefaultTabBar {...props} className="custom-tab-bar bg-gray-100 rounded-lg p-2" />
              )}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default SaldoToko
