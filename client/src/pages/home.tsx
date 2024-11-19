import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useInterval } from "../tools/interval";
import "./css/home.css";
import { SAPIBase } from "../tools/api";
import { useLayoutEffect } from "react";


const HomePage = (props: {}) => {
  const navigate = useNavigate();
  const [BServerConnected, setBServerConnected] = React.useState<boolean>(false);
  const [lhs, setLhs] = useState<number>(0);
  const [rhs, setRhs] = useState<number>(0);
  const [operation, setOperation] = useState<string>("add");
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { id: number; lhs: number; operation: string; rhs: number; result: string }[]
  >([]);

  useInterval(() => {
    interface IStatusAPIRes { isOnline: boolean };
    const asyncFun = async () => {
      const res = await axios.get<IStatusAPIRes>(SAPIBase + "/status");
      setBServerConnected(res.data.isOnline);
    };
    asyncFun().catch((e) => setBServerConnected(false));
  }, 100);

  const handleCalculate = async () => {
    try {
      const response = await axios.get(`${SAPIBase}/${operation}`, {
        params: { lhs, rhs},
      });
      setResult(response.data.result);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult("Error in calculation");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${SAPIBase}/history`,{params:{his_num:10}});
      setHistory(response.data); // 받아온 계산 기록을 상태에 저장
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const deleteResult = async (id:number) => {
    try {
      await axios.delete(`${SAPIBase}/delete?id=${id}`);
      fetchHistory(); // Update history after deletion
    } catch (error) {
      console.error("Failed to delete result:", error);
    }
  };

  const deleteAllResults = async () => {
    try {
      await axios.delete("http://localhost:8080/arithmetics/arithmetic/delete-all");
      fetchHistory(); // Update history after deletion
    } catch (error) {
      console.error("Failed to delete all results:", error);
    }
  };

  useLayoutEffect(() => {
    fetchHistory();
  });

  return (
    <div className="home">
      <h1>Calculator</h1>
      <div className="server-status">
        <span className={"status-icon " + (BServerConnected ? "status-connected" : "status-disconnected")}>
          •
        </span>
        &nbsp;&nbsp;{BServerConnected ? "Connected to API Server 🥳" : "Not Connected to API Server 😭"}
      </div>
      <div className="input-section">
        <input
          type="number"
          value={lhs}
          onChange={(e) => setLhs(Number(e.target.value))}
          placeholder="Left Operand"
        />
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="add">+</option>
          <option value="sub">-</option>
          <option value="mul">×</option>
          <option value="div">÷</option>
          <option value="mod">%</option>
        </select>
        <input
          type="number"
          value={rhs}
          onChange={(e) => setRhs(Number(e.target.value))}
          placeholder="Right Operand"
        />
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      <div className="result-section">
        {result !== null && <p>Result: {result}</p>}
      </div>

      <h1>Calculation History</h1>
      <button onClick={deleteAllResults} style={{ backgroundColor: "red", color: "white" }}>
        Delete All Results
      </button>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.result}{" "}
            <button onClick={() => deleteResult(item.id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
