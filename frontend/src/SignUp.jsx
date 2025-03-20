import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userIcon from "./assets/user_icon.svg";
import emailIcon from "./assets/user_icon.svg"; // Ensure this is the correct icon
import passwordIcon from "./assets/password.svg";
import axios from "axios";

function Signup() {
  const navigate = useNavigate(); // Add this line

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/getStarted/register", formData);
      setMessage(response.data.msg);
      localStorage.setItem("token", response.data.token);
      navigate("/dash"); // Now navigate is defined
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.msg);
      } else if (error.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black h-[300px] w-[335px] p-2 rounded-xl">
      <div className="mt-6" style={{ paddingLeft: "10px" }}>
        
        {/* Username Field */}
        <div className="relative w-[300px] mb-3">
          {!formData.name && !isFocused.name && (
            <img
              src={userIcon}
              alt="User  Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          )}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 pl-10 rounded-xl"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onFocus={() => setIsFocused({ ...isFocused, name: true })}
            onBlur={() => setIsFocused({ ...isFocused, name: false })}
            autoComplete="name"
          />
        </div>

        {/* Email Field */}
        <div className="relative w-[300px] mb-3">
          {!formData.email && !isFocused.email && (
            <img
              src={emailIcon}
              alt="Email Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 pl-10 rounded-xl"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => setIsFocused({ ...isFocused, email: true })}
            onBlur={() => setIsFocused({ ...isFocused, email: false })}
            autoComplete="email"
          />
        </div>

        {/* Password Field */}
        <div className="relative w-[300px] mb-3">
          {!formData.password && !isFocused.password && (
            <img
              src={passwordIcon}
              alt="Password Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 pl-10 rounded-xl"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            autoComplete="new-password"
          />
        </div>
      </div>

      <br />
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-[100px] bg-white py-2 rounded-xl hover:bg-blue-500 transition"
        >
          Sign Up
        </button>
      </div>
      {message && <p className="text-center text-red-500">{message}</p>}
    </form>
  );
}

export default Signup;
