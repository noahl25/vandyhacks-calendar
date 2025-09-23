import { useEffect, useState } from "react"

export default function Calendar() {

    const [date, setDate] = useState("");

    useEffect(() => {

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
        setDate(formattedDate);

    }, []);


    return (
        <div className="w-[100vw] h-15 mb-3 flex justify-start items-center mt-3 text-3xl">
            <div className="ml-10">{date}</div>
        </div>
    )
}