import cn from "../../../lib/utils";

const Button = ({ onClick, children, style, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "text-white bg-gradient-to-tr from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg px-6 py-2 text-center me-2 transition-all duration-700",
        style
      )}
    >
      {children}
    </button>
  );
};

export default Button;
