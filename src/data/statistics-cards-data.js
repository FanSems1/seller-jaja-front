import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CursorArrowRaysIcon
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "yellow",
    icon: CurrencyDollarIcon,
    title: "TOTAL PENJUALAN",
    value: "Rp319.000",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "blue",
    icon: ShoppingCartIcon,
    title: "TOTAL PESANAN",
    value: "219",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "green",
    icon: UsersIcon,
    title: "TOTAL PENGUNJUNG",
    value: "6",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "pink",
    icon: CursorArrowRaysIcon,
    title: "PRODUK DILIHAT",
    value: "245",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
