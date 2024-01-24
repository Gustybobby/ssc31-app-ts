"use client"

import type { DispatchFormConfig } from "../editor-types"

interface TitleFieldProps extends DispatchFormConfig {
    title: string
}

export default function TitleField({ title, dispatchFormConfig }: TitleFieldProps){
    return(
        <input 
            id="form_title_input_field"
            className={styles.titleInput} 
            defaultValue={title}
            onChange={(e)=>{
                dispatchFormConfig({ type: 'edit_string', key: 'title', value: e.target.value })
            }}
            autoComplete="off"
        />
    )
}

const styles = {
    titleInput: [
        'w-full p-1 text-center',
        'text-2xl font-semibold',
        'border-y-2 border-black dark:border-gray-600',
        'bg-gray-200 dark:bg-black/70',
    ].join(' '),
}