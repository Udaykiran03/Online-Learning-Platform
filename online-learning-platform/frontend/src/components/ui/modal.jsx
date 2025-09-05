import { useEffect } from "react";

const Modal = ({ id, children, toggleModal, isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          id={id}
          className="overflow-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen bg-black bg-opacity-50"
          tabIndex="-1"
          aria-labelledby={`${id}-label`}
          aria-modal="true"
          role="dialog"
          onClick={toggleModal}
        >
          <div
            className="relative w-full max-w-md max-h-[85%] overflow-y-auto mx-auto my-8 bg-white rounded-lg shadow"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
