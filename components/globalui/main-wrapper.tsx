export default function MainWrapper({ children, extraClass } : { children: React.ReactNode, extraClass: string }){
    return(
        <main className="w-full text-black dark:text-white">
            <div className={`flex flex-col items-center h-[92vh] overflow-y-auto ${extraClass}`}>
                {children}
            </div>
        </main>
    )
}