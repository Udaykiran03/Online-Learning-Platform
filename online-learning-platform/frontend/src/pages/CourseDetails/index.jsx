import { MdOutlineLaptopChromebook } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { useState, useEffect } from "react";
import CourseModal from "../../components/Courses/course-modal";
import courseService from "../../services/courseService";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaRegCircleDot } from "react-icons/fa6";
import { PiStudentFill } from "react-icons/pi";
import { VideoModal } from "../../components/Videos/video-modal";
import cn from "../../../lib/utils";
import { LuSchool } from "react-icons/lu";
import { GiTeacher } from "react-icons/gi";
import { Videos } from "../../components/Videos";
import { Notes } from "../../components/Notes";

const CourseDetails = () => {
  const { id } = useParams();
  const {
    auth: { user },
  } = useAuth();

  const isStudent = user?.type === "STUDENT";
  const [isActive, setIsActive] = useState("videos");
  const [isEdit, setIsEdit] = useState({
    flag: false,
    targetVideo: "",
  });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseData, setCourseData] = useState({});
  const [isOpen, setIsOpen] = useState({
    course: false,
    video: false,
  });

  const editCourseHandler = async (courseId, courseData) => {
    await courseService
      .updateCourse(courseId, courseData)
      .then((res) => setCourseData(res.data));
  };

  useEffect(() => {
    if (courseData && courseData.students) {
      setIsEnrolled(courseData.students.includes(user._id));
    }
  }, [courseData?.students]);

  const handleEnroll = () => {
    if (!isEnrolled) {
      courseService
        .updateCourse(`${id}/enroll`, {
          student: user._id,
          enroll: true,
        })
        .then(() => setIsEnrolled(true));
    } else {
      courseService
        .updateCourse(`${id}/enroll`, {
          student: user._id,
          enroll: false,
        })
        .then(() => setIsEnrolled(false));
    }
  };

  useEffect(() => {
    if (id) {
      courseService.getCourseById(id).then((res) => setCourseData(res));
    }
  }, [isEnrolled, isOpen]);

  const isTeachersCourse = user?._id === courseData?.teacher?._id;

  const toggleModal = (modalName) => {
    if (!isTeachersCourse) return;
    setIsOpen((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  };

  return (
    <div>
      <CourseModal
        toggleModal={() => toggleModal("course")}
        isOpen={isOpen?.course}
        isEdit={true}
        courseData={courseData}
        editCourseHandler={editCourseHandler}
      />
      <VideoModal
        toggleModal={() => toggleModal("video")}
        isOpen={isOpen?.video}
        courseData={courseData}
        setCourseData={setCourseData}
        isEdit={isEdit.flag}
        targetVideoId={isEdit.targetVideo}
      />
      <div className="flex items-center justify-center text-center h-72 bg-center bg-cover bg-no-repeat bg-[url('/course-details.png')]">
        <h1 className="text-[80px] text-white text-center flex justify-center items-center font-semibold w-full h-full backdrop-blur-md uppercase">
          {courseData?.name}
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-10 px-4 py-8 items-center">
        <div className="col-span-2 text-gray-800 border-2 border-gray-300 grid grid-rows-2 text-wrap p-4 lg:min-h-[140px] rounded-md">
          <div className="flex flex-col gap-2 mb-5">
            <span className="font-extrabold text-lg">Overview: &nbsp;</span>
            <p className="font-medium text-lg line-clamp-3">
              {courseData?.description}
            </p>
          </div>

          <div className="grid grid-cols-2">
            <span className="flex items-center gap-1 font-medium text-nowrap text-lg capitalize justify-start col-span-1 bg-yellow-100 p-1 rounded-tl-md py-4 px-2">
              by:{" "}
              <span className="font-semibold">
                {courseData?.department?.name || ""}
              </span>{" "}
              <LuSchool />
            </span>
            <span className="flex items-center gap-1 font-medium text-lg capitalize col-span-1 bg-red-100 rounded-tr-md py-4 px-2">
              by Teacher:{" "}
              <span className="font-semibold">
                {courseData?.teacher?.name || ""}
              </span>{" "}
              <GiTeacher />
            </span>
            <span className="flex items-center gap-1 font-medium text-lg col-span-1 bg-violet-100 rounded-bl-md py-4 px-2">
              Total Views:{" "}
              <span className="font-semibold">{courseData?.views || 0}</span>{" "}
              <FaRegCircleDot />
            </span>
            <span className="flex items-center gap-1 font-medium text-lg col-span-1 bg-lime-100 rounded-br-md py-4 px-2">
              Students Enrolled:{" "}
              <span className="font-semibold">
                {courseData?.students?.length || 0}
              </span>{" "}
              <PiStudentFill className="h-6 w-6" />
            </span>
          </div>
        </div>
        <div className="mx-16 space-y-4">
          {!isStudent ? (
            <div className="flex flex-col gap-5">
              <button
                disabled={!isTeachersCourse}
                type="button"
                title={
                  isTeachersCourse
                    ? "Edit Course"
                    : "Cannot edit another teacher's course"
                }
                className="text-white transition bg-rose-500 hover:bg-rose-800 font-medium rounded-lg text-lg py-4 flex justify-center items-center gap-2 h-fit w-full disabled:cursor-not-allowed disabled:bg-rose-200"
                onClick={() => toggleModal("course")}
              >
                Edit Course <FiEdit3 />
              </button>

              <button
                disabled={!isTeachersCourse}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 transition focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg py-4 px-8 flex justify-center items-center gap-2 h-fit w-full disabled:cursor-not-allowed disabled:bg-blue-200"
                onClick={() => toggleModal("video")}
                title={
                  isTeachersCourse
                    ? "Add Videos"
                    : "Cannot add videos for another teacher's course"
                }
              >
                Add Videos <MdOutlineLaptopChromebook />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              type="button"
              className={cn(
                "text-white bg-rose-500 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg py-4 flex justify-center items-center gap-2 h-fit w-full",
                !isEnrolled && "bg-blue-500 hover:bg-blue-800"
              )}
            >
              {isEnrolled ? (
                "Unenroll this course"
              ) : (
                <span className="flex items-center gap-3">
                  Enroll Now <MdOutlineLaptopChromebook />
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="border-2 px-3 py-5 flex flex-col items-center justify-center">
        <div className="border-2 grid grid-cols-2 items-center justify-center p-2">
          <button
            onClick={() => setIsActive("videos")}
            className={cn(
              "h-12 w-36 text-center font-semibold bg-gray-100 transition",
              isActive === "videos" && "bg-teal-200"
            )}
          >
            Videos
          </button>
          <button
            onClick={() => setIsActive("notes")}
            className={cn(
              "h-12 w-36 text-center font-semibold bg-gray-100 transition",
              isActive === "notes" && "bg-teal-200"
            )}
          >
            Notes
          </button>
        </div>
        {isActive === "videos" && (
          <Videos
            id={id}
            isTeachersCourse={isTeachersCourse}
            courseData={courseData}
            isOpen={isOpen}
            isEnrolled={isEnrolled}
            setCourseData={setCourseData}
            setIsOpen={setIsOpen}
            setIsEdit={setIsEdit}
          />
        )}
        {isActive === "notes" && (
          <Notes
            isTeachersCourse={isTeachersCourse}
            courseData={courseData}
            user={user}
            setCourseData={setCourseData}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
