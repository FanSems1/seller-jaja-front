import { Button, DatePicker, Dropdown, Input, Menu, Modal, Select, Steps, Tag } from 'antd'
import React, { useState } from 'react'
import {
    PencilSquareIcon,
    TrashIcon,
    ChevronDownIcon,
    InboxArrowDownIcon,
  } from "@heroicons/react/24/solid";
import Gambar1 from '../../../assets/pesanan/produkTesting2.png'
import Gambar2 from '../../../assets/dashboard/MobilMini.png'
import { Card, CardBody } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const orders = [
    {
        invoice: "INV-202406047095",
        date: "2021-07-08 00:49:17",
        status: "Aktif",
        brand: 'MobileZen',
        kategori: 'Tidak ada',
        sub_kategori: 'Tidak ada',
        voucher: 'JUNICERIA',
        kode_voucher: 'JUNICERIA',
        kuota: '10',
        potongan: '20.000',
        min_belanja: '50.000',
        periode_awal: '06 Jun 2024',
        periode_akhir: '30 Jun 2024',
        images: Gambar1,
        target: 'Semua Produk'
    },
    {
        invoice: "INV-202406047095",
        date: "2021-07-08 00:49:17",
        status: "Tidak Aktif",
        brand: 'MobileZen',
        kategori: 'Tidak ada',
        sub_kategori: 'Tidak ada',
        voucher: 'JUNICERIA',
        kode_voucher: 'JUNICERIA',
        kuota: '10',
        potongan: '20.000',
        min_belanja: '50.000',
        periode_awal: '06 Jun 2024',
        periode_akhir: '30 Jun 2024',
        images: Gambar1,
        target: 'Semua Produk'
    },
    
    
];

function Semua({statusFilter }) {

    
  const [status, setStatus] = useState(statusFilter || "Semua");

  const filteredOrders =
    status === "Semua"
      ? orders
      : orders.filter(order => order.status === status);
   
    const navigate = useNavigate();
    const handleDetail = () => {
        navigate('/dashboard/promosi/DaftarPromosi/EditDetailPromosi');
      }
   

    const handleDelete = () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus saja!',
            cancelButtonText: 'Batalkan'
        }).then((result) => {
            if (result.isConfirmed) {
                // Hapus item di sini
                Swal.fire(
                    'Dihapus!',
                    'Item berhasil dihapus.',
                    'success'
                );
            }
        });
    };

    const menu = (
        <Menu className='w-56'>
          <Menu.Item key="4">
                <button onClick={handleDetail} >
                    <div className='flex justify-center items-center space-x-2'>
                        <PencilSquareIcon className="w-4 h-4"/> 
                        <div>
                            Edit
                        </div>
                    </div>
                </button>
          </Menu.Item>
          <Menu.Item key="5">
            <button> 
                    <div className='flex justify-center items-center space-x-2'>
                        <InboxArrowDownIcon className="w-4 h-4"/> 
                        <div>
                            Nonaktifkan  
                        </div>
                    </div>
                </button>
          </Menu.Item>
          <Menu.Item key="6">
                <button onClick={handleDelete}> 
                    <div className='flex justify-center items-center space-x-2'>
                        <TrashIcon className="w-4 h-4"/> 
                        <div>
                            Hapus 
                        </div>
                    </div>
                </button>
          </Menu.Item>
        </Menu>
      );

  return (
    <div>
       
        {/* 🔥 FILTER BARIS ATAS */}
      <div className='w-full flex space-x-5'>

        {/* KIRI = Jenis Potongan + Status */}
        <div className='w-1/2 flex items-end space-x-3'>

          {/* Select Jenis Potongan */}
          <Select
            showSearch
            className="w-1/2 h-10"
            placeholder="Jenis Potongan"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="Diskon">Diskon</Option>
            <Option value="Nominal">Nominal</Option>
          </Select>

          {/* 🔥 Select Status PINDAHAN */}
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            className="w-1/2 h-10"
          >
            <Option value="Semua">Semua</Option>
            <Option value="Aktif">Aktif</Option>
            <Option value="Tidak Aktif">Tidak Aktif</Option>
          </Select>

        </div>

        {/* KANAN = Search */}
        <div className='w-1/2'>
          <div className='w-full flex justify-end'>
            <div>
              Search : <Input placeholder='Search' className='h-10' />
            </div>
          </div>
        </div>

      </div>
        {/* Data */}
        <>
        <div className="mb-4 w-full mt-4 ">
            {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
                <div className=" mb-5">
                
                    <h1 className="text-2xl">Belum Ada Data</h1>
                
                </div>
            </div>
            ) : (
            <table className="w-full table-auto border-collapse overflow-auto">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-lg">No.</th>
                    <th className="border px-4 py-2 text-lg">Voucher</th>
                    <th className="border px-4 py-2 text-lg">Target</th>
                    <th className="border px-4 py-2 text-lg">Kuota</th>
                    <th className="border px-4 py-2 text-lg">Potongan</th>
                    <th className="border px-4 py-2 text-lg">Min Belanja</th>
                    <th className="border px-4 py-2 text-lg">Periode</th>
                    <th className="border px-4 py-2 text-lg">Status</th>
                    <th className="border px-4 py-2 text-lg">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.map((order, index) => (
                    <tr key={index}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className='border px-4 py-2'>
                        <div className='w-full flex space-x-8'>
                            <div>
                                <img src={order.images} className='w-8 h-8' alt="" />
                            </div>
                            <div>
                                {order.voucher}
                                <p>
                                    <Tag color='blue'>
                                        Kode : {order.kode_voucher}
                                    </Tag>
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className='border px-4 py-2 text-center'>{order.target}</td>
                    <td className='border px-4 py-2 text-center'>{order.kuota}</td>
                    <td className='border px-4 py-2 text-center'>{order.potongan}</td>
                    <td className='border px-4 py-2 text-center'>{order.min_belanja}</td>
                    <td className='border px-4 py-2 text-center'>
                        <div>
                            <div>
                                Awal : <span>{order.periode_awal}</span>
                            </div>
                            <div>
                                Akhir : <span>{order.periode_akhir}</span>
                            </div>
                        </div>
                    </td>
                    <td className='border px-4 py-2 text-center'>
                        <Tag color={order.status === 'Aktif' ? 'green' : 'red'}>
                            {order.status}
                        </Tag>
                    </td>
                    <td className='border px-4 py-2 text-center'>
                        <div>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Button className="text-center px-2 py-2 h-10 border border-[#6fcbf2] text-[#6fcbf2]">
                                    Atur <ChevronDownIcon className="w-4 h-4 text-[#6fcbf2] "/>
                                </Button>
                            </Dropdown>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        </>
    </div>
  )
}

export default Semua
