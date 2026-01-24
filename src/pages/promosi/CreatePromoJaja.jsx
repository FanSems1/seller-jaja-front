import React, { useState } from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { Input, Select, DatePicker, Upload, InputNumber, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PROMO_JAJA_ENDPOINTS, apiFetch } from '@/configs/api';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

function CreatePromoJaja() {
  const [kodePromo, setKodePromo] = useState('');
  const [judulPromo, setJudulPromo] = useState('');
  const [tipeVoucher, setTipeVoucher] = useState('global');
  const [kategoriPromo, setKategoriPromo] = useState('diskon');
  const [fileList, setFileList] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [discountMode, setDiscountMode] = useState('nominal'); // 'nominal' or 'persentase'
  const [nominalDiskon, setNominalDiskon] = useState(0);
  const [persentaseDiskon, setPersentaseDiskon] = useState(0);
  const [minBelanja, setMinBelanja] = useState(0);
  const [maxDiskon, setMaxDiskon] = useState(0);
  const [kuota, setKuota] = useState(0);
  const [saving, setSaving] = useState(false);
  const [isPlatform, setIsPlatform] = useState(false);

  const handleUploadChange = ({ fileList: fl }) => {
    const latest = fl.slice(-1);
    setFileList(latest);
    // generate preview for the selected file
    const f = latest[0]?.originFileObj || latest[0];
    if (f) {
      try {
        const url = URL.createObjectURL(f);
        setBannerPreview(url);
      } catch (e) {
        setBannerPreview(null);
      }
    } else {
      setBannerPreview(null);
    }
  };

  // cleanup object URL when component unmounts or preview changes
  React.useEffect(() => {
    return () => {
      if (bannerPreview) {
        try { URL.revokeObjectURL(bannerPreview); } catch (e) {}
      }
    };
  }, [bannerPreview]);

  const validate = () => {
    if (!kodePromo.trim()) return 'Kode promo wajib diisi';
    if (!judulPromo.trim()) return 'Judul promo wajib diisi';
    if (!tipeVoucher) return 'Tipe voucher wajib dipilih';
    if (!kategoriPromo) return 'Kategori promo wajib dipilih';
    if (!dateRange || dateRange.length !== 2) return 'Periode mulai/berakhir wajib diisi';
    if (discountMode === 'nominal' && (!nominalDiskon || Number(nominalDiskon) <= 0)) return 'Nominal diskon wajib diisi dan > 0';
    if (discountMode === 'persentase' && (!persentaseDiskon || Number(persentaseDiskon) <= 0)) return 'Persentase diskon wajib diisi dan > 0';
    if (!kuota || Number(kuota) <= 0) return 'Kuota wajib diisi dan > 0';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err, showConfirmButton: false, timer: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append('kode_promo', kodePromo);
    formData.append('judul_promo', judulPromo);
    formData.append('tipe_voucher', tipeVoucher);
    formData.append('kategori_promo', kategoriPromo);
    // banner_promo (file)
    const file = fileList[0]?.originFileObj || fileList[0];
    if (file) formData.append('banner_promo', file);

    const mulai = dayjs(dateRange[0]).format('YYYY-MM-DD');
    const berakhir = dayjs(dateRange[1]).format('YYYY-MM-DD');
    formData.append('mulai', mulai);
    formData.append('berakhir', berakhir);

    if (discountMode === 'nominal') {
      formData.append('nominal_diskon', String(nominalDiskon || 0));
      formData.append('persentase_diskon', String(0));
    } else {
      formData.append('persentase_diskon', String(persentaseDiskon || 0));
      formData.append('nominal_diskon', String(0));
    }

    formData.append('min_belanja', String(minBelanja || 0));
    formData.append('max_diskon', String(maxDiskon || 0));
    formData.append('kuota', String(kuota || 0));

    try {
      setSaving(true);
      const res = await apiFetch(PROMO_JAJA_ENDPOINTS.CREATE, { method: 'POST', body: formData });
      const msg = (res && (res.message || res.msg)) || 'Promo Jaja berhasil dibuat';
      Swal.fire({ icon: 'success', title: 'Berhasil', text: msg, showConfirmButton: false, timer: 1500 });

      // reset form
      setKodePromo('');
      setJudulPromo('');
      setTipeVoucher('global');
      setKategoriPromo('diskon');
      setFileList([]);
      setDateRange(null);
      setDiscountMode('nominal');
      setNominalDiskon(0);
      setPersentaseDiskon(0);
      setMinBelanja(0);
      setMaxDiskon(0);
      setKuota(0);
      setIsPlatform(false);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.message || 'Terjadi kesalahan', showConfirmButton: false, timer: 2000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Typography variant="h5" className="font-bold">Buat Promo Jaja</Typography>
              <Typography className="text-sm text-gray-500">Form pembuatan promo untuk Jaja</Typography>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Kode Promo</label>
              <Input value={kodePromo} onChange={(e)=>setKodePromo(e.target.value)} placeholder="EXAMPLE2026" className="!rounded-lg" />
            </div>

            <div>
              <label className="text-sm font-medium">Judul Promo</label>
              <Input value={judulPromo} onChange={(e)=>setJudulPromo(e.target.value)} placeholder="Judul promo" className="!rounded-lg" />
            </div>

            <div>
              <label className="text-sm font-medium">Tipe Voucher</label>
              <Select value={tipeVoucher} onChange={(v)=>setTipeVoucher(v)} className="w-full">
                <Option value="global">global</Option>
                <Option value="khusus">khusus</Option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Kategori Promo</label>
              <Select value={kategoriPromo} onChange={(v)=>setKategoriPromo(v)} className="w-full">
                <Option value="diskon">diskon</Option>
                <Option value="ongkir">ongkir</Option>
                <Option value="cashback">cashback</Option>
                <Option value="gratis">gratis</Option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Periode</label>
              <RangePicker value={dateRange} onChange={(ds)=>setDateRange(ds)} className="w-full" />
            </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">Banner Promo</label>
                          <div className="mt-3 flex items-start gap-4">
                            <div>
                              <Upload beforeUpload={()=>false} fileList={fileList} onChange={handleUploadChange} accept="image/*">
                                <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
                              </Upload>
                              <div className="text-xs text-gray-400 mt-2">Rekomendasi ukuran: 1200x400</div>
                            </div>

                            {bannerPreview && (
                              <div className="w-24 h-16 rounded overflow-hidden border">
                                <img src={bannerPreview} alt="preview" className="object-cover w-full h-full" />
                              </div>
                            )}
                          </div>
                        </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Tipe Diskon</label>
              <div className="flex items-center gap-3 mt-2">
                <label className={`px-3 py-2 border rounded cursor-pointer ${discountMode==='nominal' ? 'bg-gray-100 border-gray-300' : ''}`}>
                  <input type="radio" name="discountMode" checked={discountMode==='nominal'} onChange={()=>setDiscountMode('nominal')} /> Nominal
                </label>
                <label className={`px-3 py-2 border rounded cursor-pointer ${discountMode==='persentase' ? 'bg-gray-100 border-gray-300' : ''}`}>
                  <input type="radio" name="discountMode" checked={discountMode==='persentase'} onChange={()=>setDiscountMode('persentase')} /> Persentase
                </label>
              </div>
            </div>

            {discountMode === 'nominal' ? (
              <div>
                <label className="text-sm font-medium">Nominal Diskon (Rp)</label>
                <InputNumber value={nominalDiskon} onChange={(v)=>setNominalDiskon(v)} className="w-full" min={0} />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium">Persentase Diskon (%)</label>
                <InputNumber value={persentaseDiskon} onChange={(v)=>setPersentaseDiskon(v)} className="w-full" min={0} max={100} />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Min. Belanja (Rp)</label>
              <InputNumber value={minBelanja} onChange={(v)=>setMinBelanja(v)} className="w-full" min={0} />
            </div>

            <div>
              <label className="text-sm font-medium">Max Diskon (Rp)</label>
              <InputNumber value={maxDiskon} onChange={(v)=>setMaxDiskon(v)} className="w-full" min={0} />
            </div>

            <div>
              <label className="text-sm font-medium">Kuota</label>
              <InputNumber value={kuota} onChange={(v)=>setKuota(v)} className="w-full" min={1} />
            </div>

            {/* <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Platform</label>
              <Switch checked={isPlatform} onChange={(v)=>setIsPlatform(v)} />
            </div> */}

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <Button variant="outlined" color="gray" onClick={() => window.history.back()}>Batal</Button>
              <Button color="green" variant="gradient" onClick={handleSubmit} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
            </div>

          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default CreatePromoJaja;
