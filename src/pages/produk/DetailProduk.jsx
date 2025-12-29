import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody } from "@material-tailwind/react";
import { Button, Spin, Tag, Pagination } from "antd";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { PRODUCT_ENDPOINTS, API_BASE_URL, apiFetch } from "../../configs/api";
import Gambar1 from "../../assets/pesanan/produkTesting2.png";

const getImageUrl = (url) => {
  if (!url) return Gambar1;
  if (url.startsWith("http")) return url;
  // Remove leading slash if exists to prevent double slash
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
  return `${API_BASE_URL}/${cleanUrl}`;
};

function DetailProduk() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const variasiPerPage = 2;

  useEffect(() => {
    if (!id) return;
    let abort = false;

    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(PRODUCT_ENDPOINTS.DETAIL(id));
        if (abort) return;
        if (res.success && res.produk) {
          setProduk(res.produk);
        } else {
          setError(res.message || "Gagal memuat detail produk");
        }
      } catch (e) {
        if (!abort) {
          setError(e.message || "Gagal memuat detail produk");
        }
      } finally {
        if (!abort) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      abort = true;
    };
  }, [id]);

  // Set selected image when produk foto loaded
  useEffect(() => {
    if (produk?.foto?.length > 0) {
      // Set foto pertama sebagai default
      setSelectedImage(produk.foto[0].url);
    }
  }, [produk]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !produk) {
    return (
      <div className="mb-8">
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error || "Produk tidak ditemukan"}</p>
              <Button className="mt-4" onClick={() => navigate(-1)}>
                Kembali
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const foto = Array.isArray(produk.foto) ? produk.foto : [];
  const variasi = Array.isArray(produk.variasi) ? produk.variasi : [];
  
  // Pagination untuk variasi
  const indexOfLastVariasi = currentPage * variasiPerPage;
  const indexOfFirstVariasi = indexOfLastVariasi - variasiPerPage;
  const currentVariasi = variasi.slice(indexOfFirstVariasi, indexOfLastVariasi);
  
  // Gunakan selectedImage atau foto pertama sebagai default
  const displayImage = selectedImage || (foto.length > 0 ? foto[0].url : null);

  return (
    <div className="mb-6 px-3">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="default"
          size="middle"
          icon={<ArrowLeftIcon className="w-4 h-4" />}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          Kembali
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left: Images Section */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 shadow">
            <div className="aspect-square w-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={getImageUrl(displayImage)}
                alt={produk.nama_produk}
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.src = Gambar1;
                }}
              />
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {foto.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {foto.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedImage(f.url)}
                  className={`
                    aspect-square rounded-md border-2 overflow-hidden cursor-pointer
                    transition-all duration-200 hover:scale-105 hover:shadow-md
                    ${
                      selectedImage === f.url
                        ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
                        : "border-gray-200 hover:border-blue-300"
                    }
                  `}
                >
                  <img
                    src={getImageUrl(f.url)}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.src = Gambar1;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-4">
          {/* Product Title & Status */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {produk.nama_produk}
              </h1>
              <Tag
                color={produk.status_produk === "live" ? "green" : "orange"}
                className="text-xs"
              >
                {produk.status_produk.toUpperCase()}
              </Tag>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Tag color="blue" className="text-[10px] px-2 py-0.5">SKU: {produk.kode_sku}</Tag>
              <Tag color="purple" className="text-[10px] px-2 py-0.5">Kondisi: {produk.kondisi}</Tag>
              <Tag color={produk.pre_order === "Y" ? "orange" : "default"} className="text-[10px] px-2 py-0.5">
                {produk.pre_order === "Y" ? "Pre Order" : "Ready Stock"}
              </Tag>
              {produk.draft === "Y" && <Tag color="red" className="text-[10px] px-2 py-0.5">Draft</Tag>}
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-bold text-blue-600">
                {formatRupiah(produk.harga)}
              </span>
              {produk.diskon > 0 && (
                <Tag color="red" className="text-xs">
                  Diskon: {formatRupiah(produk.diskon)}
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <ShoppingCartIcon className="w-3.5 h-3.5" />
                Stok: <strong className="text-gray-900">{produk.stok}</strong>
              </span>
              <span>Berat: <strong className="text-gray-900">{produk.berat}g</strong></span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Deskripsi Produk</h2>
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {produk.deskripsi || "Tidak ada deskripsi"}
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Detail Produk</h2>
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">Kategori</td>
                    <td className="px-3 py-2 text-gray-900">ID: {produk.id_kategori} / Sub: {produk.id_sub_kategori}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-700 bg-gray-50">Merek</td>
                    <td className="px-3 py-2 text-gray-900">ID: {produk.merek}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-700 bg-gray-50">Etalase</td>
                    <td className="px-3 py-2 text-gray-900">ID: {produk.etalase}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-700 bg-gray-50">Slug</td>
                    <td className="px-3 py-2 text-gray-900 font-mono text-[10px]">{produk.slug_produk}</td>
                  </tr>
                  {produk.tag_produk && (
                    <tr>
                      <td className="px-3 py-2 font-medium text-gray-700 bg-gray-50">Tags</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {produk.tag_produk.split(",").map((tag, idx) => (
                            <Tag key={idx} color="cyan" className="text-[10px] px-1.5 py-0">{tag.trim()}</Tag>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Variasi */}
          {variasi.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Variasi Produk
                  <Tag color="blue" className="ml-2 text-[10px] px-1.5 py-0">{variasi.length} varian</Tag>
                </h2>
              </div>
              
              <div className="space-y-3">
                {currentVariasi.map((v, idx) => (
                  <div
                    key={v.id}
                    className="bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                  >
                    <div className="flex items-start gap-4">
                      {/* Variasi Image */}
                      {v.image && (
                        <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0 bg-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                          <img
                            src={getImageUrl(v.image)}
                            alt={`Variasi ${indexOfFirstVariasi + idx + 1}`}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              e.target.src = Gambar1;
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Variasi Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            #{indexOfFirstVariasi + idx + 1}
                          </span>
                          {v.warna && (
                            <Tag color="magenta" className="text-[10px] px-2 py-0.5">
                              🎨 {v.warna}
                            </Tag>
                          )}
                          {v.ukuran && (
                            <Tag color="purple" className="text-[10px] px-2 py-0.5">
                              📏 {v.ukuran}
                            </Tag>
                          )}
                          {v.model && (
                            <Tag color="geekblue" className="text-[10px] px-2 py-0.5">
                              ✨ {v.model}
                            </Tag>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-md border border-blue-200">
                            <span className="text-xs text-gray-600 block">Harga</span>
                            <span className="text-sm font-bold text-blue-600">
                              {formatRupiah(v.harga)}
                            </span>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-md border border-green-200">
                            <span className="text-xs text-gray-600 block">Stok</span>
                            <span className="text-sm font-bold text-green-600">
                              {v.stok} pcs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {variasi.length > variasiPerPage && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    current={currentPage}
                    pageSize={variasiPerPage}
                    total={variasi.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} variasi`}
                    className="text-xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* Grosir Pricing */}
          {produk.grosir && (produk.grosir.min1 > 0 || produk.grosir.min2 > 0) && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Harga Grosir</h2>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-md border border-green-200 p-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {produk.grosir.min1 > 0 && (
                    <div className="bg-white rounded-md p-2 border border-green-200">
                      <div className="text-gray-600 text-[10px] mb-0.5">Min. {produk.grosir.min1} pcs</div>
                      <div className="font-semibold text-green-600">
                        {formatRupiah(produk.grosir.price1)}
                      </div>
                    </div>
                  )}
                  {produk.grosir.min2 > 0 && (
                    <div className="bg-white rounded-md p-2 border border-green-200">
                      <div className="text-gray-600 text-[10px] mb-0.5">Min. {produk.grosir.min2} pcs</div>
                      <div className="font-semibold text-green-600">
                        {formatRupiah(produk.grosir.price2)}
                      </div>
                    </div>
                  )}
                  {produk.grosir.min3 > 0 && (
                    <div className="bg-white rounded-md p-2 border border-green-200">
                      <div className="text-gray-600 text-[10px] mb-0.5">Min. {produk.grosir.min3} pcs</div>
                      <div className="font-semibold text-green-600">
                        {formatRupiah(produk.grosir.price3)}
                      </div>
                    </div>
                  )}
                  {produk.grosir.min4 > 0 && (
                    <div className="bg-white rounded-md p-2 border border-green-200">
                      <div className="text-gray-600 text-[10px] mb-0.5">Min. {produk.grosir.min4} pcs</div>
                      <div className="font-semibold text-green-600">
                        {formatRupiah(produk.grosir.price4)}
                      </div>
                    </div>
                  )}
                  {produk.grosir.min5 > 0 && (
                    <div className="bg-white rounded-md p-2 border border-green-200">
                      <div className="text-gray-600 text-[10px] mb-0.5">Min. {produk.grosir.min5} pcs</div>
                      <div className="font-semibold text-green-600">
                        {formatRupiah(produk.grosir.price5)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailProduk;
