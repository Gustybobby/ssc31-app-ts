import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import QRCode from "react-qr-code";

export default async function CredentialsPage(){
    const session = await getServerAuthSession()
    if(!session?.user.id){
        throw 'invalid session'
    }
    const date = new Date()
    return (
        <MainWrapper>
            <div className={styles.mainBox}>
                <div className={styles.sectionBox}>
                    <div className="w-full md:w-80 bg-gray-100 dark:bg-black/70 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2">
                        <div className="border-8 border-red-600 w-fit">
                            <QRCode value={session?.user.id+'</>'+date.toISOString()}/>
                        </div>
                    </div>
                    <div className="w-full md:w-80 bg-gray-100 dark:bg-black/70 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2">
                        <span>Email: {session.user.email}</span>
                        <span>Name: {session.user.name}</span>
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
        'bg-white/70 dark:bg-black/70'
    ].join(' '),
    sectionBox:[
        'p-2 flex flex-col items-center space-y-2',
        'w-full h-full shadow-sm rounded-2xl',
        'bg-black/10 dark:bg-white/20',
    ].join(' ')
}