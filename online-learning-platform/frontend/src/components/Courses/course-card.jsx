import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import { FaRegCircleDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import courseService from "../../services/courseService";
import { STUDENT } from "../../constants/user";

const CourseCard = ({ course, deleteCourseHandler }) => {
  const {
    auth: { user },
  } = useAuth();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const isStudent = user?.type === STUDENT;

  const viewHandler = () => {
    if (isStudent) {
      courseService.updateCourse(`${course?._id}/view`, {});
    }
  };

  let isTeachersCourse = user?._id === course?.teacher?._id;

  return (
    <div
      className="w-full h-80 relative rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out transform hover:scale-105 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="/course.webp"
        alt={course?.name}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
      />

      <div
        className={`absolute inset-0 bg-black bg-opacity-75 text-white ${
          isHovered ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 flex flex-col justify-center items-center h-full overflow-hidden`}
      >
        <div className="flex flex-col justify-center items-center gap-5 px-10">
          <h2 className="text-xl font-bold capitalize ">{course?.name}</h2>
          <p
            className="overflow-hidden"
            style={{
              WebkitLineClamp: 2,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
            title={course?.description}
          >
            {course?.description}
          </p>
          <div className="flex gap-5 justify-self-end">
            {!isStudent && (
              <button
                disabled={!isTeachersCourse}
                className="bg-white  text-black hover:scale-150 transition text-lg p-2 rounded-full hover:bg-red-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
                title={
                  isTeachersCourse
                    ? "Delete Course"
                    : "Cannot delete another teacher's course"
                }
                onClick={() => {
                  if (!isTeachersCourse) return;
                  deleteCourseHandler(course?._id);
                }}
              >
                <CiTrash />
              </button>
            )}
            <button
              className="bg-white text-black text-lg p-2 hover:scale-150 transition rounded-full hover:bg-emerald-300"
              title="View Course Details"
              onClick={() => {
                viewHandler();
                navigate(`/courses/${course?._id}`);
              }}
            >
              <FaRegCircleDot />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
