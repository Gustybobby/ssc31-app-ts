"use client"

import useManageAppointments from "../hooks/use-manage-appointments"
import SearchAppointments from "./search-appointments"
import { ShowAppointments } from "./show-appointments"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import ParticipantsHoursPopUp from "./participants-hours-pop-up"

export default function ManageAppointments({ eventId }: { eventId: string }){
    const {
        appointments, refetch,
        startAt, setStartAt,
        endAt, setEndAt,
        selectedApptId, setSelectedApptId,
        open, setOpen,
    } = useManageAppointments({ eventId })

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
            {selectedApptId &&
            <ParticipantsHoursPopUp
                eventId={eventId}
                selectedApptId={selectedApptId}
                open={open}
                setOpen={setOpen}
            />
            }
        </div>
    )
}