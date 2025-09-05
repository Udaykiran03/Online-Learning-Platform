import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import Navbar from "../../components/Navbar/Navbar";
import useAuth from "../../hooks/useAuth";

const NotFound = () => {
  const [errorCode, setErrorCode] = useState(404);
  const pathname = useLocation().pathname;
  const { auth } = useAuth();

  useEffect(() => {
    if (pathname === "/unauthorised") {
      setErrorCode(401);
    }
  }, [pathname]);

  let message = "";

  switch (errorCode) {
    case 401:
      message = "Unauthorised!";
      break;
    case 404:
      message = "lost!";
      break;
    case 500:
      message = "facing server side problem!";
      break;
    default:
  }
  if (!auth?.user) return <Navigate to="/" replace />;
  return (
    <>
      <Navbar />
      <section className="w-full !h-[600px] flex justify-center items-center">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-semibold text-red-500">
            {errorCode}
          </h1>
          <p className="mb-4 text-lg text-gray-600">
            Oops! Looks like you're <span className="underline">{message}</span>
          </p>
          <div className="animate-bounce flex justify-center">
            <HiOutlinePaperAirplane className="text-red-500 h-20 w-20" />
          </div>
          <p className="mt-3 text-gray-600">
            Let's get you back{" "}
            <a href="/" className="text-sky-500">
              home
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
};

export default NotFound;
