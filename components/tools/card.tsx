export function Card({ children, variant, extraClass }: { children: React.ReactNode, variant: CardVariants, extraClass?: string }){
    return(
        <div className={styles.card({ variant, extraClass })}>
            {children}
        </div>
    )
}

const styles = {
    card: ({ variant, extraClass }: { variant: CardVariants, extraClass?: string}) => [
        'border rounded-lg shadow-lg',
        cardVariants[variant],
        extraClass,
    ].join(' ')
}

export type CardVariants = keyof typeof cardVariants

const cardVariants = {
    'white-gray': 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    'white-gray-light': 'bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-200',
    'green': 'bg-green-400 dark:bg-green-600 border-green-300 dark:border-green-700',
    'translucent': 'bg-white dark:bg-black/70 border-white/20',
}