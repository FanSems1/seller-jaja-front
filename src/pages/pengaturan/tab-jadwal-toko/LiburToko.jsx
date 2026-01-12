import { Card, CardBody } from '@material-tailwind/react'
import { Button, message, Spin, DatePicker, Alert } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState, useEffect } from 'react'
import { API_BASE_URL, apiFetch } from '../../../configs/api';

function LiburToko() {
  const [loading, setLoading] = useState(true);
  const [tokoData, setTokoData] = useState(null);
  const [liburData, setLiburData] = useState(null);

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

  // Fetch toko detail (factored for retry)
  const [fetchError, setFetchError] = useState(null);

  const fetchTokoDetail = async () => {
    try {
      setFetchError(null);
      setLoading(true);
      const slugToko = getSlugToko();
      if (!slugToko) {
        message.error('Slug toko tidak ditemukan');
        setFetchError('Slug toko tidak ditemukan');
        return;
      }

      const res = await apiFetch(`${API_BASE_URL}/main/toko/${slugToko}`);
      const toko = res.data || res.toko;
      if (toko) {
        setTokoData(toko);
        // Parse data_libur_toko if exists
        if (toko.data_libur_toko && toko.data_libur_toko !== 'null') {
          try {
            const liburInfo = JSON.parse(toko.data_libur_toko);
            setLiburData(liburInfo);
          } catch (e) {
            console.error('Error parsing data_libur_toko:', e);
          }
        }
      } else {
        const msg = res.message || 'Gagal memuat data toko';
        message.error(msg);
        setFetchError(msg);
      }
    } catch (error) {
      console.error('Error fetching toko detail:', error);
      const msg = error.message || 'Gagal memuat data toko';
      message.error(msg);
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokoDetail();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (fetchError) {
    return (
      <div className='p-4 mt-4'>
        <Alert message="Gagal memuat data toko" description={fetchError} type="error" showIcon />
        <div className='mt-4'>
          <Button type="primary" onClick={() => fetchTokoDetail()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }
  return (
    <div className='p-4 mt-4'>
       <Card className='border border-solid shadow-lg'>
          <CardBody>
              <h1 className='text-xl font-bold text-[#6c757d]'>
              Atur jadwal libur toko
              </h1>
              <br />
              <hr />
              <br />


              <div className='w-full flex space-x-5'>
                <div className='w-1/4'>
                   <label className='text-lg text-[#6c757d] font-semibold'> Mulai Tanggal </label>
                   <DatePicker className='w-full h-10 mt-2 '/>
                </div>
                <div className='w-1/4'>
                   <label className='text-lg text-[#6c757d] font-semibold'> Berakhir Tanggal </label>
                   <DatePicker className='w-full h-10 mt-2 '/>
                </div>
              </div>

              <br />
              <div className='w-full '>
                <label className='text-lg text-[#6c757d] font-semibold'>Catatan :</label>
                <TextArea showCount maxLength={100} className='w-full mt-2'  />
              </div>

            
              <div className='w-full flex space-x-2 justify-end pt-12'>
                <Button className='bg-blue-400 text-white text-lg h-10 '>
                  Simpan
                </Button>
              </div>
          </CardBody>
       </Card>

    </div>
  )
}

export default LiburToko
