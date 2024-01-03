"use client"

export default function Warning(){
    return(
        <div className={styles.warningBox}>
            !!! Deleting the form will also delete all the responses&nbsp;
            <span className="underline">with no backup</span>
        </div>
    )
}

const styles = {
    warningBox: [
        'my-2 p-4 space-y-1 rounded-lg shadow-lg',
        'text-xl font-bold text-red-600 dark:text-red-400',
        'bg-white dark:bg-gray-800',
    ].join(' ')
}