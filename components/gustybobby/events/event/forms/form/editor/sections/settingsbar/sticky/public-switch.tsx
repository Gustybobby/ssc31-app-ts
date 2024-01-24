import { SliderSwitch } from "@/components/tools/switch"
import { memo } from "react"
import type { DispatchFormConfig } from "../../../editor-types"

interface PublicSwitchProps extends DispatchFormConfig {
    publicForm: boolean
}

function PublicSwitchComponent({ publicForm, dispatchFormConfig }: PublicSwitchProps){
    return(
        <div className="flex justify-end items-center order-3 md:justify-center">
            <span className={styles.openTag(publicForm)}>
                PUBLIC
            </span>
            <SliderSwitch
                on={publicForm}
                onColor="bg-green-600"
                offColor="bg-red-600"
                pinColor="bg-white"
                size="sm"
                onChange={()=>{
                    dispatchFormConfig({ type: 'edit_boolean', key: 'public', value: !publicForm })
                }}
            />
        </div>
    )
}
const PublicSwitch = memo(PublicSwitchComponent)
export default PublicSwitch

const styles = {
    openTag: (open: boolean) => [
        'w-16 font-bold transition-colors',
        open? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    ].join(' ')
}