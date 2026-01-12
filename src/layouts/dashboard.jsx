import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator, setOpenSidenav } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav, miniSidenav } = controller;

  const contentMarginClass = openSidenav ? (miniSidenav ? 'lg:ml-[6.5rem]' : 'lg:ml-[19rem]') : 'lg:ml-0';

  // Ensure sidenav is open by default on large screens so desktop keeps visible sidebar
  React.useEffect(() => {
    // Use the `lg` breakpoint (>=1024) to match sidenav mini/desktop behavior
    if (window.innerWidth >= 1024) {
      setOpenSidenav(dispatch, true);
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className={`p-4 transition-all duration-200 ${contentMarginClass}`}>
        <div className="relative">
          {/* Content decoration: subtle geometric blob behind content (hidden on small screens) */}
      <div className="absolute -left-12 top-6 pointer-events-none z-0 hidden lg:block" aria-hidden="true" style={{ opacity: 0.06, filter: 'blur(6px)' }}>
        <svg width="720" height="360" viewBox="0 0 720 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[720px] h-[360px]">
                <defs>
                  <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F0FDFF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#E6F9FF" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <rect x="16" y="16" width="520" height="240" rx="28" fill="url(#bg2)" />
                <circle cx="520" cy="60" r="86" fill="#DFF8FF" opacity="0.5" />
                <path d="M96 188c40-64 120-64 160 0" stroke="#DFF8FF" strokeWidth="18" strokeLinecap="round" opacity="0.34" />
                {/* receipt + bag + coin trio */}
                <g transform="translate(480,24)">
                  <rect x="0" y="0" width="92" height="122" rx="12" fill="#FFFFFF" opacity="0.06" stroke="#DFF8FF" strokeWidth="1" />
                  <path d="M12 16h68M12 34h68M12 52h44" stroke="#DFF8FF" strokeWidth="2.2" opacity="0.56" strokeLinecap="round" />
                  <circle cx="110" cy="10" r="18" fill="#FFDCA8" opacity="0.45" />
                  <rect x="120" y="40" width="64" height="44" rx="8" fill="#E6F9FF" opacity="0.36" />
                </g>
              </svg>
            </div>

          <div className="relative z-50">
            <DashboardNavbar />
          </div>
        </div>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element, subPages }) => (
                <Route key={path} exact path={path} element={element}>
                  {subPages && subPages.map(({ path: subPath, element: subElement }) => (
                    <Route key={subPath} path={subPath} element={subElement} />
                  ))}
                </Route>
              ))
          )}
        </Routes>
        <Outlet />
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;