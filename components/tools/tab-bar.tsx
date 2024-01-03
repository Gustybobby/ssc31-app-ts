"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"

interface TabConfig {
    id: string
    label: string
}

export default function TabBar({ commonPath, tabList = [] }: { commonPath: string, tabList: TabConfig[]}){

    const pathname = usePathname()

    return(
        <div className={styles.tabBar}>
            {tabList.map((tab) => (
            <Tab
                key={tab.id}
                tabHref={commonPath+'/'+tab.id}
                tabLabel={tab.label}
                selected={pathname.slice(commonPath.length+1).startsWith(tab.id)}
            />
            ))}
        </div>
    )
}

export function ParamsTabBar({ param = 'tab', tabList = [] }: { param: string, tabList: TabConfig[] }){

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tabRef = (tab_id: string) => {
        const newParam = searchParams.get(param) === null? `${param}=${tab_id}` : null
        const queryStrings = []
        searchParams.forEach((value, key) => {
            queryStrings.push([key ,key === param? tab_id : value].join('='))
        })
        if(newParam){
            queryStrings.push(newParam)
        }
        return [pathname, queryStrings.join('&')].join('?')
    }

    return(
        <div className={styles.tabBar}>
            {tabList.map((tab) => (
            <Tab
                key={tab.id}
                tabHref={tabRef(tab.id)}
                tabLabel={tab.label}
                selected={searchParams.get(param) === tab.id}
            />
            ))}
        </div>
    )
}

function Tab({ tabHref, tabLabel, selected }: { tabHref: string, tabLabel: string, selected: boolean }){

    const [hovered, setHovered] = useState(false)

    return(
        <Link
            className={styles.tabLink}
            href={tabHref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className={styles.linkLabel(selected, hovered)}>
                {tabLabel}
            </span>
        </Link>
    )
}

const styles = {
    tabBar: [
        'w-full h-12 flex shadow-lg overflow-x-auto',
        'bg-gray-200 dark:bg-gray-800',
        'border-b border-black dark:border-white',
    ].join(' '),
    tabLink: [
        'h-full flex items-center justify-center px-1',
    ].join(' '),
    linkLabel: (selected: boolean, hovered: boolean) => [
        'px-2 py-1 rounded-lg transition-colors ease-in-out',
        hovered? 'bg-black/10 dark:bg-white/10' : '',
        selected? 'font-bold bg-black/10 dark:bg-white/10' : '',
    ].join(' '),
}