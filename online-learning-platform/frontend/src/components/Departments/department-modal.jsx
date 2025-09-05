import { IoIosClose } from "react-icons/io";
import Modal from "../ui/modal";
import Button from "../ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

const DepartmentModal = ({
  toggleModal,
  isOpen,
  isEdit,
  addDeptHandler,
  deptData,
  editDeptHandler,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const btnRef = useRef(null);

  useEffect(() => {
    if (deptData) {
      setValue("name", deptData?.name?.split(" ")?.splice(2)?.join(" "));
      setValue("description", deptData?.description || "");
    }
  }, [deptData?.name, deptData?.description]);

  const onSubmit = async (data) => {
    const deptName =
      "Department of " + data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const deptPayload = {
      name: deptName,
      description: data.description,
    };
   
    if (isEdit && deptData._id) {
      await editDeptHandler(deptData._id, deptPayload).then(() => {
        btnRef?.current?.click();
      });
    } else {
      await addDeptHandler(deptPayload).then(() => {
        btnRef?.current?.click();
      });
    }

    toggleModal();
    reset();
  };

  return (
    <>
      <Modal id="crud-modal" toggleModal={toggleModal} isOpen={isOpen}>
        <div className="sticky top-0 left-0 bg-white flex items-center justify-between p-4 px-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Department" : "Create New Department"}
          </h3>
          <button
            ref={btnRef}
            type="button"
            className="rounded-lg text-4xl flex justify-center items-center p-0"
            onClick={() => {
              toggleModal();
            }}
          >
            <IoIosClose className="text-black" />
          </button>
        </div>
        <form
          noValidate
          className="p-4 md:p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-5">
            <label
              htmlFor="courseName"
              className="block mb-2 text-sm font-medium"
            >
              Department Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Department name is required",
              })}
              className={`border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 block w-full p-2.5 ${
                errors.name && "border-red-500"
              }`}
              placeholder="Enter Department Name here..."
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="courseDescription"
              className="block mb-2 text-sm font-medium"
            >
              Department Description
            </label>
            <textarea
              rows="4"
              {...register("description", {
                required: "Department description is required",
              })}
              className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description && "border-red-500"
              }`}
              placeholder="Enter Department Description here..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button type="submit"> {isEdit ? "Update" : "Add"} Department</Button>
        </form>
      </Modal>
    </>
  );
};

export default DepartmentModal;
