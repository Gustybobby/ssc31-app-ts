import { sectionStyles } from "@/components/styles/sections";
import ActivityHours from "./activity-hours/activity-hours";
import type { ActivityRecord } from "@/server/typeconfig/record";

export default function MemberHours({ activityRecords, activityHours }: {
    activityRecords: { [appt_id: string]: ActivityRecord }
    activityHours: number
}){
    return (
        <div className={sectionStyles.container()}>
            <ActivityHours activityRecords={activityRecords} activityHours={activityHours}/>
        </div>
    )
}