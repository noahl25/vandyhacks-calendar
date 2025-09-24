import Calendar from "./Calendar"
import JudgeSchedule from "./JudgeSchedule"
import Navbar from "./Navbar"


function App() {

  return (
    <div className="overflow-hidden w-full relative">
      <Navbar/>
      <div className="h-[75px]"></div>
      <Calendar/>
    </div>
  )
}

export default App
