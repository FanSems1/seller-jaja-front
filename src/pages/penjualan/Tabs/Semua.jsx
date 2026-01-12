import { Button, DatePicker, Input, Modal, Steps, Tag, Table, Pagination } from 'antd'
import React, { useState, useMemo, useEffect } from 'react'
import {
  FunnelIcon,
  NewspaperIcon,
  ChatBubbleBottomCenterIcon,
  CursorArrowRippleIcon,
  CheckIcon,
  PrinterIcon
} from "@heroicons/react/24/solid";
import Gambar1 from '../../../assets/pesanan/produkTesting2.png'
import Gambar2 from '../../../assets/dashboard/MobilMini.png'
import { useNavigate } from 'react-router-dom';
import { ORDER_ENDPOINTS, apiFetch } from '../../../configs/api';

const { Step } = Steps;

function Semua({ status, date, search, StatusPill }) {

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Konfirmasi Pesanan modal state
  const [isKonfirmasiModalVisible, setIsKonfirmasiModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [konfirmasiLoading, setKonfirmasiLoading] = useState(false);

  const handleDetail = (orderId) => navigate(`/dashboard/penjualan/pesanan/detail-pesanan/${orderId}`);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // Konfirmasi Pesanan handlers
  const showKonfirmasiModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsKonfirmasiModalVisible(true);
  };
  const handleKonfirmasiCancel = () => {
    setIsKonfirmasiModalVisible(false);
    setSelectedOrderId(null);
  };
  const handleKonfirmasiSubmit = async () => {
    setKonfirmasiLoading(true);
    try {
      // Call TERIMA API for the selected order
      const response = await apiFetch(ORDER_ENDPOINTS.TERIMA(selectedOrderId), { method: 'POST' });
      if (response && response.success) {
        Modal.success({
          title: 'Berhasil!',
          content: 'Pesanan berhasil dikonfirmasi.',
          okButtonProps: {
            className: '!bg-blue-600 !text-white !border-none'
          }
        });

        // Refresh orders list from API
        try {
          const listResp = await apiFetch(ORDER_ENDPOINTS.LIST);
          if (listResp && listResp.success && listResp.data) {
            const transformedOrders = listResp.data.map((order, index) => {
              const firstDetail = order.details?.[0] || {};
              return {
                key: order.id_data || index,
                invoice: order.invoice || "-",
                date: `${order.created_date} ${order.created_time}`,
                status: order.status_transaksi || "Unknown",
                item: {
                  images: firstDetail.foto_produk || Gambar1,
                  productName: firstDetail.nama_produk || "Produk tidak tersedia",
                  quantity: parseInt(firstDetail.qty) || 0,
                  price: parseInt(firstDetail.harga_aktif) || 0,
                  notes: order.details_count > 1 ? `+${order.details_count - 1} produk lainnya` : "Tidak Ada Catatan",
                  address: order.alamat_pengiriman || "-",
                  courier: order.pengiriman || "-",
                  courierPrice: 0,
                  totalPrice: order.total_tagihan || 0,
                  trackingNumber: order.resi || null,
                  printed: false
                }
              };
            });
            setOrders(transformedOrders);
            setPagination(listResp.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 });
          }
        } catch (err) {
          console.error('Failed to refresh orders after confirm:', err);
        }

        setIsKonfirmasiModalVisible(false);
      } else {
        throw new Error(response.message || 'Gagal mengkonfirmasi pesanan');
      }
    } catch (err) {
      Modal.error({
        title: 'Gagal!',
        content: err.message || 'Gagal mengkonfirmasi pesanan. Silakan coba lagi.',
        okButtonProps: {
          className: '!bg-blue-600 !text-white !border-none'
        }
      });
    } finally {
      setKonfirmasiLoading(false);
    }
  };

  // Fetch orders from API
  useEffect(() => {
    let abort = false;
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiFetch(ORDER_ENDPOINTS.LIST);
        console.log("API Response:", response);

        if (abort) return;

        if (response.success && response.data) {
          const transformedOrders = response.data.map((order, index) => {
            const firstDetail = order.details?.[0] || {};
            return {
              key: order.id_data || index,
              invoice: order.invoice || "-",
              date: `${order.created_date} ${order.created_time}`,
              status: order.status_transaksi || "Unknown",
              item: {
                images: firstDetail.foto_produk || Gambar1,
                productName: firstDetail.nama_produk || "Produk tidak tersedia",
                quantity: parseInt(firstDetail.qty) || 0,
                price: parseInt(firstDetail.harga_aktif) || 0,
                notes: order.details_count > 1 ? `+${order.details_count - 1} produk lainnya` : "Tidak Ada Catatan",
                address: order.alamat_pengiriman || "-",
                courier: order.pengiriman || "-",
                courierPrice: 0,
                totalPrice: order.total_tagihan || 0,
                trackingNumber: order.resi || null,
                printed: false
              }
            };
          });
          console.log("Transformed Orders:", transformedOrders);
          setOrders(transformedOrders);
          setPagination(response.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 });
        } else {
          console.log("Response not successful or no data");
          setError(response.message || "Gagal memuat data pesanan");
          setOrders([]);
        }
      } catch (err) {
        if (!abort) {
          setError(err.message || "Gagal memuat data pesanan");
          console.error("Error fetching orders:", err);
          setOrders([]);
        }
      } finally {
        if (!abort) {
          console.log("Setting loading to false");
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => { abort = true; };
  }, []);

  // ==============================
  //   FILTERING LOGIC
  // ==============================
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {

      // Filter status (case-insensitive)
      if (status && order.status?.toLowerCase() !== status.toLowerCase()) return false;

      // Filter tanggal (format sama YYYY-MM-DD)
      if (date) {
        const orderDate = order.date.split(" ")[0]; // ambil tanggal saja
        const selectedDate = date.format("YYYY-MM-DD");
        if (orderDate !== selectedDate) return false;
      }

      // Filter search invoice OR product
      if (search) {
        const s = search.toLowerCase();
        const invoiceMatch = order.invoice.toLowerCase().includes(s);
        const productMatch = order.item.productName.toLowerCase().includes(s);
        if (!invoiceMatch && !productMatch) return false;
      }

      return true;
    });
  }, [orders, status, date, search]);

  // Paginated data
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, pageSize]);

  // ==============================
  //   TABLE COLUMNS
  // ==============================
  const formatNumber = (value) => {
    try {
      return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
    } catch (e) {
      return String(value || 0);
    }
  };
  // Util: Modern status badge with distinct vibrant colors
  const statusPill = (status) => {
    const statusLower = status?.toLowerCase();
    // More prominent pill styles for clarity
    const map = {
      'menunggu pembayaran': 'bg-yellow-100 text-yellow-900 border-yellow-300 shadow-sm',
      'paid': 'bg-blue-500 text-white border-blue-600 shadow-md',
      'sudah dibayar': 'bg-blue-500 text-white border-blue-600 shadow-md',
      'selesai': 'bg-cyan-100 text-cyan-900 border-cyan-300 shadow-sm',
      'dibatalkan': 'bg-red-100 text-red-900 border-red-300 shadow-sm'
    };
    const base = map[statusLower] || 'bg-gray-100 text-gray-800 border-gray-200';

    const statusText = {
      'menunggu pembayaran': 'Menunggu Pembayaran',
      'paid': 'Sudah Dibayar',
      'sudah dibayar': 'Sudah Dibayar',
      'selesai': 'Sudah Dikirim',
      'dibatalkan': 'Kadaluwarsa'
    };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-semibold border ${base}`}>
        {/* small static dot for decoration */}
        <span className={`${statusLower === 'paid' || statusLower === 'sudah dibayar' ? 'w-2 h-2 rounded-full bg-white' : 'w-2 h-2 rounded-full bg-current/80'}`} />
        {statusText[statusLower] || status}
      </span>
    );
  };

  const columns = [
    {
      title: 'No',
      key: 'no',
      width: 40,
      render: (_, __, index) => <span className="text-[10px] text-gray-500">{(currentPage - 1) * pageSize + index + 1}</span>
    },
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
      width: 140,
      render: (text) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-[11px] font-medium leading-tight break-all">
          {text}
        </span>
      )
    },
    {
      title: 'Produk',
      key: 'produk',
      width: 260,
      render: (_, record) => (
        <div className="flex space-x-2 w-full">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-xs font-medium text-gray-800 leading-tight line-clamp-2 break-words">
              {record.item.productName}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (_, record) => (StatusPill ? <StatusPill status={record.status} /> : statusPill(record.status))
    },
    {
      title: 'Kurir',
      key: 'kurir',
      width: 140,
      render: (_, r) => (
        <div className="text-[10px]">
          <p className="text-gray-800 font-medium">{r.item.courier}</p>
        </div>
      )
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      render: (_, r) => (
        <p className="text-sm font-semibold text-gray-800">{formatNumber(r.item.totalPrice)}</p>
      )
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (value) => <span className="text-[10px] text-gray-600 whitespace-nowrap">{value}</span>
    },
    {
      title: 'Aksi',
      key: 'aksi',
      width: 180,
      render: (_, order) => {
        const statusLower = (order.status || '').toLowerCase();
        const isPaid = (s) => {
          if (!s) return false;
          const v = String(s).toLowerCase();
          // Strict check for PAID status (ID 3)
          // Must NOT show for 'diproses' (ID 5) or 'dikirim' etc.
          if (v === '3' || v === 'paid' || v.includes('menunggu konfirmasi')) return true;
          // Legacy strings
          if (v.includes('sudah dibayar') && !v.includes('dikirim') && !v.includes('selesai')) return true;
          return false;
        };
        const showCheck = isPaid(statusLower);

        return (
          <div className="flex items-center justify gap-2">
            <Button onClick={() => handleDetail(order.key)} size="small" type="default" className="!flex !items-center !gap-1 !text-gray-700 !px-2 !h-8 !text-[11px] hover:!border-gray-400">
              <NewspaperIcon className="w-3 h-3 text-gray-500" />
              <span className="hidden md:inline">Rincian</span>
            </Button>

            {showCheck && (
              <button
                onClick={() => showKonfirmasiModal(order.key)}
                title="Terbayar"
                className="inline-flex items-center justify-center bg-green-600 text-white rounded-full w-5 h-5 p-0"
              >
                <CheckIcon className="w-3 h-3" />
              </button>
            )}

            {statusLower === "selesai" && (
              <>
                <Button size="small" type="default" className="!flex !items-center !gap-1 !text-gray-700 !px-2 !h-8 !text-[11px] hover:!border-gray-400">
                  <PrinterIcon className="w-3 h-3 text-gray-500" />
                  <span className="hidden md:inline">Cetak Label</span>
                </Button>
                <Button onClick={showModal} size="small" type="default" className="!flex !items-center !gap-1 !text-gray-700 !px-2 !h-8 !text-[11px] hover:!border-gray-400">
                  <CursorArrowRippleIcon className="w-3 h-3 text-gray-500" />
                  <span className="hidden md:inline">Lacak</span>
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="mt-5">
      <style>{`
                .compact-table .ant-table-thead > tr > th {
                    padding: 6px 8px !important;
                    font-size: 10px !important;
                    font-weight: 600 !important;
                }
        .compact-table .ant-table-tbody > tr > td {
          padding: 10px 12px !important;
          border-bottom: none !important;
        }
                .compact-table .ant-table-cell {
                    line-height: 1.4 !important;
                }
                .compact-table .ant-table-tbody > tr:hover {
                    background-color: #f9fafb !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    transition: all 0.2s ease;
                }
                .compact-table .ant-table-thead > tr > th::before {
                    display: none !important;
                }
            `}</style>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-lg ring-1 ring-gray-200 overflow-hidden bg-white">
          <Table
          columns={columns}
          dataSource={paginatedOrders}
          loading={loading}
          pagination={false}
          size="small"
          scroll={{ x: 1100 }}
          sticky={{ offsetHeader: 0 }}
          className="modern-table text-[10px] compact-table"
          rowClassName={() => 'hover:bg-gray-50 cursor-default'}
          locale={{
            emptyText: loading ? "Memuat data..." : "Tidak ada data pesanan"
          }}
        />

        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <div className="p-3 border-t border-gray-200 flex justify-end">
            <Pagination
              current={currentPage}
              total={filteredOrders.length}
              pageSize={pageSize}
              onChange={(page, newPageSize) => {
                setCurrentPage(page);
                if (newPageSize && newPageSize !== pageSize) setPageSize(newPageSize);
              }}
              showSizeChanger={true}
              pageSizeOptions={["10", "50", "100"]}
              showTotal={(total) => `Total ${total} pesanan`}
              size="small"
            />
          </div>
        )}
      </div>

      {/* MODAL LACAK */}
      <Modal
        width={800}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={false}
        title={<div className="text-center text-xl font-bold">Lacak Pesanan</div>}
      >
        <Steps current={currentStep} progressDot>
          <Step title="Pesanan Dibuat" description="2024-06-04 14:48:14" />
          <Step title="Pesanan Dibayar" description="Pembayaran Berhasil" />
          <Step title="Pesanan Dikirim" description="Dalam perjalanan" />
          <Step title="Pesanan Diterima" description="Diterima oleh tetangga" />
        </Steps>

        <div className="mt-6">
          <Button className="bg-blue-700 text-white px-6 h-10">Track</Button>
        </div>
      </Modal>

      {/* MODAL KONFIRMASI PESANAN */}
      <Modal
        open={isKonfirmasiModalVisible}
        onCancel={handleKonfirmasiCancel}
        title={<div className="font-bold text-lg text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Konfirmasi Pesanan
        </div>}
        footer={[
          <Button
            key="cancel"
            onClick={handleKonfirmasiCancel}
            className="!bg-gray-100 !text-gray-700 !rounded-md !px-5 !py-2 !border-none !shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            Tidak
          </Button>,
          <Button
            key="submit"
            onClick={handleKonfirmasiSubmit}
            loading={konfirmasiLoading}
            className="!bg-blue-600 !text-white !rounded-md !px-5 !py-2 !border-none !shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            Ya, Konfirmasi
          </Button>
        ]}
        bodyStyle={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(30,64,175,0.08)', padding: 24 }}
        style={{ borderRadius: 18, overflow: 'hidden' }}
      >
        <div className="py-4">
          <p className="text-sm text-gray-700">
            Apakah Anda yakin ingin mengkonfirmasi pesanan ini?
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Pesanan akan diproses setelah dikonfirmasi.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Semua;
