import {  Button, DatePicker, Input,  Modal,  Select,  Tag } from 'antd'
import React, { useState } from 'react'
import Gambar1 from '../../../../assets/dashboard/BolaTesting.png'
import { Card, CardBody } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const { Option } = Select;

const orders = [
  {
      nama_produk: 'Mobil Mini',
      status: "Aktif",
      sku: 'INVZNX',
      kategori: 'Art Shop',
      sub_kategori: 'Tidak ada',
      stok_tersedia: '100',
      harga: '10.000',
      images: Gambar1,
      periode: 'Belum ada diskon'
  },
  {
      nama_produk: 'Mobil Mini',
      status: "Tidak Aktif",
      sku: 'INVZNX',
      kategori: 'Art Shop',
      sub_kategori: 'Tidak ada',
      stok_tersedia: '100',
      harga: '10.000',
      images: Gambar1,
      periode: 'Belum ada diskon'
  },
 
  
  
];


function SemuaVoucher({status}) {
  const filteredOrders = status ? orders.filter(order => order.status === status) : orders;

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


    // Modal 
    const [isModalVisible, setIsModalVisible] = useState(false);

      const showModal = () => {
        setIsModalVisible(true);
      };

      const handleOk = () => {
        setIsModalVisible(false);
      };

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      // logika diskon ke rupiah dan sebaliknya 
      const [isDiscount, setIsDiscount] = useState(true);

      const handleClick = () => {
        setIsDiscount(!isDiscount);
      };

  return (
    <div>
    <br />
     <div className='w-full flex space-x-5'>
         <div className='w-1/2 flex justify-start items-end'>
             <div className='w-1/2'>
                 <Select
                 showSearch
                 className="w-full  h-10"
                 placeholder="Jenis Potongan"
                 filterOption={(input, option) =>
                     option.children.toLowerCase().includes(input.toLowerCase())
                 }
                     filterSort={(optionA, optionB) =>
                     optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                     }
                     >
                     <Option value="Diskon">Diskon</Option>
                     <Option value="Nominal">Nominal</Option>
                     
                 </Select>
             </div>
         </div>  
         <div className='w-1/2'>
                     <div className='w-full flex justify-end '>
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
             <tr className="bg-[#64b0d3] text-white">
                 <th className="border px-4 py-2 text-lg">No.</th>
                 <th className="border px-4 py-2 text-lg">Nama Produk</th>
                 <th className="border px-4 py-2 text-lg">Harga</th>
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
                         <div className='flex justify-center items-center'>
                             <img src={order.images} className='w-24 h-24' alt="" />
                         </div>
                         <div>
                            <div className='text-[#64b0d3] text-base cursor-pointer'>
                              {order.nama_produk}
                            </div>
                            <div className='mt-2'>
                              <Tag color='magenta'>
                                SKU : {order.sku}
                              </Tag>
                            </div>
                            <div className='mt-2'>
                              <Tag color='yellow'>
                                Kategori : {order.kategori}
                              </Tag>
                            </div>
                            <div className='mt-2'>
                              <Tag color='purple'>
                                Stok Tersedia : {order.stok_tersedia}
                              </Tag>
                            </div>
                         </div>
                     </div>
                 </td>
                 <td className='border px-4 py-2 text-center'>
                    Rp. {order.harga}
                 </td>
                 <td className='border px-4 py-2 text-center'>
                    {order.periode}
                 </td>
                 <td className='border px-4 py-2 text-center'>
                      <Tag color={order.status === "Aktif" ? 'green' : 'red'}>
                            {order.status}
                        </Tag>
                 </td>
                 <td className='border px-4 py-2 text-center'>
                      <div className='w-full flex space-x-2 justify-center items-center'>
                        <Button onClick={showModal} className='bg-blue-500 text-white h-10'>
                           Atur Diskon
                        </Button>
                        <button onClick={handleDelete} className='bg-transparent border-red-500 border text-red-500 hover:bg-red-500 hover:text-white h-10 px-4 rounded-md'>
                          <div className='flex space-x-3'>
                          <TrashIcon className='h-5 w-5'/> Hapus
                          </div>
                        </button>
                      </div>
                 </td>
                 </tr>
             ))}
             </tbody>
         </table>
         )}
     </div>
     </>
     {/* Modal */}
     <Modal
        centered
        width={1200}
        title={
          [
            <div className='text-2xl font-bold'>
              Atur Diskon
            </div>
          ]
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Simpan"
        footer={false}
        cancelText="Batal"
      >
          <>
           <div className='p-4'>
           <Card>
            <div className="mb-4 w-full mt-4 ">
               
                <table className="w-full table-auto border-collapse overflow-auto">
                    <thead>
                    <tr className="">
                        
                        <th className="border-t px-4 py-2 text-lg">Produk</th>
                        <th className="border-t px-4 py-2 text-lg">Harga Normal</th>
                        <th className="border-t px-4 py-2 text-lg">Harga Diskon</th>
                        <th className="border-t px-4 py-2 text-lg">
                          {isDiscount ? 'Potongan (Rp)' : 'Potongan (%)'}
                        </th>
                        <th className="border-t px-4 py-2 text-lg"></th>
                        
                    </tr>
                    </thead>
                    <tbody>
                    
                        <td className='border-t px-4 py-2'>
                            <div className='w-full flex space-x-8'>
                                <div className='flex justify-center items-center'>
                                    <img src={Gambar1} className='w-24 h-24' alt="" />
                                </div>
                                <div>
                                    <div className='text-[#64b0d3] text-base cursor-pointer'>
                                        Mobil Mini
                                    </div>
                                    <div className='mt-2'>
                                      <Tag className='bg-transparent border-none'>
                                        SKU : INVZNX
                                      </Tag>
                                    </div>
                                    <div className='mt-2'>
                                      <Tag className='bg-transparent border-none'>
                                        Kategori : Art Shop
                                      </Tag>
                                    </div>
                                    <div className='mt-2'>
                                      <Tag className='bg-transparent border-none'>
                                        Stok Tersedia : 100
                                      </Tag>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className='border-t px-4 py-2 text-center'>
                            Rp. 10.000
                        </td>
                        <td className='border-t px-4 py-2 text-center'>
                              Belum ada diskon
                        </td>
                        <td className='border-t px-4 py-2 text-center'>
                        <td className=' px-4 py-2 text-center'>
                          {isDiscount ? (
                            <Input addonAfter="Rp" className='w-[70%]' />
                          ) : (
                            <Input addonAfter="%" className='w-[70%]' />
                          )}
                        </td>
                        </td>
                        <td className='border-t px-4 py-2 text-center'>
                              <div className='w-full flex space-x-2 justify-center items-center'>
                                
                              <button onClick={handleClick} className='bg-transparent border-red-500 border text-red-500 hover:bg-red-500 hover:text-white h-10 px-4 rounded-md'>
                                <div className='flex space-x-3'>
                                  {isDiscount ? 'Ganti menjadi Potongan %' : 'Ganti menjadi Potongan Rp'}
                                </div>
                              </button>
                              </div>
                        </td>
                    </tbody>
                </table>
                
            </div>
            </Card>
           </div>

            <br />
            <h1 className='text-2xl font-bold'>
              Periode Diskon
            </h1>

           <div className='p-4'>
           <Card>
              <CardBody>
              <div className='w-full flex space-x-4'>
                  <div className='w-1/4'>
                      <label className='text-lg'>Mulai <span className='text-red-500'>*</span></label>
                      <DatePicker className='h-10 w-full mt-2'/>
                  </div>
                  <div className='w-1/4'>
                      <label className='text-lg'>Berakhir <span className='text-red-500'>*</span></label>
                      <DatePicker className='h-10 w-full mt-2'/>
                  </div>
                </div>
              </CardBody>
            </Card>
           </div>

            <br />
            <div className='flex w-full space-x-2 justify-end'>
              <Button onClick={handleCancel} className='text-lg bg-gray-500 h-12 text-gray-800'>
                Tutup
              </Button>
              <Button className='text-lg bg-blue-500 text-white h-12'>
                Simpan
              </Button>
            </div>
          </>
      </Modal>
 </div>
  )
}

export default SemuaVoucher
