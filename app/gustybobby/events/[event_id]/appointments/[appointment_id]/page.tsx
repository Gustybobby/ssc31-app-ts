import MainWrapper from "@/components/globalui/main-wrapper";
import Appointment from "@/components/gustybobby/events/event/appointments/appointment/appointment";

export default function AppointmentPage({ params }: { params: { event_id: string, appointment_id: string  }}){
    return (
        <MainWrapper>
            <Appointment/>
        </MainWrapper>
    )
}