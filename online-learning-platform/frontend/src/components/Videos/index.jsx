import { useEffect, useState } from "react";
import Accordion from "../common/Accordion";
import VideoPlayer from "./video-player";
import videoService from "../../services/videoService";

export const Videos = ({
  courseData,
  setCourseData,
  isOpen,
  setIsOpen,
  setIsEdit,
  isEnrolled,
  isTeachersCourse,
}) => {
  const [videoUrl, setVideoUrl] = useState("");

  const toggleModal = (modalName) => {
    setIsOpen((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  };

  const accordionData = courseData?.videos;

  const deleteVideoHandler = async (videoId) => {
    await videoService.deleteVideo(videoId).then((res) => {
      const result = courseData?.videos?.filter(({ _id }) => _id !== videoId);
      setCourseData((prev) => ({ ...prev, videos: result }));
    });
  };

  useEffect(() => {
    const extractVideoId = (url) => {
      const match = url?.match(
        /(?:youtu\.be\/|youtube\.com\/(?:.*[\W\?]|(?:v|embed|watch)\?v=))([^&=\n\?]{11})/
      );
      return match ? match[1] : "";
    };

    if (accordionData && accordionData.length > 0) {
      const videoId = extractVideoId(accordionData[0]?.url);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      setVideoUrl(embedUrl);
    }
  }, [accordionData, isEnrolled, isOpen]);

  if (accordionData?.length === 0)
    return (
      <div className="h-60 w-full mt-10 flex justify-center items-center text-2xl font-semibold border-2">
        No Videos Available
      </div>
    );

  return (
    <div className="w-full grid grid-cols-3 mt-10">
      <div className="col-span-2">
        <VideoPlayer videoSourceUrl={videoUrl} />
      </div>
      <div className="col-span-1">
        <Accordion
          isTeachersCourse={isTeachersCourse}
          accordionData={accordionData}
          setVideoUrl={setVideoUrl}
          setIsEdit={setIsEdit}
          toggleModal={() => toggleModal("video")}
          deleteVideoHandler={deleteVideoHandler}
        />
      </div>
    </div>
  );
};
