import { useEffect, useRef, useState } from "react"
import JudgeSchedule from "./JudgeSchedule";
import { ArrowRight, Plus, Search, UserRoundPen } from "lucide-react";
import { useApi } from "../lib/api";

// const judges = [{ schedule: [{ start: "3:00 AM", end: "6:00 AM", color: "#389ec9ff", teamName: "VandyHacks" }], name: "Greg H" }]

const AddJudge = ({ setVisible }) => {

    const [judgeName, setJudgeName] = useState("");
    const [placeholder, setPlaceholder] = useState("Name...");
    const inputRef = useRef(null);

    const { makeRequest } = useApi();

    const addJudge = () => {

        if (judgeName === "") return;

        makeRequest("create-judge", {
            method: "POST",
            body: JSON.stringify({
                "name": judgeName
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {

            if (response.response.includes("Error")) {
                inputRef.current.value = "";
                setPlaceholder(response.response)
            }
            else {
                setVisible(false);
            }

        })

    }


    return (
        <div className="absolute left-1/2 translate-y-[10px] -translate-x-1/2 w-[300px] h-[50px] border-3 rounded-full flex justify-center items-center bg-[oklch(98.5%_0.001_106.423)] z-120">
            <UserRoundPen className="absolute left-3 top-1/2 -translate-y-[13.5px]"/>
            <ArrowRight onClick={addJudge} size={25} className="absolute right-3 top-1/2 -translate-y-[13.5px] hover:scale-120 transition-all duration-300 ease-in-out"/>
            <input ref={inputRef} required onChange={(e) => setJudgeName(e.target.value)} type="text" id="filter" name="filter" autoComplete="off" placeholder={placeholder} className="w-full h-full text-sm ml-[42px] outline-none mr-10 relative -translate-y-[1px]"/>
        </div>
    )
}

export default function Calendar() {

    const [date, setDate] = useState("");
    const [judges, setJudges] = useState([]);
    const [filteredJudges, setFilteredJudges] = useState([]);
    const [addJudge, setAddJudge] = useState(false);
    const [render, setRender] = useState(false);
    const [refresh, setRefresh] = useState(false); // Hacky way to get state to update when adding an event from JudgeSchedule.

    const { makeRequest } = useApi();

    useEffect(() => {

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
        setDate(formattedDate);

        
        makeRequest("get-schedules", {
            method: "GET"
        }).then((response) => {
            setJudges(response);
            setFilteredJudges(response);
            setRender(true);
        });

    }, [addJudge, refresh]);

    const onFilterChange = (e) => {

        // Set judges so only show judges with name that match input or judges with team that match input
        setFilteredJudges(judges.filter((obj) => {
            let hasTeamInSchedule = false;
            const input = e.target.value;
            for (const event of obj.schedule) {
                if (event.teamName.includes(input))
                    hasTeamInSchedule = true;
            }
            return hasTeamInSchedule || obj.name.includes(input);
        }));

    }

    const filterRef = useRef(null);

    const removeJudge = (name) => {

        makeRequest("delete-judge", {
            method: "DELETE",
            body: JSON.stringify({
                "name": name
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        setJudges(prev => prev.filter((obj) => obj.name !== name));
        setFilteredJudges(prev => prev.filter((obj) => obj.name !== name));

    }

    if (render) {
        return (
            <>
                <div className="w-full h-25 relative text-3xl grid grid-cols-3 items-center justify-center">
                    <div className="ml-10 text-center opacity-0 lg:opacity-100 transition-all duration-500 ease-in-out">{date}</div>
                    <div className="w-[300px] h-[45px] rounded-full border-3 flex justify-center items-center relative mx-auto">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2"/>
                        <input ref={filterRef} onChange={onFilterChange} type="text" id="filter" name="filter" autoComplete="off" autoCorrect="off" placeholder="Find judge/team..." className="w-full h-full text-sm ml-[37px] outline-none mr-5"/>
                    </div>
                    <div className="relative opacity-0 md:opacity-100 text-center text-[20px] group cursor-pointer">
                        <div onClick={() => setAddJudge(prev => !prev)} className="hover:text-stone-600 transition-all duration-300 ease-in-out">Add Judge</div>
                        {
                            addJudge && <AddJudge setVisible={setAddJudge}/>
                        }
                    </div>
                </div>
                {
                    filteredJudges.length !== 0 ? 
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 gap-10">
                        {
                            filteredJudges.map((item, key) => {
                                return (
                                    <JudgeSchedule removeJudge={removeJudge} refresh={setRefresh} name={item.name} schedule={item.schedule} key={item.name}/>
                                )
                            })
                        }
                    </div>
                    :
                    <div className="w-full text-center text-xl">no judge schedules yet! add a judge to create one.</div>
                }
            </>
        )
    }
    else {
        return (
            <div></div>
        )
    }
}