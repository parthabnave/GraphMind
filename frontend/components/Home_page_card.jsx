import arrow from "../src/assets/Arrow.svg"

function Card({ title, titleColor = 'blue', boxBackground = 'white', learnMoreColor = 'gray', image }) {
    return (
      <div
        className={`border border-black flex justify-between items-center shadow-xl mx-auto`}
        style={{ backgroundColor: boxBackground ,borderRadius:"1.5rem", width:"650px", height:"300px" }}
      >
        <div className="mt-0">
          <div
            className={`text-3xl font-bold px-3 py-1 rounded-lg inline-block`}
            style={{ backgroundColor: titleColor }}
          >
            {title}
          </div>
          <br />
          <div className="flex items-center text-bold space-x-4 text-lg font-semibold">
            <img src={arrow} alt="Arrow" />
            <span> </span>
            <span style={{ color: learnMoreColor }}>Learn more</span>
          </div>
        </div>
        {image && <img src={image} alt="Diagram" className="w-[290px] h-[270px]" />}
      </div>
    );
  }
  
  export default Card;
  