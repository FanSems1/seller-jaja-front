import { Card, CardBody } from '@material-tailwind/react';
import { Button, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import Semua from './daftar-brand/Semua';
import { PlusIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const { Option } = Select;

function DaftarBrand() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  // state filter dropdown
  const [filterStatus, setFilterStatus] = useState("Semua");

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);


  const handleAddBrand = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="mb-8">

      <Card>
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Daftar Brand Toko</h1>
            <p className="text-sm text-gray-600">Brand akan ditampilkan dalam pilihan setelah disetujui</p>
          </div>
        </div>

        <CardBody className="p-6">
          
          {/* Modern Filter Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-3">
              
              {/* Status Filter */}
              <div className="relative">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <FunnelIcon className="w-3.5 h-3.5" />
                  Filter Status Brand
                </label>
                <Select 
                  size="large" 
                  className="w-full" 
                  value={filterStatus} 
                  onChange={setFilterStatus}
                  suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                  options={[
                    { label: "Semua", value: "Semua" },
                    { label: "Menunggu", value: "Menunggu" },
                    { label: "Disetujui", value: "Disetujui" }
                  ]}
                />
              </div>

              {/* Search */}
              <div className="relative">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <MagnifyingGlassIcon className="w-3.5 h-3.5" />
                  Pencarian Brand
                </label>
                <Input
                  placeholder="Cari nama brand atau kategori..."
                  className="!h-10 !rounded-lg !border-gray-300 hover:!border-blue-400"
                  prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                />
              </div>

            </div>
          </div>

          {/* === CONTENT BERDASARKAN FILTER === */}
          <div className="rounded-lg ring-1 ring-gray-200 overflow-hidden bg-white">
            <div className="p-0">
              {filterStatus === "Semua" && <Semua search={search} />}
              {filterStatus === "Menunggu" && <Semua status="Menunggu" search={search} />}
              {filterStatus === "Disetujui" && <Semua status="Disetujui" search={search} />}
            </div>
          </div>
        </CardBody>
      </Card>


      {/* === MODAL === */}
      <Modal
        centered
        width={800}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={false}
        title={<div className='text-xl font-semibold tracking-tight'>Usulkan Brand</div>}
      >
        <div className='w-full flex mt-6'>
          <div className='w-1/3 text-lg'>
            <label className='text-base'>Kategori</label>
          </div>
          <div className='w-full'>
            <Select showSearch className="w-full h-9" placeholder="Pilih kategori">
              <Option value="kategori1">Kategori 1</Option>
              <Option value="kategori2">Kategori 2</Option>
              <Option value="kategori3">Kategori 3</Option>
            </Select>
            <p className='text-xs text-gray-600'>Kosongkan jika kategori tidak ditemukan</p>
          </div>
        </div>

        <div className='w-full flex mt-4'>
          <div className='w-1/3 text-lg'>
            <label className='text-base'>Nama Brand <span className='text-red-500'>*</span></label>
          </div>
          <div className='w-full'>
            <Input placeholder='Masukkan Nama Brand' className='h-9' />
            <p className='text-xs text-gray-600'>Brand akan ditampilkan setelah disetujui</p>
          </div>
        </div>
        <div className='w-full flex space-x-2 justify-end mt-6'>
          <Button onClick={handleCancel} className='!h-9 !px-4 !rounded-md !bg-gray-200 !text-gray-800 hover:!bg-gray-300'>Batal</Button>
          <Button className='!h-9 !px-4 !rounded-md !bg-gray-900 !text-white hover:!bg-black/80'>Tambah</Button>
        </div>

      </Modal>

    </div>
  );
}

export default DaftarBrand;
