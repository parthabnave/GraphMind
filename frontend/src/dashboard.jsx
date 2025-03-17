import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2FiZjI4ZGM5MWZjNGZlYmM1MjIyYyIsImVtYWlsIjoia3Vsa2Fybml2eWFua2F0ZXNoMDZAZ21haWwuY29tIiwibmFtZSI6IlZ5YW5rYXRlc2ggS3Vsa2FybmkiLCJpYXQiOjE3NDIyMjEwMTgsImV4cCI6MTc0MjIyNDYxOH0.FWfpU5PJaoUWPrOt52_vOIKVcJ5JNhmQ3GmKr3MF3bg');
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

  return (
    <div>
      <Navbar />
      <br /><br />
      <div className="flex justify-between px-10 py-10">
        <h1 className="">{userName}</h1>
        <button className="w-[60px] h-[20px]">
          Create new Diagram!
        </button>
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