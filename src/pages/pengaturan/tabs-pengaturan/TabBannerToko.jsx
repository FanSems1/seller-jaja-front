import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Upload, message, Spin } from 'antd';
import { API_BASE_URL, apiFetch } from '../../../configs/api';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function TabBannerToko() {
  const [saving, setSaving] = useState(false);
  
  // Banner Utama
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [bannerUtamaFile, setBannerUtamaFile] = useState(null);

 

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // Ambil file object jika ada file baru
    if (newFileList.length > 0 && newFileList[newFileList.length - 1].originFileObj) {
      setBannerUtamaFile(newFileList[newFileList.length - 1].originFileObj);
    }
  };

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10; // Check if the file size is less than 10MB
    if (!isLt10M) {
      message.error('Image must smaller than 10MB!');
    }
    return isLt10M;
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  // Slide (Gambar 2)
  const [previewOpen2, setPreviewOpen2] = useState(false);
  const [previewImage2, setPreviewImage2] = useState('');
  const [fileList2, setFileList2] = useState([]);
  const [slideFiles, setSlideFiles] = useState([]);

 

  const handlePreview2 = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage2(file.url || file.preview);
    setPreviewOpen2(true);
  };

  const handleChange2 = ({ fileList: newFileList }) => {
    setFileList2(newFileList);
    // Ambil semua file objects
    const files = newFileList
      .filter(f => f.originFileObj)
      .map(f => f.originFileObj);
    setSlideFiles(files);
  };

  const beforeUpload2 = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10; // Check if the file size is less than 10MB
    if (!isLt10M) {
      message.error('Image must smaller than 10MB!');
    }
    return isLt10M;
  };

  const uploadButton2 = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  // Banner Promo (Gambar 3)
  const [previewOpen3, setPreviewOpen3] = useState(false);
  const [previewImage3, setPreviewImage3] = useState('');
  const [fileList3, setFileList3] = useState([]);
  const [bannerPromoFiles, setBannerPromoFiles] = useState([]);

 

  const handlePreview3 = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage3(file.url || file.preview);
    setPreviewOpen3(true);
  };

  const handleChange3 = ({ fileList: newFileList }) => {
    setFileList3(newFileList);
    // Ambil semua file objects
    const files = newFileList
      .filter(f => f.originFileObj)
      .map(f => f.originFileObj);
    setBannerPromoFiles(files);
  };

  const beforeUpload3 = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10; // Check if the file size is less than 10MB
    if (!isLt10M) {
      message.error('Image must smaller than 10MB!');
    }
    return isLt10M;
  };

  const uploadButton3 = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  // Handle Save
  const handleSave = async () => {
    try {
      console.log('=== handleSave Banner triggered ===');
      setSaving(true);

      const formData = new FormData();
      let hasChanges = false;

      // Banner Utama (single file)
      if (bannerUtamaFile) {
        console.log('Banner Utama file:', bannerUtamaFile.name);
        formData.append('banner_utama', bannerUtamaFile);
        hasChanges = true;
      }

      // Slide (multiple files)
      if (slideFiles.length > 0) {
        console.log('Slide files count:', slideFiles.length);
        slideFiles.forEach((file, index) => {
          formData.append('banner_slide[]', file);
          console.log(`Slide ${index + 1}:`, file.name);
        });
        hasChanges = true;
      }

      // Banner Promo (multiple files)
      if (bannerPromoFiles.length > 0) {
        console.log('Banner Promo files count:', bannerPromoFiles.length);
        bannerPromoFiles.forEach((file, index) => {
          formData.append('banner_promo[]', file);
          console.log(`Banner Promo ${index + 1}:`, file.name);
        });
        hasChanges = true;
      }

      if (!hasChanges) {
        message.info('Tidak ada perubahan yang perlu disimpan');
        setSaving(false);
        return;
      }

      console.log('Uploading banners...');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
      }

      const res = await apiFetch(`${API_BASE_URL}/seller/v2/toko/update`, {
        method: 'PATCH',
        body: formData,
      });

      if (res.success) {
        message.success('Banner toko berhasil disimpan');
        // Reset files
        setBannerUtamaFile(null);
        setSlideFiles([]);
        setBannerPromoFiles([]);
      } else {
        message.error(res.message || 'Gagal menyimpan banner toko');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      message.error(error.message || 'Gagal menyimpan banner toko');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='mt-10'>
      <h1 className='text-xl font-semibold'>
        Banner Toko
      </h1>
      <br />
      <hr />
      <br />
      <div className='w-full'>
        <div className='mt-5'>
          <label className='text-lg'>Banner Utama <span className='text-red-500'>*</span></label>
          <div className='mt-5'>
            <>
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={handleChange}
                className='w-full'
              >
                {fileList.length >= 12 ? null : uploadButton} {/* Increase max files to 12 */}
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

      <br /><br />
      <div className='w-full'>
        <div className='mt-5'>
          <label className='text-lg'>Slide <span className='text-red-500'>*</span></label>
          <div className='mt-5'>
            <>
              <Upload
                listType="picture-card"
                fileList={fileList2}
                beforeUpload={() => false}
                onPreview={handlePreview2}
                onChange={handleChange2}
                className='w-full'
              >
                {fileList2.length >= 12 ? null : uploadButton2} {/* Increase max files to 12 */}
              </Upload>
              {previewImage2 && (
                <Image
                  wrapperStyle={{
                    display: 'none',
                  }}
                  preview={{
                    visible: previewOpen2,
                    onVisibleChange2: (visible) => setPreviewOpen2(visible),
                    afterOpenChange2: (visible) => !visible && setPreviewImage2(''),
                  }}
                  src={previewImage2}
                />
              )}
            </>
          </div>
        </div>
      </div>

      <br /><br />
      <div className='w-full'>
        <div className='mt-5'>
          <label className='text-lg'>Banner Promo <span className='text-red-500'>*</span></label>
          <div className='mt-5'>
            <>
              <Upload
                listType="picture-card"
                fileList={fileList3}
                beforeUpload={() => false}
                onPreview={handlePreview3}
                onChange={handleChange3}
                className='w-full'
              >
                {fileList3.length >= 12 ? null : uploadButton3} {/* Increase max files to 12 */}
              </Upload>
              {previewImage3 && (
                <Image
                  wrapperStyle={{
                    display: 'none',
                  }}
                  preview={{
                    visible: previewOpen3,
                    onVisibleChange3: (visible) => setPreviewOpen3(visible),
                    afterOpenChange3: (visible) => !visible && setPreviewImage3(''),
                  }}
                  src={previewImage3}
                />
              )}
            </>
          </div>
        </div>
      </div>

<br />
      <div className='w-full flex justify-end items-end'>
        <Button 
          onClick={handleSave}
          loading={saving}
          disabled={saving}
          className='bg-blue-500 text-white h-10 text-lg'
        >
          Simpan
        </Button>
      </div>
    </div>
  );
}

export default TabBannerToko;
