import { TbLoader } from "react-icons/tb";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center space-x-2">
        <TbLoader className="size-16 animate-spin" />
        <span className="text-5xl font-medium text-gray-500">Loading...</span>
      </div>
    </div>
  );
};
