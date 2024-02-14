import MainWrapper from "@/components/globalui/main-wrapper";
import Appointment from "@/components/events/event/appointment/appointment";
import prisma from "@/prisma-client";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { redirect } from "next/navigation";

interface AppointmentPageProps {
    params: {
        event_id: string,
        appointment_id: string,
        qr_code_tab: string
    }
}

const escapedUrl = ({ params }: AppointmentPageProps) =>
    (`/events/${params.event_id}/appointments/${params.appointment_id}/${params.qr_code_tab}`).replace('/','%2F')

export default async function AppointmentPage({ params }: AppointmentPageProps){
    const session = await getServerAuthSession()
    if(!session?.user.id){
        redirect(`/api/auth/signin?callbackUrl=${escapedUrl({ params })}`)
    }
    if(session?.user.role !== "ADMIN"){
        try {
            await prisma.eventMember.findUniqueOrThrow({
                where: {
                    user_id_event_id: {
                        user_id: session.user.id,
                        event_id: params.event_id
                    },
                    status: 'ACTIVE',
                    OR: [{
                            position: {
                                can_regist: true
                            }
                        }, {
                            role: {
                                can_appoint: true
                            }
                    }]
                }, select: {
                    id: true,
                }
            })
        } catch(e){
            redirect('/profile')
        }
    }
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
                role={session?.user.role === "ADMIN"? "gustybobby" : "user"}
                appt={{
                    id: params.appointment_id,
                    title: appointment.title,
                }}
                qrCodeTab={params.qr_code_tab}
                eventId={params.event_id}
            />
        </MainWrapper>
    )
}