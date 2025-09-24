import Calendar from "./Calendar"
import JudgeSchedule from "./JudgeSchedule"
import Navbar from "./Navbar"
import Lenis from 'lenis'


function App() {

  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return (
    <div className="overflow-hidden w-full relative">
      <Navbar/>
      <div className="h-[75px]"></div>
      <Calendar/>
      <div className="h-5"></div>
    </div>
  )
}

export default App
