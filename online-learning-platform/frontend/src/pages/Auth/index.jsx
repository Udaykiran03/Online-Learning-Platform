import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { STUDENT, TEACHER } from "../../constants/user";
import useAuth from "../../hooks/useAuth";
import cn from "../../../lib/utils";
import { IoArrowUndoSharp } from "react-icons/io5";
import LocalStorageRepository, { deleteUserInfo } from "../../../lib/storage";
import { Loading } from "../Loading";

const AuthForm = ({ isRegister = true }) => {
  const [isTeacher, setIsTeacher] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const removeOldToken = () => {
    if (LocalStorageRepository.get("token")) {
      deleteUserInfo();
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    removeOldToken();
    let type;
    if (isTeacher) type = TEACHER;
    else type = STUDENT;

    if (isRegister) {
      authService.register({ ...data, type }).then(() => {
        navigate("/login");
      });
    } else {
      authService.login({ ...data }).then(() => {
        window.location.reload();
        // navigate(from, { replace: true });
      });
    }
  };

  const handleSwitchChange = () => {
    setIsTeacher((prevState) => !prevState);
  };

  if (auth?.loading) return <Loading />;

  if (auth?.user) return <Navigate to="/" state={{ from: location }} replace />;

  return (
    <section
      className={cn(
        "bg-emerald-100 h-full w-full transition-colors duration-500",
        isTeacher && "bg-red-100",
        location.pathname === "/login" && "bg-gray-200"
      )}
    >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          <img className="w-12 h-8 mr-2" src="/logo.png" alt="logo" />
          Online Learning Platform
        </Link>
        <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 relative">
          {isRegister && (
            <div className="absolute -right-5 top-7">
              <IoArrowUndoSharp className="w-10 h-10 animate-bounce" />
            </div>
          )}
          <div className=" p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              {isRegister ? (
                <span className="flex justify-between items-center">
                  Create an Account{" "}
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      checked={!isTeacher}
                      onChange={handleSwitchChange}
                      className="sr-only peer"
                    />
                    <div
                      className={cn(
                        "relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-emerald-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-emerald-600",
                        isTeacher && "peer-focus:ring-red-300"
                      )}
                    ></div>
                    <span className="ms-3 text-sm font-medium text-red-900">
                      {isTeacher ? "As Teacher" : "As Student"}
                    </span>
                  </label>
                </span>
              ) : (
                "Sign in to your account"
              )}
            </h1>
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              {isRegister && (
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <span className="text-red-600">Name is required</span>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="johndoe@email.com"
                />
                {errors.email && (
                  <span className="text-red-600">{errors.email.message}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  {...register("password", { required: true })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="text-red-600">Password is required</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {isRegister ? "Create Account" : "Sign in"}
              </button>
              <p className="text-sm font-light text-gray-500">
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account yet?"}{" "}
                <a
                  href={isRegister ? "/login" : "/register"}
                  className="font-medium text-primary-600 hover:underline"
                >
                  {isRegister ? "Sign in" : "Register"}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
