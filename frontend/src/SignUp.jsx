import { useState } from "react";
import userIcon from "./assets/user_icon.svg";
import emailIcon from "./assets/user_icon.svg";
import passwordIcon from "./assets/password.svg";
import phoneIcon from "./assets/phone.svg";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [isFocused, setIsFocused] = useState({
    username: false,
    email: false,
    password: false,
    phone: false,
  });

  return (
    <div className="bg-black h-[380px] w-[335px] p-2 rounded-xl">
      <div className="mt-6" style={{ paddingLeft: "10px" }}>
        
        {/* Username Field */}
        <div className="relative w-[300px] mb-3">
          {!formData.username && !isFocused.username && (
            <img
              src={userIcon}
              alt="User Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          )}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 pl-10 rounded-xl"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            onFocus={() => setIsFocused({ ...isFocused, username: true })}
            onBlur={() => setIsFocused({ ...isFocused, username: false })}
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
          />
        </div>

        {/* Phone Number Field */}
        <div className="relative w-[300px] mb-3">
          {!formData.phone && !isFocused.phone && (
            <img
              src={phoneIcon}
              alt="Phone Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          )}
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-2 pl-10 rounded-xl"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            onFocus={() => setIsFocused({ ...isFocused, phone: true })}
            onBlur={() => setIsFocused({ ...isFocused, phone: false })}
          />
        </div>
      </div>

      <br />
      <div className="flex justify-center">
        <button className="w-[100px] bg-white py-2 rounded-xl hover:bg-blue-500 transition">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;
