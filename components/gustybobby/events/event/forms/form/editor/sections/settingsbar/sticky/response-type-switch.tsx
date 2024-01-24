import { memo } from "react"
import { SliderSwitch } from "@/components/tools/switch"
import type { ResponseType } from "@prisma/client"
import type { DispatchFormConfig } from "../../../editor-types"

interface ResponseTypeSwitchProps extends DispatchFormConfig {
    responseType: ResponseType
}

function ResponseTypeSwitchComponent({ responseType, dispatchFormConfig }: ResponseTypeSwitchProps){
    return(
        <div className="flex justify-end items-center order-1 col-span-2 md:order-4 md:col-span-1">
            <span className={styles.openTag(responseType === 'MULTIPLE')}>
                Multiple Responses
            </span>
            <SliderSwitch 
                on={responseType === 'MULTIPLE'}
                onColor="bg-green-600"
                offColor="bg-red-600"
                pinColor="bg-white"
                size="sm"
                onChange={()=>{
                    const newResponseType = responseType === 'MULTIPLE'? 'SINGLE' : 'MULTIPLE'
                    dispatchFormConfig({ type: 'edit_response_type', value: newResponseType })
                }}
            />
        </div>
    )
}
const ResponseTypeSwitch = memo(ResponseTypeSwitchComponent)
export default ResponseTypeSwitch

const styles = {
    openTag: (open: boolean) => [
        'pr-2 font-bold transition-colors',
        open? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    ].join(' ')
}