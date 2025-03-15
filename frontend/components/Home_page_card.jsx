function card({header})
{
    return(
        <div class="w-96 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-bold inline-block p-2 rounded-lg">{header}</h2>
          <p class="mt-4">An illustration of system interactions.</p>
        </div>
        <div class="flex items-center gap-2 text-gray-500 mt-6">
          <span class="text-green-500 text-xl">&#x27A1;</span>
          <span>Learn more</span>
        </div>
      </div>
    )
}
export default card;