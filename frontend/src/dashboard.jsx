import { useState, useEffect } from "react";
import axios from "axios";
import DashCard from "../components/DashboardCard";
function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2FiZjI4ZGM5MWZjNGZlYmM1MjIyYyIsImVtYWlsIjoia3Vsa2Fybml2eWFua2F0ZXNoMDZAZ21haWwuY29tIiwibmFtZSI6IlZ5YW5rYXRlc2ggS3Vsa2FybmkiLCJpYXQiOjE3NDIyMzMzMDksImV4cCI6MTc0MjIzNjkwOX0.qzEumEJtZKPf1ugKFpsSk6u5R9OG07Ta2RArOPSQOes');
      const token = localStorage.getItem('token'); 

      try {
        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: {
            token: `Bearer ${token}`
          }
        });
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();  
  }, []); 

  const userName = data.length > 0 ? data[0].user_name : "Loading...";
  const diagrams=data;

  return (
    <div>
      <Navbar />
      <br /><br />
      <div className="flex justify-between space-x-10 p-4 pl-20 pr-[100px]">
        <h1 className="text-4xl font-bold bg-blue-200 text-black px-4 py-2 rounded-lg">
            Hi,{userName}!
        </h1>
        <button className="border border-black rounded-lg px-20 py-4 text-white bg-black font-bold  text-2xl"
        style={{textAlign:"left"}}>
            Create New Diagram!
        </button>
    </div>
    <br />
    <br />
    <br />
    <br/>  
   
    <div className="grid grid-cols-3 gap-y-14 px-10 "style={{alignItems:"center",paddingLeft:"100px"}}>
    {diagrams.map((diagram, index) => (
        <DashCard key={index} title={diagram.title} />
    ))}
</div>


    </div>

  );
}
function Navbar()
{
    return(
        <div className="flex justify-between items-center p-5 shadow-md">
            <h1 className="text-5xl font-semibold">Graph-Mind</h1>
            <div className="flex space-x-8 text-xl font-semibold text-gray-600">
                <div><a href="#">About us</a></div>
                <div><a href="#">Services</a></div>
                <div><a href="#">Use Cases</a></div>
                <div><a href="#">Pricing</a></div>
                <div><a href="#">Blog</a></div>
                <button className="border border-black px-5 pb-2 rounded-lg hover:bg-gray-50 shadow-md">Sign Up</button>
            </div>
            
        </div>
    ) 
}
export default Dashboard;