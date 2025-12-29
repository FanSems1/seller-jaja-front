import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  
  Progress,
} from "@material-tailwind/react";

import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { 
  CheckCircleIcon, 
  ClockIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon
 } from "@heroicons/react/24/solid";
import Gambar1 from "../../assets/dashboard/BolaTesting.png" 
import Gambar2 from "../../assets/dashboard/MobilMini.png" 
import Gambar3 from "../../assets/dashboard/ProdukTesting1.jpeg" 
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';


const products = [
  {
    image: Gambar1,
    title: 'Bola Testing',
    price: 'Rp1.000',
    sold: 18,
  },
  {
    image: Gambar2,
    title: 'Mobil Mini',
    price: 'Rp2.000',
    sold: 4,
  },
  {
    image: Gambar3,
    title: 'Produk Testing 16',
    price: 'Rp10.000',
    sold: 1,
  },
];

const data = [
  { name: 'Laki-Laki', value: 200 },
  { name: 'Perempuan', value: 100 },
  { name: 'Tidak Disebutkan', value: 700 },
];

const tipePembeli = [
  { name: 'Pembeli Baru', value: 600 },
  { name: 'Pembeli Lama', value: 400 },
 
];

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];
const COLORSS = ['#0088FE', '#FFBB28'];


export function Home() {
  return (
    
    <div>
      {/* Beranda */}
       <>
       <div className="w-full mb-6 flex flex-col md:flex-row space-x-0 md:space-x-5">
       
        <div className='w-full flex   pr-5 '>
             <div className='w-1/2'>
               <h1 className=" text-2xl font-bold text-start">
                 BERANDA
               </h1>
               <p>Data yang ditampilkan berdasarkan tahun 2024</p>
             </div>
   
            
           </div>
   
        <div className="sm:w-1/6 w-full ">
          <h1 className=" text-blue-gray-700 text-end">
            Pilih Tahun
          </h1>
          <select className="form-select mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>
      </div>
      </>
    
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 ">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
          
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-8 h-8 text-white",
            })}
            // footer={
            //   <Typography className="font-normal text-blue-gray-600">
            //     <strong className={footer.color}>{footer.value}</strong>
            //     &nbsp;{footer.label}
            //   </Typography>
            // }
          />
        ))}
      </div>

      <div className="w-full mb-6 flex flex-col md:flex-row space-x-0 md:space-x-5">
          
          {/* Grafik */}
          <>
          <div className="w-full md:w-full">
            <div className="">
            {statisticsChartsData.map((props) => (
              <StatisticsChart 
                key={props.title}
                {...props}
                // footer={
                //   <Typography
                //     variant="small"
                //     className="flex items-center font-normal text-blue-gray-600"
                //   >
                //     &nbsp;{props.footer}
                //   </Typography>
                // }
              />
            ))}
            </div>
          </div>
          </>

          {/* Produk Terlaris di Toko */}
          <>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardBody>
                <div className="font-bold  text-lg">
                  Produk Terlaris di Tokomu
                </div>
                <br/>
                <div>
                  {products.map((product, index) => (
                    <div key={index} className="w-full flex mb-6">
                      <div className="w-1/4 flex items-center">
                        <img src={product.image} alt={product.title} className="w-14 h-14" />
                      </div>
                      <div className="w-full">
                        <p className="font-semibold text-lg text-[#64b0cc] cursor-pointer">
                          {product.title}
                        </p>
                        <p>{product.price}</p>
                        <p>
                          Terjual: <span>{product.sold}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
          </>
      </div>


      <div className="w-full mb-6 flex flex-col md:flex-row space-x-0 md:space-x-5">
          
          {/* Jenis Kelamin Pembeli */}
          <>
          <div className="w-full md:w-1/2">
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardBody>
                <div className="font-bold  text-lg">
                  Jenis Kelamin Pembeli
                </div>
                <br/>
                <div className="flex flex-col md:flex-row items-center">
                  <PieChart width={350} height={250}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  <div className="ml-4">
                    {data.map((entry, index) => (
                      <div key={`text-${index}`} className="flex items-center mb-2">
                        <div
                          className="w-4 h-4 mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          </>

          {/* Tipe Pembeli */}
          <>
          <div className="w-full md:w-1/2">
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardBody>
                <div className="font-bold  text-lg">
                  Tipe Pembeli 
                </div>
                <br/>
                <div className="flex flex-col md:flex-row items-center">
                <PieChart width={350} height={250}>
                      <Pie
                        data={tipePembeli}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tipePembeli.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORSS[index % COLORSS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                    <div className="ml-4">
                      {tipePembeli.map((entry, index) => (
                        <div key={`text-${index}`} className="flex items-center mb-2">
                          <div
                            className="w-4 h-4 mr-2"
                            style={{ backgroundColor: COLORSS[index % COLORSS.length] }}
                          ></div>
                          <span>{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </CardBody>
            </Card>
          </div>
          </>
      </div>

    </div>
  );
}

export default Home;
