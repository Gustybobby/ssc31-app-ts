"use client"

import type Table from "@/server/classes/table"
import { Popover, Transition } from "@headlessui/react"
import { Fragment, type Dispatch, type SetStateAction, useState } from "react"
import { FaFilter } from "react-icons/fa"
import type { GustybobbyOption } from "@/server/typeconfig/form"
import FilterTag from "./filter-tag"
import { sectionStyles } from "@/components/styles/sections"
import type { TransformationFilter } from "@/server/classes/table"
import { popOverStyles } from "@/components/styles/popovers"

interface GustybobbyFiltersProps {
    columnOptions: GustybobbyOption[]
    transformationFilters: {
        [column_id: string]: TransformationFilter
    }
    setTransformation: Dispatch<SetStateAction<Table['transformation']>>
    classNames?: {
        panelWidth?: string
    }
}

export default function GustybobbyFilters({
    columnOptions,
    transformationFilters,
    setTransformation,
    classNames = {
        panelWidth: 'w-80 md:w-[36rem]'
    }
}: GustybobbyFiltersProps){
    const [filters, setFilters] = useState<TransformationFilter[]>(Object.values(transformationFilters))

    return (
        <Popover className="relative">
            <Popover.Button className={popOverStyles.popOverButton()}>
                <div className="p-1 flex items-center space-x-2">
                    <FaFilter className="text-xl"/>
                </div>
            </Popover.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Popover.Panel className={popOverStyles.popOverPanel(classNames.panelWidth+' p-2 rounded-lg')}>
                    {filters.map((filter, index) => (
                    <FilterTag
                        key={index}
                        tagIndex={index}
                        filter={filter}
                        columnOptions={columnOptions}
                        setFilters={setFilters}
                    />
                    ))}
                    {filters.length === 0 &&
                    <div className="text-lg">No filter applied</div>
                    }
                    <div className="flex justify-between">
                        <button
                            className={sectionStyles.button({ color: 'green', border: true, hover: true })}
                            onClick={() => setFilters(filters => [...filters, {
                                column_id: '',
                                operator: 'has',
                                value: '',
                            }])}
                        >
                            Add
                        </button>
                        <button
                            className={sectionStyles.button({ color: 'green', border: true, hover: true })}
                            onClick={() => setTransformation(transformation => ({
                                ...transformation,
                                filters: Object.fromEntries(filters.map(filter => [filter.column_id, filter]))
                            }))}
                        >
                            Apply
                        </button>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}