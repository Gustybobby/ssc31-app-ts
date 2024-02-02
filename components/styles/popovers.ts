export const popOverStyles = {
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
        'absolute',
        'z-10 mt-1 shadow-lg',
        'text-base sm:text-sm',
        'bg-gray-100 dark:bg-gray-700',
        panelClassName ?? '',
    ].join(' '),
}