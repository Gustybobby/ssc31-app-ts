import type { FormResponse, GustybobbyOption } from "@/server/typeconfig/form"
import type { EventConfigProperty } from "../eventconfig"
import FieldConfig from "./fieldconfig"
import type { FormConfigProperty } from "./formconfig"
import { getOptionStateFromSelection } from "@/server/inputfunction"

interface OptionFieldAnalytic {
    id: string,
    label: string,
    field_type: 'OPTIONS' | 'MULTISELECT'
    options: string[]
    optionFreqs: { [key: string]: number }
    mode: string[]
}

interface NumberOptionFieldAnalytic extends OptionFieldAnalytic {
    data_type: 'NUM'
    sd: number
    mean: number
}

type FieldAnalytic =
    OptionFieldAnalytic |
    NumberOptionFieldAnalytic

export interface DataAnalyticProperty {
    analyzedFields: FieldAnalytic[]
}

export default class DataAnalytic {
    analyzedFields: DataAnalyticProperty['analyzedFields']

    constructor(dataAnalytic: DataAnalyticProperty){
        this.analyzedFields = dataAnalytic.analyzedFields
    }

    static analyzeFormResponses(formConfig: FormConfigProperty, eventConfig: EventConfigProperty, responses: FormResponse[]){
        const analyzedFields: DataAnalyticProperty['analyzedFields'] = []
        for(const field_id of formConfig.field_order ?? []){
            const field = formConfig.form_fields?.[field_id]
            switch(field?.data_type){
                case 'NUM':
                    switch(field?.field_type){
                        case 'OPTIONS':
                        case 'MULTISELECT':
                            const fieldOptions = (new FieldConfig(field)).getOptionsByDataType(eventConfig, false)
                            const optionFreqs = DataAnalytic.getFieldOptionFreqs(responses, field_id, fieldOptions)
                            analyzedFields.push({
                                id: field_id,
                                label: field.label,
                                data_type: field.data_type,
                                field_type: field.field_type,
                                options: fieldOptions.map(({ label }) => label),
                                optionFreqs,
                                mean: DataAnalytic.getOptionFreqsMean(optionFreqs),
                                mode: DataAnalytic.getOptionFreqsMode(optionFreqs),
                                sd: DataAnalytic.getOptionFreqsSD(optionFreqs),
                            })
                            break
                        default:
                            continue
                    }
                    break
                case 'STRING':
                case 'POSITION':
                case 'ROLE':
                    switch(field?.field_type){
                        case 'OPTIONS':
                        case 'MULTISELECT':
                            const fieldOptions = (new FieldConfig(field)).getOptionsByDataType(eventConfig, false)
                            const optionFreqs = DataAnalytic.getFieldOptionFreqs(responses, field_id, fieldOptions)
                            analyzedFields.push({
                                id: field_id,
                                label: field.label,
                                field_type: field.field_type,
                                options: fieldOptions.map(({ label }) => label),
                                optionFreqs,
                                mode: DataAnalytic.getOptionFreqsMode(optionFreqs),
                            })
                            break
                        default:
                    }
                    break
                default:
                    continue
            }
        }
        return new DataAnalytic({ analyzedFields })
    }

    static getFieldOptionFreqs(responses: FormResponse[], field_id: string, fieldOptions: GustybobbyOption[]){
        const optionFreqs: { [key: string]: number } = {}
        for(const response of responses){
            const optionState = getOptionStateFromSelection(response[field_id] ?? '')
            for(const option_id of Object.keys(optionState)){
                const optionLabel = fieldOptions.find(({ id }) => id === option_id)?.label ?? ''
                optionFreqs[optionLabel] = optionFreqs[optionLabel] ?? 0
                optionFreqs[optionLabel] ++
            }
        }
        return optionFreqs
    }

    static getOptionFreqsTotal(optionFreqs: { [key: string]: number }){
        let sum = 0
        for(const amount of Object.values(optionFreqs)){
            sum += amount
        }
        return sum
    }

    static getOptionFreqsMean(optionFreqs: { [key: string]: number }){
        const total = DataAnalytic.getOptionFreqsTotal(optionFreqs)
        let optionSum = 0
        for(const [option, freq] of Object.entries(optionFreqs)){
            optionSum += Number(option) * freq
        }
        return optionSum/total
    }

    static getOptionFreqsMode(optionFreqs: { [key: string]: number }){
        const min = Math.min(...Object.values(optionFreqs))
        return Object.keys(optionFreqs).filter((option) => optionFreqs[option] === min)
    }

    static getOptionFreqsSD(optionFreqs: { [key: string]: number }){
        const mean = DataAnalytic.getOptionFreqsMean(optionFreqs)
        const total = DataAnalytic.getOptionFreqsTotal(optionFreqs)
        let variance = 0
        for(const [option, freq] of Object.entries(optionFreqs)){
            variance += freq*Math.pow((Number(option) - mean), 2)/total
        }
        return Math.sqrt(variance)
    }
}