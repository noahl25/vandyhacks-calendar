import { ArrowRight, Plus } from "lucide-react";
import { useEffect, useState } from "react"
import { useApi } from "../lib/api";

const CreateEvent = ({ judgeName, setVisible }) => {

    const [teamName, setTeamName] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [error, setError] = useState("");

    const setTimeFromMilitary = (e, start) => {
        
        // Convert from military time and set start or end.
        const militaryTime = e.target.value;
        let [hours, minutes] = militaryTime.split(":").map(Number);

        let meridian = "AM";
        if (hours > 12) {
            hours -= 12;
            meridian = "PM";
        }
        else if (hours == 12) {
            meridian = "PM";
        }
        else if (hours == 0) {
            hours = 12;
        }

        if (start) {
            setStart(`${hours}:${String(minutes).padStart(2, "0")} ${meridian}`);
        }
        else {
            setEnd(`${hours}:${String(minutes).padStart(2, "0")} ${meridian}`);
        }

    }

    const { makeRequest } = useApi();

    const onSubmit = () => {

        if (start === "" || end === "" || teamName === "")
            return;

        makeRequest("create-event", {
            method: "POST",
            body: JSON.stringify({
                "judge_name": judgeName,
                "team_name": teamName,
                "start": start,
                "end": end
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {

            if (response.response.includes("Error")) {
                setError(response.response);
            }
            else {
                setVisible(false);
            }

        })
    }

    return (
        <div className="absolute w-[225px] bg-[oklch(98.5%_0.001_106.423)] border-3 rounded-xl top-7 -right-25 z-80 p-3">
            <div className="mb-1.5">
                <span>Team Name</span>
                <input onChange={(e) => setTeamName(e.target.value)} type="text" id="name" name="name" autoComplete="off" autoCorrect="off" placeholder="Name..." className="outline-none text-center w-full rounded-xl" />
            </div>
            <div className="flex flex-wrap justify-start gap-2">
                <span>Start</span>
                <input type="time" onChange={(e) => setTimeFromMilitary(e, true)}></input>
                <span>End</span>
                <input type="time" onChange={(e) => setTimeFromMilitary(e, false)} className="ml-[12px]"></input>
            </div>
            <ArrowRight onClick={onSubmit} className="mx-auto mt-1.5 mb-1.5 hover:scale-120 transition-all duration-300 ease-in-out cursor-pointer" size={30}/>
            {
                error.length >= 0 && <div className="text-center text-red-500">{error}</div>
            }
        </div>
    )
}

export default function JudgeSchedule({name, schedule}) {

    const [times, setTimes] = useState(["12 AM"]);
    const [left, setLeft] = useState(0);
    const [addEvent, setAddEvent] = useState(false);
    
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
        return minutesAfterMidnight / (24 * 60) * 100;
    }

    useEffect(() => {

        // Setup times from 12 AM - 11 PM.
        setTimes(["12 AM"]);

        const addTimes = (postfix) => {
            for (const i of Array(11).keys()) {
                setTimes(prev => ([...prev, (i + 1) + " " + postfix]));
            }
        }

        addTimes("AM");
        setTimes(prev => ([...prev, "Noon"]));
        addTimes("PM");

        // Get width of time (e.g. 12 AM) so the events are correctly positioned from the left.
        const timeComp = document.querySelector(".time-component");
        setLeft(timeComp.getBoundingClientRect().width);

    }, []);

    return (
        <div className="w-70 ml-10 mb-5 opacity-0 fade-in">
            <div className="text-xl mb-3 mx-auto text-center ml-14 flex justify-center items-center flex-wrap gap-1 relative">
                <span>{name}</span>
                <Plus onClick={() => setAddEvent(prev => !prev)} className="hover:scale-125 transition-all duration-500 ease-in-out cursor-pointer"/>
                { 
                    addEvent && <CreateEvent judgeName={name} setVisible={setAddEvent}/> 
                }
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