import { useEffect, useState } from "react";
import { getUserSpending } from "../services/authService";
import Plot from "react-plotly.js"; // Import Plot from react-plotly.js

function UserSpendingPlot() {
  const [dates, setDates] = useState<Date[]>([]);
  const [costs, setCosts] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserSpending(); // Fetch user spending data
      if (result) {
        const [dateData, costData] = result; // Destructure the returned array
        setDates(dateData || []); // Fallback to empty array if dateData is null or undefined
        setCosts(costData || []); // Fallback to empty array if costData is null or undefined
      } else {
        // Handle the case where result is null
        setDates([]); // Default to empty array
        setCosts([]); // Default to empty array
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array to run on mount only

  // Ensure that the data is available before rendering the plot
  if (!dates.length || !costs.length) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Plot
        data={[
          {
            x: dates, // x-axis: dates
            y: costs, // y-axis: costs
            type: "scatter", // Type of plot (line plot)
            mode: "lines+markers", // Show lines and markers
            marker: { color: "blue" }, // Set marker color
          },
        ]}
        layout={{
          xaxis: {
            title: "Date", // x-axis label
            type: "date", // Specify that the x-axis should treat values as dates
          },
          yaxis: {
            title: "Cost (£)", // y-axis label
          },
        }}
      />
    </div>
  );
}

export default UserSpendingPlot;
