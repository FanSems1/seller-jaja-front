import { PencilIcon, PlusIcon, TrashIcon, TruckIcon } from '@heroicons/react/24/solid';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Alert, Button, Cascader, Flex, Image, Input, Modal, Radio, Select, Space, Upload, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ENDPOINTS, BRAND_ENDPOINTS, ETALASE_ENDPOINTS, CATEGORY_ENDPOINTS, apiFetch } from '../../configs/api';
import Swal from 'sweetalert2';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

const { Option } = Select;

function TambahProduk() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
  const [asalProduk, setAsalProduk] = useState('150'); // Default: Dalam Negeri
  const [etalase, setEtalase] = useState('');
  const [harga, setHarga] = useState('');
  const [diskon, setDiskon] = useState('');
  const [stok, setStok] = useState('');
  const [kondisi, setKondisi] = useState('baru');
  const [masaPengemasan, setMasaPengemasan] = useState('');
  const [preOrder, setPreOrder] = useState('T');
  const [draft, setDraft] = useState(false);
    const [statusProduk, setStatusProduk] = useState('live');
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
  // Daftar variasi final (warna, ukuran, harga, stok)
  const [daftarVariasi, setDaftarVariasi] = useState([]);

  // Fetch brands and etalase on mount
  useEffect(() => {
    fetchBrands();
    fetchEtalase();
    fetchCategories();
  }, []);

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


            // Upload Video 
            const [video, setVideo] = useState(null);
            const [errorMessage, setErrorMessage] = useState('');

            const handleVideoChange = (event) => {
                const selectedFile = event.target.files[0];
                const fileSizeLimit = 50 * 1024 * 1024; // 50 MB
                if (selectedFile && selectedFile.size > fileSizeLimit) {
                    setErrorMessage('File terlalu besar. Maksimum 50 MB.');
                } else {
                    setVideo(selectedFile);
                    setErrorMessage('');
                }
            };

            // Submit handler
            const handleSubmit = async (isDraft = false) => {
                // Prevent double submission
                if (loading) return;
                
                // Validasi field required
                if (!namaProduk || !idKategori || !merek || !harga || !stok || !berat || !asalProduk) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Perhatian',
                        text: 'Harap isi semua field yang wajib (Nama Produk, Kategori, Merek, Harga, Stok, Berat, Asal Produk)',
                        confirmButtonColor: '#10b981',
                        customClass: {
                            confirmButton: 'swal-no-hover'
                        }
                    });
                    return;
                }

                if (fileList.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Perhatian',
                        text: 'Harap upload minimal 1 foto produk',
                        confirmButtonColor: '#10b981',
                        customClass: {
                            confirmButton: 'swal-no-hover'
                        }
                    });
                    return;
                }
                
                setLoading(true);
                try {
                    const formData = new FormData();
                    
                    // Send exactly as Postman format - all as strings
                    formData.append('nama_produk', String(namaProduk));
                    formData.append('id_kategori', String(idKategori));
                    // If sub category not selected, send 0 as required by backend
                    formData.append('id_sub_kategori', String(idSubKategori || '0'));
                    formData.append('deskripsi', String(deskripsi || ''));
                    formData.append('merek', String(merek));
                    formData.append('kode_sku', String(kodeSku || ''));
                    formData.append('berat', String(berat));
                    formData.append('ukuran_paket_panjang', String(ukuranPaketPanjang || ''));
                    formData.append('ukuran_paket_lebar', String(ukuranPaketLebar || ''));
                    formData.append('ukuran_paket_tinggi', String(ukuranPaketTinggi || ''));
                    formData.append('asal_produk', String(asalProduk));
                    
                    // IMPORTANT: Send etalase NAME not ID (like Postman)
                    if (etalase) {
                        const selectedEtalase = etalaseList.find(et => et.id_etalase === etalase);
                        formData.append('etalase', selectedEtalase ? selectedEtalase.nama_etalase : '');
                    } else {
                        formData.append('etalase', '');
                    }
                    
                    formData.append('harga', String(harga));
                    formData.append('diskon', String(diskon || '0'));
                    formData.append('stok', String(stok));
                    formData.append('kondisi', String(kondisi));
                    formData.append('masa_pengemasan', String(masaPengemasan || ''));
                    formData.append('pre_order', String(preOrder));
                    formData.append('draft', isDraft ? 'Y' : 'T');
                    formData.append('status_produk', String(statusProduk));
                    formData.append('tag_produk', String(tagProduk || ''));
                    
                    // Tentukan variasi_harga berdasarkan grosir atau variasi
                    const hasVariasiHarga = (grosirEnabled && (grosirMin1 || grosirPrice1)) || (showCard && variasiList.length > 0) ? 'Y' : 'T';
                    formData.append('variasi_harga', hasVariasiHarga);
                    
                    formData.append('grosir_min1', String(grosirMin1 || ''));
                    formData.append('grosir_price1', String(grosirPrice1 || ''));
                    formData.append('grosir_min2', String(grosirMin2 || ''));
                    formData.append('grosir_price2', String(grosirPrice2 || ''));
                    formData.append('status_pilih', String(statusPilih));
                    formData.append('source_link_scrab', String(sourceLinkScrab || 'default'));

                    // Variasi sebagai JSON array string - dari variasiList yang diinput user
                    if (showCard && variasiList.length > 0) {
                        // Convert variasiList ke format yang sesuai dengan backend
                        const variasiData = variasiList.map(v => {
                            const item = {};
                            
                            // Loop through tipeVariasiList untuk support multi tipe-nama
                            v.tipeVariasiList.forEach(tv => {
                                // Convert tipe ke lowercase untuk match dengan backend
                                const tipeLower = tv.tipe.toLowerCase();
                                if (tipeLower === 'warna' && tv.nama) {
                                    item.warna = tv.nama;
                                }
                                if (tipeLower === 'ukuran' && tv.nama) {
                                    item.ukuran = tv.nama;
                                }
                                if (tipeLower === 'model' && tv.nama) {
                                    item.model = tv.nama;
                                }
                            });
                            
                            // Tambahkan harga_variasi - backend expect string
                            if (v.harga) {
                                item.harga_variasi = String(v.harga);
                            }
                            
                            // Stok wajib ada - backend expect string
                            item.stok = String(v.stok || '0');
                            
                            // SKU opsional
                            if (v.sku) {
                                item.sku = v.sku;
                            }
                            
                            return item;
                        });
                        formData.append('variasi', JSON.stringify(variasiData));
                    } else {
                        // Jika tidak ada variasi, kirim array kosong
                        formData.append('variasi', JSON.stringify([]));
                    }

                    // Append foto_produk files
                    fileList.forEach((file) => {
                        if (file.originFileObj) {
                            formData.append('foto_produk', file.originFileObj);
                        }
                    });

                    // Append variasi_image files (multiple images per variasi)
                    if (showCard && variasiList.length > 0) {
                        variasiList.forEach((variasi) => {
                            if (variasi.images && variasi.images.length > 0) {
                                variasi.images.forEach(image => {
                                    formData.append('variasi_image', image);
                                });
                            }
                        });
                    }

                    // Debug log
                    console.log('=== FORM DATA DEBUG ===');
                    console.log('Files:', fileList.length);
                    console.log('Variasi list:', variasiList);
                    console.log('Show card:', showCard);
                    
                    // DEBUG: Log all FormData entries before sending
                    for (let pair of formData.entries()) {
                      console.log(pair[0], pair[1]);
                    }

                    const res = await apiFetch(PRODUCT_ENDPOINTS.CREATE, {
                        method: 'POST',
                        body: formData,
                    });

                    if (res.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Produk berhasil ditambahkan!',
                            confirmButtonColor: '#10b981',
                            customClass: {
                                confirmButton: 'swal-no-hover'
                            }
                        }).then(() => {
                            navigate('/dashboard/produk/daftar-produk');
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: res.message || 'Gagal menambahkan produk',
                            confirmButtonColor: '#10b981',
                            customClass: {
                                confirmButton: 'swal-no-hover'
                            }
                        });
                    }
                } catch (error) {
                    console.error('Submit error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Terjadi kesalahan',
                        confirmButtonColor: '#10b981',
                        customClass: {
                            confirmButton: 'swal-no-hover'
                        }
                    });
                } finally {
                    setLoading(false);
                }
            };
            

