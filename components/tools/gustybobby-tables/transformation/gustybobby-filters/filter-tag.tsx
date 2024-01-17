"use client"

import { sectionStyles } from "@/components/styles/sections"
import { inputStyles } from "@/components/styles/tools"
import { InputField } from "@/components/tools/input"
import { ListBoxSingleSelect } from "@/components/tools/list-box"
import { contentPatterns } from "@/server/classes/forms/contentconfig"
import type { TransformationFilter } from "@/server/classes/table"
import type { GustybobbyOption } from "@/server/typeconfig/form"
import type { Dispatch, SetStateAction } from "react"
import { RxCross1 } from "react-icons/rx"

export default function FilterTag({ columnOptions, filter, setFilters, tagIndex }: {
    columnOptions: GustybobbyOption[]
    filter: TransformationFilter
    setFilters: Dispatch<SetStateAction<TransformationFilter[]>>
    tagIndex: number
}){
    return(
        <div className="flex flex-row space-x-1">
            <div>
                <span className={inputStyles.label('default','sm')}>Column</span>
                <ListBoxSingleSelect
                    list={columnOptions.map((option) => ({
                        ...option,
                        active: option.id === filter.column_id
                    }))}
                    setList={(list) => {
                        setFilters(filters => filters.map((filt, index) => {
                            const selectedId = list.find((item) => item.active)?.id ?? null
                            return {
                                ...filt,
                                column_id: index === tagIndex? selectedId : filt.column_id
                            }
                        }))
                    }}
                    width="w-24 md:w-64"
                    maxHeight="max-h-48"
                />
            </div>
            <div>
                <span className={inputStyles.label('default','sm')}>OP</span>
                <ListBoxSingleSelect
                    list={operatorOptions.map((option) => ({
                        ...option,
                        active: option.id === filter.operator }))}
                    setList={(list) => {
                        setFilters(filters => filters.map((filt, index) => {
                            const selectedOperator = list.find((item) => item.active)?.id ?? null
                            return {
                                ...filt,
                                operator: index === tagIndex? selectedOperator : filt.operator
                            }
                        }))
                    }}
                    width="w-16 md:w-20"
                    maxHeight="max-h-48"
                />
            </div>
            <InputField
                id={`value_field_${tagIndex}`}
                type="text"
                label="Value"
                defaultValue={filter.value}
                pattern={contentPatterns.label}
                required={false}
                size="sm"
                onChange={(e) => {
                    setFilters(filters => filters.map((filt, index) => ({
                        ...filt,
                        value: index === tagIndex? e.target.value : filt.value
                    })))
                }}
            />
            <button
                className={sectionStyles.button({ color: 'red', border: true, hover: true, padding: 'p-1', extensions: 'mt-7' })}
                onClick={() => setFilters(filters => filters.filter(({ column_id }) => column_id !== filter.column_id))}
            >
                <RxCross1/>
            </button>
        </div>
    )
}

const operatorOptions: GustybobbyOption[] = ['has','starts','ends','=','<','>'].map((operator, index) => ({
    id: operator,
    label: operator,
    index,
    active: false
}))