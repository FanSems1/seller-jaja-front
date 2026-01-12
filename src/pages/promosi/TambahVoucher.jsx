import React, { useState } from 'react';
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { Input, Select, DatePicker, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { VOUCHER_ENDPOINTS } from '@/configs/api';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const { Option } = Select;

export function TambahVoucher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form states
  const [promoCategory, setPromoCategory] = useState('unique');
  const [kodePromo, setKodePromo] = useState('');
  const [judulPromo, setJudulPromo] = useState('');
  const [mulai, setMulai] = useState(null);
  const [berakhir, setBerakhir] = useState(null);
  const [nominalDiskon, setNominalDiskon] = useState('');
  const [minBelanja, setMinBelanja] = useState('0');
  const [maxDiskon, setMaxDiskon] = useState('');
  const [kuotaVoucher, setKuotaVoucher] = useState('');
  const [generateUrl, setGenerateUrl] = useState(false);
  const [bannerPromo, setBannerPromo] = useState(null);
  const [bannerFileList, setBannerFileList] = useState([]);

  // Handle banner upload
  const handleBannerChange = (info) => {
    console.log('Upload info:', info);
    setBannerFileList(info.fileList);
    
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj || info.fileList[0];
      console.log('Selected file:', file);
      setBannerPromo(file);
    } else {
      setBannerPromo(null);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!judulPromo || !kodePromo || !mulai || !berakhir || !nominalDiskon || !kuotaVoucher) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Mohon lengkapi semua field yang wajib diisi!',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();

      formData.append('promo_category', promoCategory);
      formData.append('kode_promo', kodePromo);
      formData.append('judul_promo', judulPromo);
      formData.append('mulai', dayjs(mulai).format('YYYY-MM-DD'));
      formData.append('berakhir', dayjs(berakhir).format('YYYY-MM-DD'));
      formData.append('nominal_diskon', nominalDiskon);
      formData.append('min_belanja', minBelanja || '0');
      formData.append('max_diskon', maxDiskon || '');
      formData.append('kuota_voucher', kuotaVoucher);
      formData.append('generate_url', generateUrl ? 'true' : 'false');
      
      if (bannerPromo) {
        console.log('Appending banner_promo:', bannerPromo);
        formData.append('banner_promo', bannerPromo);
      }

      // Debug: Log all formData entries
      console.log('=== FormData Contents ===');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
      }
      console.log('========================');

      const response = await fetch(VOUCHER_ENDPOINTS.CREATE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat voucher');
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Voucher berhasil dibuat!',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/dashboard/promosi/voucher-toko');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <Card>
        <CardBody>
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="text"
              color="blue-gray"
              onClick={() => navigate('/dashboard/promosi/voucher-toko')}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" /> Kembali
            </Button>
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Tambah Voucher Baru
            </Typography>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Informasi Voucher */}
            <Card className="border border-gray-200">
              <CardBody className="p-5">
                <Typography variant="h6" className="mb-4 text-base font-semibold">
                  Informasi Voucher
                </Typography>

                <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                  {/* Kategori Promo */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Kategori Promo <span className="text-red-500">*</span>
                    </label>
                    <Select
                      size="middle"
                      className="w-full"
                      value={promoCategory}
                      onChange={(val) => setPromoCategory(val)}
                    >
                      <Option value="unique">Unique</Option>
                      <Option value="claim">Claim</Option>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">
                      <i>Unique: Kode unik untuk setiap pengguna</i>
                    </p>
                  </div>

                  {/* Kode Promo */}
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">
                      Kode Promo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      size="middle"
                      placeholder="DISKON50,PROMO20,HEMAT30"
                      value={kodePromo}
                      onChange={(e) => setKodePromo(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      <i>Pisahkan dengan koma untuk multiple kode</i>
                    </p>
                  </div>

                  {/* Judul Promo */}
                  <div className="col-span-3">
                    <label className="text-sm font-medium mb-1 block">
                      Judul Promo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      size="middle"
                      placeholder="Diskon Spesial Akhir Tahun"
                      value={judulPromo}
                      onChange={(e) => setJudulPromo(e.target.value)}
                    />
                  </div>

                  {/* Tanggal Mulai */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      size="middle"
                      className="w-full"
                      format="YYYY-MM-DD"
                      value={mulai}
                      onChange={(date) => setMulai(date)}
                    />
                  </div>

                  {/* Tanggal Berakhir */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Tanggal Berakhir <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      size="middle"
                      className="w-full"
                      format="YYYY-MM-DD"
                      value={berakhir}
                      onChange={(date) => setBerakhir(date)}
                    />
                  </div>

                  {/* Generate URL */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Generate URL?
                    </label>
                    <Radio.Group
                      value={generateUrl}
                      onChange={(e) => setGenerateUrl(e.target.value)}
                    >
                      <Radio value={true}>Ya</Radio>
                      <Radio value={false}>Tidak</Radio>
                    </Radio.Group>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Pengaturan Diskon */}
            <Card className="border border-gray-200">
              <CardBody className="p-5">
                <Typography variant="h6" className="mb-4 text-base font-semibold">
                  Pengaturan Diskon
                </Typography>

                <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                  {/* Nominal Diskon */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Nominal Diskon <span className="text-red-500">*</span>
                    </label>
                    <Input
                      size="middle"
                      type="number"
                      addonBefore="Rp"
                      placeholder="50000"
                      value={nominalDiskon}
                      onChange={(e) => setNominalDiskon(e.target.value)}
                    />
                  </div>

                  {/* Min Belanja */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Min. Belanja
                    </label>
                    <Input
                      size="middle"
                      type="number"
                      addonBefore="Rp"
                      placeholder="100000"
                      value={minBelanja}
                      onChange={(e) => setMinBelanja(e.target.value)}
                    />
                  </div>

                  {/* Max Diskon */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Max. Diskon
                    </label>
                    <Input
                      size="middle"
                      type="number"
                      addonBefore="Rp"
                      placeholder="200000"
                      value={maxDiskon}
                      onChange={(e) => setMaxDiskon(e.target.value)}
                    />
                  </div>

                  {/* Kuota Voucher */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Kuota Voucher <span className="text-red-500">*</span>
                    </label>
                    <Input
                      size="middle"
                      type="number"
                      placeholder="100"
                      value={kuotaVoucher}
                      onChange={(e) => setKuotaVoucher(e.target.value)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Banner Promo */}
            <Card className="border border-gray-200">
              <CardBody className="p-5">
                <Typography variant="h6" className="mb-4 text-base font-semibold">
                  Banner Promo
                </Typography>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Upload Banner
                  </label>
                  <Upload
                    listType="picture"
                    maxCount={1}
                    fileList={bannerFileList}
                    beforeUpload={() => false}
                    onChange={handleBannerChange}
                    accept="image/jpeg,image/png,image/jpg"
                  >
                    <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
                  </Upload>
                  <p className="text-xs text-gray-400 mt-1">
                    <i>Format: JPG, PNG. Max 2MB</i>
                  </p>
                  {bannerPromo && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ File terpilih: {bannerPromo.name}
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outlined"
                color="gray"
                onClick={() => navigate('/dashboard/promosi/voucher-toko')}
              >
                Batal
              </Button>
              <Button
                color="green"
                variant="gradient"
                onClick={handleSubmit}
                loading={loading}
              >
                Simpan Voucher
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default TambahVoucher;
