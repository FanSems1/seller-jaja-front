import React, { useEffect, useMemo, useState } from 'react';
import Gambar1 from '../../../assets/pesanan/produkTesting2.png';
// Card wrapper handled by parent

import {
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import { Button, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PRODUCT_ENDPOINTS, apiFetch, API_BASE_URL } from '../../../configs/api';

const getImageUrl = (url) => {
    if (!url) return Gambar1;
    if (url.startsWith('http')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_BASE_URL}/${cleanUrl}`;
};

function Semua({ status, search }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    useEffect(() => {
        let abort = false;
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await apiFetch(PRODUCT_ENDPOINTS.LIST);
                if (abort) return;
                if (res.success && Array.isArray(res.produk)) {
                    setProducts(res.produk);
                } else {
                    setError(res.message || 'Gagal memuat produk');
                    setProducts([]);
                }
            } catch (e) {
                if (!abort) {
                    setError(e.message || 'Gagal memuat produk');
                    setProducts([]);
                }
            } finally {
                if (!abort) setLoading(false);
            }
        };
        fetchProducts();
        return () => { abort = true; };
    }, []);
    
    const filtered = useMemo(() => {
        return products.filter(p => {
            if (status && status !== 'Semua') {
                if ((p.status_produk || '').toLowerCase() !== status.toLowerCase()) return false;
            }
            if (search) {
                const s = search.toLowerCase();
                const nameMatch = (p.nama_produk || '').toLowerCase().includes(s);
                const slugMatch = (p.slug_produk || '').toLowerCase().includes(s);
                if (!nameMatch && !slugMatch) return false;
            }
            return true;
        });
    }, [products, status, search]);

    // Paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filtered.slice(startIndex, endIndex);
    }, [filtered, currentPage, pageSize]);

    // reset page when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [status, search]);

    const handleEdit = (id) => {
        navigate(`/dashboard/produk/daftar-produk/edit-produk/${id}`);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus saja!',
            cancelButtonText: 'Batalkan'
        }).then((result) => {
                        if (result.isConfirmed) {
                                apiFetch(PRODUCT_ENDPOINTS.DELETE(id), { method: 'DELETE' })
                                    .then(() => {
                                        Swal.fire('Dihapus!', 'Produk berhasil dihapus.', 'success');
                                        setProducts(prev => prev.filter(p => p.id_produk !== id));
                                    })
                                    .catch(err => {
                                        Swal.fire('Gagal', err.message || 'Gagal menghapus produk', 'error');
                                    });
                        }
        });
    };
      
    return (
        <div className="mb-4 w-full mt-4">
            <div className='mb-5 rounded-lg ring-1 ring-gray-200 overflow-hidden bg-white'>
                {/* Header omitted — filters are rendered by parent DaftarProduk (compact, no blue card) */}

                {/* Body (loading / error / empty / table) */}
                {loading ? (
                    <div className="px-6 py-8 text-center text-gray-500">Memuat data...</div>
                ) : error ? (
                    <div className="px-6 py-8 text-center text-red-600">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        <div className=" mb-5">
                            <h1 className="text-2xl">Belum Ada Data</h1>
                            <p className="mt-2 text-sm text-gray-400">Silakan tambahkan produk pertama Anda menggunakan tombol Tambah Produk.</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 text-left w-12 sticky top-0 z-10">No.</th>
                                    <th className="px-4 py-3 text-left sticky top-0 z-10">Nama Produk</th>
                                    <th className="px-4 py-3 text-left w-40 sticky top-0 z-10">Kategori</th>
                                    <th className="px-4 py-3 text-left w-36 sticky top-0 z-10">Harga</th>
                                    <th className="px-4 py-3 text-center w-24 sticky top-0 z-10">Stok</th>
                                    <th className="px-4 py-3 text-center w-28 sticky top-0 z-10">Status</th>
                                    <th className="px-4 py-3 text-center w-40 sticky top-0 z-10">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {paginatedData.map((item, idx) => (
                                    <tr key={item.id_produk} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-center text-xs text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className='flex items-start gap-3 min-w-0'> 
                                                <div className='relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden'>
                                                    {(() => {
                                                        const imageSrc = item.foto_produk || (item.thumbnail ? getImageUrl(item.thumbnail) : null);
                                                        if (imageSrc) {
                                                            return (
                                                                <img
                                                                    src={imageSrc}
                                                                    alt={item.nama_produk}
                                                                    className='w-full h-full object-cover'
                                                                    crossOrigin="anonymous"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = Gambar1;
                                                                    }}
                                                                />
                                                            );
                                                        }
                                                        return (
                                                            <div className='w-full h-full flex items-center justify-center text-[8px] text-gray-400'>
                                                                No Image
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                <div className='min-w-0'>
                                                    <div className='text-sm font-medium text-gray-900 leading-snug line-clamp-2 break-words'>
                                                        {item.nama_produk}
                                                    </div>
                                                    <div className='mt-1 flex items-center gap-2 flex-wrap'>
                                                        <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200'>
                                                            Kode: {item.kode_produk || item.kode_sku || item.slug_produk || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {item.kategori?.nama || item.kategori || item.kategori_nama || item.kategoriProduk || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className='text-sm text-gray-900'>Rp {Number(item.harga).toLocaleString('id-ID')}</div>
                                        </td>
                                        <td className="text-center px-4 py-3">
                                            <div className='text-sm text-gray-900'>{item.stok}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-100'>
                                                <span className='w-1.5 h-1.5 rounded-full bg-current opacity-70'></span>
                                                {(item.status_produk || '').toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-2 py-3">
                                            <div className='flex gap-2 justify-center'>
                                                <Button
                                                    className="!h-8 !px-3 !text-xs !rounded-md !border-gray-300 hover:!border-gray-400 flex items-center gap-1"
                                                    onClick={() => handleEdit(item.id_produk)}
                                                >
                                                    <PencilIcon className="w-4 h-4" /> Edit
                                                </Button>
                                                <Button
                                                  danger
                                                  className="!h-8 !px-2 !text-xs !rounded-md flex items-center"
                                                  onClick={() => handleDelete(item.id_produk)}
                                                  title="Hapus"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-6 flex justify-end">
                            <Pagination
                                current={currentPage}
                                total={filtered.length}
                                pageSize={pageSize}
                                onChange={(page, newSize) => {
                                    setCurrentPage(page);
                                    if (newSize && newSize !== pageSize) setPageSize(newSize);
                                }}
                                showSizeChanger={true}
                                pageSizeOptions={["10", "50", "100"]}
                                showTotal={(total) => `Total ${total} produk`}
                                size="small"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Semua;
