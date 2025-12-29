import { Tabs } from 'antd';
import React from 'react'
import TabPenghasilanToko from './TabPenghasilanToko';
import { Card, CardBody } from '@material-tailwind/react';
import MaskedNumber from './MaskedNumber';

const onChange = (key) => {
  console.log('Tab:', key);
};

const items = [
  { key: '1', label: 'Semua', children: <TabPenghasilanToko /> },
  { key: '2', label: 'Pending', children: <TabPenghasilanToko status="Pending" /> },
  { key: '3', label: 'Done', children: <TabPenghasilanToko status="Done" /> },
  { key: '4', label: 'Refund', children: <TabPenghasilanToko status="Refund" /> },
];

function PenghasilanToko() {
  return (
    <div className="mb-8">
      <Card>
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Penghasilan Toko</h1>
            <p className="text-sm text-gray-500">Ringkasan pendapatan dan riwayat pencairan toko Anda</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-sm text-gray-500">Rekening Bank</div>
            <div className="mt-1">
              <MaskedNumber number="12341587" />
            </div>
          </div>
        </div>

        <hr />

        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">Rp 1.204.693</div>
              <div className="text-sm text-gray-500 mt-1">Total saldo menunggu pencairan</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-gray-500">Done (Bulan ini)</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">Rp 1.228.002</div>
              <div className="text-sm text-gray-500 mt-1">Saldo yang sudah dilepaskan ke rekening</div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-gray-500">Grand Total</div>
              <div className="mt-2 text-2xl font-semibold text-gray-800">Rp 3.891.125</div>
              <div className="text-sm text-gray-500 mt-1">Akumulasi pendapatan</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6">
        <Card>
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

export default PenghasilanToko
