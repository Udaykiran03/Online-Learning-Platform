import { useSpring, animated } from "react-spring";
import { IoWarning } from "react-icons/io5";
import cn from "../../../lib/utils";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/button";
import studentService from "../../services/studentService";
import teacherService from "../../services/teacherService";
import { deleteUserInfo } from "../../../lib/storage";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TeacherDp, studentDp } from "../../constants/user";

const UserProfile = ({ isOpen, onClose }) => {
  const {
    auth: { user },
    setAuth,
  } = useAuth();

  const [userData, setUserData] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const isStudent = user?.type === "STUDENT";
  const onSubmit = (data) => {
    const userPayload = {
      ...data,
      email: userData?.email,
    };

    if (isStudent) {
      studentService
        .updateStudent(user?._id, userPayload)
        .then((res) => setUserData(res.data));
    } else {
      teacherService.updateTeacher(user?._id, userPayload).then((res) => {
        setUserData(res.data);
        setAuth({ user: res.data, loading: false });
      });
    }
  };

  const deleteUserHandler = () => {
    if (isStudent) {
      studentService.deleteStudent(user?._id).then(() => {
        deleteUserInfo();
        setAuth({ user: null, loading: false });
      });
    } else {
      teacherService.deleteTeacher(user?._id).then(() => {
        deleteUserInfo();
        setAuth({ user: null, loading: false });
      });
    }
  };

  const [departments, setDepartments] = useState([]);

  const profilePicture = isStudent ? studentDp : TeacherDp;

  const slideAnimation = useSpring({
    transform: isOpen ? `translateX(0%)` : `translateX(100%)`,
  });

  useEffect(() => {
    const setValues = (data) => {
      setValue("name", data?.name);
      setValue("email", data?.email);
      if (!isStudent) {
        setValue("department", data?.department?._id);
      }
    };

    if (!isStudent) {
      departmentService.getAllDepartments().then((res) => {
        setDepartments(res);
      });
    }

    if (isStudent) {
      studentService.getStudentById(user?._id).then((res) => {
        setAuth({ user: res, loading: false });
        setUserData(res);
        setValues(res);
      });
    } else {
      teacherService.getTeacherById(user?._id).then((res) => {
        setAuth({ user: res, loading: false });
        setUserData(res);
        setValues(res);
      });
    }
  }, [userData?.name, userData?.email, userData?.department?._id]);

  return (
    <animated.div
      className={cn(
        "fixed top-0 right-0 h-full w-1/3 bg-gradient-to-b from-red-100 to-emerald-50 z-50 shadow-lg",
        isStudent && "bg-gradient-to-b from-emerald-100 to-red-50 !max-h-screen"
      )}
      style={slideAnimation}
    >
      <div className="p-6 shadow-2xl h-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {isStudent ? "Student Profile" : "Teacher Profile"}
            </h1>
            <button
              type="button"
              disabled={!isStudent && !userData?.department}
              onClick={onClose}
              className="text-gray-600 hover:bg-gray-50 hover:text-black px-2 rounded-lg"
            >
              Close
            </button>
          </div>
          <div className="flex items-center justify-center mb-4">
            <img
              src={profilePicture}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover"
            />
          </div>
          <div className="p-4 rounded-lg mb-0 space-y-3">
            <div>
              <label className="font-medium text-stone-800">Name:</label>
              <input
                type="text"
                defaultValue={userData?.name}
                {...register("name", { required: "Name is required" })}
                className={`text-lg capitalize mb-2 font-medium block focus:outline-none border-2 bg-white w-full rounded-md p-2 ${
                  errors.name && "border-red-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="font-medium text-stone-800 flex items-center justify-between">
                Email:{" "}
                <span className="p-1 text-xs rounded-full bg-sky-100 text-sky-500 flex items-center gap-1">
                  <IoMdInformationCircleOutline /> Cannot be edited as per
                  guidelines.
                </span>
              </label>
              <input
                type="email"
                defaultValue={userData?.email}
                {...register("email")}
                className="text-lg mb-2 font-medium block focus:outline-none border-2 cursor-not-allowed w-full bg-white rounded-md p-2 disabled:text-gray-400"
                disabled
              />
            </div>
            {!isStudent ? (
              <div>
                <label className="font-medium text-stone-800 flex justify-between">
                  Department:{" "}
                  {!isStudent && !userData?.department && (
                    <span className="p-1 relative text-xs rounded-full bg-red-100 text-red-400 flex items-center gap-1">
                      <IoMdInformationCircleOutline /> Department must be
                      updated.
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    </span>
                  )}
                </label>
                <select
                  {...register("department", {
                    required: "Department is required",
                  })}
                  className={`text-lg mb-2 font-medium block focus:outline-none border-2 bg-white w-full rounded-md p-2 ${
                    errors.department && "border-red-500"
                  }`}
                  defaultValue={userData?.department}
                >
                  <option value="" disabled selected>
                    Select Department
                  </option>
                  {departments?.map((dept) => {
                    return (
                      <option key={dept?._id} value={dept?._id}>
                        {dept?.name}
                      </option>
                    );
                  })}
                </select>
                {errors?.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department.message}
                  </p>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex justify-end items-center">
            <Button type="submit" style="mx-4 w-full">
              Update
            </Button>
          </div>
        </form>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <p className="py-2 font-semibold text-nowrap">Delete Account</p>
            <div>
              <p className="inline-flex gap-2 items-center border border-red-500 rounded-full px-4 py-1 text-red-500 text-nowrap">
                <span>
                  <IoWarning />
                </span>
                Proceed with caution
              </p>
            </div>
          </div>
          <p className="mt-2">
            We will completely wipe your data. There is no way to access your
            account after this action.
          </p>
          <button
            onClick={deleteUserHandler}
            className="mt-4 rounded-full bg-red-500 shadow-lg w-60 py-2 text-white disabled:opacity-50"
          >
            Delete Account
          </button>
        </div>
      </div>
    </animated.div>
  );
};

export default UserProfile;
