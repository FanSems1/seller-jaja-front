import { PencilIcon } from '@heroicons/react/24/solid'
import { Button, Modal, message, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import EditdanDetailLokasi from './EditdanDetailLokasi';
import { API_BASE_URL, apiFetch } from '../../../configs/api';

function TabLokasi() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokoData, setTokoData] = useState(null);
  const [locationNames, setLocationNames] = useState({
    province: '',
    city: '',
    district: '',
    village: ''
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
        const toko = res.data || res.toko;
        if (toko) {
          setTokoData(toko);
          // Fetch location names based on IDs
          await fetchLocationNames(toko);
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

  // Fetch location names based on IDs
  const fetchLocationNames = async (toko) => {
    try {
      const names = { province: '', city: '', district: '', village: '' };

      // Fetch province name
      if (toko.provinsi) {
        const provRes = await apiFetch(`${API_BASE_URL}/main/location/provinces?page=1&limit=40`);
        const province = provRes.data?.find(p => p.province_id === toko.provinsi);
        if (province) names.province = province.province;
      }

      // Fetch city name
      if (toko.provinsi && toko.kota_kabupaten) {
        const cityRes = await apiFetch(`${API_BASE_URL}/main/location/cities?province_id=${toko.provinsi}&page=1&limit=100`);
        const city = cityRes.data?.find(c => c.city_id === toko.kota_kabupaten);
        if (city) names.city = city.city_name;
      }

      // Fetch district name  
      if (toko.kota_kabupaten && toko.kecamatan) {
        const distRes = await apiFetch(`${API_BASE_URL}/main/location/districts?city_id=${toko.kota_kabupaten}&page=1&limit=100`);
        const district = distRes.data?.find(d => d.kecamatan_kd === toko.kecamatan);
        if (district) names.district = district.kecamatan;
      }

      // Fetch village name
      if (toko.kecamatan && toko.kelurahan) {
        const villRes = await apiFetch(`${API_BASE_URL}/main/location/villages?kecamatan_kd=${toko.kecamatan}&page=1&limit=100`);
        const village = villRes.data?.find(v => v.kelurahan_id === toko.kelurahan);
        if (village) names.village = village.kelurahan_desa;
      }

      setLocationNames(names);
    } catch (error) {
      console.error('Error fetching location names:', error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    // Refresh toko data after successful update
    const slugToko = getSlugToko();
    if (slugToko) {
      apiFetch(`${API_BASE_URL}/main/toko/${slugToko}`)
        .then(async res => {
          const toko = res.data || res.toko;
          if (toko) {
            setTokoData(toko);
            await fetchLocationNames(toko);
          }
        })
        .catch(err => console.error('Error refreshing toko data:', err));
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className='mt-10'>
      <h1 className='text-xl font-semibold'>
          Lokasi Toko
      </h1>
      <br />
      <hr />
      <br />

      <div className='w-full sm:flex space-x-4'>
        {/* Akun */}
        <div className='bg-[#f3f4f7] rounded-md border border-[#e2e7f1] sm:w-1/3 w-full'>
          <div className='p-4'>
            <p className='text-lg font-bold text-[#4b4b5a]'>
              {tokoData?.nama_toko || 'Toko Anda'}
            </p>
            <div className='mt-4 text-base text-[#6c757d]'>
              Nama Pemilik :
              <p>
                {tokoData?.nama_user || '-'}
              </p>
            </div>
            <div className='mt-4 text-base text-[#6c757d]'>
              Alamat Email :
              <p>
                {tokoData?.email || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Alamat */}
        <div className='bg-[#f3f4f7] rounded-md border border-[#e2e7f1] w-full '>
          <div className='p-4'>
            <div className='flex w-full'>
              <div className='w-1/2  text-base text-[#6c757d]'>
                Alamat
              </div>
              <div className='w-1/2 flex justify-end items-end'>
                <Button onClick={showModal} className='bg-[#d7d9dc] border border-[#aaaaaa]'>
                  <PencilIcon className='w-4 h-4' /> Edit
                </Button>
              </div>
              
            </div>
            <div className='mt-4  text-base text-[#6c757d]'>
                {tokoData?.alamat_toko || '-'}
              </div>
              <div className='mt-8  text-base text-[#6c757d] flex w-full flex-wrap gap-4'>
                  <div>
                    Provinsi :
                    <p>
                      {locationNames.province || '-'}
                    </p>
                  </div>
                  <div>
                    Kota/Kabupaten :
                    <p>
                    {locationNames.city || '-'}
                    </p>
                  </div>
                  <div>
                    Kecamatan :
                    <p>
                    {locationNames.district || '-'}
                    </p>
                  </div>
                  <div>
                    Kelurahan :
                    <p>
                    {locationNames.village || '-'}
                    </p>
                  </div>
                  <div>
                    Kode Pos :
                    <p>
                    {tokoData?.kode_pos || '-'}
                    </p>
                  </div>
              </div>
          </div>
        </div>
       
      </div>
      

      {/* Modal Edit */}
      <Modal
        width={1000}
        centered
        title={
        [
          <div className='text-2xl p-3'>
            Ubah Alamat Toko : {tokoData?.nama_toko || 'Toko Anda'}
            <hr className='mt-8 ' />
          </div>
        ]
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        footer={false}
        cancelText="Cancel"
      >
        <div className='p-3'>
          <EditdanDetailLokasi 
            tokoData={tokoData}
            onClose={handleCancel}
            onSuccess={handleSuccess}
          />
        </div>
      </Modal>
    </div>
  )
}

export default TabLokasi
