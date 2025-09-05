import { useEffect, useState } from "react";
import CourseCard from "../../components/Courses/course-card";
import SearchBar from "../../components/common/SearchBar/search-bar";
import CourseModal from "../../components/Courses/course-modal";
import Button from "../../components/ui/button";
import courseService from "../../services/courseService";
import useAuth from "../../hooks/useAuth";

const Courses = () => {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const addCourseHandler = async (courseData) => {
    await courseService.createCourse(courseData).then((res) => {
      setCourses([...courses, res.data]);
      setFilteredCourses([...courses, res.data]);
    });
  };

  const deleteCourseHandler = async (courseId) => {
    await courseService.deleteCourse(courseId).then(() => {
      const result = courses.filter(({ _id }) => _id !== courseId);
      setCourses(result);
      setFilteredCourses(result);
    });
  };

  const isTeacher = auth?.user?.type === "TEACHER";

  useEffect(() => {
    courseService.getAllCourses().then((res) => {
      setCourses(res);
      setFilteredCourses(res);
    });
  }, []);

  const handleSearch = (term, filter) => {
    setSearchTerm(term);
    setSelectedFilter(filter);
    if (!term) {
      setFilteredCourses(courses);
    } else {
      let filtered = courses.filter((course) =>
        course?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (selectedFilter === "Department") {
        filtered = courses.filter((course) =>
          course.department?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      } else if (selectedFilter === "Teacher") {
        filtered = courses.filter((course) =>
          course.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (selectedFilter === "Enrolled Courses") {
        const enrolledCourseIds = auth?.user?.coursesEnrolled || [];
        filtered = courses.filter((course) =>
          enrolledCourseIds.includes(course._id)
        );
      }
      setFilteredCourses(filtered);
    }
  };

  const dropdownOptions = ["Department", "Teacher", "Enrolled Courses"];

  return (
    <section>
      <div className="relative p-10 bg-gray-200">
        <div className="flex items-center">
          <h1>Courses</h1>
        </div>
        {isTeacher && (
          <div className="absolute top-12 right-5">
            <Button onClick={toggleModal}>Add Course</Button>
          </div>
        )}
      </div>
      <CourseModal
        toggleModal={toggleModal}
        isOpen={isOpen}
        addCourseHandler={addCourseHandler}
      />
      <div className="flex justify-center items-center my-4">
        <SearchBar
          dropdownOptions={dropdownOptions}
          handleSearch={handleSearch}
        />
      </div>
      {filteredCourses.length !== 0 ? (
        <div className="grid grid-cols-4 gap-10 p-10 border-2">
          {filteredCourses.map((course, i) => (
            <CourseCard
              key={i}
              course={course}
              deleteCourseHandler={deleteCourseHandler}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-[400px] text-center flex items-center justify-center border-2">
          <h2 className="text-2xl">
            No Courses Available,{" "}
            {isTeacher ? "Let's Create One!" : "come back later!"}
          </h2>
        </div>
      )}
    </section>
  );
};

export default Courses;
