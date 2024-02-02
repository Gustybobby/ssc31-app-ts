import { sectionStyles } from "@/components/styles/sections";

export default function EmailRestrictsFieldLoading(){
    return (
        <div className={sectionStyles.box.gray({ round: false, shadow: false })}>
            <div className="p-4 h-52 rounded-lg bg-gray-200 dark:bg-black/70 space-y-2">
                <div className="h-8 w-64 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse"/>
                <div className="h-32 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse"/>
            </div>
        </div>
    )
}