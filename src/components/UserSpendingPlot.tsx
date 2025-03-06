import { useEffect, useState } from "react";
import { getUserSpending } from "../services/authService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  YAxis,
} from "recharts";

function UserSpendingPlot() {
  const [costData, setCostData] = useState<
    { receipt_id: number; slot_time: Date; cost: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getUserSpending(); // Fetch user spending data
      if (result) {
        setCostData(result);
      }
      setIsLoading(false);
    };
    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array to run on mount only

  return (
    <>
      {isLoading ? (
        <div className="d-flex align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", height: "500px" }}>
          <ResponsiveContainer>
            <LineChart data={costData}>
              <CartesianGrid
                stroke="#ccc"
                strokeDasharray="5 5"
              ></CartesianGrid>
              <Line dataKey="cost" stroke="#8884d8"></Line>
              <XAxis dataKey="slot_time" tickFormatter={formatDate}></XAxis>
              <YAxis tickFormatter={(value) => `£${value.toFixed(0)}`} />
              <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

// Date Format Function
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    })
    .replace(",", ""); // Removes the comma between date and time
};

export default UserSpendingPlot;
