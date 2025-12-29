import { Card, CardBody } from '@material-tailwind/react';
import React, { useState } from 'react';
import Semua from './Semua';
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
    <div className="mb-8">
      <Card>

        <CardBody className="p-6">
          {/* Compact filter row (no blue background) */}
          <div className="mb-6">
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-3">
                <label className="sr-only">Status</label>
                <Select
                  value={filterStatus}
                  className="w-full"
                  size="large"
                  onChange={(value) => setFilterStatus(value)}
                  options={filterList.map((item) => ({ label: item, value: item }))}
                  suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <div className="col-span-7">
                <label className="sr-only">Pencarian</label>
                <Input
                  placeholder="Cari nama produk, SKU, atau kategori..."
                  className="!h-9 !rounded-md !border-gray-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                />
              </div>

              <div className="col-span-2 flex justify-end">
                <Button
                  className="!h-9 !px-3 !rounded-md !bg-blue-600 !border-blue-600 !text-white !shadow-none !hover:!bg-blue-600"
                  onClick={() => window.location.href = '/dashboard/produk/tambah-produk'}
                >
                  Tambah
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
