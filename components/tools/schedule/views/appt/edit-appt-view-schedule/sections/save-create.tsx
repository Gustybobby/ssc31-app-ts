/*
import { sectionStyles } from "@/components/appstyles/section";
import toast from "react-hot-toast";
import { sendDataToAPI } from "@/components/tools/api";
import { dateToDateKey } from "@/server/appointmentfunction";

export default function SaveCreate({ apptExisted, apptConfig, setView, postURLs, setAppointments, setRefetch }){
    return(
        <div className="flex justify-end">
            <button
                className={sectionStyles.button({ color: apptExisted? 'blue' : 'green'})}
                onClick={(e) => onSaveOrCreate(e, apptExisted, apptConfig, setView, postURLs, setRefetch)}
            >
                {apptExisted? 'Save' : 'Create'}
            </button>
        </div>
    )
}

async function onSaveOrCreate(e, apptExisted, apptConfig, setView, postURLs, setRefetch){
    e.target.disabled = true
    const editToast = toast.loading(apptExisted? 'Saving...' : 'Creating...')
    let res
    if(apptExisted){
        res = await onSave(apptConfig, postURLs.create)
    } else{
        res = await onCreate(apptConfig, postURLs.update)
    }
    switch(res.message){
        case 'SUCCESS':
            const dateKey = dateToDateKey(apptConfig.start_at)
            toast.success(apptExisted? 'Saved' : 'Created', { id: editToast })
            setView(dateKey)
            break
        default:
            toast.error('Error', { id: editToast })
            e.target.disabled = false
    }
    setRefetch(refetch => !refetch)
}

async function onCreate(apptConfig, createURL){
    const res = await sendDataToAPI({
        apiURL: createURL,
        method: 'POST',
        body: JSON.stringify({ data: apptConfig }),
    })
    return await res.json()
}

async function onSave(apptConfig, updateURL){
    const res = await sendDataToAPI({
        apiURL: `${updateURL}/${apptConfig.id}`,
        method: 'PUT',
        body: JSON.stringify({ data: apptConfig }),
    })
    return await res.json()
}
 */