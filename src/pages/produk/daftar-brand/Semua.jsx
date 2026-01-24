import { Button, Input, Modal, Select, Tag, Spin, Pagination } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Card, CardBody } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { BRAND_ENDPOINTS, CATEGORY_ENDPOINTS, apiFetch } from '../../../configs/api';

const { Option } = Select;

function Semua({ status, search: parentSearch }) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [search, setSearch] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    // Modal states
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editingBrand, setEditingBrand] = useState(null);
    
    // Form states
    const [namaBrand, setNamaBrand] = useState('');
    const [idKategori, setIdKategori] = useState('');
    const [idSubKategori, setIdSubKategori] = useState('');
    const [statusBrand, setStatusBrand] = useState('Y');
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // Category states
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);

    // Use parent search if provided
    const effectiveSearch = parentSearch !== undefined ? parentSearch : search;

    // Fetch brands
    useEffect(() => {
        fetchBrands();
        fetchCategories();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(BRAND_ENDPOINTS.LIST);
            if (res.success && res.brands) {
                setBrands(res.brands);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await apiFetch(CATEGORY_ENDPOINTS.MEGA_MENU);
            if (res && Array.isArray(res)) {
                setCategoryList(res);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryChange = (value) => {
        setIdKategori(value);
        setIdSubKategori(''); // Reset sub kategori
        
        // Find selected category and populate subcategories
        const selectedCategory = categoryList.find(cat => cat.id_kategori === value);
        if (selectedCategory && selectedCategory.children) {
            setSubCategoryList(selectedCategory.children);
        } else {
            setSubCategoryList([]);
        }
    };

    // Filtered brands
    const filteredBrands = useMemo(() => {
        let result = brands;
        
        // Filter by status prop from parent
        if (status) {
            result = result.filter(brand => 
                status === "Disetujui" ? brand.status === 'Y' : brand.status !== 'Y'
            );
        }
        
        // Filter by search
        if (effectiveSearch) {
            result = result.filter(brand => 
                brand.nama_brand?.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                brand.kategori_name?.toLowerCase().includes(effectiveSearch.toLowerCase())
            );
        }
        
        return result;
    }, [brands, status, effectiveSearch]);

    // Paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredBrands.slice(startIndex, endIndex);
    }, [filteredBrands, currentPage, pageSize]);

    // Open modal for create
    const handleCreate = () => {
        setModalMode('create');
        setEditingBrand(null);
        setNamaBrand('');
        setIdKategori('');
        setIdSubKategori('');
        setSubCategoryList([]);
        setStatusBrand('Y');
        setIsModalVisible(true);
    };

    // Open modal for edit
    const handleEdit = (brand) => {
        setModalMode('edit');
        setEditingBrand(brand);
        setNamaBrand(brand.nama_brand || '');
        setIdKategori(brand.id_kategori || '');
        setIdSubKategori(brand.id_sub_kategori || '');
        setStatusBrand(brand.status || 'Y');
        
        // Populate subcategories if kategori is set
        if (brand.id_kategori) {
            const selectedCategory = categoryList.find(cat => cat.id_kategori === brand.id_kategori);
            if (selectedCategory && selectedCategory.children) {
                setSubCategoryList(selectedCategory.children);
            }
        }
        
        setIsModalVisible(true);
    };

    // Submit (create or edit)
    const handleSubmit = async () => {
        if (!namaBrand.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                text: 'Nama brand harus diisi!',
            });
            return;
        }

        setSubmitLoading(true);
        try {
            const body = {
                nama_brand: namaBrand,
                id_kategori: idKategori || null,
                id_sub_kategori: idSubKategori || null,
            };

            if (modalMode === 'edit') {
                body.status = statusBrand;
            }

            const endpoint = modalMode === 'create' 
                ? BRAND_ENDPOINTS.CREATE 
                : BRAND_ENDPOINTS.UPDATE(editingBrand.id_brand);
            
            const method = modalMode === 'create' ? 'POST' : 'PATCH';

            const res = await apiFetch(endpoint, {
                method,
                body: JSON.stringify(body),
            });

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: modalMode === 'create' ? 'Brand berhasil ditambahkan!' : 'Brand berhasil diupdate!',
                    timer: 1500,
                    showConfirmButton: false,
                });
                setIsModalVisible(false);
                fetchBrands();
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

    // Delete brand
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Brand?',
            text: 'Brand ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            try {
                const res = await apiFetch(BRAND_ENDPOINTS.DELETE(id), {
                    method: 'DELETE',
                });
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Terhapus!',
                        text: 'Brand berhasil dihapus.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    fetchBrands();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: error.message || 'Gagal menghapus brand',
                });
            }
        }
    };

    const showModal = () => handleCreate();
    const handleCancel = () => setIsModalVisible(false);

    return (
        <div>
            {/* === DATA TABLE === */}
            <div className="mb-4 w-full mt-4">
                <div className='mb-5 rounded-lg ring-1 ring-gray-200 overflow-hidden bg-white'>
                    {/* Header (always visible) */}
                    <div className="px-6 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight text-gray-900">Daftar Brand</h2>
                        <Button onClick={showModal} className="!h-9 !px-3 !rounded-md !bg-gray-900 !text-white !shadow-none hover:!bg-black/80 flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" /> Usulkan Brand
                        </Button>
                    </div>

                    {/* Body (loading / error / empty / table) */}
                    {loading ? (
                        <div className="px-6 py-8 text-center text-gray-500">Memuat data...</div>
                    ) : filteredBrands.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            <div className="mb-5">
                                <h1 className="text-2xl">Belum Ada Data</h1>
                                <p className="mt-2 text-sm text-gray-400">Silakan usulkan brand pertama menggunakan tombol Usulkan Brand.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed">
                                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                                    <tr>
                                        <th className="px-4 py-3 text-left w-16 sticky top-0 z-10">No.</th>
                                        <th className="px-4 py-3 text-left w-96 sticky top-0 z-10">Nama Brand</th>
                                        <th className="px-4 py-3 text-left w-40 sticky top-0 z-10">Kategori</th>
                                        <th className="px-4 py-3 text-left w-40 sticky top-0 z-10">Sub Kategori</th>
                                        <th className="px-4 py-3 text-center w-28 sticky top-0 z-10">Status</th>
                                        <th className="px-4 py-3 text-center w-48 sticky top-0 z-10">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {paginatedData.map((brand, idx) => (
                                        <tr key={brand.id_brand} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-center text-xs text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className='min-w-0'>
                                                    <div className='text-sm font-medium text-gray-900 leading-snug'>
                                                        {brand.nama_brand}
                                                    </div>
                                                    <div className='mt-1 flex items-center gap-2 flex-wrap'>
                                                        <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200'>
                                                            {brand.created_date}
                                                        </span>
                                                        {brand.created_by && (
                                                            <span className='text-xs text-gray-400'>oleh: {brand.created_by.nama_user}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className='text-sm text-gray-900'>
                                                    {brand.id_kategori || <span className="text-gray-400">-</span>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className='text-sm text-gray-900'>
                                                    {brand.id_sub_kategori || <span className="text-gray-400">-</span>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${
                                                    brand.status === 'Y' 
                                                        ? 'bg-green-50 text-green-700 border border-green-100' 
                                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                }`}>
                                                    <span className='w-1.5 h-1.5 rounded-full bg-current opacity-70'></span>
                                                    {brand.status === "Y" ? 'Disetujui' : 'Menunggu'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3">
                                                <div className='flex gap-2 justify-center'>
                                                    <Button
                                                        className="!h-8 !px-3 !text-xs !rounded-md !border-gray-300 hover:!border-gray-400 flex items-center gap-1"
                                                        onClick={() => handleEdit(brand)}
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" /> Edit
                                                    </Button>
                                                    <Button
                                                        danger
                                                        className="!h-8 !px-3 !text-xs !rounded-md flex items-center gap-1"
                                                        onClick={() => handleDelete(brand.id_brand)}
                                                    >
                                                        <TrashIcon className="w-4 h-4" /> Hapus
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
                                    total={filteredBrands.length}
                                    pageSize={pageSize}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                    showTotal={(total) => `Total ${total} brand`}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* === MODAL CREATE/EDIT - Modern & Clean === */}
            <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                centered
                closeIcon={
                    <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
                }
            >
                <div className="py-4">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {modalMode === 'create' ? 'Usulkan Brand Baru' : 'Edit Brand'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {modalMode === 'create' 
                                ? 'Brand akan ditampilkan setelah disetujui oleh admin' 
                                : 'Update informasi brand'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Nama Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Brand <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Contoh: Samsung, Apple, Nike..."
                                value={namaBrand}
                                onChange={(e) => setNamaBrand(e.target.value)}
                                className="w-full"
                                size="large"
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori
                            </label>
                            <Select
                                showSearch
                                className="w-full"
                                size="large"
                                placeholder="Pilih kategori (opsional)"
                                value={idKategori || undefined}
                                onChange={handleCategoryChange}
                                allowClear
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {categoryList.map((cat) => (
                                    <Option key={cat.id_kategori} value={cat.id_kategori}>
                                        {cat.kategori}
                                    </Option>
                                ))}
                            </Select>
                            <p className="text-xs text-gray-400 mt-1">
                                Kosongkan jika kategori tidak ditemukan
                            </p>
                        </div>

                        {/* Sub Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sub Kategori
                            </label>
                            <Select
                                showSearch
                                className="w-full"
                                size="large"
                                placeholder="Pilih sub kategori (opsional)"
                                value={idSubKategori || undefined}
                                onChange={(val) => setIdSubKategori(val)}
                                allowClear
                                disabled={!idKategori || subCategoryList.length === 0}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {subCategoryList.map((subCat) => (
                                    <Option key={subCat.id_kategori} value={subCat.id_kategori}>
                                        {subCat.kategori}
                                    </Option>
                                ))}
                            </Select>
                            <p className="text-xs text-gray-400 mt-1">
                                Pilih kategori terlebih dahulu untuk melihat sub kategori
                            </p>
                        </div>

                        {/* Status (only for edit) */}
                        {modalMode === 'edit' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <Select
                                    className="w-full"
                                    size="large"
                                    value={statusBrand}
                                    onChange={(val) => setStatusBrand(val)}
                                >
                                    <Option value="Y">Disetujui</Option>
                                    <Option value="T">Menunggu</Option>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            onClick={handleCancel}
                            className="bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200"
                            disabled={submitLoading}
                            size="large"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                            disabled={submitLoading}
                            size="large"
                        >
                            {submitLoading ? (
                                <Spin size="small" className="mr-2" />
                            ) : null}
                            {modalMode === 'create' ? 'Usulkan Brand' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Semua;
