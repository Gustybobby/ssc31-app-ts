"use client"

import { Fragment, useEffect, useState } from "react"
import { ZoomIn } from "../tools/transition"
import { RadioGroup } from "@headlessui/react"
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useRouter } from "next/navigation"
import type { Session } from "next-auth";
import type { MemberStatus } from "@prisma/client";
import ProfileSection from "../tools/profile-section";
import RadioOptionBox from "../tools/radio-option-box";
import { textColorClassVariants } from "../styles/class-variants";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface EventMember {
    status: MemberStatus;
    position: {
        label: string;
    } | null;
    role: {
        label: string;
    } | null;
    event: {
        id: string;
        title: string;
    };
}

export default function Profile({ session, event_members }: { session: Session, event_members: EventMember[] }){

    const router = useRouter()

    return(
        <div className={styles.mainBox}>
            <div className="h-full p-4 grid grid-cols-1 gap-y-4">
                <ZoomIn show={true} duration={'duration-75'} delay={'delay-75'} as={Fragment}>
                    <div className={styles.sectionBox}>
                        <ProfileSection session={session}/>
                    </div>
                </ZoomIn>
                <ZoomIn show={true} duration={'duration-75'} delay={'delay-150'} as={Fragment}>
                    <div className={[styles.sectionBox, 'overflow-y-auto'].join(' ')}>
                        <h1 className="text-center text-2xl font-semibold underline mt-4">
                            Your Events
                        </h1>
                        <RadioGroup 
                            className="w-full flex flex-col items-center p-4" 
                            onChange={(selected)=>redirectToDashboard(selected, router)}
                        >
                            <div className="space-y-2 w-full max-w-4xl">
                                {event_members.length > 0?
                                event_members.map((member) => (
                                    <RadioOptionBox
                                        key={member.event.id}
                                        value={member.event.id}
                                        label={member.event.title}
                                        checkedVariant="loading"
                                        align="justify-between"
                                        variantColor="blue"
                                        checkedLabelColor="yellow"
                                    >
                                        <div className="flex justify-between items-end text-lg font-semibold">
                                            <MemberTag
                                                status={member.status}
                                                positionLabel={member.position?.label ?? ''}
                                                roleLabel={member.role?.label ?? ''}
                                            />
                                            <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                                                <span>VIEW</span>
                                                <HiMagnifyingGlass/>
                                            </span>
                                        </div>
                                    </RadioOptionBox>
                                ))
                                :
                                <div className="text-center text-xl font-semibold p-4">
                                    You are not participating in any events
                                </div>
                                }
                            </div>
                        </RadioGroup>
                    </div>
                </ZoomIn>
            </div>
        </div>
    )
}

function MemberTag({ status, positionLabel, roleLabel }: {
    status: EventMember['status'],
    positionLabel: string,
    roleLabel: string
}){

    const [cycle, setCycle] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => setCycle(cycle => (cycle+1)%3), 500)
        return () => clearInterval(interval);
    },[])

    switch(status){
        case 'PENDING':
        case 'SELECTED':
            return(
                <span className={statusColorVariants.PENDING}>
                    🟡{'PENDING'+('.'.repeat(cycle+1))}
                </span>
            )
        case 'ACTIVE':
            return(
                <div className="flex flex-col md:flex-row md:space-x-2">
                    <span className={statusColorVariants[status]}>
                        🟢{status}
                    </span>
                    <span className={textColorClassVariants.sky}>
                        {positionLabel}
                    </span>
                    <span className={textColorClassVariants.amber}>
                        {roleLabel}
                    </span>
                </div>
            )
    }
}

function redirectToDashboard(event_id: string, router: AppRouterInstance){
    router.push(`/profile/events/${event_id}/profile`)
}

const styles = {
    mainBox:[
        'flex flex-col',
        'w-full h-full shadow-lg',
        'bg-white/70 dark:bg-black/70'
    ].join(' '),
    sectionBox:[
        'p-2',
        'w-full h-full shadow-sm rounded-2xl',
        'bg-black/10 dark:bg-white/20',
    ].join(' ')
}

const statusColorVariants = {
    PENDING: textColorClassVariants.yellow,
    ACTIVE: textColorClassVariants.green,
}