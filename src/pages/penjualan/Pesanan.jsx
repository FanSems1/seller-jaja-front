"use client";
import { Card, CardBody } from "@material-tailwind/react";
import React, { useState } from "react";
import { Select, DatePicker, Input } from "antd";
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Semua from "./Tabs/Semua";

// Provide a StatusPill component here so parent page controls status styling
function StatusPill({ status }) {
  const s = String(status || '').toLowerCase();
  // normalize common variants
  const isDibayar = s.includes('paid') || s.includes('dibayar');
  const isMenunggu = s.includes('menunggu');
  const isDiproses = s.includes('diproses') || s.includes('disiapkan');
  const isDikirim = s.includes('dikirim');
  const isSelesai = s.includes('selesai'); // Strict selesai
  const isDibatalkan = s.includes('batal') || s.includes('dibatalkan') || s.includes('refund') || s.includes('pengembalian');

  let base = 'bg-gray-100 text-gray-800 border-gray-200';
  let label = status || '';
  let dotClass = 'w-2 h-2 rounded-full bg-current/80';

  if (isDibayar) {
    base = 'bg-green-100 text-green-800 border-green-200';
    label = 'Menunggu Konfirmasi';
    dotClass = 'w-2 h-2 rounded-full bg-green-500';
  } else if (isMenunggu) {
    base = 'bg-orange-100 text-orange-900 border-orange-200';
    label = 'Menunggu Pembayaran';
    dotClass = 'w-2 h-2 rounded-full bg-orange-500';
  } else if (isDiproses) {
    base = 'bg-blue-100 text-blue-800 border-blue-200';
    label = 'Perlu Dikirim';
    dotClass = 'w-2 h-2 rounded-full bg-blue-500';
  } else if (isDikirim) {
    base = 'bg-purple-100 text-purple-800 border-purple-200';
    label = 'Dalam Pengiriman';
    dotClass = 'w-2 h-2 rounded-full bg-purple-500';
  } else if (isSelesai) {
    base = 'bg-gray-100 text-gray-600 border-gray-300';
    label = 'Selesai';
    dotClass = 'w-2 h-2 rounded-full bg-gray-400';
  } else if (isDibatalkan) {
    base = 'bg-red-100 text-red-900 border-red-300'; // Keep alert style
    label = 'Dibatalkan';
    dotClass = 'w-2 h-2 rounded-full bg-red-500';
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-semibold border ${base}`}>
      <span className={dotClass} />
      {label}
    </span>
  );
}

function Pesanan() {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [searchText, setSearchText] = useState("");

  const statusOptions = [
    { value: "", label: "Semua Status", color: "gray" },
    { value: "menunggu", label: "Menunggu Pembayaran", color: "orange" },
    { value: "paid", label: "Menunggu Konfirmasi", color: "green" },
    { value: "diproses", label: "Perlu Dikirim", color: "blue" },
    { value: "dikirim", label: "Dalam Pengiriman", color: "purple" },
    { value: "selesai", label: "Selesai", color: "gray" },
    { value: "dibatalkan", label: "Dibatalkan", color: "red" },
  ];

  return (
    <div className="mb-8">
      <Card>
        {/* Modern Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Daftar Pesanan
              </h1>
            </div>
          </div>
        </div>

        <CardBody className="p-6">
          {/* Modern Filter Section */}
          <div className="mb-6">
            <div className="grid md:grid-cols-3 gap-3">
              {/* Date Filter */}
              <div className="relative">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Filter Tanggal
                </label>
                <DatePicker
                  className="w-full !h-10 !rounded-lg !border-gray-300 hover:!border-blue-400"
                  placeholder="Pilih tanggal pesanan"
                  onChange={(date) => setDateFilter(date)}
                  format="DD/MM/YYYY"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <FunnelIcon className="w-3.5 h-3.5" />
                  Filter Status
                </label>
                <Select
                  className="w-full"
                  placeholder="Pilih status pesanan"
                  onChange={(value) => setStatusFilter(value)}
                  options={statusOptions}
                  allowClear
                  size="large"
                  suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                />
              </div>

              {/* Search */}
              <div className="relative">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <MagnifyingGlassIcon className="w-3.5 h-3.5" />
                  Pencarian
                </label>
                <Input
                  placeholder="Cari invoice atau nama produk..."
                  className="!h-10 !rounded-lg !border-gray-300 hover:!border-blue-400"
                  prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </div>
            </div>
          </div>

          {/* LIST TABLE */}
          <Semua
            status={statusFilter}
            date={dateFilter}
            search={searchText}
            StatusPill={StatusPill}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default Pesanan;
