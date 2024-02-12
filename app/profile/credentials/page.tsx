import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import ProfileCredentials from "@/components/profile/credentials/profile-credentials";
import { encryptQR } from "@/server/modules/qr-encryption";
import { redirect } from "next/navigation";
import QRCode from "react-qr-code";

export default async function CredentialsPage(){
    const session = await getServerAuthSession()
    if(!session?.user.id){
        redirect('/profile')
    }
    const date = new Date()
    const qrCode = encryptQR(session.user.id+'</>'+date.toISOString())
    return (
        <MainWrapper>
            <div className={styles.mainBox}>
                <div className={styles.sectionBox}>
                    <ProfileCredentials session={session} isoString={date.toISOString()}/>
                    <div className="w-full md:w-fit bg-black/70 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2">
                        <div className="border-8 border-red-600 w-fit">
                            <QRCode value={qrCode}/>
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    )
}

const styles = {
    mainBox:[
        'flex flex-col p-4',
        'w-full h-full shadow-lg',
        'bg-black/70'
    ].join(' '),
    sectionBox:[
        'p-2 flex flex-col items-center space-y-2',
        'w-full h-full shadow-sm rounded-2xl',
        'bg-white/20',
    ].join(' ')
}

