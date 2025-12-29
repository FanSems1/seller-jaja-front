import { PencilIcon, PlusIcon, TrashIcon, TruckIcon } from '@heroicons/react/24/solid';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Alert, Button, Cascader, Flex, Image, Input, Modal, Radio, Select, Space, Upload, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCT_ENDPOINTS, BRAND_ENDPOINTS, ETALASE_ENDPOINTS, CATEGORY_ENDPOINTS, apiFetch, API_BASE_URL } from '../../../configs/api';
import Swal from 'sweetalert2';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

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

    // Form states - semua field
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
    const [preOrder, setPreOrder] = useState('Tidak');
    const [draft, setDraft] = useState(false);
    const [statusProduk, setStatusProduk] = useState('aktif');
    const [tagProduk, setTagProduk] = useState('');
    const [variasiHarga, setVariasiHarga] = useState('');
    const [grosirMin1, setGrosirMin1] = useState('');
    const [grosirPrice1, setGrosirPrice1] = useState('');
    const [grosirMin2, setGrosirMin2] = useState('');
    const [grosirPrice2, setGrosirPrice2] = useState('');
    const [statusPilih, setStatusPilih] = useState('');
    const [sourceLinkScrab, setSourceLinkScrab] = useState('');

    // Toggle states
    const [diskonEnabled, setDiskonEnabled] = useState(false);
    const [grosirEnabled, setGrosirEnabled] = useState(false);

    // Variasi
    const [showCard, setShowCard] = useState(false);
    const [variasiList, setVariasiList] = useState([]);
    const [daftarVariasi, setDaftarVariasi] = useState([]);

    const [produk, setProduk] = useState(null);

    const tambahVariasi = () => {
        setVariasiList([...variasiList, {
        tipeVariasi: '',
        namaVariasi: ''
        }]);
    };

    const handleChangeVariasi = (index, field, value) => {
        const newList = [...variasiList];
        newList[index][field] = value;
        setVariasiList(newList);
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


            const selectBefore = (
                <Select value={beratUnit} onChange={(val) => setBeratUnit(val)}>
                  <Option value="Gram (g)">Gram (g)</Option>
                  <Option value="Kilogram (kg)">Kilogram (kg)</Option>
                </Select>
              );

    // Fetch brands and etalase
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

    // Handle category change to populate subcategories
    const handleCategoryChange = (value) => {
        setIdKategori(value);
        setIdSubKategori(''); // Reset sub category
        
        // Find selected category and get its children
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

            // Variasi sebagai JSON array string
            if (showCard && daftarVariasi.length > 0) {
                formData.append('variasi', JSON.stringify(daftarVariasi));
            }

            // Append foto_produk files (hanya yang baru)
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

    useEffect(() => {
        // Fetch brands and etalase
        fetchBrands();
        fetchEtalase();
        fetchCategories();

        // Fetch product detail
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
                    // Prefill semua field
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
                    setPreOrder(p.pre_order || 'Tidak');
                    setStatusProduk(p.status_produk || 'aktif');
                    setTagProduk(p.tag_produk || '');
                    setVariasiHarga(p.variasi_harga || '');
                    setGrosirMin1(p.grosir_min1 || '');
                    setGrosirPrice1(p.grosir_price1 || '');
                    setGrosirMin2(p.grosir_min2 || '');
                    setGrosirPrice2(p.grosir_price2 || '');
                    setStatusPilih(p.status_pilih || '');
                    setSourceLinkScrab(p.source_link_scrab || '');

                    // Set toggle states
                    setDiskonEnabled(p.diskon && p.diskon !== '' && p.diskon !== '0');
                    setGrosirEnabled((p.grosir_min1 && p.grosir_min1 !== '') || (p.grosir_price1 && p.grosir_price1 !== ''));

                    // Prefill fileList dengan foto yang sudah ada
                    if (p.foto && Array.isArray(p.foto)) {
                        const existingFiles = p.foto.map((f, idx) => ({
                            uid: `-existing-${idx}`,
                            name: f.foto_produk || `image-${idx}.jpg`,
                            status: 'done',
                            url: `${IMAGE_BASE}${f.foto_produk}`,
                        }));
                        setFileList(existingFiles);
                    }

                    // Prefill variasi
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

    // Populate subcategories when category changes or categoryList is loaded
    useEffect(() => {
        if (idKategori && categoryList.length > 0) {
            const selectedCategory = categoryList.find(cat => cat.id_kategori === parseInt(idKategori));
            if (selectedCategory && selectedCategory.children) {
                setSubCategoryList(selectedCategory.children);
            }
        }
    }, [idKategori, categoryList]);

  return (
    <div className=" mb-8 ">
      {loading && <Spin size="large" fullscreen />}
      <Card>
           <h1 className="pl-5 pt-5 text-2xl font-bold text-start">
          EDIT PRODUK
        </h1>
        <hr className="mt-5" />
            <CardBody>
                    {/* Kategori */}
                   <>
                    <div>
                            <h1 className='text-xl font-semibold mb-4'>
                                Pilih Kategori
                            </h1>
                            <hr />
                           <div className='w-full flex space-x-5 mt-5'>
                                <div className='sm:w-1/4 w-full'>
                                    <label className='mb-2 text-lg'>Kategori <span className='text-red-500'>*</span></label>
                                    <Select
                                        showSearch
                                        className="w-full mt-2 h-10"
                                        placeholder="Pilih kategori"
                                        value={idKategori || undefined}
                                        onChange={handleCategoryChange}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                          }
                                          filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                          }
                                        allowClear
                                    >
                                        {categoryList.map((cat) => (
                                            <Option key={cat.id_kategori} value={cat.id_kategori}>
                                                {cat.kategori}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className='sm:w-1/4 w-full'>
                                    <label className='mb-2 text-lg'>Sub Kategori</label>
                                    <Select
                                        showSearch  
                                        className="w-full mt-2 h-10"
                                        placeholder="Pilih sub kategori"
                                        value={idSubKategori || undefined}
                                        onChange={(val) => setIdSubKategori(val)}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                          }
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
                        </div>
                   </>
            </CardBody>
        </Card>

        <br />
        {/* Informasi Produk */}
       <>
       <Card>
            <CardBody>
                <>
                    <div>
                        <h1 className='text-xl font-semibold mb-4'>
                            Informasi Produk
                        </h1>
                        <hr />
                    </div>

                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Nama Produk <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <Input className='h-10' showCount maxLength={100} value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} placeholder="Anker Soundcore Nano Speaker Bluetooth Original" />
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Deskripsi Produk <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <TextArea className='h-52' showCount maxLength={5000} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Anker Soundcore Nano Speaker Bluetooth Original" />
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Brand <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                                    <Select
                                        showSearch
                                        allowClear
                                        className="w-full  h-10"
                                        placeholder="Pilih brand"
                                        value={merek}
                                        onChange={(val) => setMerek(val)}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                          }
                                          filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                          }
                                    >
                                        {brandList.map(brand => (
                                            <Option key={brand.id_brand} value={brand.id_brand}>
                                                {brand.nama_brand}
                                            </Option>
                                        ))}
                                    </Select>
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Asal Produk <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                                    <Select
                                        showSearch
                                        className="w-full  h-10"
                                        placeholder="Pilih kategori"
                                        value={asalProduk}
                                        onChange={(val) => setAsalProduk(val)}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                          }
                                          filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                          }
                                    >
                                        <Option value={4}>Dalam Negeri</Option>
                                        <Option value={5}>Luar Negeri</Option>
                                    </Select>
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Kategori Toko <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                                    <Select
                                        showSearch
                                        allowClear
                                        className="w-full  h-10"
                                        placeholder="Pilih etalase"
                                        value={etalase}
                                        onChange={(val) => setEtalase(val)}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                          }
                                          filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                          }
                                    >
                                        {etalaseList.map(et => (
                                            <Option key={et.id_etalase} value={et.id_etalase}>
                                                {et.nama_etalase || et.slug_etalase}
                                            </Option>
                                        ))}
                                    </Select>
                        </div>
                    </div>
                </>
            </CardBody>
        </Card>       
       </>


        <br />
        {/* Informasi Penjualan */}
        <>
        <Card>
            <CardBody>
                <>
                    <div>
                        <h1 className='text-xl font-semibold mb-4'>
                            Informasi Penjualan
                        </h1>
                        <hr />
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Pre-Order <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                                    <Select
                                        showSearch
                                        className="w-full  h-10"
                                        placeholder="Pilih kategori"
                                        value={preOrder}
                                        onChange={(val) => setPreOrder(val)}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                          }
                                          filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                          }
                                    >
                                        <Option value="Ya">Ya</Option>
                                        <Option value="Tidak">Tidak</Option>
                                    </Select>
                                    <p>
                                        <i className='text-red-500 text-sm'>*Kirimkan produk dalam 2 hari (tidak termasuk hari Sabtu, Minggu, libur nasional dan non-operasional jasa kirim).</i>
                                    </p>
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Kondisi Produk <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <Radio.Group onChange={onChangeKondisi} value={kondisi}>
                                <Radio value="baru">Baru</Radio>
                                <Radio value="bekas">Bekas</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Kode SKU <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <Input className='h-10' value={kodeSku} onChange={(e) => setKodeSku(e.target.value)} placeholder='1212211221' />
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Harga Satuan <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <Input type='number' addonBefore="Rp." value={harga} onChange={(e) => setHarga(e.target.value)} placeholder='5000'/>
                            <p className='text-gray-400 text-sm'>
                                <i>
                                Hanya berisi angka (0-9)
                                </i>
                            </p>
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Stok Produk <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <Input type='number' className='h-10' value={stok} onChange={(e) => setStok(e.target.value)} placeholder='100' />
                             <p className='text-gray-400 text-sm'>
                                <i>
                                Hanya berisi angka (0-9)
                                </i>
                            </p>
                        </div>
                    </div>

                    {/* Tag Produk */}
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Tag Produk</label>
                        </div>
                        <div className='w-full'>
                            <Input className='h-10' value={tagProduk} onChange={(e) => setTagProduk(e.target.value)} placeholder='tag1, tag2, tag3' />
                            <p className='text-gray-400 text-sm'><i>Pisahkan dengan koma</i></p>
                        </div>
                    </div>

                    {/* Status Produk */}
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Status Produk</label>
                        </div>
                        <div className='w-full'>
                            <Select
                                className="w-full h-10"
                                value={statusProduk}
                                onChange={(val) => setStatusProduk(val)}
                            >
                                <Option value="aktif">Aktif</Option>
                                <Option value="tidak_aktif">Tidak Aktif</Option>
                            </Select>
                        </div>
                    </div>

                    {/* Draft */}
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Simpan sebagai Draft?</label>
                        </div>
                        <div className='w-full'>
                            <Radio.Group onChange={(e) => setDraft(e.target.value === 'true')} value={draft ? 'true' : 'false'}>
                                <Radio value="true" className='text-lg'>Ya</Radio>
                                <Radio value="false" className='text-lg'>Tidak</Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    {/* Diskon Toggle */}
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Aktifkan Diskon?</label>
                        </div>
                        <div className='w-full'>
                            <Radio.Group onChange={(e) => {
                                setDiskonEnabled(e.target.value === 'ya');
                                if (e.target.value === 'tidak') setDiskon('');
                            }} value={diskonEnabled ? 'ya' : 'tidak'}>
                                <Radio value="ya" className='text-lg'>Ya</Radio>
                                <Radio value="tidak" className='text-lg'>Tidak</Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    {/* Diskon Input - Conditional */}
                    {diskonEnabled && (
                        <div className='w-full flex mt-8'>
                            <div className='w-1/3 text-lg'>
                                <label>Diskon (%)</label>
                            </div>
                            <div className='w-full'>
                                <Input type='number' className='h-10' value={diskon} onChange={(e) => setDiskon(e.target.value)} placeholder='10' />
                                <p className='text-gray-400 text-sm'><i>Masukkan persentase diskon (0-100)</i></p>
                            </div>
                        </div>
                    )}

                    {/* Grosir Toggle */}
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Aktifkan Harga Grosir?</label>
                        </div>
                        <div className='w-full'>
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
                                <Radio value="ya" className='text-lg'>Ya</Radio>
                                <Radio value="tidak" className='text-lg'>Tidak</Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    {/* Grosir Inputs - Conditional */}
                    {grosirEnabled && (
                        <>
                            <div className='w-full flex mt-8'>
                                <div className='w-1/3 text-lg'>
                                    <label>Grosir 1 - Min. Pembelian</label>
                                </div>
                                <div className='w-full'>
                                    <Input type='number' className='h-10' value={grosirMin1} onChange={(e) => setGrosirMin1(e.target.value)} placeholder='10' />
                                </div>
                            </div>
                            <div className='w-full flex mt-8'>
                                <div className='w-1/3 text-lg'>
                                    <label>Grosir 1 - Harga</label>
                                </div>
                                <div className='w-full'>
                                    <Input type='number' addonBefore="Rp." value={grosirPrice1} onChange={(e) => setGrosirPrice1(e.target.value)} placeholder='9000' />
                                </div>
                            </div>
                            <div className='w-full flex mt-8'>
                                <div className='w-1/3 text-lg'>
                                    <label>Grosir 2 - Min. Pembelian</label>
                                </div>
                                <div className='w-full'>
                                    <Input type='number' className='h-10' value={grosirMin2} onChange={(e) => setGrosirMin2(e.target.value)} placeholder='50' />
                                </div>
                            </div>
                            <div className='w-full flex mt-8'>
                                <div className='w-1/3 text-lg'>
                                    <label>Grosir 2 - Harga</label>
                                </div>
                                <div className='w-full'>
                                    <Input type='number' addonBefore="Rp." value={grosirPrice2} onChange={(e) => setGrosirPrice2(e.target.value)} placeholder='8000' />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Status Pilih */}
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Status Pilih</label>
                        </div>
                        <div className='w-full'>
                            <Input className='h-10' value={statusPilih} onChange={(e) => setStatusPilih(e.target.value)} placeholder='Status pilih' />
                        </div>
                    </div>

                    {/* Source Link Scrab */}
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Source Link Scrab</label>
                        </div>
                        <div className='w-full'>
                            <Input className='h-10' value={sourceLinkScrab} onChange={(e) => setSourceLinkScrab(e.target.value)} placeholder='https://example.com/product' />
                            <p className='text-gray-400 text-sm'><i>URL sumber produk</i></p>
                        </div>
                    </div>
                    
                        <div>
                            <div className='w-full flex mt-8'>
                                <div className='w-1/3 text-lg'>
                                    <label>Variasi Produk</label>
                                </div>
                                <div className='w-full'>
                                    <Button 
                                        className={`w-full h-10 bg-${showCard ? 'red' : 'blue'}-500 text-white rounded-md`}
                                        onClick={handleButtonClick}
                                    >
                                        {showCard ? 'Batalkan Variasi Harga' : 'Aktifkan Variasi Harga'}
                                    </Button>
                                </div>
                            </div>
                            {showCard && (
                                <div >
                                    <div className='mt-4 p-4 border rounded shadow'>
                                    <Button className='w-full h-10 bg-blue-500  text-white' onClick={tambahVariasi}>+ Tambah Variasi</Button>
                                    {variasiList.map((variasi, index) => (
                                        <div key={index} className='w-full mt-5'>
                                       <div className='w-full flex'>
                                       <div className='w-1/3'>
                                            <label className='text-lg'>Tipe Variasi</label>
                                        </div>
                                        <div className='w-full'>
                                            <Select
                                            className="w-full h-10"
                                            value={variasi.tipeVariasi}
                                            onChange={(val) => handleChangeVariasi(index, 'tipeVariasi', val)}
                                            name="tipeVariasi"
                                            >
                                            <Option value="">Pilih kategori</Option>
                                            <Option value="Model">Model</Option>
                                            <Option value="Warna">Warna</Option>
                                            <Option value="Ukuran">Ukuran</Option>
                                            </Select>
                                        </div>
                                       </div>
                                       <div className='w-full flex'>
                                       <div className='w-1/3'>
                                            <label className='text-lg'>Nama Variasi</label>
                                        </div>
                                        <div className='w-full mt-2'>
                                            <Input
                                            className='h-10'
                                            type="text"
                                            value={variasi.namaVariasi}
                                            onChange={(e) => handleChangeVariasi(index, 'namaVariasi', e.target.value)}
                                            name="namaVariasi"
                                            placeholder='Masukkan nama variasi sesuai tipe, Contoh: Biru'
                                            />
                                        </div>
                                       </div>
                                        </div>
                                    ))}
                                    
                                    </div>

                                    <div className='mt-4 p-4 border rounded shadow'>
                                        <h1 className='text-lg font-bold'>
                                            Daftar Variasi
                                        </h1>
                                        <div className='mt-4'>
                                            <table className="w-full table-auto ">
                                                 <thead>
                                                    <tr >
                                                        <th className="border px-4 py-2">Variasi</th>
                                                        <th className="border px-4 py-2">Harga</th>
                                                        <th className="border px-4 py-2">Stok</th>
                                                        <th className="border px-4 py-2">Kode SKU</th>
                                                        <th className="border px-4 py-2">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border px-4 py-2">
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <div>
                                                                <Input type='number' addonBefore="Rp." placeholder='5000'/>
                                                            </div>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <div>
                                                                <Input type='number'  placeholder='5000'/>
                                                            </div>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <div>
                                                                <Input type='number'  placeholder='5000'/>
                                                            </div>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <div className='flex space-x-2 justify-center items-center'>
                                                                <TrashIcon className='w-5 h-5'/>
                                                                <PencilIcon className='w-5 h-5'/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    
                </>
            </CardBody>
        </Card>
        </>

        <br />
        {/* Foto Produk */}
        <>
        <Card>
            <CardBody>
                
                    <div>
                        <h1 className='text-xl font-semibold mb-4'>
                            Foto Produk
                        </h1>
                        <hr />

                        <Alert className='h-14 p-5' 
                        message={
                            [
                                <div>
                                    <div className='text-base'>
                                        <b>Info</b> : Gunakan foto yang memiliki kecerahan cukup, disarankan untuk mengatur bagian foto yang ingin di crop. 
                                    </div>
                                </div>
                            ]
                        }
                        type="warning" 
                        />
                    </div>

                    {/* Upload */}
                    <div className='mt-10 flex justify-center'>
                    <>
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
                        </>
                    </div>
                    
            </CardBody>
        </Card>
        </>


        <br />
        {/* Pengiriman */}
        <>
        <Card>
            <CardBody>
                
                    <div>
                        <h1 className='text-xl font-semibold mb-4'>
                            Pengiriman
                        </h1>
                        <hr />
                    </div>

                    <div className='mt-4'>
                        <div className='w-full flex'>
                            <div className='w-1/3'>
                                <label> Berat <span className='text-red-500'>*</span></label>
                            </div>
                            <div className='w-full'>
                                <Space direction="vertical">
                                     <Input type='number' className='h-10' addonBefore={selectBefore} value={berat} onChange={(e) => setBerat(e.target.value)} />
                                </Space>
                                <p>
                                Hanya berisi angka (0-9)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className='w-full flex'>
                            <div className='w-1/3'>
                                <label> Ukuran <span className='text-red-500'>*</span> </label>
                            </div>
                            <div className='w-full'>
                               <div className='w-full flex space-x-2'>
                                    <Input type='number' className='h-10' addonAfter="cm" value={ukuranPaketPanjang} onChange={(e) => setUkuranPaketPanjang(e.target.value)} />
                                    <Input type='number' className='h-10' addonAfter="cm" value={ukuranPaketLebar} onChange={(e) => setUkuranPaketLebar(e.target.value)} />
                                    <Input type='number' className='h-10' addonAfter="cm" value={ukuranPaketTinggi} onChange={(e) => setUkuranPaketTinggi(e.target.value)} />
                                </div>                          
                            </div>
                           
                        </div>
                    </div>
                    
            </CardBody>
        </Card>
        </>

        {/* Button */}
        <br />
        <>
        <div className='w-full flex space-x-2 justify-end items-end'>
            <Button className='h-14 bg-blue-gray-300 text-gray-800 text-lg' onClick={() => handleSubmit(true)} disabled={loading}>
                Simpan Sebagai Draft
            </Button>
            <Button className='h-14 bg-blue-500 text-white text-lg' onClick={() => handleSubmit(false)} disabled={loading}>
                Simpan dan Tampilkan
            </Button>
        </div>
        </>
    </div>
  )
}

export default EditProduk
