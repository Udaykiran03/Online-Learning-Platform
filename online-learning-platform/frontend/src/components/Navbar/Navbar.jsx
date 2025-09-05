import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/button";
import useAuth from "../../hooks/useAuth";

import LocalStorageRepository from "../../../lib/storage";
import { useEffect, useState } from "react";
import UserProfile from "../../pages/Profile";
import cn from "../../../lib/utils";
import { STUDENT, TeacherDp, studentDp } from "../../constants/user";

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        if (window.scrollY > 0) {
          navbar.classList.add("shadow-md");
        } else {
          navbar.classList.remove("shadow-md");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Courses", link: "/courses" },
    { label: "Departments", link: "/departments" },
    { label: "Search", link: "/search" },
  ];

  const handleLogout = () => {
    if (auth.user) {
      setAuth({ user: null });
      LocalStorageRepository.delete("token");
    }
  };
  if (!auth?.user) return <Navigate to="/" replace />;

  let isStudent = auth?.user.type === STUDENT;
  const profilePicture = isStudent ? studentDp : TeacherDp;

  return (
    <>
      <nav
        id="navbar"
        className="w-full sticky top-0 left-0 right-0 flex items-center justify-between gap-10 flex-wrap cursor-pointer bg-transparent
       backdrop-blur-md px-6 h-24 z-20 transition-shadow duration-300 "
      >
        <div
          className="h-20 justify-self-center"
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            src="/logo.png"
            alt="brand_logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex items-center justify-center md:items-center flex-shrink-0 text-white flex-col sm:flex-row">
          {navLinks.map((item, i) => (
            <NavLink
              key={i}
              className={cn(
                "text-gray-800 w-[150px] p-2 [&.active]:font-medium [&.active]:bg-gray-200 hover:bg-gray-100 text-md flex items-center justify-center capitalize h-[96px] text-center"
              )}
              to={item.link}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="block md:hidden">
          <button
            id="nav-toggle"
            className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 "
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        <div
          className="w-full border-t-2 border-gray-200 md:border-t-0 md:flex md:items-center md:w-fit hidden pt-2 md:pt-0 gap-5"
          id="nav-content"
        >
          <div
            className="flex items-center justify-center relative"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <img
              src={profilePicture}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            {auth.user?.type === "TEACHER" && !auth?.user?.department && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
            )}
          </div>
          <div className="flex justify-center items-center">
            {pathname !== ("/login" || "/register") && (
              <Button
                onClick={() => {
                  handleLogout();
                  navigate("/login");
                }}
              >
                {auth?.user ? "Log Out" : "Log In"}
              </Button>
            )}
          </div>
        </div>
      </nav>
      <UserProfile isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
    </>
  );
};

export default Navbar;
