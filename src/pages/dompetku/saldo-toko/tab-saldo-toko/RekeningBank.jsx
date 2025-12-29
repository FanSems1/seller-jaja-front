import { PlusIcon } from '@heroicons/react/24/solid';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Button, Modal } from 'antd';
import React, { useState } from 'react'
import TambahRekeningBank from './TambahRekeningBank';
import Chip from "../../../../assets/rekening/Chip.png"
import MaskedNumber from '../../penghasilan-toko/MaskedNumber';
import DetailRekening from './DetailRekening';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

function RekeningBank() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Detail Rekening
  const [isModalVisibleDetail, setIsModalVisibleDetail] = useState(false);

  const showModalDetail = () => {
    setIsModalVisibleDetail(true);
  };

  const handleOkDetail = () => {
    setIsModalVisibleDetail(false);
  };

  const handleCancelDetail = () => {
    setIsModalVisibleDetail(false);
  };
  return (
     <div className=" mb-8 ">
    
    
          <Card>
            <div className='w-full flex pl-5 pt-5 pr-5 '>
              <div className='w-1/2'>
                <h1 className=" text-2xl font-bold text-start">
                 REKENING BANK
                </h1>
              
              </div>
    
             
            </div>
    
            <hr className="mt-5" />
    
          <CardBody>
            <h1 className='text-xl font-semibold'>
              Rekening Toko (Maksimal 2 Rekening)
            </h1>
            <br />
            <hr />
            <br />
            <div className='w-full rounded-lg'>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add account card */}
                <div>
                  <Button onClick={showModal} className='w-full h-48 bg-white border border-dashed rounded-lg flex flex-col justify-center items-center'>
                    <PlusIcon className='w-8 h-8 font-bold text-gray-600' />
                    <p className='mt-3 text-gray-600 font-medium'>Tambah Rekening Bank</p>
                    <p className='text-sm text-gray-400 mt-2'>Maksimal 2 rekening</p>
                  </Button>
                </div>

                {/* Existing account card - modern e-commerce style (responsive) */}
                <div className=''>
                  <div className='w-full bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div className='flex items-start sm:items-center gap-4 min-w-0'>
                      <div className='w-16 h-16 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0'>BM</div>
                      <div className='min-w-0'>
                        <div className='text-sm text-gray-500 truncate'>PT. Bank Mandiri (PERSERO) TBK.</div>
                        <div className='text-lg font-semibold text-gray-900 mt-1 flex items-center gap-3'>
                          <MaskedNumber number="12341587" />
                        </div>
                        <div className='text-sm text-gray-500 mt-1 truncate'>FEBRIANSYAH ADI PUTRA</div>
                      </div>
                    </div>

                    <div className='flex flex-col sm:items-end sm:justify-between gap-3'>
                      <div className='flex items-center gap-2 flex-wrap justify-end'>
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700'>UTAMA</span>
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-600 text-white'>Terverifikasi</span>
                      </div>

                      <div className='flex items-center gap-2 flex-wrap justify-end'>
                        <button onClick={showModalDetail} className='inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 100 12A6 6 0 0010 2zM2 10a8 8 0 1116 0A8 8 0 012 10z"/></svg>
                          <span>Detail</span>
                        </button>
                        <button className='inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm text-indigo-600 hover:bg-indigo-50'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/></svg>
                          <span>Edit</span>
                        </button>
                        <button className='inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm text-red-600 hover:bg-red-50'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 6a1 1 0 012 0v7a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd"/></svg>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>


        {/* Modal Tambah Tabungan */}
        <Modal 
        width={1000}
        title={[
          <div className='text-2xl font-semibold'>
            Tambah Rekening Bank
          
            <hr className='mt-5 mb-5' />
           
          </div>
          
        ]}
        footer={false}
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        centered
        className="custom-modal"
      >
       <TambahRekeningBank/>
      
      </Modal>


      {/* Modal Detail Rekening */}
      <Modal 
        width={900}
        title={[
          <div className='text-2xl font-semibold'>
            Detail Rekening Bank
          
            <hr className='mt-5 mb-5' />
           
          </div>
          
        ]}
        footer={false}
        visible={isModalVisibleDetail} 
        onOk={handleOkDetail} 
        onCancel={handleCancelDetail}
        centered
        className="custom-modal"
      >
       <DetailRekening/>
      
      </Modal>

    </div>
  )
}

export default RekeningBank
