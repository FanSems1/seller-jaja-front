import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Typography, Chip } from "@material-tailwind/react";
import { Input, Table, Spin, Alert, Switch, Pagination, Select, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { VOUCHER_ENDPOINTS } from '@/configs/api';
import Swal from 'sweetalert2';

const { RangePicker } = DatePicker;

export function VoucherToko() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [pageSize, setPageSize] = useState(10);

  // Fetch vouchers
  const fetchVouchers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      let url = `${VOUCHER_ENDPOINTS.LIST}?page=${page}&limit=${pagination.pageSize}`;
      if (search) url += `&search=${search}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch vouchers');

      const result = await response.json();
      setVouchers(result.data || []);
      setPagination({
        ...pagination,
        current: result.pagination?.page || 1,
        total: result.pagination?.total || 0,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers(pagination.current);
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    fetchVouchers(1, value);
  };

  // Handle toggle status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(VOUCHER_ENDPOINTS.TOGGLE(id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to toggle status');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Voucher berhasil ${currentStatus === 'Aktif' ? 'dinonaktifkan' : 'diaktifkan'}`,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchVouchers(pagination.current, searchText);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Judul Promo',
      dataIndex: 'judul_promo',
      key: 'judul_promo',
      width: '20%',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Kode Promo',
      dataIndex: 'kode_promo',
      key: 'kode_promo',
      width: '15%',
      render: (text) => (
        <div className="flex flex-wrap gap-1">
          {text?.split(',').slice(0, 2).map((code, idx) => (
            <Chip key={idx} value={code.trim()} size="sm" className="bg-blue-50 text-blue-600" />
          ))}
          {text?.split(',').length > 2 && (
            <span className="text-xs text-gray-500">+{text.split(',').length - 2}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'promo_category',
      key: 'promo_category',
      width: '10%',
      render: (text) => (
        <Chip
          value={text === 'unique' ? 'Unique' : 'Claim'}
          size="sm"
          className={text === 'unique' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}
        />
      ),
    },
    {
      title: 'Periode',
      key: 'periode',
      width: '15%',
      render: (_, record) => (
        <div className="text-sm">
          <div>{record.mulai}</div>
          <div className="text-gray-500">s/d {record.berakhir}</div>
        </div>
      ),
    },
    {
      title: 'Diskon',
      key: 'diskon',
      width: '12%',
      render: (_, record) => {
        const hasPercent = record.persentase_diskon !== null && record.persentase_diskon !== undefined && String(record.persentase_diskon).trim() !== '';
        const hasNominal = record.nominal_diskon !== null && record.nominal_diskon !== undefined && String(record.nominal_diskon).trim() !== '';

        return (
          <div className="text-sm">
            {hasPercent ? (
              <div className="font-semibold text-orange-600">
                {Number(record.persentase_diskon).toLocaleString('id-ID')}%
              </div>
            ) : hasNominal ? (
              <div className="font-semibold text-orange-600">
                Rp {parseInt(record.nominal_diskon, 10).toLocaleString('id-ID')}
              </div>
            ) : (
              <div className="text-sm text-gray-500">-</div>
            )}

            {record.min_belanja > 0 && (
              <div className="text-xs text-gray-500">
                Min. Rp {parseInt(record.min_belanja, 10).toLocaleString('id-ID')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Kuota',
      dataIndex: 'kuota_voucher',
      key: 'kuota_voucher',
      width: '8%',
      align: 'center',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status_aktif',
      key: 'status_aktif',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <Switch
          checked={text === 'Aktif'}
          onChange={() => handleToggleStatus(record.id_promo, text)}
          checkedChildren="Aktif"
          unCheckedChildren="Nonaktif"
          style={{
            backgroundColor: text === 'Aktif' ? '#1677ff' : '#ff4d4f',
          }}
        />
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Button
          size="sm"
          color="blue"
          variant="gradient"
          onClick={() => navigate(`/dashboard/promosi/edit-voucher/${record.id_promo}`)}
          className="flex items-center gap-2"
        >
          <EditOutlined /> Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <Card>

        {/* Page header (same style as Pesanan) */}
          <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Voucher Toko</h1>
            </div>
          </div>
        </div>

        <CardBody className="p-6">
          {/* Compact Filter Row (match Pesanan style) */}
          <div className="mb-4">
            <div className="grid md:grid-cols-3 gap-3 items-center">
              <div className="flex gap-2">
                <Select
                  className="w-full"
                  placeholder="Status"
                  size="middle"
                  allowClear
                  onChange={(value) => setStatusFilter(value || '')}
                  suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                  options={[
                    { label: "Aktif", value: "Aktif" },
                    { label: "Nonaktif", value: "Nonaktif" }
                  ]}
                />
                <Select
                  className="w-full"
                  placeholder="Kategori"
                  size="middle"
                  allowClear
                  onChange={(value) => setCategoryFilter(value || '')}
                  suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                  options={[
                    { label: "Unique", value: "unique" },
                    { label: "Claim", value: "claim" }
                  ]}
                />
              </div>

              <div>
                <RangePicker
                  className="w-full !h-8 !rounded-lg !border-gray-300"
                  format="DD/MM/YYYY"
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={['Mulai', 'Berakhir']}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Input
                  placeholder="Cari judul atau kode promo..."
                  className="!h-8 !rounded-lg !border-gray-300 w-full md:w-72"
                  prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
                <Button
                  color="green"
                  variant="gradient"
                  className="flex items-center gap-2 !h-8 !px-3"
                  onClick={() => navigate('/dashboard/promosi/tambah-voucher')}
                >
                  <PlusOutlined /> Tambah
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : vouchers.length > 0 ? (
            <>
              <div>
                <style>{`
                  .compact-table-promosi .ant-table-tbody > tr > td { border-bottom: none !important; }
                `}</style>
                <Table
                  className="compact-table-promosi"
                  columns={columns}
                  dataSource={vouchers}
                  rowKey="id_promo"
                  pagination={false}
                  scroll={{ x: 1200 }}
                  rowClassName={() => 'hover:bg-gray-50 cursor-default'}
                />
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-end">
                <Pagination
                  current={pagination.current}
                  total={pagination.total}
                  pageSize={pageSize}
                  onChange={(page, newSize) => {
                    setPageSize(newSize || pageSize);
                    setPagination(prev => ({ ...prev, current: page, pageSize: newSize || prev.pageSize }));
                    fetchVouchers(page, searchText);
                  }}
                  showSizeChanger={true}
                  pageSizeOptions={["10", "50", "100"]}
                  showTotal={(total) => `Total ${total} voucher`}
                />
              </div>
            </>
          ) : (
            <Alert
              message="Tidak ada voucher"
              description="Belum ada voucher yang dibuat. Klik tombol Tambah Voucher untuk membuat voucher baru."
              type="info"
              showIcon
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default VoucherToko;
