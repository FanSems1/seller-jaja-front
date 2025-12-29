import React, { useState, useEffect } from 'react'
import sicepat from "../../../assets/pengiriman/sicepat.png"
import jne from "../../../assets/pengiriman/jne.png"
import jnt from "../../../assets/pengiriman/jnt.png"
import { Button, Checkbox, Tag, message, Spin } from 'antd'
import { API_BASE_URL, apiFetch } from '../../../configs/api';

const shippingOptions = [
  {
    src: sicepat,
    alt: 'SiCepat',
    company: 'SiCepat Express',
    imgClass: 'w-28 h-10',
  },
  {
    src: jnt,
    alt: 'J&T',
    company: 'J&T Express',
    imgClass: 'w-20 h-8',
  },
  {
    src: jne,
    alt: 'JNE',
    company: 'JNE',
    imgClass: 'w-20 h-20',
  },
];

function TabPengiriman() {
  const [loading, setLoading] = useState(true);
  const [tokoData, setTokoData] = useState(null);
  const [selectedCouriers, setSelectedCouriers] = useState([]);

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
          // Parse pilihan_kurir
          try {
            const couriers = JSON.parse(toko.pilihan_kurir || '[]');
            setSelectedCouriers(couriers);
          } catch (e) {
            console.error('Error parsing pilihan_kurir:', e);
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

  if (loading) {
    return <Spin />;
  }

  return (
    <div className='mt-10'>
      <h1 className='text-xl font-semibold'>
        Kurir Pengiriman
      </h1>
      <br />
      <hr />
      <br />


      <div className='w-full'>
          <h1 className='text-xl font-semibold'>
            Reguler
          </h1>
          <div className='w-full flex mt-6 space-x-5'>
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className='w-1/2 flex bg-[#f3f4f7] border border-[#e2e7f1] rounded-md'
              >
                <div className='w-full flex p-4'>
                  <div className='w-[3rem] flex items-center'>
                    <input
                      type="checkbox"
                      checked={selectedCouriers.includes(option.alt.toLowerCase())}
                      onChange={() => {
                        setSelectedCouriers(prev => 
                          prev.includes(option.alt.toLowerCase())
                            ? prev.filter(c => c !== option.alt.toLowerCase())
                            : [...prev, option.alt.toLowerCase()]
                        );
                      }}
                      className={`form-checkbox h-5 w-5 ${selectedCouriers.includes(option.alt.toLowerCase()) ? 'text-[#64b0c9]' : 'text-gray-600'}`}
                    />
                  </div>
                  <div className='w-1/3 flex items-center'>
                    <img src={option.src} alt={option.alt} className={option.imgClass} />
                  </div>
                  <div className='w-1/2'>
                    <p className='text-lg font-semibold text-[#6c757d]'>
                      {option.company}
                    </p>
                    <p className='mt-2'>
                      <Tag color='blue'>
                        Reguler
                      </Tag>
                    </p>
                  </div>
                </div>
              </div>
            ))}

     
          </div>
      </div>

      <br />
      <div className='w-full flex justify-end items-end'>
        <Button className='bg-blue-500 text-white h-10 text-lg'>
          Simpan
        </Button>
      </div>
    </div>
  )
}

export default TabPengiriman
