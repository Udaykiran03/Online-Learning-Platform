import { IoIosClose } from "react-icons/io";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import videoService from "../../services/videoService";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/button";
import { useEffect } from "react";

export const VideoModal = ({
  isOpen,
  toggleModal,
  courseData,
  setCourseData,
  isEdit,
  targetVideoId,
}) => {
  const {
    auth: { user },
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (isEdit) {
      await videoService
        .updateVideo(targetVideoId, {
          title: data.title,
          description: data.description,
          url: data.videoUrl,
          course: courseData?._id,
          teacher: user?._id,
        })
        .then((res) => {
          toggleModal();
          const result = courseData?.videos?.reduce((acc, curr) => {
            return curr?._id === res?._id ? [...acc, res] : [...acc, curr];
          }, []);
          setCourseData((prev) => ({ ...prev, videos: result }));
        });
    } else {
      await videoService
        .createVideo({
          title: data.title,
          description: data.description,
          url: data.videoUrl,
          course: courseData?._id,
          teacher: user?._id,
        })
        .then((res) => {
          toggleModal();
          setCourseData((prev) => ({ ...prev, videos: [...prev.videos, res] }));
        });
    }
    reset();
  };

  useEffect(() => {
    if (isEdit) {
      const targetVideo = courseData?.videos?.find(
        ({ _id }) => _id === targetVideoId
      );
      setValue("title", targetVideo?.title);
      setValue("description", targetVideo?.description);
      setValue("videoUrl", targetVideo?.url);
    }
  }, [isEdit, setValue, targetVideoId]);

  return (
    <Modal isOpen={isOpen} toggleModal={() => toggleModal("video")}>
      <div className="sticky top-0 left-0 bg-white flex items-center justify-between p-4 px-5 border-b rounded-t">
        <h3 className="text-lg font-semibold text-gray-900">
          {" "}
          {isEdit ? "Edit" : "Add New"} Video
        </h3>
        <button
          type="button"
          className="rounded-lg text-4xl flex justify-center items-center p-0"
          onClick={() => {
            toggleModal("video");
          }}
        >
          <IoIosClose className="text-black" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ol className="p-4">
          <div className="mb-5 space-y-2">
            <label className="block mb-2 text-sm font-medium">
              Video Title
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Video title is required",
              })}
              className={`border text-sm rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                errors["title"] && "border-red-500"
              }`}
              placeholder="Enter Video Title here..."
            />
            {errors["title"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["title"].message}
              </p>
            )}

            <label className="block mb-2 text-sm font-medium">
              Video Description
            </label>
            <textarea
              rows="4"
              {...register("description", {
                required: "Video description is required",
              })}
              className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-20 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 ${
                errors["description"] && "border-red-500"
              }`}
              placeholder="Enter Video Description here..."
            ></textarea>
            {errors["description"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["description"].message}
              </p>
            )}

            <label className="block mb-2 text-sm font-medium">Video URL</label>
            <input
              type="text"
              {...register("videoUrl", { required: "Video URL is required" })}
              className={`border text-sm rounded-lg focus:ring-blue-500 bg-gray-50 focus:border-blue-500 block w-full p-2.5 ${
                errors["videoUrl"] && "border-red-500"
              }`}
              placeholder="Enter Video URL here..."
            />
            {errors["videoUrl"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["videoUrl"].message}
              </p>
            )}
          </div>
        </ol>

        <Button style="m-4 mt-0" type="submit">
          {isEdit ? "Update" : "Add"} Video
        </Button>
      </form>
    </Modal>
  );
};
