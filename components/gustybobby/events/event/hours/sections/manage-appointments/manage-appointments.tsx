"use client"

import useManageAppointments, { type UseManageAppointmentsProps } from "../../hooks/use-manage-appointments"
import SearchAppointments from "./search-appointments"
import ShowAppointments from "./show-appointments"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import ParticipantsHoursPopUp from "./participants-hours-pop-up"
import type { Dispatch, SetStateAction } from "react"

interface ManageAppointmentsProps extends UseManageAppointmentsProps {
    setStartAt: Dispatch<SetStateAction<string>>
    setEndAt: Dispatch<SetStateAction<string>>
}

export default function ManageAppointments({ eventId, startAt, setStartAt, endAt, setEndAt }: ManageAppointmentsProps){
    const { appointments, refetch, selectedApptId, setSelectedApptId, open, setOpen } = useManageAppointments({ eventId, startAt, endAt })

    if(appointments === 'error'){
        throw 'appointments fetch error'
    }
    return (
        <div className="space-y-2">
            <SearchAppointments
                startAt={startAt}
                setStartAt={setStartAt}
                endAt={endAt}
                setEndAt={setEndAt}
                refetch={refetch}
            />
            {appointments === 'loading'?
            <GustybobbyTableLoading/>
            :
            <ShowAppointments
                appointments={appointments}
                setSelectedApptId={setSelectedApptId}
            />
            }
            {selectedApptId && appointments !== 'loading' &&
            <ParticipantsHoursPopUp
                eventId={eventId}
                selectedApptId={selectedApptId}
                open={open}
                setOpen={setOpen}
                apptPublic={!!appointments.find((appt) => appt.id === selectedApptId)?.public}
            />
            }
        </div>
    )
}