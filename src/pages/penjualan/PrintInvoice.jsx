import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ORDER_ENDPOINTS, apiFetch } from '../../configs/api';
import LogoJaja from '../../assets/LogoJaja.png';

function PrintInvoice() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await apiFetch(ORDER_ENDPOINTS.DETAIL(id));
                if (response.success && response.data) {
                    setOrderData(response.data);
                    // Auto print after data loaded
                    setTimeout(() => {
                        window.print();
                    }, 500);
                }
            } catch (err) {
                console.error('Error fetching order detail:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

    if (loading || !orderData) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                Loading invoice...
            </div>
        );
    }

    const statusConfig = {
        'Menunggu Pembayaran': { color: 'warning', text: 'Menunggu Pembayaran' },
        'Paid': { color: 'success', text: 'Telah Dibayar' },
        'Pesanan Selesai': { color: 'success', text: 'Selesai' },
        'Dibatalkan': { color: 'danger', text: 'Dibatalkan' }
    };

    const status = statusConfig[orderData?.status_transaksi] || statusConfig['Menunggu Pembayaran'];
    const totalProduct = orderData.details?.reduce((sum, item) => sum + ((item.harga_aktif || 0) * (item.qty || 0)), 0) || 0;
    const shipping = orderData.biaya_ongkir || orderData.total_ongkir || orderData.ongkir || 0;
    const discountVoucher = Number(orderData.diskon_voucher || 0) || 0;
    const discountVoucherToko = Number(orderData.diskon_voucher_toko || 0) || 0;
    const discount = discountVoucher + discountVoucherToko;
    const ppnNominal = Number(orderData.ppn_nominal || 0) || 0;
    const grandTotal = Number(orderData.total_tagihan || (totalProduct + shipping - discount + ppnNominal)) || 0;

    return (
        <>
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.5;
                    color: #1f2937;
                    background: white;
                }
                .invoice-container {
                    max-width: 210mm;
                    margin: 20px auto;
                    padding: 20px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    gap: 16px;
                    border-bottom: 1px solid #e6f6ff;
                    margin-bottom: 18px;
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }
                .logo {
                    height: 64px;
                    width: auto;
                    border-radius: 6px;
                    background: white;
                    padding: 6px;
                    box-shadow: 0 2px 8px rgba(3, 105, 161, 0.06);
                }
                .company-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .company-name {
                    font-size: 18px;
                    font-weight: 800;
                    color: #0f172a;
                }
                .company-sub {
                    font-size: 12px;
                    color: #475569;
                }
                .invoice-block {
                    background: linear-gradient(90deg, rgba(59,130,246,0.06), rgba(14,165,233,0.04));
                    padding: 14px 18px;
                    border-radius: 8px;
                    text-align: right;
                    min-width: 260px;
                }
                .invoice-title {
                    font-size: 20px;
                    font-weight: 800;
                    color: #0f172a;
                }
                .invoice-number {
                    font-size: 13px;
                    color: #334155;
                    margin-top: 6px;
                }
                .header-right {
                    text-align: right;
                    display:flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap:8px;
                }
                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 999px;
                    font-weight: 700;
                    font-size: 13px;
                    border: none;
                    box-shadow: 0 2px 10px rgba(2,132,199,0.08);
                }
                .status-success {
                    background: #0284c7;
                    color: #ffffff;
                }
                .status-warning {
                    background: #f59e0b;
                    color: #ffffff;
                }
                .status-danger {
                    background: #ef4444;
                    color: #ffffff;
                }
                .date-text {
                    font-size: 11px;
                    color: #6b7280;
                    margin-top: 8px;
                }
                .content {
                    padding: 0 32px;
                }
                .grid-3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    margin-bottom: 24px;
                }
                .info-box {
                    border-left: 4px solid #0ea5e9;
                    padding: 12px 16px;
                    background: rgba(240, 249, 255, 0.5);
                }
                .info-box-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    font-size: 12px;
                    color: #111827;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                }
                .company-address {
                    font-size: 12px;
                    color: #374151;
                    text-align: right;
                    line-height: 1.3;
                    font-weight: 500;
                }
                .info-box-content {
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.6;
                    font-weight: 500;
                }
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 16px;
                }
                .card {
                    background: #f9fafb;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                .card-label {
                    font-size: 10px;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 4px;
                }
                .card-value {
                    font-weight: 700;
                    color: #111827;
                }
                .courier-card {
                    background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
                    border: 2px solid #bae6fd;
                }
                .courier-value {
                    font-size: 18px;
                    text-transform: uppercase;
                }
                .order-id {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    background: #f3f4f6;
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 4px;
                    border: 1px solid #d1d5db;
                    margin-bottom: 20px;
                }
                .section-header {
                    background: transparent;
                    color: #0f172a;
                    padding: 8px 0 6px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-radius: 4px;
                    margin-top: 18px;
                    margin-bottom: 6px;
                }
                .section-title {
                    font-weight: 700;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 18px;
                    box-shadow: 0 4px 18px rgba(2,132,199,0.06);
                    border-radius: 8px;
                    overflow: hidden;
                }
                thead {
                    background: linear-gradient(90deg, #f0f9ff, #ecfeff);
                }
                th {
                    padding: 12px 14px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 700;
                    color: #0f172a;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid rgba(15,23,42,0.06);
                }
                td {
                    padding: 12px 14px;
                    border-bottom: 1px solid rgba(15,23,42,0.04);
                    font-size: 13px;
                    vertical-align: middle;
                    color: #0f172a;
                }

                tbody tr:nth-child(even) td { background: #fbfdff; }
                .product-name {
                    font-weight: 600;
                    color: #111827;
                }
                .product-store {
                    font-size: 11px;
                    color: #6b7280;
                    margin-top: 2px;
                }
                .qty-badge {
                    display: inline-block;
                    background: #dbeafe;
                    color: #075985;
                    font-weight: 700;
                    padding: 4px 12px;
                    border-radius: 999px;
                    font-size: 11px;
                    border: 1px solid #7dd3fc;
                }
                .text-center {
                    text-align: center;
                }
                .text-right {
                    text-align: right;
                }
                .font-bold {
                    font-weight: 700;
                }
                .note-box {
                    background: #fffbeb;
                    border-left: 4px solid #f59e0b;
                    padding: 12px;
                    margin-bottom: 20px;
                    border-radius: 0 8px 8px 0;
                }
                .note-title {
                    font-size: 11px;
                    font-weight: 700;
                    color: #92400e;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 4px;
                }
                .note-content {
                    font-size: 13px;
                    color: #374151;
                    font-style: italic;
                    font-weight: 500;
                }
                .summary {
                    border-top: 1px solid rgba(15,23,42,0.06);
                    padding-top: 14px;
                    display: flex;
                    justify-content: flex-end;
                }
                .summary-box {
                    width: 380px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 13px;
                }
                .summary-label {
                    color: #6b7280;
                    font-weight: 500;
                }
                .summary-value {
                    font-weight: 700;
                    color: #111827;
                }
                .total-box {
                    background: #0284c7;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 12px;
                    border: 2px solid #075985;
                }
                .total-label {
                    font-weight: 700;
                    font-size: 15px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .total-value {
                    font-weight: 700;
                    font-size: 20px;
                }
                .footer {
                    background: #f9fafb;
                    padding: 16px 32px;
                    border-top: 2px solid #e5e7eb;
                    margin-top: 24px;
                }
                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #6b7280;
                    margin-bottom: 12px;
                }
                .footer-left p {
                    margin-bottom: 4px;
                }
                .footer-right {
                    text-align: right;
                }
                .platform {
                    font-weight: 700;
                    color: #374151;
                }
                .link {
                    color: #0284c7;
                    font-weight: 600;
                }
                .footer-note {
                    text-align: center;
                    padding-top: 12px;
                    border-top: 1px solid #d1d5db;
                    font-size: 11px;
                    color: #9ca3af;
                    font-style: italic;
                }
                @media print {
                    .invoice-container {
                        margin: 0;
                        padding: 0;
                    }
                }
            `}</style>
            
            <div className="invoice-container">
                {/* Header */}
                <div className="header">
                    <div className="header-left">
                        <img src={LogoJaja} alt="Logo" className="logo" />
                        <div className="company-meta">
                            <div className="company-name">Jaja Marketplace</div>
                            <div className="company-sub">Jl. Contoh Alamat No.123, Jakarta • (021) 1234 5678</div>
                            <div className="company-sub">support@jaja.id • www.jaja.id</div>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="invoice-block">
                            <div className="invoice-title">INVOICE</div>
                            <div className="invoice-number">{orderData.invoice}</div>
                        </div>
                        <div>
                            <div className={`status-badge ${status.color === 'success' ? 'status-success' : status.color === 'danger' ? 'status-danger' : 'status-warning'}`}>
                                {status.text}
                            </div>
                            <div className="date-text">{orderData.created_date} • {orderData.created_time}</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="content">
                    {/* Grid Info */}
                    <div className="grid-3">
                        {/* Column 1: Penerima */}
                        <div>
                            <div className="card" style={{ marginBottom: '12px' }}>
                                <div className="card-label">Penerima</div>
                                <div className="card-value">{orderData.nama_penerima || '-'}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>📞 {orderData.telp_penerima || '-'}</div>
                            </div>
                            <div className="info-box" style={{ marginTop: '6px' }}>
                                <div className="info-box-title">📍 Alamat Pengiriman</div>
                                <div className="info-box-content">{orderData.alamat_pengiriman || '-'}</div>
                            </div>
                        </div>

                        {/* Column 2: Pemesan */}
                        <div>
                            <div className="card" style={{ marginBottom: '12px' }}>
                                <div className="card-label">Pemesan</div>
                                <div className="card-value">{orderData.nama_customer || '-'}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{orderData.email_customer || orderData.email || '-'}</div>
                            </div>
                            {orderData.pesan_customer && (
                                <div className="note-box" style={{ marginTop: 8 }}>
                                    <div className="note-title">Catatan Pemesan</div>
                                    <div className="note-content">"{orderData.pesan_customer}"</div>
                                </div>
                            )}
                        </div>

                        {/* Column 3: Pengiriman & Pembayaran */}
                        <div>
                            <div className="card courier-card" style={{ marginBottom: '12px' }}>
                                <div className="card-label">🚚 Kurir</div>
                                <div className="card-value courier-value">{orderData.pengiriman || '-'}</div>
                                {orderData.resi && <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Resi: {orderData.resi}</div>}
                            </div>
                            <div className="card">
                                <div className="card-label">💳 Pembayaran</div>
                                <div className="card-value">{orderData.metode_pembayaran || 'Belum Dibayar'}</div>
                                {orderData.tgl_pembayaran && (
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Dibayar: {orderData.tgl_pembayaran}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order ID */}
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Order ID:</span>
                        <span className="order-id">{orderData.order_id}</span>
                    </div>

                    {/* Products */}
                    <div className="section-header">
                        <span>🛍️</span>
                        <span className="section-title">Rincian Pesanan</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>No</th>
                                <th style={{ width: '120px' }}>Kode Produk</th>
                                <th>Nama Produk</th>
                                <th style={{ width: '120px' }} className="text-center">Harga</th>
                                <th style={{ width: '60px' }} className="text-center">Qty</th>
                                <th style={{ width: '100px' }} className="text-center">Diskon</th>
                                <th style={{ width: '100px' }} className="text-center">Pajak</th>
                                <th style={{ width: '140px' }} className="text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData.details?.map((item, index) => (
                                <tr key={item.id_detail || index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">{item.kode_sku || item.kode_produk || item.sku || '-'}</td>
                                    <td>
                                        <div className="product-name">{item.nama_produk}</div>
                                    </td>
                                    <td className="text-center">Rp {item.harga_aktif?.toLocaleString('id-ID')}</td>
                                    <td className="text-center"><span className="qty-badge">{item.qty}</span></td>
                                    <td className="text-center">{(item.diskon || item.diskon_nominal || item.discount) ? `- Rp ${Number(item.diskon || item.diskon_nominal || item.discount).toLocaleString('id-ID')}` : '-'}</td>
                                    <td className="text-center">{(item.ppn || item.ppn_nominal) ? `Rp ${Number(item.ppn || item.ppn_nominal).toLocaleString('id-ID')}` : '-'}</td>
                                    <td className="text-right font-bold">Rp {item.total?.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Customer Note */}
                    {orderData.pesan_customer && (
                        <div className="note-box">
                            <div className="note-title">Catatan Pembeli:</div>
                            <div className="note-content">"{orderData.pesan_customer}"</div>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="summary">
                        <div className="summary-box">
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal Produk</span>
                                    <span className="summary-value">Rp {totalProduct.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Biaya Pengiriman (Ongkir)</span>
                                    <span className="summary-value">Rp {Number(shipping).toLocaleString('id-ID')}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="summary-row">
                                        <span className="summary-label">Diskon</span>
                                        <span className="summary-value" style={{ color: '#dc2626' }}>- Rp {Number(discount).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {ppnNominal > 0 && (
                                    <div className="summary-row">
                                        <span className="summary-label">PPN</span>
                                        <span className="summary-value">Rp {Number(ppnNominal).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="total-box">
                                    <span className="total-label">TOTAL PEMBAYARAN</span>
                                    <span className="total-value">Rp {Number(grandTotal).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    <div className="footer-content">
                        <div className="footer-left">
                            <p><span className="platform">Platform: {orderData.platform}</span></p>
                            <p>Terima kasih telah berbelanja!</p>
                        </div>
                        <div className="footer-right">
                            <p className="link">www.jaja.id</p>
                            <p>support@jaja.id</p>
                        </div>
                    </div>
                    <div className="footer-note">
                        Dokumen ini dicetak secara otomatis dan sah tanpa tanda tangan
                    </div>
                </div>
            </div>
        </>
    );
}

export default PrintInvoice;
