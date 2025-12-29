import React from 'react'
import MaskedNumber from '../../penghasilan-toko/MaskedNumber'
import { Button, Tag } from 'antd'
import Swal from 'sweetalert2';

function DetailRekening() {

    const handleDelete = () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus saja!',
            cancelButtonText: 'Batalkan'
        }).then((result) => {
            if (result.isConfirmed) {
                // Hapus item di sini
                Swal.fire(
                    'Dihapus!',
                    'Item berhasil dihapus.',
                    'success'
                );
            }
        });
    };

  return (
    <div className='mt-5'>
     <div className='flex w-full'>
        <div className='w-1/2'>
            <div className='mb-5'>
                <label className='text-sm text-gray-500'>Atas Nama</label>
                <div className='text-lg'>
                    FEBRIANSYAH ADI PUTR
                </div>
            </div>

            <div className='mb-5'>
                <label className='text-sm text-gray-500'>No. Rekening</label>
                <div className='text-lg'>
                    <MaskedNumber number="1234 1587" />
                </div>
            </div>

            <div className='mb-5'>
                <label className='text-sm text-gray-500'>Kota/Kabupaten</label>
                <div className='text-lg'>
                    Bekasi
                </div>
            </div>

        </div>
        <div className='w-1/2'>
            <div className='mb-5'>
                <label className='text-sm text-gray-500'>Bank</label>
                <div className='text-lg'>
                    PT. BANK MANDIRI (PERSERO) TBK.
                </div>
            </div>

            <div className='mb-5'>
                <label className='text-sm text-gray-500'>Kantor Cabang</label>
                <div className='text-lg'>
                    Bekasi
                </div>
            </div>

            <div className='mb-5'>
                <label className='text-sm text-gray-500'>Status</label>
                <div className='text-lg'>
                    <Tag color='green'>Terverifikasi</Tag>
                </div>
            </div>
        </div>
     </div>

     <div className='w-full flex'>
        <div className='w-full flex space-x-2 justify-end items-end'>
            
            <Button onClick={handleDelete} className='h-10 bg-white border border-red-500 text-red-500 text-lg'>
                Hapus
            </Button>
        </div>
     </div>
    </div>
  )
}

export default DetailRekening
