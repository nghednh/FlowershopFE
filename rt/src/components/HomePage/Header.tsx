export default function Header() {
    return (
    <div className="relative sticky top-0 z-50 flex flex-row w-full h-[10vh] bg-white border border-gray-100" >
        <div className="w-[25%] flex flex-row  border border-gray-100">
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-full w-[50%] flex items-center justify-center cursor-pointer text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the shop button!")}
            >
            {/*Shop*/}
            Shop
          </button>
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-full w-[50%] flex items-center justify-center cursor-pointer text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the Contact button!")}
            >
            {/*Contact*/}
            Contact
          </button>
        </div>

        <div className="ml-auto w-[25%] flex flex-row ">
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-[100%] w-[50%] flex items-center justify-center cursor-pointer text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the Sign button!")}
            >
            {/*Sign in*/}
            Sign in
          </button>
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-[100%] w-[50%] flex items-center justify-center cursor-pointer text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the Cart button!")}
            >
            {/*Cart*/}
            Cart
          </button>
        </div>
        
        
      </div>
    )
}