import { LuSchool } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";

import cn from "./../../../lib/utils";
import DepartmentModal from "./department-modal";
import departmentService from "../../services/departmentService";
import { useState } from "react";

export const DepartmentsTable = ({
  departments,
  deleteDeptHandler,
  setDepartments,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deptData, setDeptData] = useState({});

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const editDeptHandler = async (deptId, deptData) => {
    await departmentService.updateDepartment(deptId, deptData).then((res) => {
      const result = departments?.reduce((acc, curr) => {
        return curr?._id === deptId ? [...acc, res.data] : [...acc, curr];
      }, []);

      const sortedDepartments = result.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      setDepartments(sortedDepartments);
    });
  };

  const getDataById = (_id) => {
    const result = departments.find((dept) => dept._id === _id);
    setDeptData(result);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
      <DepartmentModal
        toggleModal={toggleModal}
        isOpen={isOpen}
        isEdit={true}
        deptData={deptData}
        editDeptHandler={editDeptHandler}
      />
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-medium text-gray-900 max-w-[320px]"
            >
              Department
            </th>
            <th
              scope="col"
              className="px-6 text-center py-4 font-medium text-gray-900"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-center font-medium text-gray-900"
            >
              Teachers
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-center font-medium text-gray-900"
            >
              Courses
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-end font-medium text-gray-900"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {departments.length !== 0 ? (
            departments?.map((dept, i) => {
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="flex gap-3 px-6 py-4 font-normal text-gray-900 max-w-[320px]">
                    <div
                      className={cn(
                        "relative h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100"
                      )}
                    >
                      <LuSchool className="h-5 w-5" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">
                        {dept.name}
                      </div>
                      <div className="text-gray-400">
                        dept@
                        {dept?.name.split(" ").splice(2).join("").toLowerCase()}
                        .com
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-gray-700 text-start w-[350px]"
                    title={dept.description}
                  >
                    {dept.description}
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <div
                      className={cn(
                        "flex gap-2 overflow-x-auto w-[200px]",
                        dept.teachers.length < 3 && "justify-center"
                      )}
                    >
                      {dept.teachers.length !== 0
                        ? dept.teachers.map((teacher, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-full bg-green-50 hover:bg-green-200 px-2 py-1 text-xs font-semibold text-green-600 text-nowrap capitalize cursor-pointer"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-green-600 " />
                              {teacher?.name}
                            </span>
                          ))
                        : "There are no teachers"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "flex gap-2 overflow-x-auto w-[200px] ",
                        dept.courses.length < 3 && "justify-center"
                      )}
                    >
                      {dept.courses.length !== 0
                        ? dept.courses.map((course, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-full bg-violet-50 hover:bg-violet-200 px-2 py-1 text-xs font-semibold text-violet-600 text-nowrap capitalize cursor-pointer"
                            >
                              {course.name}
                            </span>
                          ))
                        : "There are no courses"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4 space-x-3">
                      <GrEdit
                        className="w-6 h-6 cursor-pointer hover:text-sky-500"
                        onClick={() => {
                          getDataById(dept._id);
                          toggleModal();
                        }}
                      />
                      <RiDeleteBin6Line
                        onClick={() => deleteDeptHandler(dept._id)}
                        className="w-6 h-6 cursor-pointer hover:text-red-500"
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="hover:bg-gray-50">
              <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                <div
                  className={cn(
                    "relative h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100"
                  )}
                >
                  <LuSchool className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-700">no data</div>
                  <div className="text-gray-400">no data</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  no data
                </span>
              </td>
              <td className="px-6 py-4">no data</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                    no data
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                    no data
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                    no data
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-4">
                  <GrEdit className="w-6 h-6 cursor-pointer hover:text-sky-500" />
                  <RiDeleteBin6Line className="w-6 h-6 cursor-pointer hover:text-red-500" />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
