import { ChatBubbleBottomCenterIcon, CursorArrowRippleIcon, NewspaperIcon, PrinterIcon } from '@heroicons/react/24/solid'
import { Button, Tag } from 'antd'
import React from 'react'

function OrderTable({orders }) {
  return (
    <div className="mb-4 w-full mt-4 overflow-x-scroll">
    {orders.map((order, index) => (
        <div key={index} className='mb-5'>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-start" colSpan={5}>
                            <div className='flex space-x-4'>
                                <div className='text-[#7db0c9] font-bold text-lg '>{order.invoice}</div>
                                <div className='text-[#798181] text-sm text-center flex items-center'>{order.date}</div>
                                <div className='flex items-center'>
                                    <Tag className='' color={order.color}>{order.status}</Tag>
                                    {order.statusPembatalan && (
                                        <Tag color='gray'>
                                            <p>{order.statusPembatalan}</p>
                                        </Tag>
                                    )}
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2"></th>
                        <th className="border px-4 py-2">Info Produk</th>
                        <th className="border px-4 py-2">Alamat</th>
                        <th className="border px-4 py-2">Kurir</th>
                        <th className="border px-4 py-2">Total Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.slice(0, 1).map((item, itemIndex) => (
                        <tr key={itemIndex}>
                            <td className="border px-4 py-2">
                                <img src={item.images} alt={item.productName} className='w-10 h-10'/>
                            </td>
                            <td className="border px-4 py-2">
                                <div className='text-[#7db0c9] font-bold text-base mb-1 w-[20rem]'>{item.productName}</div>
                                <div className='mb-1 text-base'>{item.quantity} x <span className='text-red-500 '>Rp {item.price}</span></div>
                                <div className='mb-1 text-base'><i className='text-[#798181]'>{item.notes}</i></div>
                            </td>
                            <td className="border px-4 py-2">
                                <div className='w-[25rem] text-base'>{item.address}</div>
                                {item.trackingNumber && (
                                    <div className='w-[25rem] text-base mt-4'>
                                        Nomor Resi :
                                        <p>{item.trackingNumber}</p>
                                    </div>
                                )}
                            </td>
                            <td className="border px-4 py-2 text-base">
                                <div>{item.courier}</div>
                                <div className='mb-4'>Rp {item.courierPrice}</div>
                                <div className='mb-2'>
                                    <Tag className="bg-gray-200 px-2 py-1 rounded">Belum Dicetak</Tag>
                                </div>
                            </td>
                            <td className="border px-4 py-2">
                                <div className='text-2xl font-semibold text-[#ffbe0b]'>Rp {item.totalPrice}</div>
                            </td>
                        </tr>
                    ))}
                    {order.items.length > 1 && (
                        <tr>
                            <td colSpan={5} className="border px-4 py-2 text-center">
                                <div className='text-[#7db0c9] font-bold text-base mb-1 w-[20rem] cursor-pointer'>
                                    Lihat {order.items.length - 1} produk lainnya
                                </div>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={5} className='border px-4 py-2'>
                            <div className='space-x-4'>
                                <Button className='h-10 border border-blue-800'>
                                    <NewspaperIcon className="w-4 h-4 text-blue-800" />
                                    Rincian Pesanan 
                                </Button>
                                {order.status === "Pesanan Selesai" && (
                                    <>
                                        <Button className='h-10 border border-[#0b0fff]'>
                                            <PrinterIcon className="w-4 h-4 text-[#0b0fff]" />
                                            Cetak Label
                                        </Button>
                                        <Button className='h-10 border border-[#b60bff] '>
                                            <CursorArrowRippleIcon className="w-4 h-4 text-[#b60bff]" />
                                            Lacak Pesanan 
                                        </Button>
                                    </>
                                )}
                                <Button className='h-10 border border-[#ffbe0b]'>
                                    <ChatBubbleBottomCenterIcon className="w-4 h-4 text-[#ffbe0b]" />
                                    Pesan
                                </Button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ))}
</div>
  )
}

export default OrderTable
