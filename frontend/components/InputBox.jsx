import { useState, useRef } from "react";

function Box({ title, img }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClick = () => {
    setFocused(true);
    inputRef.current.focus();
  };

  return (
    <div
      className="flex items-center p-4 rounded-3xl bg-white shadow-md cursor-text"
      onClick={handleClick}
      style={{ gap: "15px", width: "400px", borderRadius: "30px" }} // Extra border radius
    >
      {!focused && (
        <>
          <img src={img} alt="icon" className="w-6 h-6" />
          <span className="font-bold text-lg text-gray-600">{title}</span>
        </>
      )}
      <input
        ref={inputRef}
        type="text"
        onBlur={(e) => e.target.value === "" && setFocused(false)}
        className={`outline-none bg-transparent text-gray-600 ${
          !focused && "hidden"
        }`}
        style={{
          caretColor: "black",
          fontSize: "20px",
          caretWidth: "3px", 
          width: "100%", 
        }}
      />
    </div>
  );
}

export default Box;
