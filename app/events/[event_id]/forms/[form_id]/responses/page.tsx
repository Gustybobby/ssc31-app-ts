import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { redirect } from "next/navigation";
import prisma from "@/prisma-client";
import MainWrapper from "@/components/globalui/main-wrapper";
import FormResponses from "@/components/events/event/forms/form/responses/form-responses";
import getPermittedFormInfo from "@/server/modules/get-permitted-form-info";

export default async function FormResponsesPage({ params }: { params: { event_id: string, form_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id){
        redirect("/events")
    }
    const formInfo = await getPermittedFormInfo(prisma, {
        user_id: session.user.id,
        event_id: params.event_id,
        form_id: params.form_id,
    }, session.user.role === "ADMIN")
    switch(formInfo.type){
        case "UNAUTHORIZED":
            redirect("/events")
        case "ADMIN":
        case "MEMBER":
            return (
                <MainWrapper>
                    <FormResponses
                        event_id={params.event_id}
                        role={formInfo.type === "ADMIN"? "gustybobby" : "user"}
                        formConfig={formInfo.form_config as any}
                        responses={formInfo.responses as any}
                    />
                </MainWrapper>
            )
    }
}