import React from 'react'
import Gambar1 from "../../../assets/dashboard/BolaTesting.png"
import { Tag } from 'antd';

const orders = [
  {
      invoice : "INV-202406107217",
      total_produk: '1',
      status: 'Refund',
      jumlah_dana_dilepaskan: "16.500",
      images: Gambar1,
      customer: 'TASYA ID'
  },
  {
      invoice : "INV-202406107217",
      total_produk: '1',
      status: 'Pending',
      jumlah_dana_dilepaskan: "16.500",
      images: Gambar1,
       customer: 'TASYA ID'
  },
  {
      invoice : "INV-202406107217",
      total_produk: '1',
      status: 'Done',
      jumlah_dana_dilepaskan: "16.500",
      images: Gambar1,
       customer: 'TASYA ID'
  },
 
  
];

function TabPenghasilanToko({status}) {
  const filteredOrders = status ? orders.filter(order => order.status === status) : orders;
  return (
    <div className='p-4'>
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <h1 className="text-2xl">Belum Ada Data</h1>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img src={order.images} alt="produk" className="w-12 h-12 rounded-md object-cover" />
                <div>
                  <div className="text-lg font-semibold text-gray-800">{order.invoice}</div>
                  <div className="text-sm text-gray-500">{order.total_produk} Produk • {order.customer}</div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Jumlah Dana</div>
                  <div className="text-lg font-medium text-gray-800">Rp {order.jumlah_dana_dilepaskan}</div>
                </div>

                <div>
                  {/* use Antd Tag for accessibility; keep colors single-tone, no gradients */}
                  <Tag
                    color={
                      order.status === 'Done' ? 'green' :
                      order.status === 'Refund' ? 'red' :
                      order.status === 'Pending' ? 'gold' :
                      'default'
                    }
                    className="px-3 py-1 rounded-full text-sm"
                  >
                    {order.status}
                  </Tag>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TabPenghasilanToko
