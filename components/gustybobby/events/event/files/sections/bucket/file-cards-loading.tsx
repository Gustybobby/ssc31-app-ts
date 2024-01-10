export default function FileCardsLoading(){
    return(
        <div className="mb-2 flex flex-wrap gap-2">
            <CardLoading/>
        </div>
    )
}

function CardLoading(){
    return(
        <div className="w-80 h-80 flex flex-col justify-between p-2 rounded-lg shadow-lg bg-gray-200 dark:bg-gray-800">
            <div className="flex justify-between">
                <div className="w-1/2 h-10 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
                <div className="w-12 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
            </div>
            <div className="h-64 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
        </div>
    )
}