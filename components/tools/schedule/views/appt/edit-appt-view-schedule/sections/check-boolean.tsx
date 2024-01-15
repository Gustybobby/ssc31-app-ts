import { SliderSwitch } from "@/components/tools/switch";
import { dispatchApptConfig } from "../edit-appt-view-schedule";

interface CheckBooleanProps extends dispatchApptConfig {
    attendanceRequired: boolean
    publicAppt: boolean
}

export default function CheckBoolean({ publicAppt, attendanceRequired, dispatchApptConfig }: CheckBooleanProps){
    return(
        <div className="flex flex-col items-end">
            <div className="flex space-x-1 items-center">
                <span className={styles.labelSpan(attendanceRequired)}>Attendance</span>
                <SliderSwitch
                    on={attendanceRequired}
                    onColor="bg-green-600"
                    offColor="bg-red-600"
                    pinColor="bg-white"
                    size="sm"
                    onChange={() => dispatchApptConfig({ type: 'edit_boolean', key: 'attendance_required', value: !attendanceRequired })}
                />
            </div>
            <div className="flex space-x-1 items-center">
                <span className={styles.labelSpan(publicAppt)}>Public</span>
                <SliderSwitch
                    on={publicAppt}
                    onColor="bg-green-600"
                    offColor="bg-red-600"
                    pinColor="bg-white"
                    size="sm"
                    onChange={() => dispatchApptConfig({ type: 'edit_boolean', key: 'public', value: !publicAppt })}
                />
            </div>
        </div>
    )
}

const styles = {
    labelSpan: (on: boolean) => [
        on? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
        'font-bold',
    ].join(' ')
}