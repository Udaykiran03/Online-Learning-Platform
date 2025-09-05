import { FaRegTrashAlt } from "react-icons/fa";
import { TiPencil } from "react-icons/ti";
import useAuth from "../../../hooks/useAuth";
import { TEACHER } from "../../../constants/user";

export default function AccordionItem({
  item,
  index,
  setVideoUrl,
  setIsEdit,
  toggleModal,
  deleteVideoHandler,
  toggleSection,
  openSectionIndex,
  isTeachersCourse,
}) {
  const {
    auth: { user },
  } = useAuth();

  const isSectionOpen = (index) => openSectionIndex === index;

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*[\W\?]|(?:v|embed|watch)\?v=))([^&=\n\?]{11})/
    );
    return match ? match[1] : "";
  };

  const setUrlHandler = () => {
    const videoId = extractVideoId(item?.url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    setVideoUrl(embedUrl);
  };

  const isTeacher = user?.type === TEACHER;

  return (
    <div
      key={index}
      className="mb-4 bg-blue-50 rounded-xl px-8 py-4 cursor-pointer"
    >
      <button
        onClick={() => {
          setUrlHandler();
          toggleSection(index);
        }}
        id={index}
        className="flex items-center focus:outline-none w-full justify-between bg-transparent"
      >
        <div className="text-base md:text-lg font-semibold text-start capitalize">
          {item.title}
        </div>
        {isTeacher && isTeachersCourse && (
          <div className="flex justify-start items-center gap-5">
            <button
              className="self-center"
              onClick={() => {
                toggleModal();
                setIsEdit((prev) => ({
                  ...prev,
                  flag: true,
                  targetVideo: item?._id,
                }));
              }}
            >
              <TiPencil />
            </button>
            <button
              className="self-center text-red-500"
              onClick={() => {
                deleteVideoHandler(item?._id);
              }}
            >
              <FaRegTrashAlt />
            </button>
          </div>
        )}
      </button>
      <div
        className={`pr-4 transition-max-height flex justify-between items-end overflow-hidden duration-500  ${
          isSectionOpen(index) ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="flex mt-3 md:mt-8">
          <p
            className="font-normal text-sm md:text-base w-80 overflow-hidden"
            style={{
              WebkitLineClamp: 2,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}
