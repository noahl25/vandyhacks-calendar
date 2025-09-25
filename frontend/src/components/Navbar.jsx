import { CodeXml } from "lucide-react";

export default function Navbar() {
    return <div className="fixed top-0 w-screen h-[75px] bg-stone-100 z-1000 flex justify-start items-center border-b-1 border-stone-200 shadow-lg">
        <CodeXml color="black" className="ml-10 relative translate-y-[1px]" strokeWidth={2.2} size={28}/>
        <div className="text-black text-2xl ml-[5.5px]">VandyHacks <span className="text-stone-400">Calendar</span></div>
    </div>
}