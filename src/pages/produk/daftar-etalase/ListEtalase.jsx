import React, { useState, useEffect, useMemo } from 'react';
import { Input, Spin, Pagination, Modal, Button } from 'antd';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ETALASE_ENDPOINTS, apiFetch } from '../../../configs/api';
import Swal from 'sweetalert2';

function ListEtalase({ search: parentSearch }) {
    const [etalases, setEtalases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editingEtalase, setEditingEtalase] = useState(null);
    
    // Form states
    const [namaEtalase, setNamaEtalase] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    // Use parent search if provided
    const effectiveSearch = parentSearch !== undefined ? parentSearch : search;

    // Fetch etalases
    useEffect(() => {
        fetchEtalases();
    }, []);

    const fetchEtalases = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(ETALASE_ENDPOINTS.LIST);
            if (res.success && res.etalase) {
                setEtalases(res.etalase);
            }
        } catch (error) {
            console.error('Error fetching etalases:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered etalases
    const filteredEtalases = useMemo(() => {
        if (!effectiveSearch) return etalases;
        return etalases.filter(etalase => 
            etalase.nama_etalase?.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
            etalase.slug_etalase?.toLowerCase().includes(effectiveSearch.toLowerCase())
        );
    }, [etalases, effectiveSearch]);

    // Paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredEtalases.slice(startIndex, endIndex);
    }, [filteredEtalases, currentPage, pageSize]);

    // Open modal for create
    const handleCreate = () => {
        setModalMode('create');
        setEditingEtalase(null);
        setNamaEtalase('');
        setIsModalOpen(true);
    };

    // Open modal for edit
    const handleEdit = (etalase) => {
        setModalMode('edit');
        setEditingEtalase(etalase);
        setNamaEtalase(etalase.nama_etalase || '');
        setIsModalOpen(true);
    };

    // Submit (create or edit)
    const handleSubmit = async () => {
        if (!namaEtalase.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                text: 'Nama etalase harus diisi!',
            });
            return;
        }

        setSubmitLoading(true);
        try {
            const body = {
                nama_etalase: namaEtalase,
            };

            const endpoint = modalMode === 'create' 
                ? ETALASE_ENDPOINTS.CREATE 
                : ETALASE_ENDPOINTS.UPDATE(editingEtalase.id_etalase);
            
            const method = modalMode === 'create' ? 'POST' : 'PATCH';

            const res = await apiFetch(endpoint, {
                method,
                body: JSON.stringify(body),
            });

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: modalMode === 'create' ? 'Etalase berhasil ditambahkan!' : 'Etalase berhasil diupdate!',
                    timer: 1500,
                    showConfirmButton: false,
                });
                setIsModalOpen(false);
                fetchEtalases();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: res.message || 'Terjadi kesalahan',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Terjadi kesalahan',
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete etalase
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Etalase?',
            text: 'Etalase ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            try {
                const res = await apiFetch(ETALASE_ENDPOINTS.DELETE(id), {
                    method: 'DELETE',
                });
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Terhapus!',
                        text: 'Etalase berhasil dihapus.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    fetchEtalases();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: error.message || 'Gagal menghapus etalase',
                });
            }
        }
    };

    return (
        <div className="mb-5 rounded-lg ring-1 ring-gray-200 overflow-hidden bg-white">
            {loading && <Spin size="large" fullscreen />}
            
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex-1">
                    <Input.Search
                        placeholder="Cari nama etalase..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                        allowClear
                    />
                </div>
                <Button 
                    onClick={handleCreate} 
                    className="!h-9 !px-3 !rounded-md !bg-gray-900 !text-white !shadow-none hover:!bg-black/80 flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" /> Tambah Etalase
                </Button>
            </div>

            {/* Table */}
            {filteredEtalases.length === 0 && !loading ? (
                <div className="text-center text-gray-500 py-12">
                    <h1 className="text-xl">Belum Ada Data Etalase</h1>
                    <p className="text-sm mt-2">Klik tombol "Tambah Etalase" untuk membuat etalase baru</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3 text-left w-16 sticky top-0 z-10">No.</th>
                                <th className="px-4 py-3 text-left w-96 sticky top-0 z-10">Nama Etalase</th>
                                <th className="px-4 py-3 text-left w-64 sticky top-0 z-10">Slug</th>
                                <th className="px-4 py-3 text-left w-40 sticky top-0 z-10">Tanggal Dibuat</th>
                                <th className="px-4 py-3 text-center w-48 sticky top-0 z-10">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {paginatedData.map((etalase, idx) => (
                                <tr key={etalase.id_etalase} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className='text-sm font-medium text-gray-900 leading-snug'>
                                            {etalase.nama_etalase || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200 font-mono'>
                                            {etalase.slug_etalase || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className='text-sm text-gray-900'>
                                            {etalase.created_date ? new Date(etalase.created_date).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            }) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-2 py-3">
                                        <div className='flex gap-2 justify-center'>
                                            <Button
                                                className="!h-8 !px-3 !text-xs !rounded-md !border-gray-300 hover:!border-gray-400 flex items-center gap-1"
                                                onClick={() => handleEdit(etalase)}
                                            >
                                                <PencilSquareIcon className="w-4 h-4" /> Edit
                                            </Button>
                                            <Button
                                                danger
                                                className="!h-8 !px-3 !text-xs !rounded-md flex items-center gap-1"
                                                onClick={() => handleDelete(etalase.id_etalase)}
                                            >
                                                <TrashIcon className="w-4 h-4" /> Hapus
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredEtalases.length > pageSize && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <Pagination
                                current={currentPage}
                                total={filteredEtalases.length}
                                pageSize={pageSize}
                                onChange={(page) => setCurrentPage(page)}
                                showSizeChanger={false}
                                showTotal={(total) => `Total ${total} etalase`}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Modal Create/Edit */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
                centered
                title={
                    <div className='text-xl font-semibold tracking-tight'>
                        {modalMode === 'create' ? 'Tambah Etalase Baru' : 'Edit Etalase'}
                    </div>
                }
            >
                <div className="mt-4">
                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Etalase <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Contoh: Promo Spesial, Best Seller, Produk Baru..."
                                value={namaEtalase}
                                onChange={(e) => setNamaEtalase(e.target.value)}
                                className="w-full"
                                size="large"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Nama etalase akan muncul di toko Anda
                            </p>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            className="!h-9 !px-4 !rounded-md !bg-gray-200 !text-gray-800 hover:!bg-gray-300"
                            disabled={submitLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="!h-9 !px-4 !rounded-md !bg-gray-900 !text-white hover:!bg-black/80"
                            loading={submitLoading}
                        >
                            {modalMode === 'create' ? 'Tambah' : 'Simpan'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ListEtalase;
