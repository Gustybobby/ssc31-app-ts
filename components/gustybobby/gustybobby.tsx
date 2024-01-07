"use client";
import { RadioGroup } from "@headlessui/react";
import { Fragment } from "react";
import { ZoomIn } from "../tools/transition";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileSection from "../tools/profile-section";
import RadioOptionBox from "../tools/radio-option-box";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type EventBanner = {
    id: string
    title: string
    online: boolean
}

export default function Gustybobby({ events }: { events: EventBanner[] }){

    const { data:session } = useSession()
    const router = useRouter()

    return(
        <div className={styles.mainBox}>
            <div className="p-4 flex flex-col items-center justify-center space-y-4">
                <ZoomIn show={true} duration={'duration-75'} delay={'delay-75'} as={Fragment}>
                    <div className={[styles.sectionBox,'h-[20vh]'].join(' ')}>
                        <ProfileSection session={session}/>
                    </div>
                </ZoomIn>
                <ZoomIn show={true} duration={'duration-75'} delay={'delay-150'} as={Fragment}>
                    <div className={[styles.sectionBox,'h-[60vh] overflow-auto'].join(' ')}>
                        <h1 className="text-center text-2xl font-semibold underline pt-4">
                            All Events
                        </h1>
                        <RadioGroup className="w-full flex flex-col items-center p-4" 
                        onChange={(selected)=>redirectToEditor(selected, router)}>
                            <div className="space-y-2 w-full max-w-4xl">
                                {events.map((event) => (
                                    <RadioOptionBox
                                        key={event.id}
                                        value={event.id}
                                        label={event.title}
                                        checkedVariant="loading"
                                        align="justify-between"
                                        variantColor="blue"
                                        checkedLabelColor="yellow"
                                    >
                                        <EventTag online={event.online}/>
                                    </RadioOptionBox>
                                ))}
                                <div className="w-full">
                                    <RadioOptionBox
                                        value="new_event"
                                        label="Create New Event"
                                        checkedVariant="loading"
                                        align="justify-between"
                                        variantColor="green"
                                        checkedLabelColor="green"
                                    >
                                    </RadioOptionBox>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </ZoomIn>
            </div>
        </div>
    )
}

function EventTag({ online }: { online: boolean }){
    return(
        <span>
            {(online)? 
                <>
                    <span className="text-lg">&#128994;</span>{' '}
                    <span className="text-lg text-green-600 dark:text-green-400 font-semibold">
                        ONLINE
                    </span>
                </> 
                : 
                <>
                    <span className="text-lg">&#128308;</span>{' '}
                    <span className="text-lg text-red-600 dark:text-red-500 font-semibold">
                        OFFLINE
                    </span>
                </>
            }
        </span>
    )
}

function redirectToEditor(id: string, router: AppRouterInstance){
    if(id==="new_event"){
        router.push('/gustybobby/events/new')
    } else{
        router.push(`/gustybobby/events/${id}/settings`)
    }
}

const styles = {
    mainBox:[
        'box-content flex flex-col',
        'w-full h-[92vh] shadow-lg',
        'border-1',
        'bg-white/70 dark:bg-black/70'
    ].join(' '),
    sectionBox:[
        'box-content p-2',
        'w-full shadow-sm rounded-2xl',
        'bg-black/10 dark:bg-white/20',
    ].join(' ')
}