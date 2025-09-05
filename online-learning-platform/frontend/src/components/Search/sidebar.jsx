const Sidebar = ({ tabs, activeTab, setActiveTab }) => {
  const handleClickTab = (index) => {
    setActiveTab(index);
  };

  return (
    <aside className="fixed flex flex-col w-64 h-full bg-gray-200">
      <ul className="space-y-6 font-medium">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-blue-600 ${
              index === activeTab ? "text-blue-600 font-bold bg-white" : ""
            }`}
            onClick={() => handleClickTab(index, tab.collections)}
          >
            {tab.display}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
