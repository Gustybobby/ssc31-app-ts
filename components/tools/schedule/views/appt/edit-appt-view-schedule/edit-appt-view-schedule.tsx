"use client"

import { sectionStyles } from "@/components/styles/sections"
import { type Dispatch, useReducer, useState, type SetStateAction } from "react"
import apptConfigReducer, { type ApptConfigReducerAction } from "./hooks/appt-config-reducer"
import type { EditableAppointment } from "@/server/typeconfig/record"
import { usePathname, useRouter } from "next/navigation"
import { RxCross1 } from "react-icons/rx"
import DateTimePicker from "./sections/date-time-picker"
import type { Schedule } from "../../../hooks/schedule-state-reducer"
import IconPicker from "./sections/icon-picker"
import TitleField from "./sections/title-field"
import PopUpDelete from "./sections/pop-up-delete"
import TypePicker from "./sections/type-picker"
import DescriptionField from "./sections/description-field"
import LocationField from "./sections/location-field"
import PartySelectorTable from "./sections/party-selector-table"
import SaveButton from "./sections/save-button"
import CreateButton from "./sections/create-button"
import CheckBoolean from "./sections/check-boolean"

interface EditApptViewScheduleProps {
    eventId: string
    appt: EditableAppointment | undefined
    date: Date
    dateAppts: Schedule['appointments']['key']['appts']
    role: 'gustybobby' | 'user'
    refetch: Dispatch<SetStateAction<{}>>
}

export interface dispatchApptConfig {
    dispatchApptConfig: Dispatch<ApptConfigReducerAction>
}

export default function EditApptViewSchedule({ eventId, appt, date, dateAppts, role, refetch }: EditApptViewScheduleProps){

    const [apptConfig, dispatchApptConfig] = useReducer(apptConfigReducer, appt ?? newApptConfig(date))
    const [openDelete, setOpenDelete] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    return(
        <div className="h-fit bg-gray-200 dark:bg-black/70 border border-black dark:border-white">
            <div className="p-1 flex justify-between md:grid md:grid-cols-3 items-center content-center border-b border-black dark:border-white">
                <button
                    className={sectionStyles.button({ color: 'gray', border: true, hover: true })}
                    onClick={() => router.push(pathname+`?view=month&year=${date.getFullYear()}&month=${date.getMonth()}`)}
                >
                    Back
                </button>
                <span className="font-bold text-2xl text-center">
                    {appt? 'Edit' : 'Create'} Appointment
                </span>
                {appt &&
                <div className="flex justify-end">
                    <button 
                        className={sectionStyles.button({ color: 'red', border: true, hover: true })}
                        onClick={() => setOpenDelete(true)}
                    >
                        <RxCross1 className="text-2xl"/>
                    </button>
                    <PopUpDelete
                        eventId={eventId}
                        apptId={appt.id}
                        openDelete={openDelete}
                        setOpenDelete={setOpenDelete}
                        role={role}
                        refetch={refetch}
                    />
                </div>
                }
            </div>
            {
            <div className="p-2 space-y-1 xl:space-y-0 xl:grid xl:grid-cols-2">
                <div className="w-full">
                    <div className="text-xl font-bold">Title</div>
                    <div className="flex items-center space-x-2">
                        <IconPicker
                            icon={apptConfig.icon}
                            dispatchApptConfig={dispatchApptConfig}
                        />
                        <TitleField
                            title={apptConfig.title}
                            dispatchApptConfig={dispatchApptConfig}
                        />
                    </div>
                    <div className="text-xl font-bold mb-2">Type</div>
                    <div className="flex items-center justify-between md:justify-start md:space-x-4">
                        <TypePicker
                            role={role}
                            type={apptConfig.type}
                            dispatchApptConfig={dispatchApptConfig}
                        />
                        <CheckBoolean
                            attendanceRequired={apptConfig.attendance_required}
                            publicAppt={apptConfig.public}
                            dispatchApptConfig={dispatchApptConfig}
                        />
                    </div>
                    <DateTimePicker
                        apptId={apptConfig.id}
                        startAt={apptConfig.start_at}
                        endAt={apptConfig.end_at}
                        appts={dateAppts}
                        dispatchApptConfig={dispatchApptConfig}
                    />
                    <LocationField
                        location={apptConfig.location}
                        dispatchApptConfig={dispatchApptConfig}
                    />
                    <DescriptionField
                        description={apptConfig.description}
                        dispatchApptConfig={dispatchApptConfig}
                    />
                </div>
                <div className="mx-2 flex flex-col justify-between space-y-2 xl:space-y-0">
                    <div className="h-[90vh] overflow-auto">
                        <PartySelectorTable
                            eventId={eventId}
                            role={role}
                            dispatchApptConfig={dispatchApptConfig}
                            partyMembers={appt?.party_members ?? []}
                        />
                    </div>
                    {appt?
                    <SaveButton
                        eventId={eventId}
                        apptConfig={apptConfig}
                        role={role}
                        refetch={refetch}
                    />
                    :
                    <CreateButton
                        eventId={eventId}
                        apptConfig={apptConfig}
                        role={role}
                        refetch={refetch}
                    />
                    }
                </div>
            </div>
            }
        </div>
    )
}


const newApptConfig = (date: Date): EditableAppointment => {
    return {
        permission: 'editable',
        id: 'new',
        icon: 'CONTACT',
        title: '',
        public: false,
        type: 'MEETING',
        attendance_required: false,
        start_at: (new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0)).toISOString(),
        end_at: (new Date(date.getFullYear(),date.getMonth(),date.getDate(),1,0,0)).toISOString(),
        location: '',
        description: '',
        party_members: [],
        attendances: [],
        _count: {
            party_members: 0,
        }
    }
}