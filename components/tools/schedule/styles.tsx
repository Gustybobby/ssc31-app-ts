import { type ColorVariants, backgroundColorClassVariants, hoverColorClassVariants } from "@/components/styles/class-variants"
import { BiSolidContact } from "react-icons/bi"
import { BsBuildingFill, BsPersonFillGear } from "react-icons/bs"
import { HiUserGroup } from "react-icons/hi"

export const colorCycle: ColorVariants[] = ['blue','orange','fuchsia','pink','sky','yellow','purple']

export function getColorByIdHash(id: string){
    let hash: number = 0
    for(var i=0;i<id.length;i++){
        hash += id.charCodeAt(i)
    }
    return colorCycle[hash%colorCycle.length]
}

export const IconMap = {
    CONTACT: <BiSolidContact/>,
    GROUP: <HiUserGroup/>,
    GEAR: <BsPersonFillGear/>,
    BUILDING: <BsBuildingFill/>,
}

export const scheduleStyles = {
    dayTile: (selected: boolean, diffMonth: boolean, index: number) => [
        'h-36 p-1 flex flex-col',
        'transition-colors',
        'border-b border-black dark:border-white',
        selected? 'bg-green-400 bg-opacity-20 dark:bg-opacity-40' : '',
        diffMonth? 'bg-gray-400 dark:bg-black/40' : '',
        index%7!==0? 'border-l' : '',
    ].join(' '),
    banner: (color: ColorVariants, onlyOne: boolean, dayView: boolean) => [
        onlyOne? 'h-28' : '',
        'flex flex-col',
        'p-1 rounded-lg',
        dayView? 'shadow-lg' : '',
        'transition-colors',
        backgroundColorClassVariants[color],
        hoverColorClassVariants[color],
    ].join(' '),
    dayTileButton: (color: ColorVariants) => [
        'w-6 h-6 rounded-md shadow-lg',
        'flex items-center justify-center',
        'transition-colors',
        backgroundColorClassVariants[color],
        hoverColorClassVariants[color],
    ].join(' '),
}