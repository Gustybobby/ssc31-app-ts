import { sectionStyles } from "@/components/styles/sections";
import ActivityHours from "./activity-hours/activity-hours";
import type { ActivityRecord, TransferRecord } from "@/server/typeconfig/record";
import TransferHours from "./transfer-hours/transfer-hours";

export default function MemberHours({ activityRecords, transferRecords, activityHours }: {
    activityRecords: { [appt_id: string]: ActivityRecord }
    transferRecords: { [key: string]: TransferRecord }
    activityHours: number
}){
    return (
        <div className={sectionStyles.container()}>
            <ActivityHours activityRecords={activityRecords} activityHours={activityHours}/>
            <TransferHours transferRecords={transferRecords}/>
        </div>
    )
}