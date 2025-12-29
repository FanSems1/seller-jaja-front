import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon, ChevronDoubleRightIcon, Bars3Icon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Collapse,
} from "@material-tailwind/react";
import {
  ArrowRightCircleIcon,
  ArrowDownCircleIcon
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import LogoJaja from "../../assets/LogoJaja.png";
import ImageAkun from "../../assets/sidebar/default_akun.png" 
import Bronze from "../../assets/sidebar/Bronze.png" 
import Silver from "../../assets/sidebar/Silver.png" 
import Gold from "../../assets/sidebar/Gold.png" 
import Platinum from "../../assets/sidebar/Platinum.png" 

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [openMenus, setOpenMenus] = useState({});
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("auth_user");
      if (token && userStr) {
        const parsed = JSON.parse(userStr);
        setAuthUser(parsed);
        setIsAuthenticated(true);
      } else {
        setAuthUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error reading auth_user from localStorage:", err);
      setAuthUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const handleToggle = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-700 to-gray-800",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
    cyan: "bg-gradient-to-br from-cyan-800 to-orange-100",
  };

  const gradientColors = 'from-[#FBFEFF] via-[#C9F8FF] to-[#C9F8FF]';


  return (
    <>
      {/* Hamburger toggle button (responsive & accessible) */}
      <IconButton
        variant="filled"
        size="sm"
        color="blue"
        ripple={false}
        className={`fixed top-4 left-4 z-60 p-2 rounded-md shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200 dark:bg-gray-800/70 dark:border-gray-700`} 
        onClick={() => setOpenSidenav(dispatch, !openSidenav)}
        aria-label={openSidenav ? "Tutup sidebar" : "Buka sidebar"}
        title={openSidenav ? "Tutup sidebar" : "Buka sidebar"}
      >
        <Bars3Icon className={`h-6 w-6 text-[#1f6f8b] transition-transform duration-200 ${openSidenav ? "rotate-90" : ""}`} />
      </IconButton>

      <aside
        className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } bg-white fixed overflow-auto inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
      >
      <div className={`relative `}>
  <Link to="/dashboard/home" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            <div className="font-bold text-xl text-start pl-6">
              Toko Anda
            </div> 
            <div className="flex space-x-4 p-4">
              <div className="w-1/3">
                <img
                  src={
                    authUser?.toko?.logo || authUser?.avatar || ImageAkun
                  }
                  className="w-18 h-18 rounded"
                  alt="Akun"
                />
              </div>
              <div>
                <div className="mt-2 font-semibold">
                  {authUser?.toko?.nama_toko || authUser?.nama_toko || "NCEKTECH"}
                </div>
                <p>
                  {/* membership badge: try to pick a badge from toko or user level, fallback to Bronze */}
                  {(() => {
                    const level = (authUser?.toko?.membership || authUser?.level || "").toString().toLowerCase();
                    if (level.includes("silver")) return <img src={Silver} className="w-16 h-6" alt="Silver" />;
                    if (level.includes("gold")) return <img src={Gold} className="w-16 h-6" alt="Gold" />;
                    if (level.includes("platinum")) return <img src={Platinum} className="w-16 h-6" alt="Platinum" />;
                    return <img src={Bronze} className="w-16 h-6" alt="Bronze" />;
                  })()}
                </p>
              </div>
            </div>
            <div className="text-start">
              <div className="p-4 rounded-lg ml-[1rem] mr-[1rem] border border-[#9fcddd]">
                <div className="">
                  <div className="text-base w-1/2 text-[#b6b6b6]">
                    Saldo Anda
                  </div>
                </div>
                <div className="text-xl text-[#91c6d8] font-semibold">Rp1.589.233</div>
              </div>
            </div>
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>

      <div className="ml-4 mr-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography variant="small" color="dark" className="font-black uppercase opacity-100 ">
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path, subPages }) => (
              <li key={name}>
                {subPages ? (
                  <>
                    <div
                      onClick={() => handleToggle(name)}
                      className="flex bg-white items-center gap-4 px-4 capitalize w-full text-left text-blue-gray-500 cursor-pointer"
                      style={{ padding: "14px" }}
                    >
                      {icon}
                      <Typography className="font-medium capitalize text-blue-gray-500">
                        {name}
                      </Typography>
                      {openMenus[name] ? (
                        <ArrowDownCircleIcon className="w-5 h-5 ml-auto" />
                      ) : (
                        <ArrowRightCircleIcon className="w-5 h-5 ml-auto" />
                      )}
                    </div>
                    <Collapse open={openMenus[name] || false}>
                      <ul>
                        {subPages.filter(subPage => !subPage.hidden).map((subPage) => (
                          <li key={subPage.name}>
                            <NavLink to={`/${layout}${subPage.path}`}>
                              {({ isActive }) => (
                                <Button
                                  variant="text"
                                  color="blue-gray"
                                  className={`flex items-center gap-4 px-4 capitalize ${isActive ?  `bg-gradient-to-b ${gradientColors} text-[#438196]` : ""}`}
                                  fullWidth
                                >
                                  <div className="pl-9">
                                    <Typography  className="font-medium capitalize text-blue-gray-500">
                                      {subPage.name}
                                    </Typography>
                                  </div>
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : (
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant="text"
                        color="blue-gray"
                        className={`flex items-center gap-4 px-4 capitalize ${isActive ? `bg-gradient-to-b ${gradientColors} text-[#438196]` : ""}`}
                        fullWidth
                      >
                        
                        <Typography  className="text-blue-gray-500 font-medium capitalize">
                          {icon}
                        </Typography>
                        <Typography  className="text-blue-gray-500 font-medium capitalize">
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Jaja Saller",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
