import { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";
import Button from "../../components/ui/button";
import DepartmentModal from "../../components/Departments/department-modal";
import { DepartmentsTable } from "../../components/Departments/table";

const Departments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    departmentService.getAllDepartments().then((data) => {
      const sortedDepartments = data.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      setDepartments(sortedDepartments);
    });
  }, []);

  const addDeptHandler = async (deptData) => {
    await departmentService
      .createDepartment(deptData)
      .then((res) => departments.unshift(res.data));
  };

  const deleteDeptHandler = async (deptId) => {
    await departmentService.deleteDepartment(deptId).then(() => {
      const result = departments.filter(({ _id }) => {
        return _id !== deptId;
      });
      setDepartments(result);
    });
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="h-full w-full flex flex-col gap-5">
      <DepartmentModal
        toggleModal={toggleModal}
        isOpen={isOpen}
        addDeptHandler={addDeptHandler}
      />
      <div className="relative">
        <h1 className="p-10 bg-gray-200">Departments</h1>

        <div className="absolute top-12 right-5">
          <Button
            onClick={() => {
              toggleModal();
            }}
          >
            Add Department
          </Button>
        </div>
      </div>

      <DepartmentsTable
        departments={departments}
        deleteDeptHandler={deleteDeptHandler}
        setDepartments={setDepartments}
      />
    </section>
  );
};
export default Departments;
