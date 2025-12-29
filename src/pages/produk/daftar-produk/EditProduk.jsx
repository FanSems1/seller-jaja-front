import { PencilIcon, PlusIcon, TrashIcon, TruckIcon } from '@heroicons/react/24/solid';
import { Card, CardBody } from '@material-tailwind/react';
import { Alert, Button, Image, Input, Modal, Radio, Select, Space, Upload, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCT_ENDPOINTS, BRAND_ENDPOINTS, ETALASE_ENDPOINTS, CATEGORY_ENDPOINTS, apiFetch, API_BASE_URL } from '../../../configs/api';
import Swal from 'sweetalert2';

const { Option } = Select;
const IMAGE_BASE = `${API_BASE_URL}/uploads/produk/`;

function EditProduk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dropdown data
    const [brandList, setBrandList] = useState([]);
    const [etalaseList, setEtalaseList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);

    // Form states
    const [idKategori, setIdKategori] = useState('');
    const [idSubKategori, setIdSubKategori] = useState('');
    const [namaProduk, setNamaProduk] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [merek, setMerek] = useState('');
    const [kodeSku, setKodeSku] = useState('');
    const [berat, setBerat] = useState('');
    const [beratUnit, setBeratUnit] = useState('Gram (g)');
    const [ukuranPaketPanjang, setUkuranPaketPanjang] = useState('');
    const [ukuranPaketLebar, setUkuranPaketLebar] = useState('');
    const [ukuranPaketTinggi, setUkuranPaketTinggi] = useState('');
    const [asalProduk, setAsalProduk] = useState('');
    const [etalase, setEtalase] = useState('');
    const [harga, setHarga] = useState('');
    const [diskon, setDiskon] = useState('');
    const [stok, setStok] = useState('');
    const [kondisi, setKondisi] = useState('baru');
    const [masaPengemasan, setMasaPengemasan] = useState('');
    const [preOrder, setPreOrder] = useState('T');
    const [draft, setDraft] = useState(false);
    const [statusProduk, setStatusProduk] = useState('aktif');
    const [tagProduk, setTagProduk] = useState('');
    const [variasiHarga, setVariasiHarga] = useState('T');
    const [grosirMin1, setGrosirMin1] = useState('');
    const [grosirPrice1, setGrosirPrice1] = useState('');
    const [grosirMin2, setGrosirMin2] = useState('');
    const [grosirPrice2, setGrosirPrice2] = useState('');
    const [statusPilih, setStatusPilih] = useState('T');
    const [sourceLinkScrab, setSourceLinkScrab] = useState('default');

    // Toggle states
    const [diskonEnabled, setDiskonEnabled] = useState(false);
    const [grosirEnabled, setGrosirEnabled] = useState(false);

    // Variasi
    const [showCard, setShowCard] = useState(false);
    const [variasiList, setVariasiList] = useState([]);
    const [daftarVariasi, setDaftarVariasi] = useState([]);

    const [produk, setProduk] = useState(null);

    // Modal states
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);

    // Upload Foto
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChanges = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusIcon />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    // Video upload
    const [errorMessage, setErrorMessage] = useState('');
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 60) {
                    setErrorMessage('Durasi video maksimal 60 detik');
                } else {
                    setErrorMessage('');
                }
            };
            video.src = URL.createObjectURL(file);
        }
    };

    const selectBefore = (
        <Select value={beratUnit} onChange={(val) => setBeratUnit(val)}>
            <Option value="Gram (g)">Gram (g)</Option>
            <Option value="Kilogram (kg)">Kilogram (kg)</Option>
        </Select>
    );

    const tambahVariasi = () => {
        setVariasiList([...variasiList, {
            tipeVariasiList: [{ tipe: '', nama: '' }], // Multi tipe-nama
            harga: '',
            stok: '',
            sku: '',
            images: [], // Multi images
            imagePreviews: [] // Multi image previews
        }]);
    };

    const handleChangeVariasi = (index, field, value) => {
        const newList = [...variasiList];
        newList[index][field] = value;
        setVariasiList(newList);
    };

    // Handle tambah tipe-nama baru dalam satu variasi
    const handleAddTipeNama = (variasiIndex) => {
        const newList = [...variasiList];
        newList[variasiIndex].tipeVariasiList.push({ tipe: '', nama: '' });
        setVariasiList(newList);
    };

    // Handle hapus tipe-nama
    const handleRemoveTipeNama = (variasiIndex, tipeIndex) => {
        const newList = [...variasiList];
        if (newList[variasiIndex].tipeVariasiList.length > 1) {
            newList[variasiIndex].tipeVariasiList.splice(tipeIndex, 1);
            setVariasiList(newList);
        }
    };

    // Handle change tipe atau nama dalam tipeVariasiList
    const handleChangeTipeNama = (variasiIndex, tipeIndex, field, value) => {
        const newList = [...variasiList];
        newList[variasiIndex].tipeVariasiList[tipeIndex][field] = value;
        setVariasiList(newList);
    };

    const handleVariasiImageChange = (index, files) => {
        const newList = [...variasiList];
        if (files && files.length > 0) {
            const newImages = [];
            const newPreviews = [];
            
            Array.from(files).forEach(file => {
                newImages.push(file);
                
                // Create preview URL
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    if (newPreviews.length === files.length) {
                        newList[index].images = [...newList[index].images, ...newImages];
                        newList[index].imagePreviews = [...newList[index].imagePreviews, ...newPreviews];
                        setVariasiList([...newList]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Handle remove single image from variasi
    const handleRemoveVariasiImage = (variasiIndex, imageIndex) => {
        const newList = [...variasiList];
        newList[variasiIndex].images.splice(imageIndex, 1);
        newList[variasiIndex].imagePreviews.splice(imageIndex, 1);
        setVariasiList([...newList]);
    };

    const handleButtonClick = () => {
        setShowCard(!showCard);
    };

    const onChangeKondisi = e => {
        setKondisi(e.target.value);
    };

    const onChangePreOrder = e => {
        setPreOrder(e.target.value);
    };

    // Modal handlers
    const showModal = () => setIsModalVisible(true);
    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => setIsModalVisible(false);

    const showModal2 = () => setIsModalVisible2(true);
    const handleOk2 = () => setIsModalVisible2(false);
    const handleCancel2 = () => setIsModalVisible2(false);

    // Fetch functions
    const fetchBrands = async () => {
        try {
            const res = await apiFetch(BRAND_ENDPOINTS.LIST);
            if (res.success && res.brands) {
                setBrandList(res.brands);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchEtalase = async () => {
        try {
            const res = await apiFetch(ETALASE_ENDPOINTS.LIST);
            if (res.success && res.etalase) {
                setEtalaseList(res.etalase);
            }
        } catch (error) {
            console.error('Error fetching etalase:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORY_ENDPOINTS.MEGA_MENU);
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategoryList(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle category change
    const handleCategoryChange = (value) => {
        setIdKategori(value);
        setIdSubKategori('');
        const selectedCategory = categoryList.find(cat => cat.id_kategori === value);
        if (selectedCategory && selectedCategory.children) {
            setSubCategoryList(selectedCategory.children);
        } else {
            setSubCategoryList([]);
        }
    };

    // Submit handler
    const handleSubmit = async (isDraft = false) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('nama_produk', namaProduk);
            formData.append('id_kategori', idKategori);
            formData.append('id_sub_kategori', idSubKategori);
            formData.append('deskripsi', deskripsi);
            formData.append('merek', merek);
            formData.append('kode_sku', kodeSku);
            formData.append('berat', berat);
            formData.append('ukuran_paket_panjang', ukuranPaketPanjang);
            formData.append('ukuran_paket_lebar', ukuranPaketLebar);
            formData.append('ukuran_paket_tinggi', ukuranPaketTinggi);
            formData.append('asal_produk', asalProduk);
            formData.append('etalase', etalase);
            formData.append('harga', harga);
            formData.append('diskon', diskon);
            formData.append('stok', stok);
            formData.append('kondisi', kondisi);
            formData.append('masa_pengemasan', masaPengemasan);
            formData.append('pre_order', preOrder);
            formData.append('draft', isDraft ? '1' : '0');
            formData.append('status_produk', statusProduk);
            formData.append('tag_produk', tagProduk);
            formData.append('variasi_harga', variasiHarga);
            formData.append('grosir_min1', grosirMin1);
            formData.append('grosir_price1', grosirPrice1);
            formData.append('grosir_min2', grosirMin2);
            formData.append('grosir_price2', grosirPrice2);
            formData.append('status_pilih', statusPilih);
            formData.append('source_link_scrab', sourceLinkScrab);

            if (showCard && daftarVariasi.length > 0) {
                formData.append('variasi', JSON.stringify(daftarVariasi));
            }

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('foto_produk[]', file.originFileObj);
                }
            });

            const res = await apiFetch(PRODUCT_ENDPOINTS.UPDATE(id), {
                method: 'PATCH',
                body: formData,
            });

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Produk berhasil diupdate!',
                }).then(() => {
                    navigate('/dashboard/produk/daftar-produk');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: res.message || 'Gagal mengupdate produk',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Terjadi kesalahan',
            });
        } finally {
            setLoading(false);
        }
    };

    // useEffect untuk fetch data
    useEffect(() => {
        fetchBrands();
        fetchEtalase();
        fetchCategories();
    }, []);

    // useEffect untuk fetch product detail
    useEffect(() => {
        if (!id) return;
        let abort = false;
        const fetchDetail = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await apiFetch(PRODUCT_ENDPOINTS.DETAIL(id));
                if (abort) return;
                if (res.success && res.produk) {
                    const p = res.produk;
                    setProduk(p);
                    setNamaProduk(p.nama_produk || '');
                    setIdKategori(p.id_kategori || '');
                    setIdSubKategori(p.id_sub_kategori || '');
                    setDeskripsi(p.deskripsi || '');
                    setMerek(p.merek || '');
                    setKodeSku(p.kode_sku || '');
                    setBerat(p.berat || '');
                    setUkuranPaketPanjang(p.ukuran_paket_panjang || '');
                    setUkuranPaketLebar(p.ukuran_paket_lebar || '');
                    setUkuranPaketTinggi(p.ukuran_paket_tinggi || '');
                    setAsalProduk(p.asal_produk || '');
                    setEtalase(p.etalase || '');
                    setHarga(p.harga || '');
                    setDiskon(p.diskon || '');
                    setStok(p.stok || '');
                    setKondisi(p.kondisi || 'baru');
                    setMasaPengemasan(p.masa_pengemasan || '');
                    setPreOrder(p.pre_order || 'T');
                    setStatusProduk(p.status_produk || 'aktif');
                    setTagProduk(p.tag_produk || '');
                    setVariasiHarga(p.variasi_harga || 'T');
                    
                    // Handle grosir object structure
                    if (p.grosir) {
                        setGrosirMin1(p.grosir.min1 || '');
                        setGrosirPrice1(p.grosir.price1 || '');
                        setGrosirMin2(p.grosir.min2 || '');
                        setGrosirPrice2(p.grosir.price2 || '');
                        setGrosirEnabled((p.grosir.min1 && p.grosir.min1 !== 0) || (p.grosir.price1 && p.grosir.price1 !== 0));
                    }
                    
                    setStatusPilih(p.status_pilih || 'T');
                    setSourceLinkScrab(p.source_link_scrab || 'default');

                    setDiskonEnabled(p.diskon && p.diskon !== '' && p.diskon !== '0' && p.diskon !== 0);

                    // Handle foto with correct structure (url instead of foto_produk)
                    if (p.foto && Array.isArray(p.foto)) {
                        const existingFiles = p.foto.map((f, idx) => ({
                            uid: `-existing-${idx}`,
                            name: `image-${idx}.jpg`,
                            status: 'done',
                            url: `${API_BASE_URL}${f.url}`,
                        }));
                        setFileList(existingFiles);
                    }

                    // Handle variasi with correct structure
                    if (p.variasi && Array.isArray(p.variasi) && p.variasi.length > 0) {
                        setDaftarVariasi(p.variasi);
                        setShowCard(true);
                    }
                } else {
                    setError(res.message || 'Gagal memuat detail produk');
                }
            } catch (e) {
                if (!abort) setError(e.message || 'Gagal memuat detail produk');
            } finally {
                if (!abort) setLoading(false);
            }
        };
        fetchDetail();
        return () => { abort = true; };
    }, [id]);

    // useEffect untuk populate subcategories
    useEffect(() => {
        if (idKategori && categoryList.length > 0) {
            const selectedCategory = categoryList.find(cat => cat.id_kategori === parseInt(idKategori));
            if (selectedCategory && selectedCategory.children) {
                setSubCategoryList(selectedCategory.children);
            }
        }
    }, [idKategori, categoryList]);

    return (
        <div className="mb-8">
            <style>{`
                .swal-no-hover:hover {
                    background-color: #10b981 !important;
                }
            `}</style>
            {loading && <Spin size="large" fullscreen />}

            {/* Header */}
            <Card>
                <h1 className="pl-5 pt-5 text-2xl font-bold text-start">
                    EDIT PRODUK
                </h1>
                <hr className="mt-5" />
                <CardBody className="p-5">
                    {/* Kategori */}
                    <div className='mb-3'>
                        <h1 className='text-base font-semibold text-gray-800'>
                            Pilih Kategori
                        </h1>
                        <hr className='mt-2' />
                    </div>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-3 max-w-2xl'>
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Kategori <span className='text-red-500'>*</span></label>
                            <Select
                                showSearch
                                className="w-full"
                                placeholder="Pilih kategori"
                                value={idKategori || undefined}
                                onChange={handleCategoryChange}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                                size="middle"
                                allowClear
                            >
                                {categoryList.map((cat) => (
                                    <Option key={cat.id_kategori} value={cat.id_kategori}>
                                        {cat.kategori}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Sub Kategori</label>
                            <Select
                                showSearch
                                className="w-full"
                                placeholder="Pilih sub kategori"
                                value={idSubKategori || undefined}
                                onChange={(val) => setIdSubKategori(val)}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                size="middle"
                                allowClear
                                disabled={!idKategori || subCategoryList.length === 0}
                            >
                                {subCategoryList.map((subCat) => (
                                    <Option key={subCat.id_kategori} value={subCat.id_kategori}>
                                        {subCat.kategori}
                                    </Option>
                                ))}
                            </Select>
                            <p className='text-xs text-gray-400 mt-1'>
                                <i>Pilih kategori terlebih dahulu</i>
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <br />
            {/* Informasi Produk */}
            <Card>
                <CardBody className="p-5">
                    <div className='mb-3'>
                        <h1 className='text-base font-semibold text-gray-800'>
                            Informasi Produk
                        </h1>
                        <hr className='mt-2' />
                    </div>

                    <div className='grid grid-cols-4 gap-x-4 gap-y-3'>
                        {/* Nama Produk */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Nama Produk <span className='text-red-500'>*</span></label>
                            <Input
                                size="middle"
                                showCount
                                maxLength={100}
                                value={namaProduk}
                                onChange={(e) => setNamaProduk(e.target.value)}
                                placeholder="Nama produk"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Brand <span className='text-red-500'>*</span></label>
                            <Select
                                showSearch
                                className="w-full"
                                placeholder="Pilih brand"
                                value={merek}
                                onChange={(val) => setMerek(val)}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                allowClear
                                size="middle"
                            >
                                {brandList.map(brand => (
                                    <Option key={brand.id_brand} value={brand.id_brand}>
                                        {brand.nama_brand}
                                    </Option>
                                ))}
                            </Select>
                            <p className='cursor-pointer text-blue-500 text-xs mt-1 hover:underline' onClick={showModal}>
                                + Usulkan Brand
                            </p>
                        </div>

                        {/* Asal Produk */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Asal Produk <span className='text-red-500'>*</span></label>
                            <Select
                                className="w-full"
                                placeholder="Pilih asal"
                                value={asalProduk || undefined}
                                onChange={(val) => setAsalProduk(val)}
                                size="middle"
                            >
                                <Option value={4}>Dalam Negeri</Option>
                                <Option value={5}>Luar Negeri</Option>
                            </Select>
                        </div>

                        {/* Etalase */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Etalase Toko</label>
                            <Select
                                showSearch
                                className="w-full"
                                placeholder="Pilih etalase"
                                value={etalase}
                                onChange={(val) => setEtalase(val)}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                allowClear
                                size="middle"
                            >
                                {etalaseList.map(et => (
                                    <Option key={et.id_etalase} value={et.id_etalase}>
                                        {et.nama_etalase || et.slug_etalase}
                                    </Option>
                                ))}
                            </Select>
                            <p className='cursor-pointer text-blue-500 text-xs mt-1 hover:underline' onClick={showModal2}>
                                + Tambah Etalase
                            </p>
                        </div>

                        {/* Deskripsi - Full Width */}
                        <div className='col-span-4'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Deskripsi Produk <span className='text-red-500'>*</span></label>
                            <TextArea
                                rows={4}
                                showCount
                                maxLength={5000}
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                placeholder="Deskripsi lengkap produk..."
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            <br />
            {/* Harga & Stok */}
            <Card>
                <CardBody className="p-5">
                    <div className='mb-3'>
                        <h1 className='text-base font-semibold text-gray-800'>
                            Harga & Stok
                        </h1>
                        <hr className='mt-2' />
                    </div>

                    <div className='grid grid-cols-4 gap-x-4 gap-y-3'>
                        {/* Harga */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Harga <span className='text-red-500'>*</span></label>
                            <Input
                                type='number'
                                size="middle"
                                addonBefore="Rp."
                                value={harga}
                                onChange={(e) => setHarga(e.target.value)}
                                placeholder='10000'
                            />
                        </div>

                        {/* Stok */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Stok <span className='text-red-500'>*</span></label>
                            <Input
                                type='number'
                                size="middle"
                                value={stok}
                                onChange={(e) => setStok(e.target.value)}
                                placeholder='100'
                            />
                        </div>

                        {/* SKU */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Kode SKU</label>
                            <Input
                                size="middle"
                                value={kodeSku}
                                onChange={(e) => setKodeSku(e.target.value)}
                                placeholder='SKU12345'
                            />
                            <p className='text-xs text-gray-500 mt-1'>Opsional</p>
                        </div>

                        {/* Masa Pengemasan */}
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Masa Pengemasan (hari)</label>
                            <Input
                                type='number'
                                size="middle"
                                value={masaPengemasan}
                                onChange={(e) => setMasaPengemasan(e.target.value)}
                                placeholder='3'
                            />
                        </div>

                        {/* Diskon Toggle */}
                        <div className='col-span-2'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Aktifkan Diskon?</label>
                            <Radio.Group
                                onChange={(e) => {
                                    setDiskonEnabled(e.target.value === 'ya');
                                    if (e.target.value === 'tidak') {
                                        setDiskon('');
                                    }
                                }}
                                value={diskonEnabled ? 'ya' : 'tidak'}
                            >
                                <Radio value="ya">Ya</Radio>
                                <Radio value="tidak">Tidak</Radio>
                            </Radio.Group>
                        </div>

                        {/* Diskon Input */}
                        {diskonEnabled && (
                            <div className='col-span-2'>
                                <label className='text-sm font-medium text-gray-700 block mb-1'>Diskon (%)</label>
                                <Input
                                    type='number'
                                    size="middle"
                                    addonAfter="%"
                                    value={diskon}
                                    onChange={(e) => setDiskon(e.target.value)}
                                    placeholder='10'
                                />
                            </div>
                        )}

                        {/* Kondisi */}
                        <div className='col-span-2'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Kondisi <span className='text-red-500'>*</span></label>
                            <Radio.Group onChange={onChangeKondisi} value={kondisi}>
                                <Radio value="baru">Baru</Radio>
                                <Radio value="bekas">Bekas</Radio>
                            </Radio.Group>
                        </div>

                        {/* Pre Order */}
                        <div className='col-span-2'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Pre Order</label>
                            <Radio.Group onChange={onChangePreOrder} value={preOrder}>
                                <Radio value="Y">Ya</Radio>
                                <Radio value="T">Tidak</Radio>
                            </Radio.Group>
                        </div>

                        {/* Grosir Toggle */}
                        <div className='col-span-4'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Aktifkan Harga Grosir?</label>
                            <Radio.Group
                                onChange={(e) => {
                                    setGrosirEnabled(e.target.value === 'ya');
                                    if (e.target.value === 'tidak') {
                                        setGrosirMin1('');
                                        setGrosirPrice1('');
                                        setGrosirMin2('');
                                        setGrosirPrice2('');
                                    }
                                }}
                                value={grosirEnabled ? 'ya' : 'tidak'}
                            >
                                <Radio value="ya">Ya</Radio>
                                <Radio value="tidak">Tidak</Radio>
                            </Radio.Group>
                        </div>

                        {/* Grosir Inputs */}
                        {grosirEnabled && (
                            <>
                                <div>
                                    <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 1 - Min. Pembelian</label>
                                    <Input
                                        type='number'
                                        size="middle"
                                        value={grosirMin1}
                                        onChange={(e) => setGrosirMin1(e.target.value)}
                                        placeholder='10'
                                    />
                                </div>
                                <div>
                                    <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 1 - Harga</label>
                                    <Input
                                        type='number'
                                        size="middle"
                                        addonBefore="Rp."
                                        value={grosirPrice1}
                                        onChange={(e) => setGrosirPrice1(e.target.value)}
                                        placeholder='9000'
                                    />
                                </div>
                                <div>
                                    <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 2 - Min. Pembelian</label>
                                    <Input
                                        type='number'
                                        size="middle"
                                        value={grosirMin2}
                                        onChange={(e) => setGrosirMin2(e.target.value)}
                                        placeholder='50'
                                    />
                                </div>
                                <div>
                                    <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 2 - Harga</label>
                                    <Input
                                        type='number'
                                        size="middle"
                                        addonBefore="Rp."
                                        value={grosirPrice2}
                                        onChange={(e) => setGrosirPrice2(e.target.value)}
                                        placeholder='8000'
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Variasi Produk */}
                    {showCard && (
                        <div className='mt-5'>
                            <div className='mb-3'>
                                <h1 className='text-base font-semibold text-gray-800'>
                                    Variasi Produk
                                </h1>
                                <hr className='mt-2' />
                            </div>
                            <div className='p-4 border rounded-lg bg-gray-50'>
                                <Button
                                    className='w-full !h-10 !bg-blue-500 !text-white !mb-4'
                                    onClick={tambahVariasi}
                                >
                                    + Tambah Variasi
                                </Button>

                                <div className='overflow-x-auto'>
                                    <table className="w-full table-auto text-sm border-collapse">
                                        <thead className='bg-gray-100'>
                                            <tr>
                                                <th className="border px-2 py-2 text-xs">Variasi (Tipe - Nama)</th>
                                                <th className="border px-2 py-2 text-xs">Foto</th>
                                                <th className="border px-2 py-2 text-xs">Harga</th>
                                                <th className="border px-2 py-2 text-xs">Stok</th>
                                                <th className="border px-2 py-2 text-xs">SKU</th>
                                                <th className="border px-2 py-2 text-xs">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variasiList.map((variasi, index) => (
                                                <tr key={index}>
                                                    <td className="border px-2 py-2">
                                                        <div className='space-y-2'>
                                                            {variasi.tipeVariasiList.map((tv, tipeIndex) => (
                                                                <div key={tipeIndex} className='flex gap-2 items-center'>
                                                                    <Select
                                                                        size="small"
                                                                        className="w-24"
                                                                        placeholder="Tipe"
                                                                        value={tv.tipe}
                                                                        onChange={(val) => handleChangeTipeNama(index, tipeIndex, 'tipe', val)}
                                                                    >
                                                                        <Option value="">Pilih</Option>
                                                                        <Option value="Model">Model</Option>
                                                                        <Option value="Warna">Warna</Option>
                                                                        <Option value="Ukuran">Ukuran</Option>
                                                                    </Select>
                                                                    <Input
                                                                        size="small"
                                                                        placeholder='Nama'
                                                                        className='flex-1'
                                                                        value={tv.nama}
                                                                        onChange={(e) => handleChangeTipeNama(index, tipeIndex, 'nama', e.target.value)}
                                                                    />
                                                                    {variasi.tipeVariasiList.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveTipeNama(index, tipeIndex)}
                                                                            className='text-red-500 hover:text-red-700 text-xs'
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <Button
                                                                size="small"
                                                                type="dashed"
                                                                className='w-full text-xs'
                                                                onClick={() => handleAddTipeNama(index)}
                                                            >
                                                                + Tambah Tipe
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="border px-2 py-2">
                                                        <div className='flex flex-wrap gap-1'>
                                                            {variasi.imagePreviews.map((preview, imgIndex) => (
                                                                <div key={imgIndex} className='relative'>
                                                                    <img 
                                                                        src={preview} 
                                                                        alt={`Variasi ${imgIndex + 1}`} 
                                                                        className='w-12 h-12 object-cover rounded border'
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveVariasiImage(index, imgIndex)}
                                                                        className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600'
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <label className='cursor-pointer'>
                                                                <div className='w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-blue-400'>
                                                                    <span className='text-xs text-gray-400'>+</span>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    className='hidden'
                                                                    onChange={(e) => {
                                                                        const files = e.target.files;
                                                                        if (files && files.length > 0) {
                                                                            handleVariasiImageChange(index, files);
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td className="border px-2 py-2">
                                                        <Input 
                                                            size="small" 
                                                            type='number' 
                                                            addonBefore="Rp" 
                                                            placeholder='5000'
                                                            value={variasi.harga}
                                                            onChange={(e) => handleChangeVariasi(index, 'harga', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2">
                                                        <Input 
                                                            size="small" 
                                                            type='number' 
                                                            placeholder='10'
                                                            value={variasi.stok}
                                                            onChange={(e) => handleChangeVariasi(index, 'stok', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2">
                                                        <Input 
                                                            size="small" 
                                                            placeholder='SKU'
                                                            value={variasi.sku}
                                                            onChange={(e) => handleChangeVariasi(index, 'sku', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-2">
                                                        <div className='flex space-x-2 justify-center'>
                                                            <TrashIcon 
                                                                className='w-4 h-4 cursor-pointer text-red-500 hover:text-red-700'
                                                                onClick={() => {
                                                                    const newList = variasiList.filter((_, i) => i !== index);
                                                                    setVariasiList(newList);
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {variasiList.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="border px-2 py-4 text-center text-gray-500 text-xs">
                                                        Belum ada variasi. Klik tombol "+ Tambah Variasi" untuk menambahkan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className='mt-4'>
                                    <h2 className='text-sm font-semibold text-gray-800 mb-2'>Daftar Variasi dari Database</h2>
                                    <table className="w-full table-auto border-collapse">
                                        <thead>
                                            <tr className='bg-gray-100'>
                                                <th className="border px-3 py-2 text-xs">No</th>
                                                <th className="border px-3 py-2 text-xs">Warna</th>
                                                <th className="border px-3 py-2 text-xs">Ukuran</th>
                                                <th className="border px-3 py-2 text-xs">Harga</th>
                                                <th className="border px-3 py-2 text-xs">Stok</th>
                                                <th className="border px-3 py-2 text-xs">Gambar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {daftarVariasi.map((v, i) => (
                                                <tr key={v.id || i}>
                                                    <td className="border px-2 py-2 text-xs text-center">{i + 1}</td>
                                                    <td className="border px-2 py-2 text-xs">{v.warna || '-'}</td>
                                                    <td className="border px-2 py-2 text-xs">{v.ukuran || '-'}</td>
                                                    <td className="border px-2 py-2 text-xs">Rp {v.harga?.toLocaleString('id-ID') || '0'}</td>
                                                    <td className="border px-2 py-2 text-xs text-center">{v.stok || 0}</td>
                                                    <td className="border px-2 py-2 text-center">
                                                        {v.image ? (
                                                            <img 
                                                                src={`${API_BASE_URL}${v.image}`} 
                                                                alt="Variasi" 
                                                                className="w-12 h-12 object-cover rounded mx-auto"
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">No image</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {daftarVariasi.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="border px-2 py-4 text-center text-gray-500 text-xs">
                                                        Belum ada variasi
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            <br />
            {/* Foto & Video Produk */}
            <Card>
                <CardBody className="p-5">
                    <div className='grid grid-cols-2 gap-6'>
                        {/* Foto Produk */}
                        <div>
                            <div className='mb-3'>
                                <h1 className='text-base font-semibold text-gray-800'>
                                    Foto Produk
                                </h1>
                                <hr className='mt-2' />
                            </div>
                            <Alert
                                className='text-xs p-3 mb-3'
                                message={<span><b>Info:</b> Gunakan foto yang memiliki kecerahan cukup, disarankan untuk mengatur bagian foto yang ingin di crop.</span>}
                                type="warning"
                            />
                            <div className='flex justify-center'>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChanges}
                                    beforeUpload={() => false}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{
                                            display: 'none',
                                        }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Video Produk */}
                        <div>
                            <div className='mb-3'>
                                <h1 className='text-base font-semibold text-gray-800'>
                                    Video Produk
                                </h1>
                                <hr className='mt-2' />
                            </div>
                            <Alert
                                className='text-xs p-3 mb-3'
                                message={<span><b>Info:</b> Durasi maksimal video 60 detik.</span>}
                                type="warning"
                            />
                            <Input size="middle" type="file" accept="video/*" onChange={handleVideoChange} />
                            {errorMessage && <div className="text-red-500 text-xs mt-2">{errorMessage}</div>}
                        </div>
                    </div>
                </CardBody>
            </Card>

            <br />
            {/* Pengiriman */}
            <Card>
                <CardBody className="p-5">
                    <div className='mb-3'>
                        <h1 className='text-base font-semibold text-gray-800'>
                            Pengiriman
                        </h1>
                        <div className='flex items-center gap-2 text-xs text-blue-600 mt-1'>
                            <TruckIcon className='w-4 h-4' />
                            <span>Ayo Aktifkan Program Gratis Ongkos Kirim Toko Mu !</span>
                        </div>
                        <hr className='mt-2' />
                    </div>

                    <div className='grid grid-cols-3 gap-x-6 gap-y-3'>
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Berat <span className='text-red-500'>*</span></label>
                            <Space direction="vertical" className="w-full">
                                <Input size="middle" type='number' addonBefore={selectBefore} value={berat} onChange={(e) => setBerat(e.target.value)} placeholder="500" />
                            </Space>
                            <p className='text-xs text-gray-500 mt-1'>Hanya berisi angka (0-9)</p>
                        </div>

                        <div className='col-span-2'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Ukuran Paket (P x L x T)</label>
                            <div className='flex gap-2'>
                                <Input size="middle" type='number' addonAfter="cm" placeholder='Panjang' value={ukuranPaketPanjang} onChange={(e) => setUkuranPaketPanjang(e.target.value)} />
                                <Input size="middle" type='number' addonAfter="cm" placeholder='Lebar' value={ukuranPaketLebar} onChange={(e) => setUkuranPaketLebar(e.target.value)} />
                                <Input size="middle" type='number' addonAfter="cm" placeholder='Tinggi' value={ukuranPaketTinggi} onChange={(e) => setUkuranPaketTinggi(e.target.value)} />
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>Hanya berisi angka (0-9)</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Button */}
            <br />
            <div className='w-full flex space-x-3 justify-end'>
                <Button size="large" className='bg-gray-300 text-gray-800' onClick={() => handleSubmit(true)} disabled={loading}>
                    Simpan Sebagai Draft
                </Button>
                <Button size="large" className='bg-blue-500 text-white' onClick={() => handleSubmit(false)} disabled={loading}>
                    Simpan dan Tampilkan
                </Button>
            </div>

            {/* Modal Usulkan Brand */}
            <Modal
                width={800}
                title={<div className='text-2xl font-bold'>Usulkan Brand</div>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={false}
            >
                <div>
                    <div className='w-full flex space-x-5 mt-5'>
                        <div className='w-1/3'>
                            <label className='mb-2 text-lg'>Kategori</label>
                        </div>
                        <div className='w-full'>
                            <Select
                                showSearch
                                className="w-full mt-2 h-10"
                                placeholder="Pilih kategori"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                <Option value="kategori1">Kategori 1</Option>
                                <Option value="kategori2">Kategori 2</Option>
                                <Option value="kategori3">Kategori 3</Option>
                            </Select>
                            <p>Kosongkan jika kategori tidak ditemukan</p>
                        </div>
                    </div>
                    <div className='w-full flex space-x-5 mt-5'>
                        <div className='w-1/3'>
                            <label className='mb-2 text-lg'>Nama Brand</label>
                        </div>
                        <div className='w-full'>
                            <Input className='h-10' placeholder='Masukkan Nama Brand' />
                            <p>Brand akan ditampilkan setelah disetujui</p>
                        </div>
                    </div>
                    <div className='w-full flex justify-end items-end space-x-2 mt-4'>
                        <Button className='h-10 text-lg bg-red-300 text-white' onClick={handleCancel}>Batal</Button>
                        <Button className='h-10 text-lg bg-blue-300 text-white'>Tambah</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal Tambah Etalase */}
            <Modal
                width={800}
                title={<div className='text-2xl font-bold'>Etalase Toko</div>}
                visible={isModalVisible2}
                onOk={handleOk2}
                onCancel={handleCancel2}
                footer={false}
            >
                <div>
                    <div className='w-full flex space-x-5 mt-5'>
                        <div className='w-1/3'>
                            <label className='mb-2 text-lg'>Nama Etalase</label>
                        </div>
                        <div className='w-full'>
                            <Input className='h-10' placeholder='Masukkan Nama Etalase' />
                            <p>Masukkan Nama Etalase</p>
                        </div>
                    </div>
                    <div className='w-full flex justify-end items-end space-x-2 mt-4'>
                        <Button className='h-10 text-lg bg-red-300 text-white' onClick={handleCancel2}>Batal</Button>
                        <Button className='h-10 text-lg bg-blue-300 text-white'>Tambah</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default EditProduk
