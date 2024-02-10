import MainWrapper from "@/components/globalui/main-wrapper";
import Appointment from "@/components/gustybobby/events/event/appointments/appointment/appointment";
import prisma from "@/prisma-client";

export default async function AppointmentPage({ params }: { params: { event_id: string, appointment_id: string  }}){
    const appointment = await prisma.eventAppointment.findUniqueOrThrow({
        where: {
            id: params.appointment_id,
            attendance_required: true,
        },
        select: {
            title: true
        }
    })
    return (
        <MainWrapper>
            <Appointment
                appt={{
                    id: params.appointment_id,
                    title: appointment.title,
                }}
                eventId={params.event_id}
            />
        </MainWrapper>
    )
}