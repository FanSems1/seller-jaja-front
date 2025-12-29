import React, { useState, useEffect } from 'react'
import Informasi from './tabs-pengaturan/Informasi';
import TabLokasi from './tabs-pengaturan/TabLokasi';
import TabPengiriman from './tabs-pengaturan/TabPengiriman';
import TabJadwalToko from './tabs-pengaturan/TabJadwalToko';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Tabs, message, Spin } from 'antd';
import { BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL, apiFetch } from '../../configs/api';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';


const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Informasi',
    children: <Informasi />,
  },
  {
    key: '2',
    label: 'Lokasi',
    children: <TabLokasi />,
  },
  {
    key: '3',
    label: 'Pengiriman',
    children: <TabPengiriman />,
  },
  {
    key: '4',
    label: 'Jadwal Toko',
    children: <TabJadwalToko/>,
  },
  
];


function PengaturanToko() {
  const [namaToko, setNamaToko] = useState('');
  const [loading, setLoading] = useState(true);

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
        console.log('Toko response:', res);
        const toko = res.data || res.toko;
        if (toko) {
          setNamaToko(toko.nama_toko || '');
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
  return (
    <div className=" mb-8 ">
      
      
            <Card>
              <div className='w-full flex pl-5 pt-5 pr-5 '>
                <div className='w-1/2'>
                  <h1 className=" text-2xl font-bold text-start">
                    PENGATURAN TOKO
                  </h1>
                 
                </div>
      
               
              </div>
      
              <hr className="mt-5" />
            <CardBody>
              <div className=''>
                <div className='flex w-full space-x-4'>
                    <div className='flex justify-center items-center'>
                    <BuildingStorefrontIcon className='w-10 h-10'/>
                    </div>
                    {loading ? (
                      <Spin />
                    ) : (
                      <div className='flex justify-center items-center text-xl font-bold mt-2'>
                        {namaToko || 'Toko Anda'}
                      </div>
                    )}         
                  
                </div>
              </div>
              <br />
                <Tabs
                  defaultActiveKey="1"
                  items={items.map((item) => ({
                    ...item,
                    label: (
                      <span className="tab-label text-lg font-bold">
                        {item.label}
                      </span>
                    ),
                  }))}
                  onChange={onChange}
                  type="card"
                  tabBarStyle={{ marginBottom: '0' }}
                  renderTabBar={(props, DefaultTabBar) => (
                    <DefaultTabBar {...props} className="custom-tab-bar" />
                  )}
                />
            </CardBody>
      </Card>
    </div>
  )
}

export default PengaturanToko;
