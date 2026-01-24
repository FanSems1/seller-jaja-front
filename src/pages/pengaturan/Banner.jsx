import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography, Button, Avatar } from '@material-tailwind/react';
import { Modal, Upload, Input, Select, Switch, InputNumber, Spin, Pagination } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { BANNER_ENDPOINTS, apiFetch } from '@/configs/api';
import Swal from 'sweetalert2';

const { Option } = Select;

function BannerPage() {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [link, setLink] = useState('');
  const [type, setType] = useState('web');
  const [isPlatform, setIsPlatform] = useState(true);
  const [status, setStatus] = useState(0);
  const [sort, setSort] = useState(1);
  const [saving, setSaving] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchBanners = async (pageParam = page, pageSizeParam = pageSize, statusParam = statusFilter) => {
    setLoading(true);
    try {
      let url = `${BANNER_ENDPOINTS.LIST}?page=${pageParam}&limit=${pageSizeParam}`;
      if (statusParam !== '' && statusParam !== null && statusParam !== undefined) {
        url += `&status=${statusParam}`;
      }
      const res = await apiFetch(url, { method: 'GET' });
      let items = res.data || [];
      // sort client-side by 'sort' field
      items = items.sort((a, b) => {
        const va = Number(a.sort) || 0;
        const vb = Number(b.sort) || 0;
        return sortOrder === 'asc' ? va - vb : vb - va;
      });
      setBanners(items);
      setTotal(res.pagination?.total || 0);
      // keep page in sync with response if backend returns page
      setPage(res.pagination?.page || pageParam);
      setPageSize(res.pagination?.limit || pageSizeParam);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, showConfirmButton: false, timer: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners(page, pageSize, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, statusFilter, sortOrder]);

  const openModal = () => {
    setFileList([]);
    setLink('');
    setType('web');
    setIsPlatform(true);
    setStatus(0);
    setSort(1);
    setEditingId(null);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (data) => {
    // data is the banner detail object
    setFileList([]); // cannot prefill file inputs; user may upload a new file
    setLink(data.link || '');
    setType(data.type || 'web');
    setIsPlatform(Boolean(data.is_platform));
    setStatus(Number(data.status) || 0);
    setSort(Number(data.sort) || 1);
    setEditingId(data.id_data);
    setPreviewImage(data.banner_url || null);
    setIsModalOpen(true);
  };

  const handleUploadChange = ({ fileList: fl }) => {
    setFileList(fl.slice(-1));
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      // For edit, allow no new file (keep existing), but for create require file
      if (!editingId) {
        Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Pilih file banner terlebih dahulu' });
        return;
      }
    }

    const file = fileList[0].originFileObj || fileList[0];
    const formData = new FormData();
    if (file) formData.append('banner', file);
    formData.append('link', link || '#');
    formData.append('type', type);
    formData.append('is_platform', isPlatform ? '1' : '0');
    formData.append('status', String(status));
    formData.append('sort', String(sort));

    try {
      setSaving(true);
      let res = null;
      if (editingId) {
        // Update existing banner via PUT
        res = await apiFetch(BANNER_ENDPOINTS.UPDATE(editingId), { method: 'PUT', body: formData });
      } else {
        res = await apiFetch(BANNER_ENDPOINTS.CREATE, { method: 'POST', body: formData });
      }

      // Use API response message if available
      const successMessage = (res && (res.message || res.msg)) || (editingId ? 'Banner berhasil diperbarui' : 'Banner berhasil dibuat');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        html: `<div style="font-weight:600">${successMessage}</div>`,
        showConfirmButton: false,
        timer: 1500,
        background: '#fff'
      });

      setIsModalOpen(false);
      setEditingId(null);
      setPreviewImage(null);
      fetchBanners();
    } catch (err) {
      // Show a modern error modal with details (auto-close, no OK button)
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        html: `<div style="font-weight:600">${err.message || 'Terjadi kesalahan'}</div>`,
        showConfirmButton: false,
        timer: 2000,
        background: '#fff'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <style>{`
        /* Make modal OK button a solid blue and disable hover color change */
        .banner-modal-ok {
          background-color: #2563EB !important;
          border-color: #2563EB !important;
          color: #fff !important;
          box-shadow: none !important;
        }
        .banner-modal-ok:hover {
          background-color: #2563EB !important;
          filter: none !important;
        }
        /* Ensure badge inside detail modal doesn't overflow */
        .banner-detail-badge { position: relative; z-index: 2; display: inline-block; }
      `}</style>
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Typography variant="h5" className="font-bold">Banner</Typography>
              <Typography className="text-sm text-gray-500">Kelola banner website dan mobile Anda</Typography>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onChange={(v) => { setStatusFilter(v); setPage(1); }}
                className="w-40"
                size="middle"
                allowClear
                placeholder="Filter Status"
                options={[
                  { label: 'Semua', value: '' },
                  { label: 'Active', value: 1 },
                  { label: 'Inactive', value: 0 },
                ]}
              />

              <Select
                value={sortOrder}
                onChange={(v) => setSortOrder(v)}
                className="w-36"
                size="middle"
                options={[
                  { label: 'Sort: Asc', value: 'asc' },
                  { label: 'Sort: Desc', value: 'desc' },
                ]}
              />

              <Button color="green" variant="gradient" onClick={openModal} className="flex items-center gap-2">
                <PlusOutlined /> Upload Banner
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Spin size="large" /></div>
          ) : (
            <>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              {banners.map((b) => (
                <div key={b.id_data} className="border rounded-xl overflow-hidden shadow-sm bg-white">
                  <div className="relative bg-gray-50 h-36 sm:h-44 md:h-48 lg:h-44">
                    <img
                      src={b.banner_url}
                      alt={b.nama_file}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        // Fallback to a local placeholder when remote image cannot be loaded
                        try {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/img/home-decor-1.jpeg';
                        } catch (err) {
                          // no-op
                        }
                      }}
                    />
                    {/* overlay badges */}
                    <div className="absolute left-3 top-3 flex gap-2 z-20">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${b.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'} banner-detail-badge`}>
                        {b.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-white/60 text-gray-700">{b.type}</span>
                    </div>

                    {/* delete icon top-right */}
                    <div className="absolute right-3 top-3 z-30">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const confirm = await Swal.fire({
                            title: 'Hapus banner?',
                            text: 'Banner akan dihapus permanen.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#2563EB',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Hapus',
                          });
                          if (confirm.isConfirmed) {
                            try {
                              const res = await apiFetch(BANNER_ENDPOINTS.DELETE(b.id_data), { method: 'DELETE' });
                              const msg = (res && (res.message || res.msg)) || 'Banner berhasil dihapus';
                              Swal.fire({ icon: 'success', title: 'Berhasil', text: msg, showConfirmButton: false, timer: 1500, background: '#fff' });
                              fetchBanners();
                            } catch (err) {
                              Swal.fire({ icon: 'error', title: 'Gagal', text: err.message || 'Gagal menghapus', showConfirmButton: false, timer: 2000, background: '#fff' });
                            }
                          }
                        }}
                        className="p-1 rounded bg-white/80 hover:bg-white"
                        aria-label="Hapus banner"
                      >
                        <DeleteOutlined className="text-red-600" />
                      </button>
                    </div>

                    {/* actions removed from image overlay; rendered below image near name */}
                  </div>
                  <div className="p-4 relative z-10">
                    <div className="flex items-center justify-between flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate" title={b.nama_file} style={{ maxWidth: '100%' }}>
                          {b.nama_file ? (b.nama_file.length > 13 ? `${b.nama_file.slice(0,13)}...` : b.nama_file) : ''}
                        </div>
                        <div className="text-xs text-gray-500">Sort: {b.sort}</div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setDetailModalOpen(true);
                            setDetailLoading(true);
                            setSelectedBanner(null);
                            try {
                              const res = await apiFetch(BANNER_ENDPOINTS.DETAIL(b.id_data), { method: 'GET' });
                              setSelectedBanner(res.data || null);
                            } catch (err) {
                              Swal.fire({ icon: 'error', title: 'Error', text: err.message, showConfirmButton: false, timer: 2000 });
                            } finally {
                              setDetailLoading(false);
                            }
                          }}
                          className="p-1.5 md:p-2 bg-white/90 rounded shadow-sm hover:shadow-md"
                          aria-label="Lihat banner"
                        >
                          <EyeOutlined className="text-blue-600" />
                        </button>

                        <div className="flex items-center">
                          <Switch
                            checked={b.status === 1}
                            onChange={async (checked, e) => {
                              if (e && e.stopPropagation) e.stopPropagation();
                              try {
                                await apiFetch(BANNER_ENDPOINTS.UPDATE(b.id_data), { method: 'PUT', body: JSON.stringify({ status: checked ? 1 : 0 }) });
                                Swal.fire({ icon: 'success', title: 'Berhasil', text: `Status diperbarui`, showConfirmButton: false, timer: 1200 });
                                fetchBanners();
                              } catch (err) {
                                Swal.fire({ icon: 'error', title: 'Gagal', text: err.message || 'Gagal mengubah status', showConfirmButton: false, timer: 2000 });
                              }
                            }}
                          />
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(b); }}
                          className="p-1.5 md:p-2 bg-white/90 rounded shadow-sm hover:shadow-md"
                          aria-label="Edit banner"
                        >
                          <EditOutlined className="text-indigo-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {banners.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">Belum ada banner.</div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger={false}
                onChange={(p, ps) => {
                  // update state which triggers useEffect to refetch
                  setPage(p);
                  if (ps && ps !== pageSize) setPageSize(ps);
                }}
                showTotal={(t) => `Total ${t} banner`}
              />
            </div>
            </>
          )}
        </CardBody>
      </Card>

      <Modal
        title={<div className="font-semibold">Upload Banner</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okButtonProps={{ loading: saving, className: 'banner-modal-ok', style: { borderColor: '#2563EB' } }}
        cancelButtonProps={{ style: { borderColor: '#e5e7eb' } }}
        width={720}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Gambar Banner</label>
            {previewImage && (
              <div className="mb-3">
                <img src={previewImage} alt="preview" className="w-full h-32 object-cover rounded" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src='/img/home-decor-1.jpeg'; }} />
              </div>
            )}
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleUploadChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
            </Upload>
            <div className="text-xs text-gray-400 mt-2">Format JPG/PNG. Rekomendasi ukuran: 1200x400</div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Link (opsional)</label>
            <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://contoh.link" />

            <label className="text-sm font-medium mb-2 block mt-3">Type</label>
            <Select value={type} onChange={(val) => setType(val)} className="w-full">
              <Option value="web">web</Option>
              <Option value="mobile">mobile</Option>
            </Select>

            <div className="flex items-center justify-between mt-3">
              <div>
                <label className="text-sm font-medium">Platform</label>
                <div className="text-xs text-gray-500">Tandai jika banner untuk platform</div>
              </div>
              <Switch checked={isPlatform} onChange={(v) => setIsPlatform(v)} />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="w-1/2">
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={status} onChange={(v) => setStatus(v)}>
                  <Option value={0}>Inactive</Option>
                  <Option value={1}>Active</Option>
                </Select>
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium mb-1 block">Sort</label>
                <InputNumber min={0} value={sort} onChange={(v) => setSort(v)} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={null}
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={880}
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100 p-4 flex items-center justify-center">
            {detailLoading ? (
              <div className="py-12"><Spin size="large" /></div>
            ) : selectedBanner ? (
              <img
                src={selectedBanner.banner_url}
                alt={selectedBanner.nama_file}
                className="object-contain w-full h-80 rounded-lg"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/home-decor-1.jpeg'; }}
              />
            ) : (
              <div className="py-12 text-center text-gray-500">Tidak ada data</div>
            )}
          </div>

          <div className="md:w-1/2 p-6">
            {detailLoading ? (
              <div />
            ) : selectedBanner ? (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{selectedBanner.nama_file}</h3>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedBanner.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                      {selectedBanner.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-400">Type</div>
                    <div className="font-medium">{selectedBanner.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Platform</div>
                    <div className="font-medium">{selectedBanner.is_platform ? 'Platform' : 'Non Platform'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Sort</div>
                    <div className="font-medium">{selectedBanner.sort}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Link</div>
                    <div className="font-medium break-all"><a href={selectedBanner.link || '#'} target="_blank" rel="noreferrer" className="text-blue-600">{selectedBanner.link || '-'}</a></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-400">Uploaded By</div>
                  <div className="font-medium">{selectedBanner.nama_admin || '-'}</div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outlined" color="gray" onClick={() => setDetailModalOpen(false)}>Tutup</Button>
                  <Button variant="text" color="blue" onClick={() => { openEditModal(selectedBanner); setDetailModalOpen(false); }}>Edit</Button>
                  <Button color="green" variant="gradient" onClick={() => { window.open(selectedBanner.banner_url, '_blank'); }}>Buka Gambar</Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Tidak ada data</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BannerPage;
