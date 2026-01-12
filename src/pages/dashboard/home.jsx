import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Avatar, Button } from "@material-tailwind/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import Gambar1 from "../../assets/dashboard/BolaTesting.png";
import Gambar2 from "../../assets/dashboard/MobilMini.png";
import Gambar3 from "../../assets/dashboard/ProdukTesting1.jpeg";

// Professional demo datasets
const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 14000 },
  { month: "Apr", revenue: 18000 },
  { month: "May", revenue: 42000 },
  { month: "Jun", revenue: 26000 },
  { month: "Jul", revenue: 22000 },
  { month: "Aug", revenue: 20000 },
  { month: "Sep", revenue: 24000 },
  { month: "Oct", revenue: 23000 },
  { month: "Nov", revenue: 30000 },
  { month: "Dec", revenue: 34000 },
];

const topProducts = [
  { image: Gambar1, title: "Bola Premium X", price: "Rp49.000", stock: 120 },
  { image: Gambar2, title: "Mini Racer Pro", price: "Rp129.000", stock: 40 },
  { image: Gambar3, title: "Smart Home Widget", price: "Rp299.000", stock: 10 },
];

const productSummary = [
  { label: "Total Produk", value: "1.254" },
  { label: "Produk Aktif", value: "1.120" },
  { label: "Produk Tidak Aktif", value: "134" },
];

// New charts: sessions by channel (professional naming)
const sessionsByChannel = [
  { channel: "Organic", sessions: 5200 },
  { channel: "Paid", sessions: 2100 },
  { channel: "Referral", sessions: 900 },
];

// Payment breakdown
const paymentBreakdown = [
  { method: "Bank Transfer", count: 710 },
  { method: "COD", count: 210 },
  { method: "E-Wallet", count: 79 },
];

function YearSelector({ year, setYear }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        aria-label="previous-year"
        onClick={() => setYear((y) => y - 1)}
        className="w-8 h-8 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
      >
        −
      </button>
      <div className="px-3 py-2 bg-white border border-gray-200 rounded text-sm font-semibold">
        {year}
      </div>
      <button
        aria-label="next-year"
        onClick={() => setYear((y) => y + 1)}
        className="w-8 h-8 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
      >
        +
      </button>
    </div>
  );
}

export function Home() {
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const stats = [
    { id: 1, title: "Pendapatan (YTD)", value: "Rp1.234.567", icon: BanknotesIcon, color: "from-indigo-600 to-emerald-400", delta: "+18%" },
    { id: 2, title: "Pesanan Hari Ini", value: "128", icon: ShoppingBagIcon, color: "from-sky-500 to-indigo-500", delta: "+4%" },
    { id: 3, title: "Produk Terlaris", value: "Mini Racer Pro", icon: CubeIcon, color: "from-amber-500 to-rose-400", delta: "-2%" },
    { id: 4, title: "Kunjungan", value: "5.712", icon: ArrowTrendingUpIcon, color: "from-pink-500 to-red-400", delta: "+22%" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard Admin</h1>
          <p className="text-sm text-gray-500">Ringkasan toko dan performa • Tahun {year}</p>
        </div>
        <div className="flex items-center space-x-4">
          <YearSelector year={year} setYear={setYear} />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.id} className="shadow-lg">
            <CardBody className="flex items-center justify-between p-4">
              <div>
                <div className="text-xs text-gray-400">{s.title}</div>
                <div className="text-2xl font-bold mt-1">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.delta}</div>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <Card className="shadow-sm">
          <CardBody>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" color="blue" onClick={() => navigate('/dashboard/produk/tambah-produk')}>Tambah Produk</Button>
                <Button size="sm" color="teal" onClick={() => navigate('/dashboard/promosi/tambah-voucher')}>Buat Voucher</Button>
                <Button size="sm" color="purple" onClick={() => navigate('/dashboard/penjualan/pesanan')}>Lihat Pesanan</Button>
                <Button size="sm" variant="outlined" onClick={() => navigate('/dashboard/laporan')}>Export Laporan</Button>
                <div className="ml-auto text-sm text-gray-500">Terakhir disinkron: 2 jam lalu</div>
              </div>
          </CardBody>
        </Card>
      </div>

      {/* Main area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-500">Pendapatan Bulanan</div>
                  <div className="text-lg font-semibold">Tren Pendapatan Tahun {year}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" color="gray">Bulan Lalu</Button>
                  <Button size="sm" color="gray">Tahun Lalu</Button>
                </div>
              </div>
              <div style={{ width: "100%", height: 340 }}>
                <ResponsiveContainer>
                  <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip formatter={(v) => `Rp${v.toLocaleString()}`} />
                    <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Orders preview */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">Preview Pesanan Terbaru</div>
                  <a className="text-sm text-sky-600">Lihat Semua</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-500 border-b">
                        <th className="py-2">Order ID</th>
                        <th className="py-2">Customer</th>
                        <th className="py-2">Total</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "#1001", name: "Andi", total: "Rp120.000", status: "Dikirim" },
                        { id: "#1002", name: "Sinta", total: "Rp299.000", status: "Selesai" },
                        { id: "#1003", name: "Budi", total: "Rp49.000", status: "Dalam Proses" },
                      ].map((r) => (
                        <tr key={r.id} className="border-b last:border-b-0">
                          <td className="py-3">{r.id}</td>
                          <td className="py-3">{r.name}</td>
                          <td className="py-3">{r.total}</td>
                          <td className="py-3 text-sm text-gray-600">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card className="shadow-sm">
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-500">Ringkasan Produk</div>
                  <div className="text-lg font-semibold">Status & Top Produk</div>
                </div>
                <div>
                  <Button size="sm">Kelola Produk</Button>
                </div>
              </div>
              <div className="space-y-3">
                {productSummary.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">{item.label}</div>
                    <div className="text-sm font-semibold">{item.value}</div>
                  </div>
                ))}
                <div className="mt-3">
                  <div className="text-xs text-gray-500">Rasio ketersediaan: <span className="font-semibold">89%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="h-2 bg-emerald-400" style={{ width: '89%' }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Top Produk</div>
                  <div className="grid grid-cols-1 gap-3">
                    {topProducts.map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-md object-cover" />
                        <div>
                          <div className="text-sm font-semibold">{p.title}</div>
                          <div className="text-xs text-gray-500">{p.price} • Stok: {p.stock}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Charts: sessions & payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardBody>
            <div className="text-sm text-gray-500 mb-2">Sesi per Channel</div>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={sessionsByChannel} layout="horizontal">
                  <XAxis dataKey="channel" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardBody>
            <div className="text-sm text-gray-500 mb-2">Pembayaran (jumlah)</div>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={paymentBreakdown} layout="horizontal">
                  <XAxis dataKey="method" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
