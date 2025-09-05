import { useState } from "react";
import AccordionItem from "./accordion-item";

const Accordion = ({
  accordionData,
  setVideoUrl,
  setIsEdit,
  toggleModal,
  deleteVideoHandler,
  isTeachersCourse,
}) => {
  const [openSectionIndex, setOpenSectionIndex] = useState("");
  const toggleSection = (index) => {
    setOpenSectionIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
    <ul className="px-4">
      {accordionData?.length ? (
        accordionData.map((item, index) => (
          <AccordionItem
            isTeachersCourse={isTeachersCourse}
            item={item}
            key={index}
            index={index}
            setVideoUrl={setVideoUrl}
            setIsEdit={setIsEdit}
            toggleModal={toggleModal}
            deleteVideoHandler={deleteVideoHandler}
            openSectionIndex={openSectionIndex}
            toggleSection={toggleSection}
          />
        ))
      ) : (
        <div>No Videos</div>
      )}
    </ul>
  );
};

export default Accordion;
