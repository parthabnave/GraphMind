import arrow from "../src/assets/Arrow.svg";

function Card({ title, boxBackground = '#374151', image, onClick }) {
  return (
    <div
      className="border border-black flex flex-col text-white justify-between items-center shadow-xl mx-auto"
      style={{ backgroundColor: boxBackground, borderRadius: "1.5rem", width: "400px", height: "250px", paddingTop: "2.5rem", paddingBottom: "4.5rem" }}
    >
      <div
        className="text-3xl font-bold px-3 py-1 rounded-lg text-center"
        style={{ height: "100px", width: "300px", textAlign: "center" }}
      >
        {title}
      </div>
      <div className="flex items-center text-bold space-x-4 text-lg font-semibold">
        <button onClick={onClick} className="focus:outline-none">
          <img src={arrow} alt="Arrow Button" className="cursor-pointer w-8 h-8" />
        </button>
      </div>
      {image && <img src={image} alt="Diagram" className="w-[290px] h-[270px]" />}
    </div>
  );
}

export default Card;
