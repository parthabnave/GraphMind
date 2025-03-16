function Card({ title, titleColor = 'blue', boxBackground = 'white', learnMoreColor = 'gray', image }) {
    return (
      <div
        className={`w-[500px] h-[200px] rounded-3xl border border-black p-6 flex justify-between items-center shadow-md bg-${boxBackground}mx-auto`}
      >
        <div className="space-y-4">
          <div
            className={`text-3xl font-bold px-3 py-1 text-${titleColor} rounded-lg inline-block`}
            
          >
            {title}
          </div>
          <div className={`flex items-center text-${boxBackground} space-x-2 text-lg font-semibold`}>
            <span className="text-black text-2xl">↗</span>
            <span>Learn more</span>
          </div>
        </div>
        {image && <img src={image} alt="Diagram" className="w-32 h-32" />}
      </div>
    );
  }
  
  export default Card;
  