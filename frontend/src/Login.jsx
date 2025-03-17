import Box from "../components/InputBox";
import userIcon from "./assets/user_icon.svg"
function LoginBoard()
{
    return(
        <>
        <Navbar/>
        <br /><br />
        <Card/>
        </>
    )
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
function InputBoard()
{
    return(
        <div>
            <Box title={"Email"} img={userIcon} />
            <br />
            <Box title={"Password"} img={userIcon} />
            <br />
        </div>
    )
}
function OuterCard()
{
    return(
        <div class>
            <Card/>
        </div>
    )
}

function Card() {
    return (
        <div className="flex justify-center">
            <div className="shadow-xl bg-gray-200 h-[600px]">
                <br />
                <div className="flex justify-center">
                  <button className="bg-black text-white">Login</button>
                  <button className="bg-black text-white">Signup</button>  
                </div>
                <div className="flex justify-center w-[600px] h-[800px] pt-5">
                  <InputBoard />
                </div>
            </div>
        </div>
    // <div className="">
    //     <button>Login</button>
    //     <button>Signup</button>
    //   <div className="flex justify-center">
    //     <div className="flex justify-center bg-black w-[600px] h-[800px] pt-5">
    //       <InputBoard />
    //     </div>
    //   </div>
    // </div>
    );
  }
  
export default LoginBoard;