"use client"

import { useMemo } from "react"
import { dispatchApptConfig } from "../edit-appt-view-schedule"
import type { IconType } from "@prisma/client"
import { IconMap } from "@/components/tools/schedule/styles"
import { ListBoxSingleSelect } from "@/components/tools/list-box"

interface IconPickerProps extends dispatchApptConfig {
    icon: IconType
}

export default function IconPicker({ icon, dispatchApptConfig }: IconPickerProps){

    const iconList = useMemo(() => {
        return Object.entries(IconMap).map(([id,label], index) => ({ id, label, index, active: id === icon }))
    }, [icon])

    return(
        <ListBoxSingleSelect
            list={iconList as any}
            setList={(list) => {
                const selected = list.find((item) => item.active).id
                dispatchApptConfig({ type: 'edit_icon', value: selected })
            }}
            width="text-4xl w-16"
            maxHeight=""
        />
    )
}