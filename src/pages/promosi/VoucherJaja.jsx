import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button, Typography, Chip } from "@material-tailwind/react";
import { Input, Table, Spin, Alert, Switch, Pagination, Select, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { PROMO_JAJA_ENDPOINTS } from '@/configs/api';
import Swal from 'sweetalert2';

const { RangePicker } = DatePicker;

export function VoucherJaja() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchVouchers = async (page = 1, search = '', status = statusFilter) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      let url = `${PROMO_JAJA_ENDPOINTS.LIST}?page=${page}&limit=${pagination.pageSize}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&aktif=${status}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch promo jaja');

      const result = await response.json();
      setVouchers(result.data || []);
      setPagination(prev => ({ ...prev, current: result.pagination?.page || 1, total: result.pagination?.total || 0 }));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVouchers(pagination.current); }, []);

  const handleSearch = (value) => { setSearchText(value); fetchVouchers(1, value); };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('auth_token');
      // reuse same toggle endpoint pattern if available; otherwise call detail->put
      const response = await fetch(PROMO_JAJA_ENDPOINTS.TOGGLE(id), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to toggle status');
      Swal.fire({ icon: 'success', title: 'Berhasil', text: `Voucher berhasil ${currentStatus === 'Aktif' ? 'dinonaktifkan' : 'diaktifkan'}`, timer: 1500, showConfirmButton: false });
      fetchVouchers(pagination.current, searchText, statusFilter);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const columns = [
    { title: 'Judul Promo', dataIndex: 'judul_promo', key: 'judul_promo', width: '20%', render: (t) => <span className="font-medium">{t}</span> },
    { title: 'Kode Promo', dataIndex: 'kode_promo', key: 'kode_promo', width: '15%', render: (text) => (
      <div className="flex flex-wrap gap-1">{text?.split(',').slice(0,2).map((c,i)=> <Chip key={i} value={c.trim()} size="sm" className="bg-blue-50 text-blue-600" />)}{text?.split(',').length>2 && <span className="text-xs text-gray-500">+{text.split(',').length-2}</span>}</div>
    )},
    { title: 'Tipe', dataIndex: 'tipe_voucher', key: 'tipe_voucher', width: '10%', render: (t) => <Chip value={t} size="sm" className="bg-purple-50 text-purple-600" /> },
    { title: 'Periode', key: 'periode', width: '15%', render: (_, r) => (<div className="text-sm"><div>{r.mulai}</div><div className="text-gray-500">s/d {r.berakhir}</div></div>) },
    { title: 'Diskon', key: 'diskon', width: '12%', render: (_, r) => {
        const hasPercent = r.persentase_diskon !== null && r.persentase_diskon !== undefined && String(r.persentase_diskon).trim() !== '';
        const hasNominal = r.nominal_diskon !== null && r.nominal_diskon !== undefined && String(r.nominal_diskon).trim() !== '';
        return (<div className="text-sm">{hasPercent? <div className="font-semibold text-orange-600">{Number(r.persentase_diskon).toLocaleString('id-ID')}%</div> : hasNominal? <div className="font-semibold text-orange-600">Rp {parseInt(r.nominal_diskon,10).toLocaleString('id-ID')}</div> : <div className="text-sm text-gray-500">-</div>} {r.min_belanja>0 && <div className="text-xs text-gray-500">Min. Rp {parseInt(r.min_belanja,10).toLocaleString('id-ID')}</div>}</div>);
    }},
    { title: 'Kuota', dataIndex: 'kuota', key: 'kuota', width: '8%', align: 'center', render: (t) => <span className="font-medium">{t}</span> },
    { title: 'Status', dataIndex: 'status_aktif', key: 'status_aktif', width: '10%', align: 'center', render: (text, record) => (
      <Switch checked={text === 'Aktif'} onChange={() => handleToggleStatus(record.id_promo, text)} checkedChildren="Aktif" unCheckedChildren="Nonaktif" style={{ backgroundColor: text === 'Aktif' ? '#1677ff' : '#ff4d4f' }} />
    )},
    { title: 'Aksi', key: 'action', width: '10%', align: 'center', render: (_, record) => (
      <Button size="sm" color="blue" variant="gradient" onClick={() => navigate(`/dashboard/promosi/edit-promo-jaja/${record.id_promo}`)} className="flex items-center gap-2"><EditOutlined /> Edit</Button>
    )},
  ];

  return (
    <div className="mb-8">
      <Card>
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold tracking-tight text-gray-900">Voucher Jaja</h1></div></div>
        </div>
        <CardBody className="p-6">
          <div className="mb-4">
            <div className="grid md:grid-cols-3 gap-3 items-center">
              <div className="flex gap-2">
                <Select className="w-full" placeholder="Status" size="middle" allowClear onChange={(v)=>{ setStatusFilter(v||'all'); fetchVouchers(1, searchText, v||'all'); }} suffixIcon={<FunnelIcon className="w-4 h-4 text-gray-400" />} options={[{ label: 'All', value: 'all' }, { label: 'Aktif', value: 'Aktif' }, { label: 'Tidak Aktif', value: 'Tidak Aktif' }]} />
              </div>

              <div>
                <RangePicker className="w-full !h-8 !rounded-lg !border-gray-300" format="DD/MM/YYYY" onChange={(dates)=>setDateRange(dates)} placeholder={[ 'Mulai','Berakhir' ]} />
              </div>

                <div className="flex items-center justify-end gap-3">
                <Input placeholder="Cari judul atau kode promo..." className="!h-8 !rounded-lg !border-gray-300 w-full md:w-72" prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />} onChange={(e)=> handleSearch(e.target.value)} allowClear />
                <Button color="green" variant="gradient" className="flex items-center gap-2 !h-8 !px-3" onClick={()=> navigate('/dashboard/promosi/tambah-promo-jaja')}><PlusOutlined /> Tambah</Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Spin size="large" /></div>
          ) : vouchers.length>0 ? (
            <>
              <div>
                <style>{`.compact-table-promosi .ant-table-tbody > tr > td { border-bottom: none !important; }`}</style>
                <Table className="compact-table-promosi" columns={columns} dataSource={vouchers} rowKey="id_promo" pagination={false} scroll={{ x: 1200 }} rowClassName={()=>'hover:bg-gray-50 cursor-default'} />
              </div>

              <div className="mt-6 flex justify-end">
                <Pagination current={pagination.current} total={pagination.total} pageSize={pagination.pageSize} onChange={(page, newSize)=>{ setPagination(prev=>({...prev, current: page, pageSize: newSize||prev.pageSize})); fetchVouchers(page, searchText, statusFilter); }} showSizeChanger={true} pageSizeOptions={["20","50","100"]} showTotal={(total)=>`Total ${total} promo`} />
              </div>
            </>
          ) : (
            <Alert message="Tidak ada voucher" description="Belum ada voucher yang dibuat." type="info" showIcon />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default VoucherJaja;
