"use client";
import { RadioGroup } from "@headlessui/react";
import React from "react";
import CheckIcon from "../svg/check-icon";
import LoadingSVG from "../svg/loading-svg";

export default function RadioOptionBox({
    children,
    checkedVariant,
    value,
    label,
    align,
    variantColor,
    checkedLabelColor
}: {
    children?: React.ReactNode,
    checkedVariant: CheckedVariant,
    value: string,
    label: string,
    align: string,
    variantColor: RadioVariant,
    checkedLabelColor: LabelVariant
}){
    return(
        <RadioGroup.Option
            value={value}
            className={({ active, checked }) => styles.radioGroup(active,checked,variantColor)}
        >
            {({ checked }) => (
            <>
                <div className={`flex w-full items-center ${align}`}>
                    <div className="flex w-full items-center">
                        <div className="w-full text-xs">
                            <RadioGroup.Label as='div' className={styles.label(checked,checkedLabelColor)}>
                                {label}
                                {checked && (
                                    <div className="right-0 shrink-0">
                                        {checkedVariants[checkedVariant]}
                                    </div>
                                )}
                            </RadioGroup.Label>
                            <RadioGroup.Description as='span' className={`w-full inline`}>
                                {children}
                            </RadioGroup.Description>
                        </div>
                    </div>
                </div>
            </>
            )}
        </RadioGroup.Option>
    )
}

const styles = {
    radioGroup: (active: boolean,checked: boolean,variantColor: RadioVariant) => [
        'relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none',
        'transition-colors',
        active? `ring-2 ring-white ring-opacity-60 ring-offset-2 ${radioGroupVariants[variantColor].active}` : '',
        checked ? `text-white ${radioGroupVariants[variantColor].checked}` : radioGroupVariants[variantColor].unChecked
    ].join(' '),
    label: (checked: boolean, checkedLabelColor: LabelVariant) => [
        'flex justify-between items-center font-bold pb-2 text-xl',
        checked ? labelVariants[checkedLabelColor] : 'dark:text-white',
    ].join(' ')
}

type RadioVariant = keyof typeof radioGroupVariants

const radioGroupVariants = {
    blue: {
        active: 'ring-offset-sky-300', 
        checked: 'bg-blue-400/60 dark:bg-blue-600/60',
        unChecked: 'bg-white bg-opacity-40 dark:bg-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-30',
    },
    green:{
        active: 'ring-offset-green-300',
        checked: 'bg-green-400 dark:bg-opacity-60',
        unChecked: 'bg-green-500 bg-opacity-60 hover:bg-opacity-100 dark:hover:bg-opacity-70',
    }
}

type LabelVariant = keyof typeof labelVariants

const labelVariants = {
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
}

type CheckedVariant = keyof typeof checkedVariants

const checkedVariants = {
    check: <CheckIcon className="h-6 w-6" />,
    loading: <LoadingSVG fillColor="fill-gray-600"/>
}