import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Typography, Chip } from "@material-tailwind/react";
import { Input, Table, Spin, Alert, Pagination, Modal, DatePicker, message } from 'antd';
import { SearchOutlined, ThunderboltOutlined, ClockCircleOutlined, UserOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import { API_BASE_URL, apiFetch } from '@/configs/api';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

export function ActivationCoupon() {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code_coupon: '',
    email: '',
    name: '',
    from: '',
    expired: null,
    token: '',
  });

  // Fetch coupons list
  const fetchCoupons = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const url = `${API_BASE_URL}/backend/master/activation-coupon?page=${page}&limit=10${search ? `&search=${search}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch coupons');

      const result = await response.json();
      
      if (result.status.code === 200) {
        setCoupons(result.data.data || []);
        setPagination({
          current: result.data.currentPage,
          pageSize: result.data.limit,
          total: result.data.totalData,
        });
      }
    } catch (error) {
      message.error(error.message || 'Gagal memuat data coupon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    fetchCoupons(1, value);
  };

  // Open activation modal
  const showActivationModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code_coupon: coupon.code_coupon,
      email: coupon.email,
      name: coupon.name,
      from: coupon.from,
      expired: coupon.expired ? dayjs(coupon.expired, 'DD MMM YYYY, HH:mm') : null,
      token: '',
    });
    setIsModalVisible(true);
  };

  // Handle activation
  const handleActivation = async () => {
    try {
      // Validation
      if (!formData.code_coupon || !formData.email || !formData.name || !formData.from || !formData.expired || !formData.token) {
        message.error('Mohon lengkapi semua field');
        return;
      }

      // Format expired date
      const expiredFormatted = formData.expired.format('YYYY-MM-DD HH:mm');

      const payload = {
        code_coupon: formData.code_coupon,
        email: formData.email,
        name: formData.name,
        from: formData.from,
        expired: expiredFormatted,
        token: parseInt(formData.token),
      };

      const result = await apiFetch(`${API_BASE_URL}/backend/master/activation-coupon`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (result.status?.code === 200 || result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Coupon berhasil diaktivasi',
          timer: 2000,
          showConfirmButton: false,
        });
        setIsModalVisible(false);
        fetchCoupons(pagination.current, searchText);
      } else {
        message.error(result.status?.message || result.message || 'Gagal mengaktivasi coupon');
      }
    } catch (error) {
      message.error(error.message || 'Gagal mengaktivasi coupon');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Kode Coupon',
      dataIndex: 'code_coupon',
      key: 'code_coupon',
      width: '15%',
      render: (text) => (
        <div className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
          {text}
        </div>
      ),
    },
    {
      title: 'Nama Coupon',
      dataIndex: ['detail', 'coupon_name'],
      key: 'coupon_name',
      width: '25%',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Penerima',
      key: 'recipient',
      width: '20%',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Dari',
      dataIndex: 'from',
      key: 'from',
      width: '10%',
      render: (text) => <Chip value={text} size="sm" className="bg-purple-50 text-purple-600" />,
    },
    {
      title: 'Nominal',
      dataIndex: ['detail', 'amount'],
      key: 'amount',
      width: '12%',
      render: (amount) => (
        <span className="font-semibold text-green-600">
          Rp {amount?.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      title: 'Expired',
      dataIndex: 'expired',
      key: 'expired',
      width: '13%',
      render: (text) => (
        <div className="text-xs">
          <ClockCircleOutlined className="mr-1" />
          {text}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Button
          size="sm"
          color="green"
          className="flex items-center gap-2 px-3 py-2"
          onClick={() => showActivationModal(record)}
        >
          <ThunderboltOutlined /> Activate
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-12 mb-8">
      <Card>
        <CardBody>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Activation Coupon
              </Typography>
              <Typography variant="small" color="gray" className="mt-1">
                Kelola dan aktivasi coupon untuk pelanggan
              </Typography>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Cari berdasarkan kode coupon, nama, atau email..."
              prefix={<SearchOutlined />}
              size="large"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : coupons.length > 0 ? (
            <>
              <Table
                columns={columns}
                dataSource={coupons}
                rowKey="id_activation"
                pagination={false}
                scroll={{ x: 1200 }}
                className="shadow-sm"
              />

              {/* Pagination */}
              <div className="mt-6 flex justify-end">
                <Pagination
                  current={pagination.current}
                  total={pagination.total}
                  pageSize={pagination.pageSize}
                  onChange={(page) => fetchCoupons(page, searchText)}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} coupon`}
                />
              </div>
            </>
          ) : (
            <Alert
              message="Tidak ada data coupon"
              description="Belum ada coupon yang perlu diaktivasi."
              type="info"
              showIcon
            />
          )}
        </CardBody>
      </Card>

      {/* Activation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold">
            <ThunderboltOutlined className="text-yellow-500" />
            <span>Aktivasi Coupon</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleActivation}
        onCancel={() => setIsModalVisible(false)}
        okText="Aktivasi"
        cancelText="Batal"
        width={600}
        okButtonProps={{
          className: 'bg-green-500 hover:bg-green-600',
        }}
      >
        <div className="py-4">
          {/* Coupon Info Card */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="mb-2">
              <span className="text-xs text-gray-600 font-medium">Nama Coupon:</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {selectedCoupon?.detail?.coupon_name}
              </p>
            </div>
            <div className="flex gap-4 mt-3">
              <div>
                <span className="text-xs text-gray-600">Nominal:</span>
                <p className="text-sm font-bold text-green-600">
                  Rp {selectedCoupon?.detail?.amount?.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-600">Kuantitas:</span>
                <p className="text-sm font-bold text-blue-600">
                  {selectedCoupon?.detail?.quantity}x
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Kode Coupon */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <KeyOutlined className="mr-2" />
                Kode Coupon <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                value={formData.code_coupon}
                onChange={(e) => setFormData({ ...formData, code_coupon: e.target.value })}
                placeholder="Masukkan kode coupon"
                className="font-mono"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <MailOutlined className="mr-2" />
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            {/* Nama & From */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  <UserOutlined className="mr-2" />
                  Nama <span className="text-red-500">*</span>
                </label>
                <Input
                  size="large"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama penerima"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Dari <span className="text-red-500">*</span>
                </label>
                <Input
                  size="large"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  placeholder="Nama pengirim"
                />
              </div>
            </div>

            {/* Expired DateTime */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <ClockCircleOutlined className="mr-2" />
                Tanggal & Waktu Expired <span className="text-red-500">*</span>
              </label>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                size="large"
                className="w-full"
                value={formData.expired}
                onChange={(date) => setFormData({ ...formData, expired: date })}
                placeholder="Pilih tanggal dan waktu"
              />
            </div>

            {/* Google Auth Token */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <KeyOutlined className="mr-2" />
                Token Google Authenticator <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                placeholder="Masukkan 6 digit token"
                maxLength={6}
                className="font-mono text-center text-xl tracking-widest"
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan 6 digit kode dari aplikasi Google Authenticator
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ActivationCoupon;
