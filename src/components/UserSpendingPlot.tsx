import React, { useEffect, useState, useContext } from "react";
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
import { ReceiptContext } from "../contexts/ReceiptContext";
import { useNavigate } from "react-router-dom";

function UserSpendingPlot() {
  const [costData, setCostData] = useState<
    { receipt_id: number; slot_time: Date; cost: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // By default, the date is set to the last 365 days
  const currentDate: Date = new Date();
  const lastYearDate: Date = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(
    lastYearDate
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(currentDate);

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

  // Route the user to the receipt
  const receiptContext = useContext(ReceiptContext);
  if (!receiptContext) {
    throw new Error(__filename + " must be used within a ReceiptContext!");
  }
  const navigate = useNavigate();
  const { setSelectedReceiptID } = receiptContext;
  const handlePointClick = (event: any) => {
    if (!event || !event.activePayload) {
      return;
    }

    const clickedData = event.activePayload[0]?.payload;
    if (clickedData) {
      console.log("Point clicked! Data: ", clickedData);
      setSelectedReceiptID(clickedData.receipt_id);
      navigate("/receipts");
    }
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
        <>
          <section
            className="f-item"
            style={{
              padding: "10px",
              display: "flex",
              flexWrap: "wrap",
              flex: "1",
            }}
          >
            <h1
              style={{
                fontSize: "1.2rem",
              }}
            >
              Filters
            </h1>
            <hr style={{ width: "100%", marginTop: 0 }}></hr>

            <fieldset
              style={{
                border: "none",
                padding: "0",
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <legend
                style={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  marginBottom: 0,
                }}
              >
                Date Range
              </legend>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="cost-start-date">Start Date:</label>
                <input
                  type="date"
                  id="cost-start-date"
                  onChange={handleStartDateChange}
                  value={filterStartDate?.toISOString().split("T")[0]}
                  max={filterEndDate?.toISOString().split("T")[0]}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="cost-end-date">End Date:</label>
                <input
                  type="date"
                  id="cost-end-date"
                  onChange={handleEndDateChange}
                  value={filterEndDate?.toISOString().split("T")[0]}
                  min={filterStartDate?.toISOString().split("T")[0]}
                  max={new Date().toISOString().split("T")[0]}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                />
              </div>
            </fieldset>
          </section>
          <div
            className="f-item"
            style={{
              minWidth: "300px",
              minHeight: "300px",
              height: "500px",
              flexGrow: 3,
              flexShrink: 1,
              flexBasis: "500px",
            }}
          >
            <ResponsiveContainer>
              <LineChart data={costData} onClick={handlePointClick}>
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
        </>
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
