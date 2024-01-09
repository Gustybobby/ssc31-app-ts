import { textColorClassVariants } from "@/components/styles/class-variants"
import { sectionStyles } from "@/components/styles/sections"
import type { MemberStatus } from "@prisma/client"
import MemberDashboardWrapper from "../member-dashboard-wrapper"

export interface Profile {
    status: MemberStatus
    position_label: string
    role_label: string
    join_response: {
        id: string
        label: string
        data: string
    }[]
}

export default function MemberProfile({ profile, event_id, event_title }: { profile: Profile, event_id: string, event_title: string }){
    return(
        <MemberDashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>Profile</h1>
                    <div className="flex flex-col p-2 bg-black bg-opacity-10 dark:bg-opacity-20 rounded-lg">
                        <span className={styles.label}>
                            Status:&nbsp;
                            <span className={styles.status(profile.status)}>
                                {profile.status}
                            </span>
                        </span>
                        {profile.status === 'ACTIVE' &&
                        <>
                            <span className={styles.label}>
                                Position:&nbsp;
                                <span className={styles.data}>
                                    {profile.position_label}
                                </span>
                            </span>
                            <span className={styles.label}>
                                Role:&nbsp;
                                <span className={styles.data}>
                                    {profile.role_label}
                                </span>
                            </span>
                        </>
                        }
                    </div>
                </div>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'pink', extensions: 'mb-2' })}>Join Details</h1>
                    <div className="flex flex-col p-2 space-y-2 bg-black bg-opacity-10 dark:bg-opacity-20 rounded-lg">
                        {profile.join_response.map(({ id, label, data }) => (
                        <div key={id} className="flex flex-col">
                            <span className={styles.label}>{label}</span>
                            <span className="py-1 px-2 rounded-lg bg-black bg-opacity-10 dark:bg-opacity-20">{data}</span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </MemberDashboardWrapper>
    )
}

const styles = {
    label: [
        'text-lg font-bold'
    ].join(' '),
    data: [
        'font-normal'
    ].join(' '),
    status: (status: MemberStatus) => [
        textColorClassVariants[status === 'ACTIVE'? 'green' : 'yellow']
    ].join(' '),
}