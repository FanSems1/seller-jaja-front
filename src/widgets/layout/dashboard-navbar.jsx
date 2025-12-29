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
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
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
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">{/* Breadcrumbs bisa ditambahkan di sini */}</div>

        <div className="flex items-center gap-4">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

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
