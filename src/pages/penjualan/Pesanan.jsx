"use client";
import { Card, CardBody } from "@material-tailwind/react";
import React, { useState } from "react";
import { Select, DatePicker, Input } from "antd";
import { ORDER_ENDPOINTS, apiFetch } from "../../configs/api";
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Semua from "./Tabs/Semua";

// Provide a StatusPill component here so parent page controls status styling
function StatusPill({ status }) {
  // status may be a string (name) or an object { name_status, slug_status, color }
  const st = (status && typeof status === 'object') ? status : { name_status: status };
  const name = (st.name_status || st.name || st.slug_status || '').toString();
  const slug = (st.slug_status || '').toString().toLowerCase();
  const colorKey = (st.color || '').toString().toLowerCase();

  // Map API color keys to tailwind classes
  const colorMap = {
    warning: { base: 'bg-yellow-100 text-yellow-900 border-yellow-200', dot: 'bg-yellow-500' },
    info: { base: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
    primary: { base: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
    success: { base: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-green-500' },
    danger: { base: 'bg-red-100 text-red-900 border-red-300', dot: 'bg-red-500' }
  };

  // Default neutral
  let base = 'bg-gray-100 text-gray-800 border-gray-200';
  let dotClass = 'w-2 h-2 rounded-full bg-current/80';

  if (colorKey && colorMap[colorKey]) {
    base = colorMap[colorKey].base;
    dotClass = `w-2 h-2 rounded-full ${colorMap[colorKey].dot}`;
  } else {
    // Fallback by slug/name matching
    const s = name.toLowerCase();
    if (s.includes('paid') || s.includes('dibayar')) {
      base = colorMap.success.base;
      dotClass = `w-2 h-2 rounded-full ${colorMap.success.dot}`;
    } else if (s.includes('menunggu')) {
      base = colorMap.warning.base;
      dotClass = `w-2 h-2 rounded-full ${colorMap.warning.dot}`;
    } else if (s.includes('disiapkan') || s.includes('diproses')) {
      base = colorMap.primary.base;
      dotClass = `w-2 h-2 rounded-full ${colorMap.primary.dot}`;
    } else if (s.includes('dikirim')) {
      // use purple for shipped to stand out
      base = 'bg-purple-100 text-purple-800 border-purple-200';
      dotClass = 'w-2 h-2 rounded-full bg-purple-500';
    } else if (s.includes('selesai')) {
      base = 'bg-gray-100 text-gray-600 border-gray-300';
      dotClass = 'w-2 h-2 rounded-full bg-gray-400';
    } else if (s.includes('batal') || s.includes('dibatalkan') || s.includes('refund') || s.includes('pengembalian')) {
      base = colorMap.danger.base;
      dotClass = `w-2 h-2 rounded-full ${colorMap.danger.dot}`;
    }
  }

  // Friendly label: prefer localized name if provided
  const label = st.name_status || name || '';

  return (
    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-[11px] font-semibold border ${base}`}>
      <span className={dotClass} />
      {label}
    </span>
  );
}

function Pesanan() {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusOptions, setStatusOptions] = useState([
    { value: "", label: "Semua Status", color: "gray" },
  ]);


  // Fetch statuses from API (LIST may include `statuses` alongside `data`).
  React.useEffect(() => {
    let abort = false;
    const loadStatuses = async () => {
      try {
        const resp = await apiFetch(ORDER_ENDPOINTS.LIST);
        if (abort) return;

        // Support multiple response shapes: { success, data: [...] } or { statuses: [...], data: [...] }
        const maybeStatuses = resp.statuses || (resp.data && resp.data.statuses) || resp.data?.statuses;

        if (Array.isArray(maybeStatuses) && maybeStatuses.length > 0) {
          const opts = [
            { value: "", label: "Semua Status", color: "gray" },
            ...maybeStatuses.map(s => ({ value: s.name_status || s.slug_status || String(s.id_status), label: s.name_status || s.slug_status, color: s.color || 'gray' }))
          ];
          setStatusOptions(opts);
        } else {
          // If API doesn't return statuses in this call, keep default 'Semua Status' only.
          setStatusOptions([{ value: "", label: "Semua Status", color: "gray" }]);
        }
      } catch (err) {
        // swallow - keep default options
        setStatusOptions([{ value: "", label: "Semua Status", color: "gray" }]);
        console.warn('Failed to load order statuses:', err.message || err);
      }
    };

    loadStatuses();
    return () => { abort = true; };
  }, []);

  return (
    <div className="">
      <Card>
        {/* Modern Header */}
          <div className="px-6 pt-4">
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
          <div className="mb-3">
            <div className="grid md:grid-cols-3 gap-3 items-center">
              {/* Date Filter (compact, no label) */}
              <div className="relative">
                <DatePicker.RangePicker
                  className="w-full !h-8 !rounded-lg !border-gray-300"
                  placeholder={["Dari", "Sampai"]}
                  onChange={(dates) => setDateFilter(dates)}
                  format="YYYY-MM-DD"
                />
              </div>

              {/* Status Filter (compact, no label) */}
              <div className="relative">
                <Select
                  className="w-full"
                  placeholder="Status"
                  onChange={(value) => setStatusFilter(value)}
                  options={statusOptions}
                  allowClear
                  size="middle"
                  suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                />
              </div>

              {/* Search (compact, no label) */}
              <div className="relative">
                <Input
                  placeholder="Cari invoice atau produk..."
                  className="!h-8 !rounded-lg !border-gray-300"
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
            statusOptions={statusOptions}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default Pesanan;
