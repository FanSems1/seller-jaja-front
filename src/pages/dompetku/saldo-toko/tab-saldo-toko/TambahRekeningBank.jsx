import { Button, Input, Select } from 'antd';
import React from 'react'

const { Option } = Select;

function TambahRekeningBank() {
  return (
    <div className='w-full  mt-5'>
        <div className='w-full flex mt-8'>
            <div className='w-1/3 text-lg'>
            <label>Bank
                <span className='text-red-500 ml-2'>*
                </span>
            </label>
            </div>
            <div className='w-full'>
                <Select
                showSearch 
                className="w-full h-10"
                placeholder="Pilih Bank"
                filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                >
                    <Option value="PT. BANK MANDIRI">PT. BANK MANDIRI</Option>
                    <Option value="PT. BANK ACEH">PT. BANK ACEH</Option>
                    <Option value="PT. BANK BCA">PT. BANK BCA</Option>
                    <Option value="PT. BANK BNI">PT. BANK BNI</Option>
                    
                    </Select>
            </div>
        </div>
                 
        <div className='w-full flex mt-8'>
            <div className='w-1/3 text-lg'>
                <label>Nomor Rekening 
                    <span className='text-red-500 ml-2'>*</span>
                </label>
            </div>
            <div className='w-full'>
                <Input className='h-10 w-full'  placeholder='Masukkan Nomor Rekening'/>
            </div>
        </div>
        <div className='w-full flex mt-8'>
            <div className='w-1/3 text-lg'>
                <label>Kantor Cabang 
                    <span className='text-red-500 ml-2'>*</span>
                </label>
            </div>
            <div className='w-full'>
                <Input className='h-10 w-full'  placeholder='Masukkan Kantor Cabang'/>
            </div>
        </div>
        <div className='w-full flex mt-8'>
            <div className='w-1/3 text-lg'>
                <label>Kota/Kabupaten 
                    <span className='text-red-500 ml-2'>*</span>
                </label>
            </div>
            <div className='w-full'>
                <Input className='h-10 w-full'  placeholder='Masukkan Kota/Kabupaten'/>
            </div>
        </div>


        <br />
        <>
            <div className='w-full flex space-x-2 justify-end items-end'>
                <Button className='h-12 bg-red-400 text-white text-lg'>
                    Batal
                </Button>
                <Button className='h-12 bg-blue-400 text-white text-lg'>
                    Simpan
                </Button>
            </div>
        </>
    </div>
  )
}

export default TambahRekeningBank
