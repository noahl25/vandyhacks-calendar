import Calendar from "./Calendar"
import JudgeSchedule from "./JudgeSchedule"
import Navbar from "./Navbar"


function App() {

  const hi = [{ start: "3:00 AM", end: "6:00 AM", color: "#389ec9ff", teamName: "VandyHacks" }]

  return (
    <div className="overflow-hidden">
      <Navbar/>
      <Calendar/>
      <JudgeSchedule name="Bob Joe" schedule={hi}/>
    </div>
  )
}

export default App
