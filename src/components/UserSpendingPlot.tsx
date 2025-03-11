import React, { useEffect, useState } from "react";
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
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let result = await getUserSpending(); // Fetch user spending data
      if (result) {
        if (filterStartDate) {
          result = result.filter((obj) => {
            return obj.slot_time >= filterStartDate;
          });
          console.log("After Filtering Start Date: ", result);
        }
        if (filterEndDate) {
          result = result.filter((obj) => {
            return obj.slot_time <= filterEndDate;
          });
          console.log("After Filtering End Date: ", result);
        }
        setCostData(result);
        console.log("After both filters: ", result);
      }
      setIsLoading(false);
    };
    fetchData(); // Call the fetchData function
  }, [filterStartDate, filterEndDate]); // Empty dependency array to run on mount only

  // Handle input date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFilterStartDate(e.target.valueAsDate);
    console.log("Start Date:", e.target.valueAsDate);
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFilterEndDate(e.target.valueAsDate);
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", padding: "10px", flexWrap: "wrap" }}>
          <section
            style={{
              backgroundColor: "ghostwhite",
              padding: "10px",
              display: "flex",
              flexWrap: "wrap",
              flex: "1",
            }}
          >
            <h1 className="container" style={{ width: "100%" }}>
              Filters
            </h1>
            <div>
              <label htmlFor="cost-start-date">Start Date:</label>
              <input
                type="date"
                id="cost-start-date"
                onChange={handleStartDateChange}
                value={filterStartDate?.toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label htmlFor="cost-end-date">End Date:</label>
              <input
                type="date"
                id="cost-end-date"
                max={new Date().toISOString()}
                onChange={handleEndDateChange}
                value={filterEndDate?.toISOString().split("T")[0]}
              />
            </div>
          </section>
          <div style={{ minWidth: "500px", height: "500px", flex: "4" }}>
            <ResponsiveContainer>
              <LineChart data={costData}>
                <CartesianGrid
                  stroke="#ccc"
                  strokeDasharray="5 5"
                ></CartesianGrid>
                <Line dataKey="cost" stroke="#8884d8"></Line>
                <XAxis dataKey="slot_time" tickFormatter={formatDate}></XAxis>
                <YAxis tickFormatter={(value) => `£${value.toFixed(0)}`} />
                <Tooltip
                  formatter={(value: number) => `£${value.toFixed(2)}`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
