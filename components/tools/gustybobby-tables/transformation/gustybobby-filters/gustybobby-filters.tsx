"use client"

import type Table from "@/server/classes/table"
import { Popover, Transition } from "@headlessui/react"
import { Fragment, type Dispatch, type SetStateAction, useState } from "react"
import { FaFilter } from "react-icons/fa"
import type { GustybobbyOption } from "@/server/typeconfig/form"
import FilterTag from "./filter-tag"
import { sectionStyles } from "@/components/styles/sections"
import type { TransformationFilter } from "@/server/classes/table"

interface GustybobbyFiltersProps {
    columnOptions: GustybobbyOption[]
    setTransformation: Dispatch<SetStateAction<Table['transformation']>>
    classNames?: {
        panelWidth?: string
    }
}

export default function GustybobbyFilters({
    columnOptions,
    setTransformation,
    classNames = {
        panelWidth: 'w-80 md:w-[36rem]'
    }
}: GustybobbyFiltersProps){

    const [filters, setFilters] = useState<TransformationFilter[]>([])

    return (
        <Popover className="relative">
            <Popover.Button className={styles.popOverButton()}>
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
                <Popover.Panel className={styles.popOverPanel(classNames.panelWidth)}>
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

const styles = {
    popOverButton: (buttonClassName?: string) => [
        'flex flex-row justify-between items-center',
        'px-2 py-1 rounded-md shadow-md',
        'border border-gray-400 dark:border-gray-700',
        'bg-gray-200 dark:bg-gray-800 transition-colors',
        'hover:border-black dark:hover:border-gray-400',
        'focus:outline-none',
        buttonClassName ?? '',
    ].join(' '),
    popOverPanel: (panelClassName?: string) => [
        'absolute space-y-1',
        'p-2 z-10 mt-1 shadow-lg rounded-lg',
        'text-base sm:text-sm',
        'bg-gray-100 dark:bg-gray-700',
        panelClassName ?? '',
    ].join(' '),
}