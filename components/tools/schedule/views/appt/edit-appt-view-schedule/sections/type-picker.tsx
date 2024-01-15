import { ListBoxSingleSelect } from "@/components/tools/list-box";
import { ApptTypes } from "@/server/typeconfig/record";
import { useMemo } from "react";
import type { dispatchApptConfig } from "../edit-appt-view-schedule";
import type { AppointmentType } from "@prisma/client";

interface TypePickerProps extends dispatchApptConfig {
    type: AppointmentType
    role: 'gustybobby' | 'user'
}

export default function TypePicker({ type, dispatchApptConfig, role }: TypePickerProps){
    
    const typeList = useMemo(() => Object.values(ApptTypes).filter((typeConfig) => role === 'gustybobby' || !typeConfig.admin_only)
        .map((typeConfig, index) => ({
            ...typeConfig,
            index,
            active: typeConfig.id === type,
    })), [type, role])

    return(
        <ListBoxSingleSelect
            list={typeList}
            setList={(list) => {
                const selected = list.find((item) => item.active).id
                dispatchApptConfig({ type: 'edit_type', value: selected })
            }}
            width="w-28"
            maxHeight=""
        />
    )
}