import { Card, CardBody } from '@material-tailwind/react';
import React, { useState } from 'react';
import Semua from './Semua';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Input, Button } from "antd";
import { FunnelIcon } from "@heroicons/react/24/outline";

const filterList = [
  "Semua",
  "Konfirmasi",
  "Live",
  "Habis",
  "Diarsipkan",
  "Ditolak",
  "Diblokir",
];

function DaftarProduk() {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [search, setSearch] = useState("");

  return (
    <div className="">
      <Card>

        {/* Page header (same style as Pesanan) */}
          <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Daftar Produk</h1>
            </div>
          </div>
        </div>

        <CardBody className="p-6">
          {/* Compact filter row (matches Pesanan style) */}
          <div className="mb-4">
            <div className="grid md:grid-cols-3 gap-3 items-center">
              <div>
                <Select
                  value={filterStatus}
                  className="w-full"
                  size="middle"
                  onChange={(value) => setFilterStatus(value)}
                  options={filterList.map((item) => ({ label: item, value: item }))}
                  suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <div>
                <Input
                  placeholder="Cari nama produk, SKU, atau kategori..."
                  className="!h-8 !rounded-md !border-gray-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                />
              </div>

              <div className="flex items-center justify-end">
                <Button
                  className="!h-8 !px-3 !rounded-md !bg-green-600 !border-green-600 !text-white !shadow-none !hover:!bg-green-600 flex items-center gap-2"
                  onClick={() => window.location.href = '/dashboard/produk/tambah-produk'}
                >
                  <PlusOutlined />Tambah
                </Button>
              </div>
            </div>
          </div>

          {/* LIST PRODUK */}
          <Semua 
            status={filterStatus === "Semua" ? "" : filterStatus}
            search={search}
          />

        </CardBody>
      </Card>
    </div>
  );
}

export default DaftarProduk;
