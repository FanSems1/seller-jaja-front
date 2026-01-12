import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, ChevronDoubleRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Collapse,
} from "@material-tailwind/react";
import { ArrowRightCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav, setMiniSidenav } from "@/context";
import LogoJaja from "../../assets/LogoJaja.png";
import ImageAkun from "../../assets/sidebar/default_akun.png"
import Bronze from "../../assets/sidebar/Bronze.png"
import Silver from "../../assets/sidebar/Silver.png"
import Gold from "../../assets/sidebar/Gold.png"
import Platinum from "../../assets/sidebar/Platinum.png"

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, miniSidenav } = controller;
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
      {/* Mobile: overlay and off-canvas behavior. Desktop: persistent sidebar */}
      {/* Overlay (only show on small screens when sidenav open) */}
      {openSidenav && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${sidenavTypes[sidenavType]} bg-white fixed overflow-auto overflow-x-hidden inset-y-4 left-4 z-50 ml-0 h-[calc(100vh-32px)] rounded-xl transition-transform duration-300 border border-blue-gray-100 transform ${openSidenav ? 'translate-x-0' : '-translate-x-full' } ${miniSidenav ? 'w-20' : 'w-72'}`}
        aria-hidden={!openSidenav}
      >
        {/* Decorative SVG - subtle e-commerce motif (bag/coin abstract) */}
  <div className="absolute -right-6 top-4 pointer-events-none z-0 select-none" aria-hidden="true" style={{ opacity: 0.12, filter: 'blur(6px)' }}>
          <svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-80 h-80">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C9F8FF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#E6F9FF" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFAEB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFEFE0" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="92" fill="url(#g1)" />
            <g transform="translate(40,36)">
              <path d="M170 60c30 0 60 28 60 56s-30 56-60 56-60-28-60-56 30-56 60-56z" fill="#DFF8FF" opacity="0.95" />
              <rect x="90" y="140" width="120" height="56" rx="14" fill="url(#g2)" opacity="0.8" />
              <g transform="translate(-10,170) rotate(-12)">
                <rect x="0" y="0" width="84" height="50" rx="10" fill="#E6F9FF" opacity="0.72" />
                <circle cx="60" cy="26" r="8" fill="#C9F8FF" opacity="0.9" />
              </g>
            </g>
            {/* accent dots */}
            <circle cx="260" cy="40" r="6" fill="#C9F8FF" opacity="0.9" />
            <circle cx="230" cy="80" r="4" fill="#DFF8FF" opacity="0.9" />
          </svg>
        </div>

        <div className="relative z-10 px-0">
          <div className={`relative px-3 py-4 flex items-center justify-between` }>
          <div className="flex items-center gap-3">
            <Link to="#" onClick={(e) => { e.preventDefault(); }} className={`cursor-default flex items-center gap-3`} role="group" aria-label="Toko Anda">
              <img
                src={authUser?.toko?.logo || authUser?.avatar || ImageAkun}
                className={`${miniSidenav ? 'w-10 h-10' : 'w-16 h-16'} rounded`}
                alt="Akun"
              />
              {!miniSidenav && (
                <div className="ml-2">
                  <div className="mt-1 font-semibold text-base">
                    {authUser?.toko?.nama_toko || authUser?.nama_toko || "NCEKTECH"}
                  </div>
                  <div className="mt-2">
                    {(() => {
                      const level = (authUser?.toko?.membership || authUser?.level || "").toString().toLowerCase();
                      if (level.includes("silver")) return <img src={Silver} className="w-16 h-6" alt="Silver" />;
                      if (level.includes("gold")) return <img src={Gold} className="w-16 h-6" alt="Gold" />;
                      if (level.includes("platinum")) return <img src={Platinum} className="w-16 h-6" alt="Platinum" />;
                      return <img src={Bronze} className="w-16 h-6" alt="Bronze" />;
                    })()}
                  </div>
                </div>
              )}
            </Link>

            {/* Mini toggle inside sidenav next to store name - visible from lg and up */}
            <div className="hidden lg:flex items-center ml-2">
              <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
                onClick={() => setMiniSidenav(dispatch, !miniSidenav)}
                aria-label={miniSidenav ? 'Expand sidebar' : 'Minimize sidebar'}
              >
                <ChevronDoubleRightIcon className={`w-5 h-5 transition-transform ${miniSidenav ? 'rotate-180' : ''}`} />
              </IconButton>
            </div>

          {/* Close button on mobile */}
          </div>
          <button
            onClick={() => setOpenSidenav(dispatch, false)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Tutup sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="ml-4 mr-4">
          {/* when a nav item is clicked, close overlay on mobile or switch to mini on desktop */}
          {/** Note: using a handler so both top-level links and subpage links behave the same */}
          
          
          {routes.map(({ layout, title, pages }, key) => (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && (
                <li className="mx-3.5 mt-4 mb-2">
                  {!miniSidenav && (
                    <Typography variant="small" color="dark" className="font-black uppercase opacity-100 ">
                      {title}
                    </Typography>
                  )}
                </li>
              )}
              {pages.filter(p => !p.hidden).map(({ icon, name, path, subPages }) => (
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
                              <NavLink to={`/${layout}${subPage.path}`} onClick={() => {
                                // Only close the overlay on mobile. Do not auto-minimize on desktop.
                                if (window.innerWidth < 1024) {
                                  setOpenSidenav(dispatch, false);
                                }
                              }}>
                                {({ isActive }) => (
                                  <Button
                                    variant="text"
                                    color="blue-gray"
                                    className={`flex items-center gap-4 ${miniSidenav ? 'justify-center px-0' : 'px-4 capitalize'} ${isActive ? `bg-gradient-to-b ${gradientColors} text-[#56b4e6]` : ""}`}
                                    fullWidth
                                  >
                                    <div className={`${miniSidenav ? '' : 'pl-9'}`}>
                                      {!miniSidenav && (
                                        <Typography className={`font-medium capitalize text-blue-gray-500`}>
                                          {subPage.name}
                                        </Typography>
                                      )}
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
                    <NavLink to={`/${layout}${path}`} onClick={() => {
                      // Only close the overlay on mobile. Do not auto-minimize on desktop.
                      if (window.innerWidth < 1024) {
                        setOpenSidenav(dispatch, false);
                      }
                    }}>
                      {({ isActive }) => (
                        <Button
                          variant="text"
                          color="blue-gray"
                          className={`flex items-center gap-4 ${miniSidenav ? 'justify-center px-0' : 'px-4 capitalize'} ${isActive ? `bg-gradient-to-b ${gradientColors} text-[#56b4e6]` : ""}`}
                          fullWidth
                        >

                          <Typography className="text-blue-gray-500 font-medium capitalize">
                            {icon}
                          </Typography>
                          {!miniSidenav && (
                            <Typography className="text-blue-gray-500 font-medium capitalize">
                              {name}
                            </Typography>
                          )}
                        </Button>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          ))}
          {/* bottom toggle removed - control lives in header now */}
        </div>
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
