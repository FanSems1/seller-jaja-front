import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Navbar as MTNavbar, Typography, Button } from "@material-tailwind/react";

export function Navbar({ brandName, routes, action }) {
  // Mobile collapse removed — navbar is simplified (no hamburger)

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col  gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          color="blue-gray"
          className="capitalize"
        >
          <Link to={path} className="flex items-center gap-1 p-1 font-normal">
            {icon &&
              React.createElement(icon, {
                className: "w-[18px] h-[18px] opacity-50 mr-1",
              })}
            {name}
          </Link>
        </Typography>
      ))}
    </ul>
  );

  return (
    <MTNavbar className="p-3">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <Typography
            variant="small"
            className="mr-4 ml-2 cursor-pointer py-1.5 font-bold"
          >
            {brandName}
          </Typography>
        </Link>
        <div className="hidden lg:block">{navList}</div>
        {React.cloneElement(action, {
          className: "hidden lg:inline-block",
        })}
      </div>
      {/* Mobile collapse removed */}
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "Jaja Saller",
  action: (
    <a
      href="https://www.creative-tim.com/product/material-tailwind-dashboard-react"
      target="_blank"
    >
      <Button variant="gradient" size="sm" fullWidth>
        free download
      </Button>
    </a>
  ),
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
