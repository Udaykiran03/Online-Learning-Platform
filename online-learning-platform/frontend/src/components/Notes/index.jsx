import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useForm } from "react-hook-form";
import noteService from "../../services/noteService";
import { TEACHER } from "../../constants/user";
import cn from "../../../lib/utils";
import courseService from "../../services/courseService";

export const Notes = ({
  courseData,
  user,
  setCourseData,
  isTeachersCourse,
}) => {
  const [typedContent, setTypedContent] = useState("");
  const isNoteExists = !!courseData?.note;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const isEdit = watch("isEdit");

  const onChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
    if (name === "markdown") {
      setTypedContent(value);
    }
  };

  const reRender = () => {
    courseService
      .getCourseById(courseData?._id)
      .then((res) => setCourseData(res));
  };

  const handleDelete = () => {
    noteService.deleteNote(courseData?.note?._id);
    setValue("name", "");
    reRender();
  };

  useEffect(() => {
    if (isNoteExists) {
      setValue("title", courseData?.note?.title);
      setValue("markdown", courseData?.note?.markdown);
      setTypedContent(courseData?.note?.markdown);
    }
  }, [isNoteExists, courseData]);

  const onSubmit = async (data) => {
    if (!isNoteExists) {
      noteService
        .createNote({
          course: courseData._id,
          teacher: courseData.teacher._id,
          markdown: data.markdown,
          title: data.title,
        })
        .then(() => {
          setValue("isEdit", false);
          reRender();
        });
    } else {
      noteService
        .updateNote(courseData?.note?._id, {
          course: courseData._id,
          teacher: courseData.teacher._id,
          markdown: data.markdown,
          title: data.title,
        })
        .then(() => {
          setValue("isEdit", false);
          reRender();
        });
    }
  };

  const isTeacher = user?.type === TEACHER;

  return (
    <div className="w-full flex flex-col mt-10">
      <div className="relative border min-h-60">
        {isTeacher && isTeachersCourse && (
          <div className="absolute top-5 right-5 flex gap-5">
            {isEdit && (
              <button
                className={cn(
                  "bg-blue-200 rounded-md px-10 py-2 hover:bg-blue-500 hover:text-white"
                )}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </button>
            )}
            {isTeacher && (
              <button
                onClick={() => setValue("isEdit", !isEdit)}
                className="bg-orange-200 rounded-md px-10 py-2 hover:bg-orange-500 hover:text-white"
              >
                {isEdit ? "Cancel" : isNoteExists ? "Edit" : "Create"}{" "}
              </button>
            )}
            {isNoteExists && (
              <button
                onClick={handleDelete}
                className="bg-red-200 rounded-md px-10 py-2 hover:bg-red-500 hover:text-white"
              >
                Delete
              </button>
            )}
          </div>
        )}
        {isEdit ? (
          <div className="h-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-2">
                <label className="text-xl">Title:</label>
                <input
                  className={cn(
                    "ml-2 focus:border-blue-500 border-2 text-2xl",
                    errors.title && "border-red-500"
                  )}
                  defaultValue={courseData?.note?.title}
                  {...register("title", { required: "Title is required" })}
                  onChange={onChange}
                />
                {errors?.title && (
                  <p className="text-red-500">{errors?.title?.message}</p>
                )}
              </div>
              <div className="mt-10">
                <label className="text-2xl">
                  Content: (
                  <a
                    target="_blank"
                    className="underline hover:text-indigo-700"
                    href="https://www.markdownguide.org/basic-syntax/"
                  >
                    In Markdown
                  </a>
                  )
                </label>
                <textarea
                  className={cn(
                    "w-full min-h-60 border-2 focus:!border-blue-500",
                    errors.markdown && "border-red-500"
                  )}
                  defaultValue={courseData.markdown}
                  {...register("markdown", {
                    required: "Content is required",
                  })}
                  onChange={onChange}
                />
                {errors.markdown && (
                  <p className="text-red-500">{errors?.markdown?.message}</p>
                )}

                <div className="mt-5 w-full flex flex-col min-h-60 text-wrap overflow-hidden">
                  <label className="text-2xl">Preview:</label>
                  <Markdown className="text-wrap min-h-60 text-start overflow-x-auto">
                    {typedContent}
                  </Markdown>{" "}
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full">
            <h2 className="text-center my-5 text-3xl capitalize">
              {courseData?.note?.title || ""}
            </h2>{" "}
            <div className="flex flex-col justify-center h-48">
              {isNoteExists ? (
                <Markdown>{courseData?.note?.markdown}</Markdown>
              ) : (
                <h1 className="text-center font-semibold text-2xl">
                  No Notes Available
                </h1>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
