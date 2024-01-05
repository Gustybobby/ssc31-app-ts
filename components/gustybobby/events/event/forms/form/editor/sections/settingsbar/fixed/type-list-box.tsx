import { ListBoxSingleSelect } from "@/components/tools/list-box"
import type { DispatchFormConfig } from "../../../handlers/state-manager"
import type { FormType } from "@prisma/client"
import { formTypes } from "@/server/typeconfig/form"
import { useMemo } from "react"

interface TypeListBoxProps extends DispatchFormConfig {
    formType: FormType
}

export default function TypeListBox({ formType, dispatchFormConfig }: TypeListBoxProps){

    const typeOptions = useMemo(() => Object.values(formTypes).map((type, index)=>({
        id: type.id,
        label: type.label,
        index: index,
        active: type.id === formType,
    })), [formType])

    return(
        <div className="flex flex-col md:items-center order-1 md:order-3">
            <div>
                <div className="mb-1 px-2 py-1 rounded-lg bg-pink-400 dark:bg-pink-600 w-fit">
                    Form Type
                </div>
                <div>
                    <ListBoxSingleSelect
                        list={typeOptions}
                        setList={(list)=>{
                            const type: FormType = list.find((item)=>item.active).id 
                            dispatchFormConfig({ type: 'edit_type', value: type })
                        }}
                        width="w-24"
                        maxHeight=""
                    />
                </div>
                <div className="md:h-[39px]"></div>
            </div>
        </div>
    )
}