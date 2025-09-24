import { useEffect, useState } from "react"
import JudgeSchedule from "./JudgeSchedule";
import { Plus, Search } from "lucide-react";

export default function Calendar() {

    const [date, setDate] = useState("");
    const judges = [{ schedule: [{ start: "3:00 AM", end: "6:00 AM", color: "#389ec9ff", teamName: "VandyHacks" }], name: "Greg Oppenheimer" }]
    const [filteredJudges, setFilteredJudges] = useState([]);

    useEffect(() => {

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
        setDate(formattedDate);

        setFilteredJudges([...judges]);

    }, []);

    const onFilterChange = (e) => {

        // Set judges so only show judges with name that match input or judges with team that match input
        setFilteredJudges(judges.filter((obj) => {
            console.log(obj);
            let hasTeamInSchedule = false;
            const input = e.target.value;
            for (const event of obj.schedule) {
                if (event.teamName.includes(input))
                    hasTeamInSchedule = true;
            }
            return hasTeamInSchedule || obj.name.includes(input);
        }));

    }


    return (
        <>
            <div className="w-full h-25 relative text-3xl">
                <div className="ml-10 text-center absolute top-1/2 -translate-y-1/2 left-0">{date}</div>
                <div className="text-center absolute top-1/2 -translate-y-1/2 mr-10 right-0 text-[20px] flex justify-center items-center hover:text-stone-600 cursor-pointer transition-all duration-500 ease-in-out">
                    Add Judge
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[300px] h-[45px] rounded-full border-3 flex justify-center items-center">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2"/>
                    <input onChange={onFilterChange} type="text" id="filter" name="filter" placeholder="Find judge/team..." className="w-full h-full text-sm ml-[37px] outline-none mr-5"/>
                </div>
            </div>
            {
                filteredJudges.length !== 0 ? 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 gap-10">
                    {
                        filteredJudges.map((item, key) => {
                            return (
                                <JudgeSchedule name={item.name} schedule={item.schedule} key={`judge-schedule-parent-${key}`}/>
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