import { useEffect, useState } from "react";
import PieChart from "../../components/Dashboard/pie-chart";
import courseService from "../../services/courseService";
import cn from "../../../lib/utils";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);

  const getDashboardData = async () => {
    await courseService.getAllCourses().then((res) => setDashboardData(res));
  };

  useEffect(() => {
    getDashboardData();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  const shouldRenderPieChart = dashboardData.some(
    (data) => data.students && data.students.length > 0
  );

  return (
    <>
      <section className="relative">
        <h1 className="p-10 bg-gray-200">Dashboard</h1>
      </section>
      <section
        className={cn(
          "flex flex-col justify-center items-center gap-10 h-[600px] mt-5",
          shouldRenderPieChart && "justify-start"
        )}
      >
        <h2 className="text-3xl font-semibold underline">
          Students Enrolled per Course
        </h2>
        {shouldRenderPieChart ? (
          <PieChart dashboardData={dashboardData} />
        ) : (
          <div className="text-2xl">There is no data to visualize</div>
        )}
      </section>
    </>
  );
};

export default Dashboard;
