import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { Table, Input, Tag, Modal, Spin, message } from 'antd';
import { StarFilled, SearchOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { REVIEW_ENDPOINTS, apiFetch } from '@/configs/api';

const { TextArea } = Input;

function DetailReview() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ average_rating: '0', total_reviews: 0 });
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, total_pages: 1 });
  const [searchText, setSearchText] = useState('');
  
  // Modal state for reply
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const endpoint = REVIEW_ENDPOINTS.PRODUCT_DETAIL.replace(':id', productId);
      const response = await apiFetch(endpoint, {
        method: 'GET',
      });

      if (response.success && response.data) {
        setSummary(response.data.summary || { average_rating: '0', total_reviews: 0 });
        setReviews(response.data.reviews || []);
        setPagination(response.data.pagination || { total: 0, page: 1, limit: 10, total_pages: 1 });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('Gagal memuat data review');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.respon || '');
    setReplyModalVisible(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      message.warning('Silakan tulis balasan terlebih dahulu');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiFetch(REVIEW_ENDPOINTS.REPLY(selectedReview.rating_id), {
        method: 'POST',
        body: JSON.stringify({
          respon: replyText.trim(),
        }),
      });

      if (response.success) {
        message.success('Balasan berhasil dikirim');
        setReplyModalVisible(false);
        setReplyText('');
        setSelectedReview(null);
        fetchReviews(); // Refresh data
      } else {
        message.error(response.message || 'Gagal mengirim balasan');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      message.error('Gagal mengirim balasan');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = useMemo(() => {
    if (!searchText) return reviews;
    return reviews.filter(review =>
      review.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [reviews, searchText]);

  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarFilled
            key={star}
            style={{
              color: star <= rating ? '#FFD700' : '#E5E7EB',
              fontSize: '16px',
            }}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const columns = [
    {
      title: 'Pelanggan',
      key: 'customer',
      width: '20%',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.customer_photo ? (
            <img
              src={record.customer_photo}
              alt={record.customer_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
              <UserOutlined style={{ fontSize: '20px' }} />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-800">{record.customer_name}</div>
            <div className="text-xs text-gray-500">{formatDate(record.date_created)}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: '12%',
      align: 'center',
      render: (rating) => (
        <div className="flex flex-col items-center gap-1">
          <RatingStars rating={rating} />
          <span className="text-sm font-semibold text-gray-700">{rating}/5</span>
        </div>
      ),
    },
    {
      title: 'Komentar',
      key: 'comment',
      width: '40%',
      render: (_, record) => (
        <div className="space-y-2">
          <p className="text-gray-700 text-sm leading-relaxed">{record.comment}</p>
          {record.photos && record.photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {record.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Review ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          )}
          {record.video && (
            <video src={record.video} controls className="w-32 h-32 rounded border" />
          )}
        </div>
      ),
    },
    {
      title: 'Balasan',
      key: 'response',
      width: '28%',
      render: (_, record) => (
        <div className="space-y-2">
          {record.respon ? (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">
                Balasan Anda • {formatDate(record.date_respon)}
              </div>
              <p className="text-sm text-gray-700">{record.respon}</p>
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">Belum ada balasan</div>
          )}
          <Button
            size="sm"
            variant="outlined"
            className="flex items-center gap-2 normal-case text-xs"
            onClick={() => handleReply(record)}
          >
            <MessageOutlined />
            {record.respon ? 'Edit Balasan' : 'Balas Review'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-12">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          size="sm"
          variant="outlined"
          onClick={() => navigate('/dashboard/review/rating-produk')}
          className="normal-case"
        >
          ← Kembali
        </Button>
        <Typography variant="h4" color="blue-gray">
          Detail Review Produk
        </Typography>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-lg">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="text-gray-600 mb-2">
                  Rating Rata-rata
                </Typography>
                <div className="flex items-center gap-3">
                  <Typography variant="h2" className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {parseFloat(summary.average_rating).toFixed(1)}
                  </Typography>
                  <div className="flex flex-col">
                    <RatingStars rating={Math.round(parseFloat(summary.average_rating))} />
                    <Typography variant="small" className="text-gray-500 mt-1">
                      dari 5 bintang
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <StarFilled style={{ fontSize: '32px', color: 'white' }} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-lg">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" className="text-gray-600 mb-2">
                  Total Review
                </Typography>
                <Typography variant="h2" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                  {summary.total_reviews}
                </Typography>
                <Typography variant="small" className="text-gray-500 mt-1">
                  Review terkumpul
                </Typography>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <MessageOutlined style={{ fontSize: '32px', color: 'white' }} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card className="shadow-lg">
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <Typography variant="h6" color="blue-gray">
              Semua Review ({pagination.total})
            </Typography>
            <Input
              placeholder="Cari nama atau komentar..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredReviews}
            rowKey="rating_id"
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} review`,
            }}
            className="custom-table"
          />
        </CardBody>
      </Card>

      {/* Reply Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-blue-500" />
            <span>{selectedReview?.respon ? 'Edit Balasan' : 'Balas Review'}</span>
          </div>
        }
        open={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false);
          setReplyText('');
          setSelectedReview(null);
        }}
        footer={[
          <Button
            key="cancel"
            variant="outlined"
            onClick={() => {
              setReplyModalVisible(false);
              setReplyText('');
              setSelectedReview(null);
            }}
            className="normal-case"
          >
            Batal
          </Button>,
          <Button
            key="submit"
            onClick={handleSubmitReply}
            loading={submitting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white normal-case"
          >
            Kirim Balasan
          </Button>,
        ]}
        width={600}
      >
        {selectedReview && (
          <div className="space-y-4">
            {/* Review Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                  <UserOutlined style={{ fontSize: '20px' }} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{selectedReview.customer_name}</div>
                  <div className="text-xs text-gray-500">{formatDate(selectedReview.date_created)}</div>
                </div>
                <div className="ml-auto">
                  <RatingStars rating={selectedReview.rating} />
                </div>
              </div>
              <p className="text-gray-700 text-sm">{selectedReview.comment}</p>
            </div>

            {/* Reply Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Balasan Anda
              </label>
              <TextArea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan Anda untuk pelanggan..."
                rows={4}
                maxLength={500}
                showCount
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Berikan balasan yang sopan dan profesional untuk meningkatkan kepercayaan pelanggan
              </p>
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .custom-table :global(.ant-table-thead > tr > th) {
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          color: white;
          font-weight: 600;
        }
        .custom-table :global(.ant-table-tbody > tr:hover) {
          background-color: #f0f9ff;
        }
      `}</style>
    </div>
  );
}

export default DetailReview;
