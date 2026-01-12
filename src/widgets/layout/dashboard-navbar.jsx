import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useState, useEffect } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Ambil data user dari localStorage saat mount
  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    const authUser = localStorage.getItem("auth_user");
    
    if (authToken && authUser) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(authUser);
      setUserName(parsedUser.nama_lengkap || parsedUser.email);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token_time");
    navigate("/auth/sign-in");
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      {/* Decorative SVG: subtle shopping cart stroke in the navbar */}
      <div className="absolute right-2 top-0 pointer-events-none z-0 select-none" aria-hidden="true" style={{ opacity: 0.08, filter: 'blur(4px)' }}>
        <svg width="320" height="90" viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-80 h-20">
          <defs>
            <linearGradient id="navg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9F8FF" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#E6F9FF" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path d="M16 16h36l16 40h160l16-26H76" stroke="url(#navg)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.98" />
          <circle cx="110" cy="72" r="6.8" fill="#DFF8FF" opacity="0.95" />
          <circle cx="194" cy="72" r="6.8" fill="#DFF8FF" opacity="0.95" />
          <g transform="translate(240,6)">
            <rect x="0" y="0" width="52" height="52" rx="8" fill="#DFF8FF" opacity="0.18" />
            <path d="M8 18h36M8 30h36" stroke="#C9F8FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      </div>

  <div className="relative z-50 flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          {/* Hamburger: mobile and small-desktop only. Hidden on lg+ where sidenav shows its own toggle */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid lg:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          <div className="capitalize">{/* Breadcrumbs bisa ditambahkan di sini */}</div>

        </div>

        <div className="flex items-center gap-4">
          
          {isAuthenticated ? (
            // Jika sudah login, tampilkan dropdown dengan nama user dan logout
            <Menu>
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="flex items-center gap-2 normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  {userName}
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleLogout} className="flex items-center gap-2">
                  <PowerIcon className="h-4 w-4 text-red-500" />
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            // Jika belum login, tampilkan tombol Sign In
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
