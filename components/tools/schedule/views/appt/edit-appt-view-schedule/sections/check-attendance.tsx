import { dispatchApptConfig } from "../edit-appt-view-schedule";

interface CheckAttendanceProps extends dispatchApptConfig {
    attendanceRequired: boolean
}

export default function CheckAttendance({ attendanceRequired, dispatchApptConfig }: CheckAttendanceProps){
    return(
        <div className="flex space-x-1">
            <input
                id="check_attendance"
                type="checkbox"
                checked={attendanceRequired}
                onChange={(e) => dispatchApptConfig({ type: 'edit_boolean', key: 'attendance_required', value: e.target.checked })}
            />
            <label htmlFor="check_attendance" className="font-bold">
                Check Attendance
            </label>
        </div>
    )
}