function Card({ title, titleColor = 'blue', boxBackground = 'white', learnMoreColor = 'gray', image }) {
  return (
    <div
      className={`border border-black w-[900px] h-[300px] p-10 pt-2 flex justify-between items-center shadow-md mx-auto rounded-2xl`}
      style={{ backgroundColor: boxBackground }}
    >
      <div className="space-y-4">
        <div
          className={`text-4xl font-bold px-3 py-1 rounded-lg inline-block`}
          style={{ backgroundColor: titleColor }}
        >
          {title}
        </div>
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <span className="text-black text-2xl">↗</span>
          <span style={{ color: learnMoreColor }}>Learn more</span>
        </div>
      </div>
      
      {image && <img src={image} alt="Diagram" className="w-80 h-60 rounded-2xl" />}
    
    </div>

  );
}

export default Card;
