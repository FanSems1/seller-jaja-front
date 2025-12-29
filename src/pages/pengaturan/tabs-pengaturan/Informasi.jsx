import { Button, Image, Input, Tooltip, Upload, Spin, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState, useEffect } from 'react'
import {
  QuestionCircleFilled,
  DeleteOutlined,
  UploadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { API_BASE_URL, apiFetch } from '../../../configs/api';
import Swal from 'sweetalert2';


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });   


function Informasi() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [namaToko, setNamaToko] = useState('');
  const [deskripsiToko, setDeskripsiToko] = useState('');
  const [greatingMessage, setGreatingMessage] = useState('');
  const [fotoToko, setFotoToko] = useState(null);

  // Original data untuk detect perubahan
  const [originalData, setOriginalData] = useState({
    nama_toko: '',
    deskripsi_toko: '',
    greating_message: '',
  });

  // Get slug_toko from localStorage
  const getSlugToko = () => {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        return user.toko?.slug_toko;
      }
    } catch (e) {
      console.error('Error parsing auth_user:', e);
    }
    return null;
  };

  // Fetch toko detail
  useEffect(() => {
    const fetchTokoDetail = async () => {
      try {
        setLoading(true);
        const slugToko = getSlugToko();
        if (!slugToko) {
          message.error('Slug toko tidak ditemukan');
          return;
        }

        const res = await apiFetch(`${API_BASE_URL}/main/toko/${slugToko}`);
        console.log('Toko detail response:', res);
        
        // Response bisa punya structure { data: {...} } atau { success: true, data: {...} }
        const toko = res.data || res.toko;
        if (toko) {
          setNamaToko(toko.nama_toko || '');
          setDeskripsiToko(toko.deskripsi_toko || '');
          setGreatingMessage(toko.greating_message || '');

          // Simpan original data untuk comparison
          setOriginalData({
            nama_toko: toko.nama_toko || '',
            deskripsi_toko: toko.deskripsi_toko || '',
            greating_message: toko.greating_message || '',
          });

          // Set foto toko jika ada - field name adalah 'foto'
          if (toko.foto) {
            const fotoUrl = toko.foto.startsWith('http') 
              ? toko.foto 
              : `${API_BASE_URL}/uploads/toko/${toko.foto}`;
            setFileList([{
              uid: '-1',
              name: toko.foto,
              status: 'done',
              url: fotoUrl,
            }]);
          }
        } else {
          message.error(res.message || 'Gagal memuat data toko');
        }
      } catch (error) {
        console.error('Error fetching toko detail:', error);
        message.error(error.message || 'Gagal memuat data toko');
      } finally {
        setLoading(false);
      }
    };

    fetchTokoDetail();
  }, []);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // Ambil file object jika ada file baru yang di-upload
    if (newFileList.length > 0 && newFileList[newFileList.length - 1].originFileObj) {
      setFotoToko(newFileList[newFileList.length - 1].originFileObj);
    }
  };

  const handleSave = async () => {
    try {
      console.log('=== handleSave triggered ===');
      setSaving(true);

      const formData = new FormData();
      let hasChanges = false;

      console.log('Current values:', { namaToko, deskripsiToko, greatingMessage, fotoToko });
      console.log('Original values:', originalData);

      // Hanya tambahkan field yang berubah
      if (namaToko !== originalData.nama_toko) {
        console.log('nama_toko changed');
        formData.append('nama_toko', namaToko);
        hasChanges = true;
      }

      if (deskripsiToko !== originalData.deskripsi_toko) {
        console.log('deskripsi_toko changed');
        formData.append('deskripsi_toko', deskripsiToko);
        hasChanges = true;
      }

      if (greatingMessage !== originalData.greating_message) {
        console.log('greating_message changed');
        formData.append('greating_message', greatingMessage);
        hasChanges = true;
      }

      // Tambahkan foto jika ada file baru yang di-upload
      if (fotoToko) {
        console.log('foto changed:', fotoToko.name);
        formData.append('foto', fotoToko);
        hasChanges = true;
      }

      // Check jika tidak ada perubahan
      if (!hasChanges) {
        message.info('Tidak ada perubahan yang perlu disimpan');
        setSaving(false);
        return;
      }

      // Debug log
      console.log('Saving toko with FormData (changed fields only):');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
      }

      const res = await apiFetch(`${API_BASE_URL}/seller/v2/toko/update`, {
        method: 'PATCH',
        body: formData,
      });

      if (res.success) {
        message.success('Data toko berhasil disimpan');
        
        // Update original data setelah save berhasil
        setOriginalData({
          nama_toko: namaToko,
          deskripsi_toko: deskripsiToko,
          greating_message: greatingMessage,
        });
        
        // Reset fotoToko setelah save
        setFotoToko(null);
      } else {
        message.error(res.message || 'Gagal menyimpan data toko');
      }
    } catch (error) {
      console.error('Error saving toko:', error);
      message.error(error.message || 'Gagal menyimpan data toko');
    } finally {
      setSaving(false);
    }
  };

  const uploadButton = (
    <div
      style={{
        border: 0,
        background: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PlusOutlined style={{ fontSize: '24px' }} />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }


  return (
    <div className='mt-10'>
      <h1 className='text-xl font-semibold'>
        Profil Toko
      </h1>
      <br />
      <hr />
      <br />

      <div className='w-full'>
        <div>
          <label className='text-lg'>Nama Toko</label>
          <Input 
            className='w-full h-10 mt-2' 
            placeholder='NCEKTECH'
            value={namaToko}
            onChange={(e) => setNamaToko(e.target.value)}
          />
          <p>
            Anda memiliki 1 kesempatan untuk mengubah nama toko
          </p>
        </div>
        <div className='mt-5'>
          <label className='text-lg'>Greeting Message <span className='text-red-500'>*</span></label>
          <Input 
            className='w-full h-10 mt-2' 
            placeholder='Welcome to my store'
            value={greatingMessage}
            onChange={(e) => setGreatingMessage(e.target.value)}
          />
        </div>
        <div className='mt-5 flex space-x-5'>
          <div className='sm:w-1/2 w-full'>
              <label className='text-lg'>Deskripsi Toko <span className='text-red-500'>*</span></label>
              <TextArea 
                className='w-full mt-2' 
                placeholder='Selamat data di toko kami, produk yang kami sediakan 100% original dan bergaransi resmi'
                value={deskripsiToko}
                onChange={(e) => setDeskripsiToko(e.target.value)}
              />
          </div>
          <div className='sm:w-1/2 w-full'>
              <label className='text-lg'>Gambar Toko <span className='text-red-500'>*</span> 
              <span className='pl-2'>
                <Tooltip title="Gunakan foto yang memiliki kecerahan cukup, disarankan untuk mengatur bagian foto yang ingin dicrop">
                    <QuestionCircleFilled className='text-gray-700' />  
                </Tooltip></span>
              </label>
               <div className="mt-5 mx-auto">
                <div>
                      <>
                        <Upload
                          className='border-dashed'
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={handlePreview}
                          onChange={handleChange}
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                        >
                          {fileList.length >= 1 ? null : uploadButton}
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
              </div>
          </div>
        </div>
      </div>

      <div className='w-full flex justify-end items-end'>
        <Button 
          className='bg-blue-500 text-white h-10 text-lg'
          onClick={handleSave}
          loading={saving}
          disabled={saving}
        >
          Simpan
        </Button>
      </div>
    </div>
  )
}

export default Informasi
