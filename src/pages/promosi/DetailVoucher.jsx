import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import {Alert, Button, DatePicker, Flex, Input, Radio, Select, Upload } from 'antd';
import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

const { Option } = Select;

function DetailVoucher() {
    const [value, setValue] = useState('Semua Produk');
    const onChange = e => {
        setValue(e.target.value);
    };

    const [variasiList, setVariasiList] = useState([]);

    const tambahVariasi = () => {
        setVariasiList([...variasiList, {
        tipeVariasi: '',
        namaVariasi: ''
        }]);
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const newList = [...variasiList];
        newList[index][name] = value;
        setVariasiList(newList);
    };

    const handleButtonClick = () => {
        setShowCard(!showCard);
    };

     // Upload Foto 
     const getBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

        const [previewOpen, setPreviewOpen] = useState(false);
            const [previewImage, setPreviewImage] = useState('');
            const [fileList, setFileList] = useState([
                {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                
             
            ]);
            const handlePreview = async (file) => {
                if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
                }
                setPreviewImage(file.url || file.preview);
                setPreviewOpen(true);
            };
            const handleChanges = ({ fileList: newFileList }) => setFileList(newFileList);
            const uploadButton = (
                <button
                style={{
                    border: 0,
                    background: 'none',
                }}
                type="button"
                >
                <PlusIcon />
                <div
                    style={{
                    marginTop: 8,
                    }}
                >
                    Upload
                </div>
                </button>
            );


            

  return (
    <div className=" mb-8 ">
   
   
         <Card>
           <div className='w-full flex pl-5 pt-5 pr-5 '>
             <div className='w-1/2'>
               <h1 className=" text-2xl font-bold text-start">
                 DETAIL DAN EDIT VOUCHER
               </h1>
              
             </div>
   
            
           </div>
   
           <hr className="mt-5" />
            <CardBody>
                    <div>
                        <h1 className='text-xl font-semibold mb-4'>
                            Informasi Voucher
                        </h1>
                        <hr />

                        <div className='w-full flex mt-8'>
                            <div className='w-1/3 text-lg'>
                                <label>Kode Voucher <span className='text-red-500'>*</span></label>
                            </div>
                            <div className='w-full'>
                                <Input className='h-10 w-[50%]'  />
                            </div>
                        </div>
                        <div className='w-full flex mt-8'>
                            <div className='w-1/3 text-lg'>
                                <label>Nama Voucher <span className='text-red-500'>*</span></label>
                            </div>
                            <div className='w-full'>
                                <Input className='h-10 w-[50%]'  />
                            </div>
                        </div>
                        <div className='w-full flex mt-8'>
                            <div className='w-1/3 text-lg'>
                                <label>Target Voucher  <span className='text-red-500'>*</span></label>
                            </div>
                            <div className='w-full'>
                                <Radio.Group onChange={onChange} value={value} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Radio className='mb-2 text-lg' value="Semua Produk">Semua Produk</Radio>
                                    <Radio className='text-lg' value="Per-Kategori">Per-Kategori</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className='w-full flex mt-5'>
                            <div className='w-1/3 text-lg'>
                                <label>Target Voucher  <span className='text-red-500'>*</span></label>
                            </div>
                            <div className='w-full'>
                                    <Select
                                        showSearch  
                                        defaultValue="Dalam Rupiah"
                                        className="w-[50%] mt-2 h-10"
                                        placeholder="Dalam Rupiah"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                          }
                                          filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                          }
                                    >
                                        <Option value="Dalam Rupiah">Dalam Rupiah</Option>
                                        <Option value="Dalam Presentase">Dalam Presentase</Option>
                                    </Select>
                                    <div className='mt-2'>
                                        <Input className='w-[50%] ' type='number' 
                                        addonBefore={<span className='h-10 '>Rp.</span>}
                                        placeholder='20.000'/>
                                    </div>
                            </div>
                        </div>
                        <div className='w-full flex mt-8'>
                            <div className='w-1/3 text-lg'>
                                <label>Minimum Pembelian  <span className='text-red-500'>*</span></label>
                            </div>
                            <div className='w-full'>
                                    <Input className='w-[50%] ' type='number' 
                                        addonBefore={<span className='h-10 '>Rp.</span>}
                                        placeholder='50.000'/>
                            </div>
                        </div>
                        <div className='w-full flex mt-8'>
                            <div className='w-1/3 text-lg'>
                                <label>Kuota Voucher   <span className='text-red-500'>*</span></label>
                            </div>
                            <div className='w-full'>
                                    <Input className='w-[50%] h-10' type='number'
                                        placeholder='10'/>
                            </div>
                        </div>
                    </div>
            </CardBody>
        </Card>


        <br />
        {/* Periode */}
        <>
        <Card>
            <CardBody>
                <div>
                    <h1 className='text-xl font-semibold mb-4'>
                        Periode
                    </h1>
                    <hr />
                </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Tanggal Mulai  <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <DatePicker className='h-10 w-[50%]' placeholder='06 Jun 2024' />
                        </div>
                    </div>
                    <div className='w-full flex mt-8'>
                        <div className='w-1/3 text-lg'>
                            <label>Tanggal Berakhir  <span className='text-red-500'>*</span></label>
                        </div>
                        <div className='w-full'>
                            <DatePicker className='h-10 w-[50%]' placeholder='30 Jun 2024'  />
                        </div>
                    </div>

            </CardBody>
        </Card>
        </>

        <br />
        {/* Periode */}
        <>
        <Card>
            <CardBody>
                
                    <div>
                        <h1 className='text-xl font-semibold mb-4'>
                            Foto Produk
                        </h1>
                        <hr />

                        <Alert className='h-14 p-5' 
                        message={
                            [
                                <div>
                                    <div className='text-base'>
                                        <b>Info</b> : Gunakan foto yang memiliki kecerahan cukup, disarankan untuk mengatur bagian foto yang ingin di crop. 
                                    </div>
                                </div>
                            ]
                        }
                        type="warning" 
                        />
                    </div>

                    {/* Upload */}
                    <div className='mt-10 flex justify-center'>
                    <>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChanges}
                            beforeUpload={() => false}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
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
                    
            </CardBody>
        </Card>
        </>

        {/* Button */}
        <br />
        <>
            <div className='w-full flex space-x-2 justify-end items-end'>
                <Button className='h-14 bg-blue-gray-300 text-gray-800 text-lg'>
                    Batal
                </Button>
                <Button className='h-14 bg-blue-500 text-white text-lg'>
                    Edit Voucher
                </Button>
            </div>
        </>
    </div>
  )
}

export default DetailVoucher
