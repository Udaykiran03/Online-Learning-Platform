import { CChart } from "@coreui/react-chartjs";

const PieChart = ({ dashboardData }) => {
  const labels = dashboardData?.map(
    ({ name }) => name.charAt(0).toUpperCase() + name.slice(1)
  );
  const data = dashboardData?.map(({ students }) => students?.length);

  const generateColorCodes = (number) => {
    const colorCodes = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const saturation = 70;
    const lightness = 50;

    for (let i = 0; i < number; i++) {
      const hue = (i * (360 / goldenRatio)) % 360;
      const colorCode = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colorCodes.push(colorCode);
    }
    return colorCodes;
  };
  return (
    <CChart
      className="h-96"
      type="pie"
      data={{
        labels,
        datasets: [
          {
            backgroundColor: generateColorCodes(data?.length),
            data: data,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            labels: {
              color: "black",
            },
          },
        },
      }}
      style={{ height: 400, width: 400 }}
    />
  );
};

export default PieChart;
