import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  TagIcon,
  Cog6ToothIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Pesanan from "./pages/penjualan/Pesanan";
import DetailPesanan from "./pages/penjualan/DetailPesanan";
import PrintInvoice from "./pages/penjualan/PrintInvoice";
import DaftarProduk from "./pages/produk/daftar-produk/DaftarProduk";
import TambahProduk from "./pages/produk/TambahProduk";
import EditProduk from "./pages/produk/daftar-produk/EditProduk";
import DaftarBrand from "./pages/produk/DaftarBrand";
import DaftarEtalase from "./pages/produk/DaftarEtalase";
import VoucherToko from "./pages/promosi/VoucherToko";
import TambahVoucher from "./pages/promosi/TambahVoucher";
import EditVoucher from "./pages/promosi/EditVoucher";
import ActivationCoupon from "./pages/promosi/ActivationCoupon";
import PengaturanVoucher from "./pages/promosi/pengaturanVoucher/PengaturanVoucher";
import RatingProduk from "./pages/riview/RatingProduk";
import DetailReview from "./pages/riview/rating-produk/DetailReview";
import ReportProduk from "./pages/riview/report-produk/ReportProduk";
import PengaturanToko from "./pages/pengaturan/PengaturanToko";
import PenghasilanToko from "./pages/dompetku/penghasilan-toko/PenghasilanToko";
import SaldoToko from "./pages/dompetku/saldo-toko/SaldoToko";
import RekeningBank from "./pages/dompetku/saldo-toko/tab-saldo-toko/RekeningBank";
import Saldo from "./pages/dompetku/saldo/Saldo";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [

  {
    title: 'Menu',
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Beranda",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <CurrencyDollarIcon {...icon} />,
        name: "Pesanan",
        path: "/penjualan/pesanan",
        element: <Pesanan />,
      },

      
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Daftar Produk",
        path: "/produk/daftar-produk",
        element: <DaftarProduk />,
      },
      {
        // route for adding a product (hidden from sidebar)
        name: "Tambah Produk",
        path: "/produk/tambah-produk",
        element: <TambahProduk />,
        hidden: true,
      },
      {
        // route for editing a product by id (hidden from sidebar)
        name: "Edit Produk",
        path: "/produk/daftar-produk/edit-produk/:id",
        element: <EditProduk />,
        hidden: true,
      },
      {
        icon: <TagIcon {...icon} />,
        name: "Voucher Toko",
        path: "/promosi/voucher-toko",
        element: <VoucherToko />,
      },
      {
        // route for adding a voucher (hidden from sidebar)
        name: "Tambah Voucher",
        path: "/promosi/tambah-voucher",
        element: <TambahVoucher />,
        hidden: true,
      },
      {
        // route for editing a voucher by id (hidden from sidebar)
        name: "Edit Voucher",
        path: "/promosi/edit-voucher/:id",
        element: <EditVoucher />,
        hidden: true,
      },
      {
        icon: <WalletIcon {...icon} />,
        name: "dompetku",
        path: "/dompetku",
        element: null,
        subPages: [
          {
            name: "penghasilan toko",
            path: "/dompetku/penghasilan-toko",
            element: <PenghasilanToko />,
          },          
          // {
          //   name: "saldo toko",
          //   path: "/dompetku/saldo-toko",
          //   element: <Saldo />,
          // },          
          {
            name: "Rekening Bank",
            path: "/dompetku/rekening-bank",
            element: <RekeningBank />,
          },          
          {
            name: "Saldo Toko",
            path: "/dompetku/saldo-toko",
            element: <Saldo />,
          },          
        ]
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Rating Produk",
        path: "/review/rating-produk",
        element: <RatingProduk />,
      },
      {
        // detail route for a specific product rating (id param) - hidden from sidebar
        name: "Detail Rating Produk",
        path: "/review/rating-produk/:id",
        element: <DetailReview />,
        hidden: true,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Pengaturan Toko",
        path: "/pengaturan/pengaturan-toko",
        element: <PengaturanToko />,
      },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
