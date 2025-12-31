import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@material-tailwind/react';
import { Button, Tag, Spin, Modal } from 'antd';
import {
  PrinterIcon,
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  TruckIcon,
  CreditCardIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/solid';
import LogoJaja from '../../assets/LogoJaja.png';
import Gambar1 from "../../assets/pesanan/produkTesting2.png";
import { ORDER_ENDPOINTS, apiFetch } from '../../configs/api';

function DetailPesanan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Resi modal ste
  const [resiModalOpen, setResiModalOpen] = useState(false);
  const [formResi, setFormResi] = useState({ ekspedisi: 'JNE', resi: '', tanggal: new Date().toISOString().split('T')[0], catatan: '' });
  const ekspedisiOptions = [
    { label: 'JNE', value: 'JNE' },
    { label: 'J&T', value: 'J&T' },
    { label: 'SiCepat', value: 'SiCepat' },
    { label: 'AnterAja', value: 'AnterAja' },
    { label: 'ID Express', value: 'ID Express' },
    { label: 'Ninja Xpress', value: 'Ninja Xpress' },
    { label: 'Pos Indonesia', value: 'Pos Indonesia' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];

  useEffect(() => {
    if (!id) return;

    let abort = false;
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiFetch(ORDER_ENDPOINTS.DETAIL(id));
        console.log("Detail Order Response:", response);

        if (abort) return;

        if (response.success && response.data) {
          setOrderData(response.data);
        } else {
          setError(response.message || "Gagal memuat detail pesanan");
        }
      } catch (err) {
        if (!abort) {
          setError(err.message || "Gagal memuat detail pesanan");
          console.error("Error fetching order detail:", err);
        }
      } finally {
        if (!abort) {
          console.log("Detail loading set to false");
          setLoading(false);
        }
      }
    };
    fetchOrderDetail();
    return () => { abort = true; };
  }, [id]);

  // Open the dedicated PrintInvoice route in a new tab instead of building a blob HTML here.
  // This ensures the printed view is consistent with the `PrintInvoice.jsx` component.
  const handlePrint = () => {
    // open the print route in a new tab; route expects an :id param
    const printUrl = `/pejualan/print-invoice/${id}`;
    window.open(printUrl, '_blank');
  };

  const handleResiInput = () => setResiModalOpen(true);
  const handleResiCancel = () => {
    setResiModalOpen(false);
    setFormResi({ ekspedisi: 'JNE', resi: '', tanggal: new Date().toISOString().split('T')[0], catatan: '' });
  };
  const handleResiChange = (e) => {
    const { name, value } = e.target;
    setFormResi(prev => ({ ...prev, [name]: value }));
  };
  const handleEkspedisiChange = (e) => {
    setFormResi(prev => ({ ...prev, ekspedisi: e }));
  };
  const handleResiSubmit = async () => {
    if (!formResi.ekspedisi || !formResi.resi) {
      showAlert({ type: 'warning', title: 'Peringatan!', message: 'Harap isi ekspedisi dan nomor resi.' });
      return;
    }

    try {
      setKirimLoading(true);
      const response = await apiFetch(ORDER_ENDPOINTS.KIRIM(id), {
        method: 'POST',
        body: JSON.stringify({
          expedisi: formResi.ekspedisi,
          no_resi: formResi.resi
        })
      });

      if (response.success) {
        setKirimLoading(false);
        showAlert({ type: 'success', title: 'Berhasil!', message: 'Resi berhasil diinput. Pesanan akan dikirim.' });
        setResiModalOpen(false);
        setFormResi({ ekspedisi: 'JNE', resi: '', tanggal: new Date().toISOString().split('T')[0], catatan: '' });
        // refresh data
        setTimeout(() => window.location.reload(), 800);
      } else {
        setKirimLoading(false);
        showAlert({ type: 'error', title: 'Gagal', message: response.message || 'Gagal mengirim pesanan' });
      }
    } catch (err) {
      setKirimLoading(false);
      showAlert({ type: 'error', title: 'Gagal!', message: err.message || 'Gagal input resi. Silakan coba lagi.' });
    }
  };

  // Konfirmasi Pesanan modal state
  const [isKonfirmasiModalVisible, setIsKonfirmasiModalVisible] = useState(false);
  const [konfirmasiLoading, setKonfirmasiLoading] = useState(false);

  // Tolak Pesanan modal state
  const [isTolakModalVisible, setIsTolakModalVisible] = useState(false);
  const [tolakLoading, setTolakLoading] = useState(false);
  const [alasanTolak, setAlasanTolak] = useState('');

  // Kirim (input resi) loading
  const [kirimLoading, setKirimLoading] = useState(false);

  // Tailwind-styled alert modal state
  const [alert, setAlert] = useState({ open: false, type: 'success', title: '', message: '' });

  const showAlert = ({ type = 'success', title = '', message = '', autoClose = true }) => {
    setAlert({ open: true, type, title, message });
    if (autoClose) {
      setTimeout(() => setAlert(prev => ({ ...prev, open: false })), 3000);
    }
  };

  const closeAlert = () => setAlert(prev => ({ ...prev, open: false }));

  const statusConfig = {
    // Use one solid bright blue for all statuses (no hover/animation)
    // bg: solid blue, border: slightly darker blue, text: white
    'menunggu pembayaran': { color: 'info', text: 'Menunggu Pembayaran', bg: 'bg-orange-500', border: 'border-orange-600', textColor: 'text-white' },
    'belum dibayar': { color: 'info', text: 'Belum Dibayar', bg: 'bg-gray-500', border: 'border-gray-600', textColor: 'text-white' },
    'paid': { color: 'info', text: 'Menunggu Konfirmasi', bg: 'bg-green-500', border: 'border-green-600', textColor: 'text-white' },
    'diproses': { color: 'info', text: 'Sedang Disiapkan', bg: 'bg-blue-500', border: 'border-blue-600', textColor: 'text-white' },
    'dikirim': { color: 'info', text: 'Dalam Pengiriman', bg: 'bg-purple-500', border: 'border-purple-600', textColor: 'text-white' },
    'selesai': { color: 'info', text: 'Selesai', bg: 'bg-gray-600', border: 'border-gray-700', textColor: 'text-white' },
    'dibatalkan': { color: 'info', text: 'Dibatalkan', bg: 'bg-red-500', border: 'border-red-600', textColor: 'text-white' },
    'pengembalian dana': { color: 'info', text: 'Pengembalian Dana', bg: 'bg-red-500', border: 'border-red-600', textColor: 'text-white' }
  };

  // Prefer item-level / order-level "status_pesanan" when present, otherwise fallback to status_transaksi
  const rawStatusCandidate = (orderData?.status_pesanan || orderData?.status_transaksi || '') || '';
  const rawStatus = String(rawStatusCandidate).toLowerCase().trim();

  // Normalize common status variants to keys used in statusConfig
  const normalizeStatusKey = (s, order) => {
    // 0. Check explicit current_status ID from backend response
    if (order?.current_status?.id_status) {
      const id = order.current_status.id_status;
      if (id === 1) return 'menunggu pembayaran';
      if (id === 3) return 'paid';
      if (id === 5) return 'diproses';
      if (id === 7) return 'dikirim';
      if (id === 9) return 'selesai';
      if (id === 19 || id === 21) return 'dibatalkan';
    }

    if (!s) return 'belum dibayar';
    const str = String(s).toLowerCase().trim();

    // 1. Check Exact Numeric IDs (Priority) - Fallback if current_status not available
    if (str === '1') return 'menunggu pembayaran';
    if (str === '3') return 'paid';
    if (str === '5') return 'diproses';
    if (str === '7') return 'dikirim';
    if (str === '9') return 'selesai';
    if (str === '19' || str === '21') return 'dibatalkan';

    // 2. String matching
    if (str.includes('selesai')) return 'selesai';
    if (str.includes('dikirim')) return 'dikirim';
    if (str.includes('disiapkan') || str.includes('diproses')) return 'diproses';
    if (str.includes('dibatalkan') || str.includes('batal') || str.includes('refund') || str.includes('pengembalian')) return 'dibatalkan';

    // ID 3: PAID / Menunggu Konfirmasi (Seller side)
    if (str === 'paid' || str.includes('telah dibayar') || str.includes('menunggu konfirmasi') || str.includes('sudah dibayar')) return 'paid';

    // ID 1: BOOKED / Menunggu Pembayaran
    if (str.includes('menunggu')) return 'menunggu pembayaran';

    // fallback
    return 'belum dibayar';
  };

  const normalizedKey = normalizeStatusKey(rawStatus, orderData);
  const status = statusConfig[normalizedKey] || statusConfig['belum dibayar'];

  // Konfirmasi Pesanan handlers (Terima)
  const showKonfirmasiModal = () => {
    setIsKonfirmasiModalVisible(true);
  };
  const handleKonfirmasiCancel = () => {
    setIsKonfirmasiModalVisible(false);
  };
  const handleKonfirmasiSubmit = async () => {
    setKonfirmasiLoading(true);
    try {
      const response = await apiFetch(ORDER_ENDPOINTS.TERIMA(id), {
        method: 'POST'
      });

      if (response.success) {
        setKonfirmasiLoading(false);
        showAlert({ type: 'success', title: 'Berhasil!', message: 'Pesanan berhasil diterima.' });
        setIsKonfirmasiModalVisible(false);
        setTimeout(() => window.location.reload(), 800);
      } else {
        throw new Error(response.message || 'Gagal menerima pesanan');
      }
    } catch (err) {
      setKonfirmasiLoading(false);
      showAlert({ type: 'error', title: 'Gagal!', message: err.message || 'Gagal menerima pesanan. Silakan coba lagi.' });
    }
  };

  // Handle Tolak (dengan modal input alasan)
  const showTolakModal = () => {
    setIsTolakModalVisible(true);
  };
  const handleTolakCancel = () => {
    setIsTolakModalVisible(false);
    setAlasanTolak('');
  };
  const handleTolakSubmit = async () => {
    if (!alasanTolak.trim()) {
      Modal.warning({
        title: 'Peringatan!',
        content: 'Harap isi alasan penolakan.',
      });
      return;
    }

    setTolakLoading(true);
    try {
      const response = await apiFetch(ORDER_ENDPOINTS.TOLAK(id), {
        method: 'POST',
        body: JSON.stringify({
          alasan: alasanTolak
        })
      });

      if (response.success) {
        setTolakLoading(false);
        showAlert({ type: 'success', title: 'Berhasil!', message: 'Pesanan berhasil ditolak. Status akan diubah menjadi Pengembalian Dana.' });
        setIsTolakModalVisible(false);
        setAlasanTolak('');
        setTimeout(() => window.location.reload(), 800);
      } else {
        setTolakLoading(false);
        throw new Error(response.message || 'Gagal menolak pesanan');
      }
    } catch (err) {
      setTolakLoading(false);
      showAlert({ type: 'error', title: 'Gagal!', message: err.message || 'Gagal menolak pesanan. Silakan coba lagi.' });
    }
  };

  // Determine which buttons should be enabled based on status
  const getButtonStates = (order) => {
    const states = {
      terima: false,
      tolak: false,
      kirim: false,
      selesai: false
    };

    // Use normalized key which now prioritizes ID
    const statusCandidate = (order?.status_pesanan || order?.status_transaksi || '') || '';
    const statusLower = String(statusCandidate).toLowerCase().trim();
    const key = normalizeStatusKey(statusLower, order);

    // Strict Stage Check by ID/Key
    if (key === 'paid') {
      // Stage 1: Paid (ID 3) -> Seller can Accept/Reject
      states.terima = true;
      states.tolak = true;
      states.kirim = false;
      states.selesai = false;
    } else if (key === 'diproses') {
      // Stage 2: Processed (ID 5) -> Seller can Ship
      states.kirim = true;
      states.terima = false;
      states.tolak = false;
      states.selesai = false;
    } else if (key === 'dikirim') {
      // Stage 3: Shipped (ID 7) -> Waiting for Buyer
      states.selesai = false;
      states.kirim = false;
      states.terima = false;
      states.tolak = false;
    } else {
      // All other states (Selesai, Dibatalkan, Menunggu Pembayaran) -> Disable All
      states.terima = false;
      states.tolak = false;
      states.kirim = false;
      states.selesai = false;
    }

    return states;
  };

  const buttonStates = orderData ? getButtonStates(orderData) : {};

  // Determine if the order (or any item) has been shipped.
  const hasDetailDikirim = Array.isArray(orderData?.details) && orderData.details.some(d => ((d.status_pesanan || '').toLowerCase().includes('dikirim')));
  const hasHistoryDikirim = Array.isArray(orderData?.history) && orderData.history.some(h => (String(h.status || '').toLowerCase().includes('dikirim')));
  const isDikirim = normalizedKey === 'dikirim' || normalizedKey === 'selesai' || hasDetailDikirim || hasHistoryDikirim;

  // Final disabled state
  const kirimDisabled = isDikirim || !buttonStates.kirim;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!orderData) return null;

  const totalProduct = orderData.details?.reduce((sum, item) => sum + (item.harga_aktif * item.qty), 0) || 0;
  const shipping = orderData.biaya_ongkir || orderData.total_ongkir || 0;
  const discountVoucher = orderData.diskon_voucher || 0;
  const discountVoucherToko = orderData.diskon_voucher_toko || 0;
  const totalDiscount = (parseFloat(discountVoucher) + parseFloat(discountVoucherToko)) || 0;
  const ppnPercentage = orderData.ppn_persentase || 0;
  const ppnNominal = orderData.ppn_nominal || 0;
  const biayaAsuransi = orderData.biaya_asuransi || 0;
  const penggunaanKoin = orderData.penggunaan_koin || 0;
  const biayaLayanan = orderData.biaya_layanan || 0;
  const grandTotal = orderData.total_pembayaran || orderData.total_tagihan || 0;

  return (
    <div className="mb-8">
      {/* Header Actions */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          icon={<ArrowLeftIcon className="w-4 h-4" />}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          Kembali
        </Button>

        {/* Action Buttons - Sejajar dengan Print di Kanan */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={showKonfirmasiModal}
            disabled={!buttonStates.terima}
            className={`flex items-center gap-2 ${buttonStates.terima ? '!bg-blue-500 !text-white hover:!bg-blue-600' : '!bg-gray-300 !text-gray-500 cursor-not-allowed'}`}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            }
          >
            Terima
          </Button>

          <Button
            onClick={showTolakModal}
            disabled={!buttonStates.tolak}
            className={`flex items-center gap-2 ${buttonStates.tolak ? '!bg-blue-500 !text-white hover:!bg-blue-600' : '!bg-gray-300 !text-gray-500 cursor-not-allowed'}`}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            Tolak
          </Button>

          <Button
            onClick={() => { if (!isDikirim && !kirimDisabled) handleResiInput(); }}
            disabled={kirimDisabled}
            className={`flex items-center gap-2 ${!kirimDisabled ? '!bg-blue-600 !text-white hover:!bg-blue-700' : '!bg-gray-300 !text-gray-500 cursor-not-allowed'}`}
            icon={<TruckIcon className="w-4 h-4" />}
          >
            {isDikirim ? 'Sudah dikirim' : 'Kirim'}
          </Button>

          <Button
            onClick={() => {
              Modal.info({
                title: 'Info',
                content: 'Pesanan akan selesai setelah buyer konfirmasi.',
                okText: 'OK',
                // Force a single blue color for the OK button and remove hover variance via inline styles
                okButtonProps: {
                  style: {
                    backgroundColor: '#3b82f6',
                    borderColor: '#3b82f6',
                    color: '#ffffff',
                    boxShadow: 'none'
                  }
                }
              });
            }}
            disabled={!buttonStates.selesai}
            className={`flex items-center gap-2 ${buttonStates.selesai ? '!bg-blue-500 !text-white hover:!bg-blue-600' : '!bg-gray-300 !text-gray-500 cursor-not-allowed'}`}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            Selesai
          </Button>

          <Button
            icon={<PrinterIcon className="w-4 h-4" />}
            onClick={handlePrint}
            className="flex items-center gap-2 !bg-purple-600 !text-white hover:!bg-purple-700"
          >
            Print Pesanan
          </Button>
        </div>
      </div>
      {/* Modal Input Resi */}
      <Modal
        title={<div className="font-bold text-lg text-blue-700 flex items-center gap-2"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h3m4 0a4 4 0 00-4-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4v-3a4 4 0 00-4-4z" /></svg>Input Resi Pengiriman</div>}
        open={resiModalOpen}
        onCancel={handleResiCancel}
        onOk={handleResiSubmit}
        okText={<span className="font-semibold">Simpan</span>}
        cancelText={<span className="font-semibold">Batal</span>}
        footer={[
          <Button
            key="cancel"
            onClick={handleResiCancel}
            className="!bg-gray-100 !text-gray-700 !rounded-md !px-5 !py-2 !border-none !shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            Batal
          </Button>,
          <Button
            key="submit"
            onClick={handleResiSubmit}
            loading={kirimLoading}
            className="!bg-blue-600 !text-white !rounded-md !px-5 !py-2 !border-none !shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            Simpan
          </Button>
        ]}
        bodyStyle={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(30,64,175,0.08)', padding: 24 }}
        style={{ borderRadius: 18, overflow: 'hidden' }}
      >
        <form className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-700">Nama Ekspedisi</label>
            <input
              type="text"
              name="ekspedisi"
              value="JNE"
              readOnly
              disabled
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-700">Nomor Resi</label>
            <input
              type="text"
              name="resi"
              value={formResi.resi}
              onChange={handleResiChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan nomor resi"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-700">Tanggal Pengiriman</label>
            <input
              type="date"
              name="tanggal"
              value={formResi.tanggal}
              onChange={handleResiChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-700">Catatan (Opsional)</label>
            <textarea
              name="catatan"
              value={formResi.catatan}
              onChange={handleResiChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              rows={2}
              placeholder="Catatan tambahan"
            />
          </div>
        </form>
      </Modal>

      {/* MODAL TERIMA PESANAN */}
      <Modal
        open={isKonfirmasiModalVisible}
        onCancel={handleKonfirmasiCancel}
        title={<div className="font-bold text-lg text-green-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Terima Pesanan
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
            className="!bg-green-600 !text-white !rounded-md !px-5 !py-2 !border-none !shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            Ya, Terima
          </Button>
        ]}
        bodyStyle={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(30,64,175,0.08)', padding: 24 }}
        style={{ borderRadius: 18, overflow: 'hidden' }}
      >
        <div className="py-4">
          <p className="text-sm text-gray-700">
            Apakah Anda yakin ingin menerima pesanan ini?
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Setelah diterima, Anda dapat melanjutkan proses pengiriman.
          </p>
        </div>
      </Modal>

      {/* MODAL TOLAK PESANAN */}
      <Modal
        open={isTolakModalVisible}
        onCancel={handleTolakCancel}
        title={<div className="font-bold text-lg text-red-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Tolak Pesanan
        </div>}
        footer={[
          <Button
            key="cancel"
            onClick={handleTolakCancel}
            className="!bg-gray-100 !text-gray-700 !rounded-md !px-5 !py-2 !border-none !shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            Batal
          </Button>,
          <Button
            key="submit"
            onClick={handleTolakSubmit}
            loading={tolakLoading}
            className="!bg-red-600 !text-white !rounded-md !px-5 !py-2 !border-none !shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            Ya, Tolak
          </Button>
        ]}
        bodyStyle={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(30,64,175,0.08)', padding: 24 }}
        style={{ borderRadius: 18, overflow: 'hidden' }}
      >
        <div className="py-4">
          <p className="text-sm text-gray-700 mb-4">
            Apakah Anda yakin ingin menolak pesanan ini?
          </p>
          <p className="text-xs text-red-600 mb-4">
            Status akan diubah menjadi <strong>Pengembalian Dana</strong> karena pembeli sudah membayar.
          </p>
          <div>
            <label className="block text-xs font-semibold mb-2 text-gray-700">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={alasanTolak}
              onChange={(e) => setAlasanTolak(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
              rows={4}
              placeholder="Contoh: Stok habis, Produk rusak, dll."
              required
            />
          </div>
        </div>
      </Modal>

      {/* Desktop View */}
      <Card className="shadow-lg">
        <CardBody className="p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Detail Pesanan</h1>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${status.bg} ${status.border} ${status.textColor} shadow-md`}>
                  {/* solid white dot (no animation) for contrast */}
                  <span className="w-2 h-2 rounded-full bg-white" />
                  {status.text}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {orderData.created_date} • {orderData.created_time}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">No. Invoice</p>
                <p className="text-sm font-bold text-gray-800">{orderData.invoice}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="text-sm font-mono text-gray-800">{orderData.order_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Platform</p>
                <p className="text-sm font-semibold text-gray-800">{orderData.platform}</p>
              </div>
            </div>

            {/* History removed from here to place at the bottom */}
          </div>

          {/* Customer (Pemesan), Penerima, and Shipping/Payment + History in 3 columns */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Informasi Pemesan */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                <UserIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-gray-800">Informasi Pemesan</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Nama</p>
                  <p className="text-sm font-semibold text-gray-900">{orderData.nama_customer || orderData.nama_pemesan || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-700">{orderData.email_customer || orderData.email || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Catatan Pesanan</p>
                  <p className="text-sm text-gray-800 italic">{orderData.pesan_customer || '-'}</p>
                </div>
              </div>
            </div>

            {/* Informasi Penerima */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                <UserIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-gray-800">Informasi Penerima</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Nama Penerima</p>
                  <p className="text-sm font-semibold text-gray-900">{orderData.nama_penerima || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">No. Telepon</p>
                  <p className="text-sm text-gray-700 flex items-center gap-1">
                    <PhoneIcon className="w-4 h-4" />
                    {orderData.telp_penerima || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Alamat Lengkap</p>
                  <p className="text-sm text-gray-700 leading-relaxed font-semibold">{orderData.alamat_pengiriman || '-'}</p>
                  {orderData.detail_alamat && (
                    <div className="mt-1 text-xs text-gray-600 space-y-0.5 border-l-2 border-gray-300 pl-2">
                      <p>{orderData.detail_alamat.kelurahan}, {orderData.detail_alamat.kecamatan}</p>
                      <p>{orderData.detail_alamat.kota}</p>
                      <p>{orderData.detail_alamat.provinsi} - {orderData.detail_alamat.kode_pos}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping, Payment, and History stacked */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-center gap-2 mb-2">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-gray-800">Pengiriman</h3>
                </div>
                <p className="text-base font-bold text-gray-900">{orderData.pengiriman || '-'}</p>
                {orderData.code_pengiriman && (
                  <p className="text-xs text-gray-600 mt-1">Resi: <span className="font-semibold">{orderData.code_pengiriman}</span></p>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCardIcon className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-sm text-gray-800">Pembayaran</h3>
                </div>
                <p className="text-base font-bold text-gray-900">{orderData.metode_pembayaran || 'Belum dibayar'}</p>
                {orderData.tgl_pembayaran && (
                  <p className="text-xs text-gray-600 mt-1">Dibayar: {orderData.tgl_pembayaran}</p>
                )}
              </div>

              {/* History Card */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-sm text-gray-800">Riwayat Order</h3>
                </div>
                <div className="space-y-3">
                  {orderData.history && orderData.history.length > 0 ? (
                    orderData.history.slice(0, 5).map((h) => (
                      <div key={h.id_transaksi_history} className="text-sm">
                        <div className="font-medium text-gray-800">{h.status}</div>
                        <div className="text-xs text-gray-500">{h.date_created ? new Date(h.date_created).toLocaleString('id-ID') : '-'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">Tidak ada riwayat.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Payment moved to the right column above; duplicate removed */}

          {/* Products Table */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBagIcon className="w-5 h-5 text-gray-700" />
              <h3 className="font-bold text-base text-gray-800">Produk Pesanan</h3>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="text-xs font-semibold text-gray-700">
                    <th className="px-4 py-3 text-center w-12">No</th>
                    <th className="px-4 py-3 text-center w-36">Kode Produk</th>
                    <th className="px-4 py-3 text-left">Nama Produk</th>
                    <th className="px-4 py-3 text-center w-28">Harga</th>
                    <th className="px-4 py-3 text-center w-16">Qty</th>
                    <th className="px-4 py-3 text-center w-20">Diskon</th>
                    <th className="px-4 py-3 text-center w-20">Pajak</th>
                    <th className="px-4 py-3 text-right w-32">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderData.details?.map((item, index) => (
                    <tr key={item.id_detail || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-xs text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">{item.kode_sku || item.kode_produk || item.sku || '-'}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm text-gray-900">{item.nama_produk}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">Rp {item.harga_aktif?.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs">{item.qty}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-red-600">{(item.diskon || item.diskon_nominal || item.discount) ? `- Rp ${Number(item.diskon || item.diskon_nominal || item.discount).toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">{(item.ppn || item.ppn_nominal) ? `Rp ${Number(item.ppn || item.ppn_nominal).toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Rp {item.total?.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* customer note moved into Informasi Pemesan card */}

          {/* Summary Total */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-end">
              <div className="w-full md:w-96">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal Produk</span>
                    <span className="font-semibold text-gray-900">
                      Rp {totalProduct.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ongkos Kirim (Ongkir)</span>
                    <span className="font-semibold text-gray-900">
                      Rp {shipping.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {discountVoucher > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Diskon Voucher</span>
                      <span className="font-semibold text-red-600">
                        - Rp {parseFloat(discountVoucher).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  {discountVoucherToko > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Diskon Voucher Toko</span>
                      <span className="font-semibold text-red-600">
                        - Rp {parseFloat(discountVoucherToko).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  {ppnNominal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">PPN {ppnPercentage > 0 ? `(${ppnPercentage}%)` : ''}</span>
                      <span className="font-semibold text-gray-900">
                        Rp {ppnNominal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  {biayaAsuransi > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Asuransi</span>
                      <span className="font-semibold text-gray-900">
                        Rp {biayaAsuransi.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  {penggunaanKoin > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Penggunaan Koin</span>
                      <span className="font-semibold text-red-600">
                        - Rp {penggunaanKoin.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  {biayaLayanan > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Layanan</span>
                      <span className="font-semibold text-gray-900">
                        Rp {biayaLayanan.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-400 pt-3 mt-2">
                    <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md">
                      <span className="text-base font-bold">TOTAL PEMBAYARAN</span>
                      <span className="text-xl font-bold">
                        Rp {grandTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History moved to the right column card */}
        </CardBody>
      </Card>
      {/* Tailwind Alert Modal */}
      {alert.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeAlert} />
          <div className="relative max-w-md w-full">
            <div className={`rounded-xl shadow-lg overflow-hidden border ${alert.type === 'success' ? 'border-green-200' : alert.type === 'error' ? 'border-red-200' : 'border-yellow-200'} bg-white`}>
              <div className={`p-4 flex items-start gap-3 ${alert.type === 'success' ? '' : ''}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${alert.type === 'success' ? 'bg-green-100 text-green-700' : alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {alert.type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.122a1 1 0 111.414-1.415L8.414 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  ) : alert.type === 'error' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2a1 1 0 11-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.257 3.099c.765-1.36 2.681-1.36 3.446 0l5.518 9.803A1.75 1.75 0 0116.018 16H3.982a1.75 1.75 0 01-1.203-2.098L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a.75.75 0 00-.75.75v2.5c0 .414.336.75.75.75s.75-.336.75-.75v-2.5A.75.75 0 0010 7z" /></svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{alert.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <button onClick={closeAlert} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailPesanan
