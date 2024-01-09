import { textColorClassVariants } from "./class-variants"

export const inputStyles = {
    label: (color: FieldColor,size: FieldSize) => [
        'block mb-2',
        'font-bold',
        'transition-colors',
        sizeVariants[size].label,
        colorVariants[color].text,
    ].join(' '),
    inputBox: (color: FieldColor,size: FieldSize) => [
        'w-full block',
        sizeVariants[size].padding,
        'rounded-lg shadow-lg',
        'transition-colors bg-transparent border-2',
        'focus:outline-none focus:ring-0',
        colorVariants[color].inputBox
    ].join(' '),
    p: (color: FieldColor) => [
        'mt-2 text-sm transition-colors',
        colorVariants[color].text
    ].join(' ')
}

export type FieldColor = 'green' | 'red' | 'default'
export type FieldSize = 'sm' | 'md' | 'lg'

const sizeVariants = {
    'lg': {
        label: 'text-xl',
        padding: 'p-2.5'
    },
    'md': {
        label: 'text-lg',
        padding: 'p-2',
    },
    'sm': {
        label: 'text-sm',
        padding: 'p-1',
    }
}

const colorVariants = {
    green:{
        text: textColorClassVariants.green,
        inputBox: [
            'border-green-400',
            textColorClassVariants.green,
            'placeholder-gray-400',
            'focus:ring-green-500 focus:border-green-500'
        ].join(' ')
    },
    red:{
        text: textColorClassVariants.red,
        inputBox: [
            'border-red-400',
            textColorClassVariants.red,
            'placeholder-gray-400',
            'focus:ring-red-500 focus:border-red-500'
        ].join(' ')
    },
    default:{
        text: textColorClassVariants.default,
        inputBox: [
            'border-gray-400',
            textColorClassVariants.default,
            'placeholder-gray-400',
            'focus:ring-gray-500 focus:border-gray-500'
        ].join(' ')
    }
}