import Announcement from "./assets/Home_page_announcement.svg"
import Card from"../components/Home_page_card.jsx"
import UseCaseDesign from "./assets/UseCaseDesign.svg"
import System_ArchDiagram from "./assets/System_Arch.svg"
import ERDia from "./assets/ERDiagram.svg"
import twitter from "./assets/twitter.svg"
import facebook from "./assets/facebook.svg"
import linkedin from "./assets/linkedin.svg"
function Home()
{
    return(
        <>
            <Navbar/>
            <br />
            <br />
            <IntroCard/>
            <br />
            <ServiceHeader/>
            <br />
            <br />
            <br />
           <Cards/>
           <br />
           <br />
           <Navbar2/>
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

function IntroCard()
{
    return(
        <div className="grid grid-cols-2 gap-10 px-[40px]">
            <div className="space-y-4">
                <div className="text-6xl font-bold leading-tight">
                    <div>Transforming</div>
                    <div>Text into UML</div>
                    <div>Diagrams with AI!</div>
                </div>
                <br />
                <p className="text-gray-600 text-xl font-bold">
                    Our AI-powered tool instantly converts your text <br />
                    into structured UML diagrams. Simplify software design <br />
                     with accurate, effortless diagram generation.
                </p>
                <br />

                <button className="bg-black text-xl text-white px-6 py-3 shadow-xl rounded-lg hover:bg-gray-800">
                    Start creating!
                </button>
            </div>
            <div>
                <img src={Announcement} alt="Announcement Diagram" className="w-[800px] h-[550px] pr-20 pt-0 justify-self-end" />
            </div>
        </div>

    )
}

function ServiceHeader()
{
    return(

        <div className="flex items-start gap-4 p-4">
            <h2 className="text-3xl font-bold bg-blue-200 px-6 ml-3 py-2 rounded-lg">Services</h2>
            <p className="text-gray-700 text-xl font-bold">
                With Graph-Mind, you are able to streamline your workflow with the precision of AI. Currently, it supports the following UML diagrams, (with more to come!)
            </p>
        </div>
    )
}
function Cards() {
    return (
        <>
        <div className="grid grid-cols-2 gap-10">
                <Card 
                title="Use Case Diagram" 
                titleColor="#BFDBFE" 
                boxBackground="white" 
                learnMoreColor="gray" 
                image={UseCaseDesign} 
                />
                <Card 
                title="System Architecture Diagram" 
                titleColor="white" 
                boxBackground="#62a8bd" 
                learnMoreColor="white" 
                image={System_ArchDiagram} 
                />
           
                <Card
                title="ER Diagram" 
                titleColor="white" 
                boxBackground="black" 
                learnMoreColor="white" 
                image={ERDia} 
                ></Card>
             </div>
            </>
    );
}



function Navbar2()
{
    return(
        <div className="flex justify-between items-center p-5 shadow-md">
            <h1 className="text-5xl font-semibold">Graph-Mind</h1>
            <div className="flex space-x-8 text-xl font-semibold text-gray-600">
                <img src={linkedin} alt="linkedin" />
                <img src={facebook} alt="facebook" />
                <img src={twitter} alt="twitter" />
            </div>
        </div>
    ) 
}

export default Home;
