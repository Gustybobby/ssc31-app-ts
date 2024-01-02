import { type ColorVariants, backgroundColorClassVariants, hoverColorClassVariants } from "./class-variants";

export const sectionStyles = {
    container: ({ extensions }: { extensions?: string } = {}) => [
        'flex flex-col items-center justify-center',
        'm-2 space-y-2',
        extensions,
    ].join(' '),
    box: {
        gray: ({ round, shadow }: { round?: boolean, shadow?: boolean } = {}) => [
            'flex flex-col justify-center',
            'w-full p-2',
            round? 'rounded-lg' : '',
            shadow? 'shadow-lg' : '',
            'bg-gray-100 dark:bg-white/20'
        ].join(' ')
    },
    title: ({ color, extensions }: { color: ColorVariants, extensions?: string }) => [
        'w-fit h-fit rounded-lg',
        'px-2 py-1',
        'text-xl font-semibold',
        backgroundColorClassVariants[color],
        extensions,
    ].join(' '),
    button: ({
        color,
        hover,
        border,
        large,
        padding,
        extensions
    }: {
        color: ColorVariants,
        hover: boolean,
        border: boolean,
        large?: boolean,
        padding?: string,
        extensions?: string,
    }) => [
        'w-fit h-fit rounded-lg shadow-lg',
        padding?? (large? 'px-4 py-2' : 'px-2 py-1'),
        'text-xl font-bold',
        'transition-colors',
        border? 'border border-black dark:border-white' : '',
        backgroundColorClassVariants[color],
        hover? hoverColorClassVariants[color] : '',
        extensions,
    ].join(' '),
}