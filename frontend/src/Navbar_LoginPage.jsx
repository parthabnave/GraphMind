function Navbar() {
    return (
      <div className="flex justify-between items-center p-5 shadow-md">
        <h1 className="text-5xl font-semibold">Graph-Mind</h1>
        <div className="flex space-x-8 text-xl font-semibold text-gray-600">
          <div><a href="#">About us</a></div>
          <div><a href="#">Services</a></div>
          <div><a href="#">Use Cases</a></div>
          <div><a href="#">Pricing</a></div>
          <div><a href="#">Blog</a></div>
        </div>
      </div>
    )
  }
  
  export default Navbar;
  