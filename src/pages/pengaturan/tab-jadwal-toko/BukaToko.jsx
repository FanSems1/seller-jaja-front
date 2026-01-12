import { Card, CardBody } from '@material-tailwind/react'
import { Alert, Button, Select, Tag, message, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { API_BASE_URL, apiFetch } from '../../../configs/api';

const { Option } = Select;

function BukaToko() {
    const [loading, setLoading] = useState(true);
    const [tokoData, setTokoData] = useState(null);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const daysLabel = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const [selectedDays, setSelectedDays] = useState({});
    const [timeOpen, setTimeOpen] = useState('08:00');
    const [timeClose, setTimeClose] = useState('22:00');

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

    // Fetch toko detail (factored to allow retry)
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
          // Parse data_buka_toko
          try {
            const bukaData = JSON.parse(toko.data_buka_toko || '{}');
            const daysActive = (bukaData.days || 'monday,tuesday,wednesday,thursday,friday,saturday,sunday').split(',');
            const activeDaysMap = {};
            days.forEach(day => {
              activeDaysMap[day] = daysActive.includes(day.toLowerCase());
            });
            setSelectedDays(activeDaysMap);
            setTimeOpen(bukaData.time_open || '08:00');
            setTimeClose(bukaData.time_close || '22:00');
          } catch (e) {
            console.error('Error parsing data_buka_toko:', e);
            // Default all days
            const defaultDays = {};
            days.forEach(day => {
              defaultDays[day] = true;
            });
            setSelectedDays(defaultDays);
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

    const handleButtonClick = (day) => {
      setSelectedDays((prevSelectedDays) => ({
        ...prevSelectedDays,
        [day]: !prevSelectedDays[day],
      }));
    };

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
      <h1 className='text-lg font-bold text-[#6c757d]'>
        Atur jadwal toko kamu
      </h1>
      <p className='text-base text-[#7f8488]'>
        Tentukan hari dan jam berapa tokomu bisa melayani pembeli. Kamu masih bisa menerima pesanan dari pembeli meskipun telah melewati jadwal buka tokomu.
      </p>
      <br />

      <div >
        <Alert className='p-5 text-base' message={
            [
                <div className='text-[#7f8488]'>
                    Toko akan dianggap buka 7 hari 24 jam jika kamu tidak mengubah jadwal hari dan jam buka-tutup toko.
                </div>
            ]
        } type="info" showIcon />
      </div>

      <br />
      <Card className='border border-solid shadow-lg'>
        <CardBody>
            <div>
                <Tag color='#43d39e' className='text-base'>
                    Terjadwal
                </Tag>
            </div>

            <br />
            <div className='w-full flex space-x-10'>
                <div className='w-1/2'>
                <label className='text-base'>Pilih hari</label>
                <div className="mt-5 w-full flex flex-wrap space-x-2">
                        {days.map((day, idx) => (
                            <Button
                            key={day}
                            onClick={() => handleButtonClick(day)}
                            className={`border-none text-base font-semibold m-1 h-10 flex-grow ${
                                selectedDays[day] ? 'bg-[#64bddd] text-white' : 'bg-[#e3e3e3] text-[#6c757d]'
                            }`}
                            >
                            {daysLabel[idx]}
                            </Button>
                        ))}
                    </div>
                </div>


                <div className='w-1/2'>
                        <div className='w-full flex space-x-4'>
                            <div className='w-1/3'>
                                <div>
                                    <label className='text-lg font-semibold text-[#6c757d]'>Jam Buka</label>
                                </div>
                                <br />
                                <input 
                                  type="time"
                                  value={timeOpen}
                                  onChange={(e) => setTimeOpen(e.target.value)}
                                  className='w-full h-10 border border-gray-300 rounded px-2'
                                />
                            </div>

                            {/*  */}
                            <div className='w-1/3'>
                                <div>
                                    <label className='text-lg font-semibold text-[#6c757d]'>Jam Tutup</label>
                                </div>
                                <br />
                                <input 
                                  type="time"
                                  value={timeClose}
                                  onChange={(e) => setTimeClose(e.target.value)}
                                  className='w-full h-10 border border-gray-300 rounded px-2'
                                />
                            </div>
                            
                            {/*  */}
                            <div className='w-1/3'>
                                <div>
                                    <label className='text-lg font-semibold text-[#6c757d]'>Zona Waktu</label>
                                </div>
                                <br />
                                <Select
                                    showSearch
                                    className="w-full  h-10"
                                    placeholder="Pilih Waktu"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                        filterSort={(optionA, optionB) =>
                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                        }
                                        >
                                        <Option value="WIB">WIB</Option>
                                        <Option value="WITA">WITA</Option>
                                        <Option value="WIT">WIT</Option>
                                </Select>
                            </div>
                        </div>
                </div>
            </div>
        </CardBody>
      </Card>
      <br />
      <div className='w-full flex space-x-2 justify-end'>
          <Button  className='bg-red-400 text-white text-lg h-10'>
            Reset
          </Button>
          <Button className='bg-blue-400 text-white text-lg h-10'>
            Simpan
          </Button>
        </div>
    </div>
  )
}

export default BukaToko
