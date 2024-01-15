import { shortWeekDays } from "../date/date-picker"

export default function ScheduleLoading(){
    return(
        <div className="min-h-screen bg-gray-200 dark:bg-black/40 border border-black dark:border-white">
            <div className="p-2 h-32 border border-black dark:border-white">
                <div className="p-2 h-28 rounded-lg bg-gray-200 dark:bg-gray-800 space-y-2">
                    <div className="h-6 w-1/4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
                    <div className="h-6 w-1/2 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
                    <div className="h-6 w-1/3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
                </div>
            </div>
            <div className="w-full min-h-screen h-full border-black dark:border-white overflow-auto">
                <div className="w-[60rem] md:w-full grid grid-cols-7">
                    {shortWeekDays.map((day, index) => (
                    <div 
                        key={day+'_'+index}
                        className="text-center border-black dark:border-white border-b font-bold bg-gray-200 dark:bg-gray-800"
                    >
                        {day}
                    </div>
                    ))}
                    <GridRow/>
                    <GridRow/>
                    <GridRow/>
                    <GridRow/>
                    <GridRow/>
                    <GridRow/>
                </div>
            </div>
        </div>
    )
}

function GridRow(){
    return(
        <>
            <GridCell/>
            <GridCell/>
            <GridCell/>
            <GridCell/>
            <GridCell/>
            <GridCell/>
            <GridCell/>
        </>
    )
}

function GridCell(){
    return(
        <div className="h-36 p-1 bg-gray-200 dark:bg-gray-800 border border-black dark:border-white flex flex-col justify-between">
            <div className="h-4 w-1/4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
            <div className="h-28 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>      
        </div>
    )
}