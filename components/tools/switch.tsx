"use client"

import { Switch } from "@headlessui/react"

interface SwitchConfig {
    on: boolean
    onColor: string
    offColor: string
    pinColor: string
    size: SwitchSize
    onChange?: (checked: boolean) => void
}

export function SliderSwitch({ on, onColor, offColor, pinColor, size, onChange }: SwitchConfig){

    return(
        <Switch
            className={styles.sliderBar(on,onColor,offColor,size)}
            checked={on}
            onChange={(checked)=>{if(onChange){ onChange(checked) }}}
        >
            <span className="sr-only">Use setting</span>
            <span aria-hidden="true" className={styles.sliderPin(on,pinColor,size)}/>
        </Switch>
    )
}

const styles = {
    sliderBar: (on: boolean, onColor: string, offColor: string, size: SwitchSize) => [
        'relative inline-flex rounded-full flex items-center',
        sizesVariant[size].bar,
        'shrink-0 cursor-pointer',
        'border-2 border-transparent',
        on? onColor : offColor,
        'transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'
    ].join(' '),
    sliderPin: (on: boolean, pinColor: string, size: SwitchSize) => [
        on? sizesVariant[size].translate : 'translate-x-0',
        'inline-block rounded-full shadow-lg',
        sizesVariant[size].pin,
        'transform transition duration-200 ease-in-out',
        'pointer-events-none ring-0',
        pinColor,
    ].join(' '),
}

type SwitchSize = 'sm' | 'md' | 'lg'

const sizesVariant = {
    sm:{
        bar:'h-[17px] w-[37px]',
        pin:'h-[14px] w-[14px]',
        translate:'translate-x-5',
    },
    md:{
        bar:'h-[25px] w-[55px]',
        pin:'h-[22px] w-[22px]',
        translate:'translate-x-[30px]',
    },
    lg:{
        bar:'h-[38px] w-[74px]',
        pin:'h-[34px] w-[34px]',
        translate:'translate-x-9',
    }
}