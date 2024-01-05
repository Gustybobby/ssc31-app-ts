"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { ListBoxSingleSelect } from "@/components/tools/list-box"
import { SliderSwitch } from "@/components/tools/switch"
import FieldConfig from "@/server/classes/forms/fieldconfig"
import { typePermission, type DataType, type FieldType } from "@/server/typeconfig/form"
import { useMemo } from "react"

interface FieldGeneralConfigsProps extends DispatchFormConfig{
    fieldId: string
    required: boolean
    dataType: DataType
    fieldType: FieldType
}

export default function FieldGeneralConfigs({ fieldId, required, dataType, fieldType, dispatchFormConfig }: FieldGeneralConfigsProps){

    const validTypeOptions = useMemo(() => {
        const fieldConfig = FieldConfig.defaultField('')
        fieldConfig.data_type = dataType
        fieldConfig.field_type = fieldType
        return {
            data: fieldConfig.getValidDataTypeOptions(),
            field: fieldConfig.getValidFieldTypeOptions()
        }
    },[dataType, fieldType])

    return(
        <div className="flex flex-col space-y-2">
            {!typePermission.fieldType.disableRequired.has(fieldType) &&
            <div className="flex items-center space-x-2">
                <span className="font-bold">Required</span>
                <SliderSwitch
                    on={required}
                    onColor="bg-green-600"
                    offColor="bg-red-600"
                    pinColor="bg-white"
                    size="sm"
                    onChange={() => dispatchFormConfig({
                        type: 'edit_field_boolean',
                        field_id: fieldId,
                        key: 'required',
                        value: !required
                    })}
                />
            </div>
            }
            <div>
                <ListBoxSingleSelect
                    list={validTypeOptions.data}
                    setList={(list) => dispatchFormConfig({
                        type: 'edit_data_type',
                        field_id: fieldId,
                        value: list.find((item) => item.active).id,
                    })}
                    width="w-36"
                    maxHeight="max-h-28"
                />
            </div>
            <div>
                <ListBoxSingleSelect
                    list={validTypeOptions.field}
                    setList={(list) => dispatchFormConfig({
                        type: 'edit_field_type',
                        field_id: fieldId,
                        value: list.find((item) => item.active).id,
                    })}
                    width="w-36"
                    maxHeight="max-h-28"
                />
            </div>
        </div>
    )
}