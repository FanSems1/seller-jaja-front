import React, { useState, useEffect, useMemo } from 'react'
import { Input, Spin, Empty, Pagination } from 'antd';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { StarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { REVIEW_ENDPOINTS, apiFetch } from '../../configs/api';

const gradientColors = 'from-[#64b0c9] via-[#8ACDE3] to-[#B1EBFE]';

const RatingCell = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const renderStars = () => {
        let stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={i} className="w-4 h-4 text-yellow-500" />);
        }
        if (hasHalfStar) {
            stars.push(<StarIcon key="half" className="w-4 h-4 text-yellow-500" />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
        }
        return stars;
    };

    return (
        <div className="flex">
            {renderStars()}
        </div>
    );
};

function RatingProduk() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [imageErrors, setImageErrors] = useState(new Set());
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // Stats toko
    const [tokoStats, setTokoStats] = useState({
        average_rating: '0.0',
        total_reviews: 0
    });
    
    // Products list
    const [products, setProducts] = useState([]);

    // Fetch toko stats
    useEffect(() => {
        fetchTokoStats();
        fetchProducts();
    }, []);

    const fetchTokoStats = async () => {
        try {
            const res = await apiFetch(REVIEW_ENDPOINTS.TOKO_STATS);
            if (res.success && res.data) {
                setTokoStats(res.data);
            }
        } catch (error) {
            console.error('Error fetching toko stats:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`${REVIEW_ENDPOINTS.PRODUCTS}?limit=100`);
            if (res.success && res.data) {
                setProducts(res.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered products by search
    const filteredProducts = useMemo(() => {
        if (!search) return products;
        return products.filter(product => 
            product.nama_produk?.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    // Paginated data
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, currentPage, pageSize]);

    const handleDetail = (id_produk) => {
        // Untuk nanti kalau sudah ada endpoint detail review
        console.log('Detail review produk:', id_produk);
        // navigate(`/dashboard/review/rating-produk/detail/${id_produk}`);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID').format(number);
    };
    

  return (
    <div className="mb-8">
            <Card>
      
                    {/* Page header (same style as Pesanan) */}
                    <div className="px-6 pt-4 pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-gray-900">Rating Produk</h1>
                            </div>
                        </div>
                    </div>

                    <CardBody className="p-6">
                        {/* Toko Stats Section */}
                        <div className="mb-4">
                            <div className='w-full flex justify-between items-start gap-8'>
                    {/* Stats Cards - Left Side */}
                    <div className='flex flex-wrap gap-8'>
                        {/* Rating Card */}
                        <div className='bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 shadow-sm'>
                            <div className='flex items-end gap-2'>
                                <StarIcon className='w-8 h-8 text-yellow-500'/> 
                                <div className='text-3xl text-gray-800 font-bold'>{tokoStats.average_rating}</div>
                                <div className='text-base text-gray-500 pb-1'>/5.0</div>
                            </div>
                            <p className='text-xs text-gray-600 mt-2'>Rating Keseluruhan</p>
                        </div>
                        
                        {/* Total Reviews Card */}
                        <div className='bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-sm'>
                            <div className='flex items-end gap-2'>
                                <div className='text-3xl text-gray-800 font-bold'>{tokoStats.total_reviews}</div>
                                <div className='text-base text-gray-500 pb-1'>Ulasan</div>
                            </div>
                            <p className='text-xs text-gray-600 mt-2'>Total Ulasan Produk</p>
                        </div>
                    </div>
                    
                    {/* Search - Right Side */}
                    <div className='flex-shrink-0'>
                        <Input 
                            placeholder='Cari produk...' 
                            prefix={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                            className='!h-8 w-64'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            
            
            {/* Products Table */}
            <div className='mb-5 overflow-x-auto'>
                {loading ? (
                    <div className="text-center py-12">
                        <Spin size="large" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <Empty description="Belum ada produk dengan ulasan" />
                    </div>
                ) : (
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="text-center w-20 py-3">No.</th>
                          <th className="px-4 py-3">Produk</th>
                          <th className="px-4 py-3">
                            <div className='flex w-full space-x-2 justify-center items-center'>
                                Rating <StarIcon className='w-5 h-5'/>
                            </div>
                          </th>
                          <th className="px-4 py-3">Jumlah Ulasan</th>
                          <th className="px-4 py-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProducts.map((product, index) => (
                          <tr key={product.id_produk} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors cursor-default">
                            <td className="px-4 py-3 text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="px-4 py-3">
                                <div className='flex items-center space-x-4'>
                                    <div className='flex-shrink-0'>
                                        <img 
                                            src={imageErrors.has(product.id_produk) 
                                                ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/svg%3E'
                                                : product.foto_utama
                                            } 
                                            className='w-16 h-16 object-cover rounded-lg border border-gray-200' 
                                            alt={product.nama_produk}
                                            onError={(e) => {
                                                if (!imageErrors.has(product.id_produk)) {
                                                    setImageErrors(prev => new Set([...prev, product.id_produk]));
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-blue-600 font-semibold text-sm truncate'>
                                            {product.nama_produk}
                                        </p>
                                        <p className='text-gray-700 font-medium text-xs'>
                                            Rp {formatRupiah(product.harga)}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className='flex flex-col items-center gap-1'>
                                    <span className='font-bold text-base text-gray-700'>{product.average_rating}</span>
                                    <RatingCell rating={parseFloat(product.average_rating)} />
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                    {product.total_reviews} ulasan
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button 
                                    onClick={() => navigate(`/dashboard/review/rating-produk/${product.id_produk}`)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 text-sm rounded-lg transition-colors"
                                >
                                    Lihat Detail
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                )}
            </div>
            
            {/* Pagination */}
            {!loading && filteredProducts.length > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={currentPage}
                        total={filteredProducts.length}
                        pageSize={pageSize}
                        onChange={(page, newSize) => {
                            setCurrentPage(page);
                            if (newSize && newSize !== pageSize) setPageSize(newSize);
                        }}
                        showSizeChanger={true}
                        pageSizeOptions={["10", "50", "100"]}
                        showTotal={(total) => `Total ${total} produk`}
                        size="small"
                    />
                </div>
            )}
          </CardBody>
    </Card>
  </div>
  )
}

export default RatingProduk
