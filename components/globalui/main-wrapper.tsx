export default function MainWrapper({ children, extraClass } : { children: React.ReactNode, extraClass?: string }){
    return(
        <main className="w-full text-black dark:text-white">
            <div
                className={`flex flex-col items-center overflow-y-auto ${extraClass}`}
                style={{height: 'calc(100vh - 54px)'}}
            >
                {children}
            </div>
        </main>
    )
}