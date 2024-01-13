export default function GustybobbyTableLoading(){
    return (
        <div className="h-full">
            <div className="grid grid-cols-4 gap-2 w-full h-10 p-2 bg-gray-200 dark:bg-gray-800 border border-black dark:border-white">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"/>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"/>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"/>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"/>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full h-64 p-2 bg-gray-100 dark:bg-gray-700 border border-black dark:border-white">
                <RowCellsLoading/>
                <RowCellsLoading/>
                <RowCellsLoading/>
                <RowCellsLoading/>
                <RowCellsLoading/>
                <RowCellsLoading/>
                <RowCellsLoading/>
            </div>
        </div>
    )
}

function RowCellsLoading(){
    return(
        <>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"/>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"/>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"/>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"/>
        </>
    )
}