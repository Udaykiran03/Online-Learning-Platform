import { IoIosClose } from "react-icons/io";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";

const CourseModal = ({
  toggleModal,
  isOpen,
  isEdit,
  addCourseHandler,
  courseData,
  editCourseHandler,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [departments, setDepartments] = useState([]);

  const {
    auth: { user },
  } = useAuth();
  const onSubmit = async (data) => {
    const coursePayload = {
      name: data.courseName,
      description: data.courseDescription,
      teacher: user?._id,
      department: data.department,
    };
    if (isEdit && courseData?._id) {
      await editCourseHandler(courseData?._id, coursePayload);
    } else {
      await addCourseHandler(coursePayload);
    }

    toggleModal();
    reset();
  };

  useEffect(() => {
    departmentService.getAllDepartments().then((res) => {
      setDepartments(res);
    });

    if (isEdit) {
      setValue("courseName", courseData?.name);
      setValue("department", courseData?.department?._id);
      setValue("courseDescription", courseData?.description);
    }
  }, [
    isEdit,
    setValue,
    courseData?.name,
    courseData?.department,
    courseData?.description,
  ]);

  return (
    <>
      <Modal id="crud-modal" toggleModal={toggleModal} isOpen={isOpen}>
        <div className="sticky top-0 left-0 bg-white flex items-center justify-between p-4 px-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Course" : "Create New Course"}
          </h3>
          <button
            type="button"
            className="rounded-lg text-4xl flex justify-center items-center p-0"
            onClick={() => {
              toggleModal();
            }}
          >
            <IoIosClose className="text-black" />
          </button>
        </div>
        <form className="p-4 md:p-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label
              htmlFor="courseName"
              className="block mb-2 text-sm font-medium"
            >
              Course Name
            </label>
            <input
              type="text"
              defaultValue={courseData?.name}
              className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 block w-full p-2.5 ${
                errors.courseName && "border-red-500" // Corrected errors?.courseName to errors.courseName
              }`}
              placeholder="Enter Course Name here..."
              {...register("courseName", {
                required: "Course name is required",
              })}
            />
            {errors.courseName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.courseName.message}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="department"
              className="block mb-2 text-sm font-medium"
            >
              Department
            </label>
            <select
              className={`border text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 bg-gray-50 block w-full p-2.5 ${
                errors.department && "border-red-500"
              }`}
              {...register("department", {
                required: "Department is required",
              })}
              // defaultValue={courseData?.department?.name}
            >
              <option value="" disabled selected>
                Select Department
              </option>
              {departments.map((department, index) => {
                return (
                  <option value={department?._id} key={index}>
                    {department?.name}
                  </option>
                );
              })}
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="courseDescription"
              className="block mb-2 text-sm font-medium"
            >
              Course Description
            </label>
            <textarea
              rows="4"
              defaultValue={courseData?.description}
              className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                errors.courseDescription && "border-red-500"
              }`}
              placeholder="Enter Course Description here..."
              {...register("courseDescription", {
                required: "Course description is required",
              })}
            ></textarea>
            {errors.courseDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.courseDescription.message}
              </p>
            )}
          </div>
          <Button type="submit"> {isEdit ? "Update" : "Add"} Course</Button>
        </form>
      </Modal>
    </>
  );
};

export default CourseModal;
