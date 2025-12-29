import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { Table, Input, Tag, Modal, Select, Spin } from 'antd';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { BRAND_ENDPOINTS, apiFetch } from '../../../configs/api';
import Swal from 'sweetalert2';

const { Option } = Select;

function ListBrand() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editingBrand, setEditingBrand] = useState(null);
    
    // Form states
    const [namaBrand, setNamaBrand] = useState('');
    const [idKategori, setIdKategori] = useState('');
    const [idSubKategori, setIdSubKategori] = useState('');
    const [status, setStatus] = useState('Y');
    const [submitLoading, setSubmitLoading] = useState(false);

    // Fetch brands
    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(BRAND_ENDPOINTS.LIST);
            if (res.success && res.brand) {
                setBrands(res.brand);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered brands
    const filteredBrands = useMemo(() => {
        if (!search) return brands;
        return brands.filter(brand => 
            brand.nama_brand?.toLowerCase().includes(search.toLowerCase())
        );
    }, [brands, search]);

    // Open modal for create
    const handleCreate = () => {
        setModalMode('create');
        setEditingBrand(null);
        setNamaBrand('');
        setIdKategori('');
        setIdSubKategori('');
        setStatus('Y');
        setIsModalOpen(true);
    };

    // Open modal for edit
    const handleEdit = (brand) => {
        setModalMode('edit');
        setEditingBrand(brand);
        setNamaBrand(brand.nama_brand || '');
        setIdKategori(brand.id_kategori || '');
        setIdSubKategori(brand.id_sub_kategori || '');
        setStatus(brand.status || 'Y');
        setIsModalOpen(true);
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
                body.status = status;
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
                setIsModalOpen(false);
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

    const columns = [
        {
            title: 'No',
            key: 'no',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Nama Brand',
            dataIndex: 'nama_brand',
            key: 'nama_brand',
        },
        {
            title: 'Kategori',
            dataIndex: 'nama_kategori',
            key: 'nama_kategori',
            render: (text) => text || '-',
        },
        {
            title: 'Sub Kategori',
            dataIndex: 'nama_sub_kategori',
            key: 'nama_sub_kategori',
            render: (text) => text || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={status === 'Y' ? 'green' : 'red'}>
                    {status === 'Y' ? 'Aktif' : 'Tidak Aktif'}
                </Tag>
            ),
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        color="blue"
                        className="p-2"
                        onClick={() => handleEdit(record)}
                    >
                        <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        color="red"
                        className="p-2"
                        onClick={() => handleDelete(record.id_brand)}
                    >
                        <TrashIcon className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="mt-12 mb-8">
            <Card>
                <CardBody>
                    <div className="flex items-center justify-between mb-6">
                        <Typography variant="h5" color="blue-gray">
                            Daftar Brand
                        </Typography>
                        <Button
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600"
                            onClick={handleCreate}
                        >
                            <PlusIcon className="h-5 w-5" />
                            Tambah Brand
                        </Button>
                    </div>

                    <div className="mb-4">
                        <Input
                            placeholder="Cari brand..."
                            prefix={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-xs"
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredBrands}
                        loading={loading}
                        rowKey="id_brand"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} brand`,
                        }}
                    />
                </CardBody>
            </Card>

            {/* Modal Create/Edit - Modern & Clean Design */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
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
                            {modalMode === 'create' ? 'Tambah Brand Baru' : 'Edit Brand'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {modalMode === 'create' 
                                ? 'Isi data brand yang ingin ditambahkan' 
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
                                placeholder="Pilih kategori (opsional)"
                                value={idKategori || undefined}
                                onChange={(val) => setIdKategori(val)}
                                className="w-full"
                                size="large"
                                allowClear
                            >
                                <Option value="12">Elektronik</Option>
                                <Option value="13">Fashion</Option>
                                <Option value="14">Makanan</Option>
                            </Select>
                            <p className="text-xs text-gray-400 mt-1">
                                Kosongkan jika tidak terkait kategori tertentu
                            </p>
                        </div>

                        {/* Sub Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sub Kategori
                            </label>
                            <Select
                                placeholder="Pilih sub kategori (opsional)"
                                value={idSubKategori || undefined}
                                onChange={(val) => setIdSubKategori(val)}
                                className="w-full"
                                size="large"
                                allowClear
                            >
                                <Option value="20">Smartphone</Option>
                                <Option value="21">Laptop</Option>
                                <Option value="22">TV & Audio</Option>
                            </Select>
                        </div>

                        {/* Status (only for edit) */}
                        {modalMode === 'edit' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <Select
                                    value={status}
                                    onChange={(val) => setStatus(val)}
                                    className="w-full"
                                    size="large"
                                >
                                    <Option value="Y">
                                        <Tag color="green">Aktif</Tag>
                                    </Option>
                                    <Option value="T">
                                        <Tag color="red">Tidak Aktif</Tag>
                                    </Option>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200"
                            disabled={submitLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
                            disabled={submitLoading}
                        >
                            {submitLoading ? (
                                <Spin size="small" className="mr-2" />
                            ) : null}
                            {modalMode === 'create' ? 'Tambah Brand' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ListBrand;
