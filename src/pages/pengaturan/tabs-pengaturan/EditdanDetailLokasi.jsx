import { Button, Input, Select, message, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, apiFetch } from '../../../configs/api';

const { Option } = Select;

function EditdanDetailLokasi({ tokoData, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Location states
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  // Form states
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [kodePos, setKodePos] = useState('');
  const [alamatToko, setAlamatToko] = useState('');

  // Original data untuk detect perubahan
  const [originalData, setOriginalData] = useState({
    provinsi: null,
    kota_kabupaten: null,
    kecamatan: null,
    kelurahan: null,
    kode_pos: '',
    alamat_toko: '',
  });

  // Load initial data
  useEffect(() => {
    if (tokoData) {
      setSelectedProvince(tokoData.provinsi);
      setSelectedCity(tokoData.kota_kabupaten);
      setSelectedDistrict(tokoData.kecamatan);
      setSelectedVillage(tokoData.kelurahan);
      setKodePos(tokoData.kode_pos || '');
      setAlamatToko(tokoData.alamat_toko || '');

      // Simpan original data
      setOriginalData({
        provinsi: tokoData.provinsi,
        kota_kabupaten: tokoData.kota_kabupaten,
        kecamatan: tokoData.kecamatan,
        kelurahan: tokoData.kelurahan,
        kode_pos: tokoData.kode_pos || '',
        alamat_toko: tokoData.alamat_toko || '',
      });
    }
  }, [tokoData]);

  // Fetch provinces
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch cities when province selected
  useEffect(() => {
    if (selectedProvince) {
      fetchCities(selectedProvince);
    }
  }, [selectedProvince]);

  // Fetch districts when city selected
  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(selectedCity);
    }
  }, [selectedCity]);

  // Fetch villages when district selected
  useEffect(() => {
    if (selectedDistrict) {
      fetchVillages(selectedDistrict);
    }
  }, [selectedDistrict]);

  const fetchProvinces = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/main/location/provinces?page=1&limit=40`);
      if (res.data) {
        setProvinces(res.data);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/main/location/cities?province_id=${provinceId}&page=1&limit=100`);
      if (res.data) {
        setCities(res.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchDistricts = async (cityId) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/main/location/districts?city_id=${cityId}&page=1&limit=100`);
      if (res.data) {
        setDistricts(res.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchVillages = async (kecamatanKd) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/main/location/villages?kecamatan_kd=${kecamatanKd}&page=1&limit=100`);
      if (res.data) {
        setVillages(res.data);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setCities([]);
    setDistricts([]);
    setVillages([]);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setDistricts([]);
    setVillages([]);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedVillage(null);
    setVillages([]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      let hasChanges = false;

      // Hanya tambahkan field yang berubah
      if (selectedProvince !== originalData.provinsi) {
        formData.append('provinsi', selectedProvince);
        hasChanges = true;
      }

      if (selectedCity !== originalData.kota_kabupaten) {
        formData.append('kota_kabupaten', selectedCity);
        hasChanges = true;
      }

      if (selectedDistrict !== originalData.kecamatan) {
        formData.append('kecamatan', selectedDistrict);
        hasChanges = true;
      }

      if (selectedVillage !== originalData.kelurahan) {
        formData.append('kelurahan', selectedVillage);
        hasChanges = true;
      }

      if (kodePos !== originalData.kode_pos) {
        formData.append('kode_pos', kodePos);
        hasChanges = true;
      }

      if (alamatToko !== originalData.alamat_toko) {
        formData.append('alamat_toko', alamatToko);
        hasChanges = true;
      }

      // Check jika tidak ada perubahan
      if (!hasChanges) {
        message.info('Tidak ada perubahan yang perlu disimpan');
        setSaving(false);
        return;
      }

      console.log('Updating location with changed fields:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }

      const res = await apiFetch(`${API_BASE_URL}/seller/v2/toko/update`, {
        method: 'PATCH',
        body: formData,
      });

      if (res.success) {
        message.success('Lokasi toko berhasil diupdate');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        message.error(res.message || 'Gagal update lokasi toko');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      message.error(error.message || 'Gagal update lokasi toko');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/*  */}
      <div className='flex w-full space-x-5'>
           <div className='w-1/4 flex item items-center'>
                <label className='mb-2 text-lg'>Provinsi <span className='text-red-500'>*</span></label>
           </div>
           <div className='w-full'>
                <Select
                showSearch
                className="w-full mt-2 h-10"
                placeholder="Pilih Provinsi"
                value={selectedProvince}
                onChange={handleProvinceChange}
                filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                     optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                     }
                     >
                        {provinces.map(prov => (
                          <Option key={prov.province_id} value={prov.province_id}>
                            {prov.province}
                          </Option>
                        ))}
                </Select>
           </div>
      </div>

      {/*  */}
      <br />
      <div className='flex w-full space-x-5'>
           <div className='w-1/4 flex item items-center'>
                <label className='mb-2 text-lg'>Kota/Kabupaten <span className='text-red-500'>*</span></label>
           </div>
           <div className='w-full'>
                <Select
                showSearch
                className="w-full mt-2 h-10"
                placeholder="Pilih Kota/Kabupaten"
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedProvince}
                filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                     optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                     }
                     >
                        {cities.map(city => (
                          <Option key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </Option>
                        ))}
                </Select>
           </div>
      </div>


      {/*  */}
      <br />
      <div className='flex w-full space-x-5'>
           <div className='w-1/4 flex item items-center'>
                <label className='mb-2 text-lg'>Kecamatan <span className='text-red-500'>*</span></label>
           </div>
           <div className='w-full'>
                <Select
                showSearch
                className="w-full mt-2 h-10"
                placeholder="Pilih Kecamatan"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedCity}
                filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                     optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                     }
                     >
                        {districts.map(dist => (
                          <Option key={dist.kecamatan_id} value={dist.kecamatan_kd}>
                            {dist.kecamatan}
                          </Option>
                        ))}
                </Select>
           </div>
      </div>


      {/*  */}
      <br />
      <div className='flex w-full space-x-5'>
           <div className='w-1/4 flex item items-center'>
                <label className='mb-2 text-lg'>Kelurahan <span className='text-red-500'>*</span></label>
           </div>
           <div className='w-full'>
                <Select
                showSearch
                className="w-full mt-2 h-10"
                placeholder="Pilih Kelurahan"
                value={selectedVillage}
                onChange={setSelectedVillage}
                disabled={!selectedDistrict}
                filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                     optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                     }
                     >
                        {villages.map(vill => (
                          <Option key={vill.kelurahan_id} value={vill.kelurahan_id}>
                            {vill.kelurahan_desa}
                          </Option>
                        ))}
                </Select>
           </div>
      </div>

      {/*  */}
      <br />
      <div className='flex w-full space-x-5 mt-2'>
           <div className='w-1/4 flex item items-center'>
                <label className='mb-2 text-lg'>Kode Pos <span className='text-red-500'>*</span></label>
           </div>
           <div className='w-full'>
                <Input 
                  placeholder='17215' 
                  className='h-10 w-full'
                  value={kodePos}
                  onChange={(e) => setKodePos(e.target.value)}
                />
           </div>
      </div>


      {/*  */}
      <br />
      <div className='flex w-full space-x-5 mt-2'>
           <div className='w-1/4 flex item items-center'>
                <label className='mb-2 text-lg'>Alamat Toko <span className='text-red-500'>*</span></label>
           </div>
           <div className='w-full'>
                <TextArea 
                  placeholder='Jl. Puri Harapan Jaya No.88' 
                  className='w-full'
                  rows={3}
                  value={alamatToko}
                  onChange={(e) => setAlamatToko(e.target.value)}
                />
           </div>
      </div>


      <br />
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

export default EditdanDetailLokasi

