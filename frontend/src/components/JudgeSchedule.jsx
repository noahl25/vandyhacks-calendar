import { Plus } from "lucide-react";
import { useEffect, useState } from "react"

export default function JudgeSchedule({name, schedule}) {

    const [times, setTimes] = useState(["12 AM"]);
    const [left, setLeft] = useState(0);
    
    const toRatioAfterMidnight = (time) => {

        // Convert time (e.g. 12:00 AM) to percent 0-100 after midnight. For positioning purposes.
        const [raw, meridian] = time.split(" ");
        let [hours, minutes] = raw.split(":").map(Number);

        if (meridian === "AM") {
            if (hours === 12) hours = 0;
        } else {
            if (hours !== 12) hours += 12; 
        }

        const minutesAfterMidnight = hours * 60 + minutes;
        return minutesAfterMidnight / (25 * 60) * 100;
    }

    useEffect(() => {

        // Setup times from 12 AM - 12 AM.
        setTimes(["12 AM"]);

        const addTimes = (postfix) => {
            for (const i of Array(11).keys()) {
                setTimes(prev => ([...prev, (i + 1) + " " + postfix]));
            }
        }

        addTimes("AM");
        setTimes(prev => ([...prev, "Noon"]));
        addTimes("PM");

        // Get width of time (e.g. 12 AM) so the events are correctly positioned.
        const timeComp = document.querySelector(".time-component");
        setLeft(timeComp.getBoundingClientRect().width);

    }, []);

    return (
        <div className="w-70 ml-10 mb-5">
            <div className="text-xl mb-3 mx-auto text-center ml-14 flex justify-center items-center flex-wrap gap-1">
                <span>{name}</span>
                <Plus className="hover:scale-125 transition-all duration-500 ease-in-out cursor-pointer"/>
            </div>
            <div className="w-full relative">
                {
                    times.map((time, key) => {
                        return (
                            <div key={key} className="w-full h-[75px] flex justify-start items-start">
                                <div className="w-17">
                                    <div className="text-stone-400 flex-none relative -translate-y-[7px] w-full time-component">{time}</div>
                                </div>
                                <div className="h-full bg-stone-300/20 w-full border-l-2 border-r-2 border-b-2 border-[#c1c1c1ff]" style={{ borderTop: key == 0 ? "2px solid #c1c1c1ff" : "0px"}}></div>
                            </div>
                        )
                    })
                }
                {
                    left > 0 && schedule.map((item, key) => {
                        return (
                            <div key={`${key}-schedule-item`} className="absolute rounded-lg right-0 grid place-items-center overflow-hidden" style={{ top: `${toRatioAfterMidnight(item.start)}%`, bottom: `${100 - toRatioAfterMidnight(item.end)}%`, left: left + "px", backgroundColor: item.color, opacity: "0.9" }}>
                                <div>
                                    <div className="text-center text-lg text-black/70">{item.teamName}</div>
                                    {
                                        Math.abs(toRatioAfterMidnight(item.start) - toRatioAfterMidnight(item.end)) >= 4 &&
                                        <div className="text-center text-black/50">{item.start} - {item.end}</div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        
    )

}