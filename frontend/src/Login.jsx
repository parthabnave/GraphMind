import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import userIcon from "./assets/user_icon.svg";
import passwordIcon from "./assets/password.svg";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post("http://localhost:5000/getStarted/login", formData);
      setMessage(response.data.msg); // Show success message

      // Store the token in local storage
      localStorage.setItem("token", response.data.token);

      // Navigate to the /dash page
      navigate("/dash");
    } catch (error) {
      // Check if error.response exists
      if (error.response) {
        setMessage(error.response.data.msg); // Show error message from server
      } else if (error.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black h-[250px] w-[335px] p-2 rounded-xl">
      <div className="mt-6" style={{ paddingLeft: "10px" }}>
        {/* Email Field */}
        <div className="relative w-[300px] mb-3">
          {!formData.email && !isFocused.email && (
            <img
              src={userIcon}
              alt="User  Icon"
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
            autoComplete="current-password"
          />
        </div>
      </div>

      <br />
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-[100px] bg-white py-2 rounded-xl hover:bg-blue-500 transition"
        >
          Login
        </button>
      </div>
      {message && <p className="text-center text-red-500">{message}</p>} {/* Display message */}
    </form>
  );
}

export default Login;