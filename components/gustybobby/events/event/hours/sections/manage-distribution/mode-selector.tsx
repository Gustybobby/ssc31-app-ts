import { ListBoxSingleSelect } from "@/components/tools/list-box"
import { distributionModes, type DistributionMode } from "@/server/modules/hours-modules"
import type { Dispatch, SetStateAction } from "react"

export default function ModeSelector({ mode, setMode }: {
    mode: DistributionMode,
    setMode: Dispatch<SetStateAction<DistributionMode>>
}){
    return (
        <div>
            <h1 className="text-lg font-bold">Mode</h1>
            <ListBoxSingleSelect
                list={distributionModes.map((option, index) => ({
                    ...option,
                    index,
                    active: option.id === mode
                }))}
                setList={(list) => {
                    const selectedMode = list.find((item) => item.active).id
                    setMode(selectedMode)
                }}
                width="w-36"
                maxHeight=""
            />
        </div>
    )
}