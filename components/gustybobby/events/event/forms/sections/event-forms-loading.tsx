import { sectionStyles } from "@/components/styles/sections";
import { Card } from "@/components/tools/card";

export default function EventFormsLoading(){
    return(
        <div className={sectionStyles.container()}>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <div className={sectionStyles.title({ color: 'purple', extensions: 'mb-2' })}>
                    Forms
                </div>
                <div className="md:grid md:grid-cols-3 md:gap-2 xl:grid-cols-4 mb-2 space-y-2 md:space-y-0">
                    <FormCardLoading/>
                </div>
            </div>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <div className={sectionStyles.title({ color: 'red', extensions: 'mb-2' })}>
                    Delete
                </div>
                <div className="h-16 w-2/3 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"/>
            </div>
        </div>
    )
}

function FormCardLoading(){
    return(
        <Card variant="white-gray" extraClass="max-w-sm min-h-72 p-4 flex flex-col justify-between">
            <div className="flex flex-col">
                <div className="h-8 w-2/3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"/>
                <div className="h-6 w-1/4 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"/>
                <div className="h-6 w-1/3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"/>
                <div className="h-6 w-1/3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"/>
                <div className="h-6 w-2/3 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"/>
            </div>
            <div className="flex justify-between">
                <div className="h-10 w-32 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
                <div className="h-10 w-16 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"/>
            </div>
        </Card>
    )
}