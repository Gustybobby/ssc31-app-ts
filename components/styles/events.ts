import { ColorVariants, backgroundColorClassVariants, hoverColorClassVariants } from "./class-variants"

export const eventStyles = {
    box: ({ size, round, extensions } : { size: BoxSize, round: boolean, extensions?: string }) => [
        'w-full flex flex-col items-center justify-center',
        round? 'rounded-2xl' : '',
        'shadow-lg',
        'border-1',
        'bg-white dark:bg-black/70',
        boxSizeVariant[size],
        extensions,
    ].join(' '),
    link: ({ color }: { color: ColorVariants }) => [
        'flex items-center space-x-2',
        'm-4 px-5 py-2 rounded-2xl',
        'text-xl font-bold text-center',
        'transition ease-in-out delay-50 duration-50 hover:-translate-y-1 hover:scale-105',
        backgroundColorClassVariants[color],
        hoverColorClassVariants[color],
    ].join(' '),
    title: ({ extensions }: { extensions?: string } = {}) => [
        'text-4xl font-bold text-center',
        'text-black dark:text-yellow-400',
        extensions,
    ].join(' '),
    button: ({ color, large, extensions }: { color: ColorVariants, large: boolean, extensions?: string }) => [
        'w-fit h-fit rounded-lg',
        large? 'px-4 py-2' : 'px-2 py-1',
        'text-xl font-bold',
        'transition-colors',
        backgroundColorClassVariants[color],
        hoverColorClassVariants[color],
        extensions,
    ].join(' '),
}

const boxSizeVariant = {
    auto: '',
    sm: 'max-w-2xl',
    md: 'max-w-5xl',
}
type BoxSize = keyof typeof boxSizeVariant