// Modal Usulkan Brand
const [isModalVisible, setIsModalVisible] = useState(false);

const showModal = () => {
  setIsModalVisible(true);
};

const handleOk = () => {
  setIsModalVisible(false);
};

const handleCancel = () => {
  setIsModalVisible(false);
};

// Modal Usulkan Etalase Toko
const [isModalVisible2, setIsModalVisible2] = useState(false);

const showModal2 = () => {
  setIsModalVisible2(true);
};

const handleOk2 = () => {
  setIsModalVisible2(false);
};

const handleCancel2 = () => {
  setIsModalVisible2(false);
};

  return (
   <div className=" mb-8 ">
     <style>{`
       .swal-no-hover {
         background-color: #10b981 !important;
       }
       .swal-no-hover:hover {
         background-color: #10b981 !important;
       }
       .swal-no-hover:focus {
         background-color: #10b981 !important;
         box-shadow: none !important;
       }
     `}</style>
     {loading && <Spin size="large" fullscreen />}
         <Card>
              <h1 className="pl-5 pt-5 text-2xl font-bold text-start">
             TAMBAH PRODUK
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
                      {/* Kategori */}
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

                      {/* Sub Kategori */}
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
     <>
     <Card>
          <CardBody className="p-5">
              <div className='mb-3'>
                  <h1 className='text-base font-semibold text-gray-800'>
                      Informasi Produk
                  </h1>
                  <hr className='mt-2' />
              </div>

              <div className='grid grid-cols-4 gap-x-4 gap-y-3'>
                  {/* Column 1 */}
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
                  
                  {/* Column 2 */}
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

                  {/* Column 3 */}
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Asal Produk <span className='text-red-500'>*</span></label>
                      <Select
                          className="w-full"
                          placeholder="Pilih asal"
                          value={asalProduk || undefined}
                          onChange={(val) => setAsalProduk(val)}
                          size="middle"
                      >
                          <Option value="4">Dalam Negeri</Option>
                          <Option value="5">Luar Negeri</Option>
                      </Select>
                  </div>

                  {/* Column 4 */}
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
     </>


      <br />
      {/* Informasi Penjualan */}
      <>
      <Card>
          <CardBody className="p-5">
              <div className='mb-3'>
                  <h1 className='text-base font-semibold text-gray-800'>
                      Informasi Penjualan
                  </h1>
                  <hr className='mt-2' />
              </div>
              
              <div className='grid grid-cols-3 gap-x-6 gap-y-3'>
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Kode SKU</label>
                      <Input size="middle" value={kodeSku} onChange={(e) => setKodeSku(e.target.value)} placeholder='SKU123' />
                  </div>
                  
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Harga Satuan <span className='text-red-500'>*</span></label>
                      <Input size="middle" type='number' addonBefore="Rp" value={harga} onChange={(e) => setHarga(e.target.value)} placeholder='10000'/>
                  </div>
                  
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Stok <span className='text-red-500'>*</span></label>
                      <Input size="middle" type='number' value={stok} onChange={(e) => setStok(e.target.value)} placeholder='100' />
                  </div>

                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Kondisi <span className='text-red-500'>*</span></label>
                      <Radio.Group onChange={onChangeKondisi} value={kondisi} size="small">
                          <Radio value="baru">Baru</Radio>
                          <Radio value="bekas">Bekas</Radio>
                      </Radio.Group>
                  </div>

                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Pre-Order</label>
                      <Radio.Group onChange={onChangePreOrder} value={preOrder} size="small">
                          <Radio value="Y">Ya</Radio>
                          <Radio value="T">Tidak</Radio>
                      </Radio.Group>
                  </div>

                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Masa Pengemasan (hari)</label>
                      <Input size="middle" type='number' value={masaPengemasan} onChange={(e) => setMasaPengemasan(e.target.value)} placeholder='1-7' />
                      <p className='text-xs text-gray-500 mt-1'>Waktu proses pesanan</p>
                  </div>

                  {/* Tag Produk */}
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Tag Produk</label>
                      <Input size="middle" value={tagProduk} onChange={(e) => setTagProduk(e.target.value)} placeholder='tag1, tag2, tag3' />
                      <p className='text-xs text-gray-500 mt-1'>Pisahkan dengan koma</p>
                  </div>

                  {/* Status Produk */}
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Status Produk</label>
                      <Select
                          className="w-full"
                          value={statusProduk}
                          onChange={(val) => setStatusProduk(val)}
                          size="middle"
                      >
                          <Option value="live">live</Option>
                          <Option value="ditolak">ditolak</Option>
                          <Option value="blokir">blokir</Option>
                          <Option value="arsipkan">arsipkan</Option>
                          <Option value="menunggu konfirmasi">menunggu konfirmasi</Option>
                          <Option value="habis">habis</Option>
                      </Select>
                  </div>

                  {/* Draft */}
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Simpan sebagai Draft?</label>
                      <Radio.Group onChange={(e) => setDraft(e.target.value === 'true')} value={draft ? 'true' : 'false'} size="small">
                          <Radio value="true">Ya</Radio>
                          <Radio value="false">Tidak</Radio>
                      </Radio.Group>
                  </div>

                  {/* Diskon Toggle */}
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Aktifkan Diskon?</label>
                      <Radio.Group onChange={(e) => {
                          setDiskonEnabled(e.target.value === 'ya');
                          if (e.target.value === 'tidak') setDiskon('');
                      }} value={diskonEnabled ? 'ya' : 'tidak'} size="small">
                          <Radio value="ya">Ya</Radio>
                          <Radio value="tidak">Tidak</Radio>
                      </Radio.Group>
                  </div>

                  {/* Diskon Input - Conditional */}
                  {diskonEnabled && (
                      <div className='col-span-2'>
                          <label className='text-sm font-medium text-gray-700 block mb-1'>Diskon (Nominal)</label>
                          <Input size="middle" type='number' value={diskon} onChange={(e) => setDiskon(e.target.value)} placeholder='1500000' addonBefore="Rp" />
                          <p className='text-xs text-gray-500 mt-1'>Masukkan nominal diskon dalam rupiah</p>
                      </div>
                  )}

                  {/* Grosir Section */}
                  <div className='col-span-3'>
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
                          size="small"
                      >
                          <Radio value="ya">Ya</Radio>
                          <Radio value="tidak">Tidak</Radio>
                      </Radio.Group>
                  </div>

                  {/* Grosir Inputs - Conditional */}
                  {grosirEnabled && (
                      <>
                          <div className='col-span-3 grid grid-cols-2 gap-3 p-3 border rounded bg-gray-50'>
                              <div>
                                  <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 1 - Min. Pembelian</label>
                                  <Input size="middle" type='number' value={grosirMin1} onChange={(e) => setGrosirMin1(e.target.value)} placeholder='10' />
                              </div>
                              <div>
                                  <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 1 - Harga</label>
                                  <Input size="middle" type='number' addonBefore="Rp" value={grosirPrice1} onChange={(e) => setGrosirPrice1(e.target.value)} placeholder='9000' />
                              </div>
                              <div>
                                  <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 2 - Min. Pembelian</label>
                                  <Input size="middle" type='number' value={grosirMin2} onChange={(e) => setGrosirMin2(e.target.value)} placeholder='50' />
                              </div>
                              <div>
                                  <label className='text-sm font-medium text-gray-700 block mb-1'>Grosir 2 - Harga</label>
                                  <Input size="middle" type='number' addonBefore="Rp" value={grosirPrice2} onChange={(e) => setGrosirPrice2(e.target.value)} placeholder='8000' />
                              </div>
                          </div>
                      </>
                  )}

                  {/* Status Pilih */}
                  <div>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Status Pilih</label>
                      <Radio.Group onChange={(e) => setStatusPilih(e.target.value)} value={statusPilih} size="small">
                          <Radio value="Y">Ya</Radio>
                          <Radio value="T">Tidak</Radio>
                      </Radio.Group>
                  </div>

                  {/* Source Link Scrab */}
                  <div className='col-span-2'>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Source Link Scrab</label>
                      <Input size="middle" value={sourceLinkScrab} onChange={(e) => setSourceLinkScrab(e.target.value)} placeholder='https://example.com/product' />
                      <p className='text-xs text-gray-500 mt-1'>URL sumber produk</p>
                  </div>
                  
                  <div className='col-span-3'>
                      <label className='text-sm font-medium text-gray-700 block mb-1'>Variasi Produk</label>
                      <Button 
                          size="middle"
                          className={`w-full bg-${showCard ? 'red' : 'blue'}-500 text-white`}
                          onClick={handleButtonClick}
                      >
                          {showCard ? 'Batalkan Variasi' : 'Aktifkan Variasi'}
                      </Button>
                  </div>
                  
                  {showCard && (
                      <div className='col-span-3'>
                          <div className='p-4 border rounded bg-gray-50'>
                          
                          <div className='mt-4 p-3 border rounded bg-white'>
                              <div className='flex items-center justify-between mb-3'>
                                  <h2 className='text-sm font-semibold'>Daftar Variasi</h2>
                                  <Button size="small" className='bg-blue-500 text-white' onClick={tambahVariasi}>+ Tambah Variasi</Button>
                              </div>
                              <div className='overflow-x-auto'>
                                  <table className="w-full table-auto text-sm">
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
                          </div>
                      </div>
                  </div>
                  )}
              </div>
          </CardBody>
      </Card>
      </>

      <br />
      {/* Foto & Video Produk - 2 Columns */}
      <>
      <Card>
          <CardBody className="p-5">
              <div className='grid grid-cols-2 gap-6'>
                  {/* Foto Produk Column */}
                  <div>
                      <div className='mb-3'>
                          <h1 className='text-base font-semibold text-gray-800'>
                              Foto Produk
                          </h1>
                          <hr className='mt-2' />
                      </div>
                      <Alert className='text-xs p-3 mb-3' 
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

                  {/* Video Produk Column */}
                  <div>
                      <div className='mb-3'>
                          <h1 className='text-base font-semibold text-gray-800'>
                              Video Produk
                          </h1>
                          <hr className='mt-2' />
                      </div>
                      <Alert className='text-xs p-3 mb-3' 
                      message={<span><b>Info:</b> Durasi maksimal video 60 detik.</span>}
                      type="warning" 
                      />
                      <Input size="middle" type="file" accept="video/*" onChange={handleVideoChange} />
                      {errorMessage && <div className="text-red-500 text-xs mt-2">{errorMessage}</div>}
                  </div>
              </div>
          </CardBody>
      </Card>
      </>


      <br />
      {/* Pengiriman */}
      <>
      <Card>
          <CardBody className="p-5">
              <div className='mb-3'>
                  <h1 className='text-base font-semibold text-gray-800'>
                      Pengiriman
                  </h1>
                  <div className='flex items-center gap-2 text-xs text-blue-600 mt-1'>
                      <TruckIcon className='w-4 h-4'/>
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
      </>

      {/* Button */}
      <br />
      <>
      <div className='w-full flex space-x-3 justify-end'>
          <Button size="large" className='bg-gray-300 text-gray-800' onClick={() => handleSubmit(true)} disabled={loading}>
              Simpan Sebagai Draft
          </Button>
          <Button size="large" className='bg-blue-500 text-white' onClick={() => handleSubmit(false)} disabled={loading}>
              Simpan dan Tampilkan
          </Button>
      </div>
      </>


      {/* Modal Usulkan Brand  */}
      <Modal
        width={800}
        title={
          [
            <div className='text-2xl font-bold'>
              Usulkan Brand
            </div>
          ]
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <>
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
                                        filterSort={(optionA, optionB) =>
                                          optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                        }
                                  >
                                      <Option value="kategori1">Kategori 1</Option>
                                      <Option value="kategori2">Kategori 2</Option>
                                      <Option value="kategori3">Kategori 3</Option>
                                  </Select>
                                  <p>
                                  Kosongkan jika kategori tidak ditemukan
                                  </p>
                              </div>
                         </div>
                         <div className='w-full flex space-x-5 mt-5'>
                              <div className='w-1/3'>
                                  <label className='mb-2 text-lg'>Nama Brand </label>
                                  
                              </div>
                              <div className='w-full'>
                                <Input className='h-10' placeholder='Masukkan Nama Brand'/>
                                  <p>
                                  Brand akan ditampilkan setelah disetujui
                                  </p>
                              </div>
                         </div>
                         <div className='w-full flex justify-end items-end space-x-2 mt-4'>
                              <Button className='h-10 text-lg bg-red-300 text-white' onClick={handleCancel}>Batal</Button>
                              <Button className='h-10 text-lg bg-blue-300 text-white'>Tambah</Button>
                         </div>
                      </div>
                      
        </>
      </Modal>


      {/* Modal Tambah Etalase  */}
      <Modal
        width={800}
        title={
          [
            <div className='text-2xl font-bold'>
              Etalase Toko
            </div>
          ]
        }
        visible={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        footer={false}
      >
        <>
                      <div>
                        
                         <div className='w-full flex space-x-5 mt-5'>
                              <div className='w-1/3'>
                                  <label className='mb-2 text-lg'>Nama Brand </label>
                                  
                              </div>
                              <div className='w-full'>
                                <Input className='h-10' placeholder='Masukkan Nama Brand'/>
                                  <p>
                                  Masukkan Nama Etalase
                                  </p>
                              </div>
                         </div>
                         <div className='w-full flex justify-end items-end space-x-2 mt-4'>
                              <Button className='h-10 text-lg bg-red-300 text-white' onClick={handleCancel2}>Batal</Button>
                              <Button className='h-10 text-lg bg-blue-300 text-white'>Tambah</Button>
                         </div>
                      </div>
                      
        </>
      </Modal>
  </div>
  )
}

export default TambahProduk
