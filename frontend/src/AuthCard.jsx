import { useState } from "react";
import Login from "./Login";
import Signup from "./SignUp";
import Navbar from "./Navbar_LoginPage.jsx";
import googleIcon from "./assets/google_icon.svg";
import githubIcon from "./assets/github_icon.svg";

function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center w-screen h-screen items-center bg-gray-100">
      <div
        className={`shadow-xl bg-white rounded-lg w-96 p-6 transition-all duration-300 ${
          isLogin ? "h-[550px]" : "h-[650px]"
        }`}
      >
        {/* Toggle Buttons */}
        <div className="flex justify-between bg-gray-300 p-1 rounded-lg">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-lg transition ${
              isLogin ? "bg-black text-white" : "text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-lg transition ${
              !isLogin ? "bg-black text-white" : "text-black"
            }`}
          >
            Signup
          </button>
        </div>

        <br />
        {isLogin ? <Login /> : <Signup />}

        {/* OR Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google & GitHub Login Options */}
        <div className="flex flex-col gap-3">
          <button className="bg-black text-white flex items-center justify-center w-full border border-gray-400 py-2 rounded-lg hover:bg-gray-100 transition">
            <img src={googleIcon} alt="Google" className="w-8 h-8 mr-2" />
            Continue with Google
          </button>
          <button className="bg-black text-white flex items-center justify-center w-full border border-gray-400 py-2 rounded-lg hover:bg-gray-100 transition">
            <img src={githubIcon} alt="GitHub" className="w-7 h-7 mr-2" />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginBoard() {
  return (
    <>
      <Navbar />
      <AuthCard />
    </>
  );
}

export default LoginBoard;
