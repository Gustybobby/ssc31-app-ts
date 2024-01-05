import { SliderSwitch } from "@/components/tools/switch"
import { memo } from "react"
import type { DispatchFormConfig } from "../../../handlers/state-manager"

interface OpenSwitchProps extends DispatchFormConfig {
    open: boolean
}

function OpenSwitchComponent({ open, dispatchFormConfig }: OpenSwitchProps){
    return(
        <div className="flex justify-start items-center order-2 md:justify-center">
            <span className={styles.openTag(open)}>
                {open? <>ONLINE</> : <>OFFLINE</>}
            </span>
            <SliderSwitch
                on={open}
                onColor="bg-green-600"
                offColor="bg-red-600"
                pinColor="bg-white"
                size="sm"
                onChange={()=>{
                    dispatchFormConfig({ type: 'edit_boolean', key: 'open', value: !open })
                }}
            />
        </div>
    )
}
const OpenSwitch = memo(OpenSwitchComponent)
export default OpenSwitch

const styles = {
    openTag: (open: boolean) => [
        'w-16 font-bold transition-colors',
        open? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    ].join(' ')
}