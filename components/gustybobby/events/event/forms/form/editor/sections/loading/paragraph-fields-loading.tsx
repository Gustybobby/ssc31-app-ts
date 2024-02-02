import { sectionStyles } from "@/components/styles/sections";

export default function ParagraphFieldsLoading(){
    return(
        <>
            <div className={sectionStyles.box.gray({ round: false, shadow: false })}>
                <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>
                    Preview
                </h1>
                <div className="p-4 h-52 rounded-lg bg-gray-200 dark:bg-black/70 space-y-2 mb-2"/>
                <div className="p-4 h-52 rounded-lg bg-gray-200 dark:bg-black/70 space-y-2"/>
            </div>
            <div className={sectionStyles.box.gray({ round: false, shadow: false })}>
                <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>
                    ...
                </h1>
                <div className="p-4 h-64 rounded-lg bg-gray-200 dark:bg-black/70 space-y-2"/>
            </div>
        </>
    )
}