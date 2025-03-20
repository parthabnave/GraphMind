import { useState, useEffect } from "react";
import axios from "axios";
import DashCard from "../components/DashboardCard";
import userIcon from "./assets/user_icon.svg";

function Dashboard() {
  const [data, setData] = useState({ name: "Loading...", history: [] });

  useEffect(() => {
    const fetchData = async () => {
      console.log("before getting token");
      const token = localStorage.getItem("token");
      console.log("token:", token);

      try {
        console.log("before fetching");
        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        console.log("after fetching");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const userName = data.name; 
  const diagrams = data.history || [];  // Ensure it's always an array

  return (
    <div>
      <Navbar name={userName} />
      <br /><br />
      <div className="flex justify-between space-x-10 p-4 pl-20 pr-[100px]">
        <h1 className="text-4xl font-bold bg-blue-200 text-black px-4 py-2 rounded-lg">
          Hi, {userName}!
        </h1>
        <button
          className="border border-black rounded-lg px-20 py-4 text-white bg-black font-bold text-2xl"
          style={{ textAlign: "left" }}
        >
          Create New Diagram!
        </button>
      </div>
      <br /><br /><br /><br />

      <div className="grid grid-cols-3 gap-y-14 px-10" style={{ alignItems: "center", paddingLeft: "100px" }}>
        {diagrams.length > 0 ? (
          diagrams.map((diagram, index) => <DashCard key={index} title={diagram.title} />)
        ) : (
          <p>No diagrams found.</p>
        )}
      </div>
    </div>
  );
}

function Navbar({ name }) {
  return (
    <div className="flex justify-between items-center p-5 shadow-md">
      <h1 className="text-5xl font-semibold">Graph-Mind</h1>
      <div className="flex space-x-8 text-xl font-semibold text-gray-600">
        <div>
          <a href="#">About us</a>
        </div>
        <div>
          <a href="#">Services</a>
        </div>
        <div className="flex justify-center">
          <img src={userIcon} alt="Usericon" />
          <div className="text-bold text-xl">{name}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
