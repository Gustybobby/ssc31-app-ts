import { getOptionStateFromSelection, stringifyGustybobbySelection } from "@/server/inputfunction"
import { GustybobbyOption } from "@/server/typeconfig/form"
import { type ChangeEvent, useEffect, useState } from "react"
import { type FieldColor, type FieldSize, inputStyles } from "../styles/tools"

interface InputFieldConfig {
    id: string
    label?: string | JSX.Element
    type: 'text' | 'textarea'
    placeholder?: string
    defaultValue?: string
    pattern: RegExp
    success?: string
    error?: string
    required: boolean
    size: FieldSize
    staticField?: boolean
    autoComplete?: 'on' | 'off'
    defaultInteract?: boolean
    onChange?: (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void
    customValid?: (input: string) => ({ valid: boolean, message: string })
}

export function InputField({ id, label, type, placeholder, defaultValue = '', pattern, success, error, required, size,
    staticField = false, autoComplete = 'on', defaultInteract = false, onChange, customValid
}: InputFieldConfig){

    const [input, setInput] = useState('')
    const [valid, setValid] = useState(false)
    const [interacted, setInteracted] = useState(defaultInteract)

    useEffect(() => {
        setInput(defaultValue)
    },[defaultValue])

    useEffect(() => {
        setInteracted(defaultInteract)
    },[defaultInteract])

    useEffect(() => {
        const value = (type === 'textarea')? input.replace('\n',' ') : input
        if(value === '' && required){
            setValid(false)
        } 
        else if(customValid){
            setValid(customValid(value).valid)
        } else {
            setValid(!!value.match(pattern))
        }
    },[input, type, required, pattern, customValid])

    function onChangeInput(e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        setInteracted(true)
        setInput(e.target.value)
        if(onChange){
            onChange(e)
        }
    }

    function InputType({ type }: { type: InputFieldConfig['type'] }){
        switch(type){
            case 'text':
                return(
                    <input 
                        type="text" 
                        id={id}
                        onChange={onChangeInput}
                        value={input}
                        className={inputStyles.inputBox(color, size)}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                    />
                )
            case 'textarea':
                return(
                    <textarea 
                        id={id}
                        onChange={onChangeInput}
                        value={input}
                        className={[inputStyles.inputBox(color, size), 'h-32'].join(' ')}
                        placeholder={placeholder}
                    />
                )
        }
    }

    const validationMessage = (validation: boolean, customValidMessage: string) => {
        if(input === '' && required){
            return 'This field is required.'
        }
        if(validation){
            return success
        }
        if(customValid && valid){
            return customValidMessage
        }
        return error
    }

    const { valid: customValidFlag, message: customValidMessage } = customValid? customValid(input) : { valid: true, message:'' }
    const validation = valid && customValidFlag
    const color = (!interacted || staticField)? 'default' : (validation? 'green' : 'red')

    return(
        <div>
            {label &&
            <label htmlFor={id} className={inputStyles.label(color, size)}>
                {label}
            </label>
            }
            {InputType({ type })}
            <p className={[inputStyles.p(color),interacted? '':'invisible'].join(' ')}>
                {validationMessage(validation, customValidMessage)}
            </p>
            <input id={`${id}_VALIDITY`} type="hidden" value={valid.toString()} readOnly={true}/>
            <input id={`${id}_INTERACTED`} type="hidden" value={interacted.toString()} readOnly={true}/>
        </div>
    )
}

interface SelectOptionsConfig {
    id: string,
    options: GustybobbyOption[],
    label?: string | JSX.Element,
    multiple: boolean,
    required: boolean
    size: FieldSize
    defaultChecked?: string
    defaultInteract: boolean
    onChange?: (e: ChangeEvent<HTMLInputElement>, optionState: { [key: string]: boolean }) => void
}

export function SelectOptions({ id, options, label, multiple, required, size,
    defaultChecked = '', defaultInteract, onChange,
}: SelectOptionsConfig){

    const [optionState, setOptionState] = useState<{ [key: string]: boolean }>({})
    const [interacted, setInteracted] = useState(defaultInteract)

    useEffect(() => {
        setOptionState(() => {
            const newOptionState: { [key: string]: boolean } = {}
            if(defaultChecked !== ''){
                const defaultCheckedState = getOptionStateFromSelection(defaultChecked)
                return { ...newOptionState, ...defaultCheckedState }
            }
            return newOptionState
        })
        setInteracted(true)
    },[defaultChecked])

    useEffect(() => {
        setInteracted(defaultInteract)
    },[defaultInteract])

    const selection = (): { valid: boolean, color: FieldColor } => {
        function checkAmountActive(){
            let count = 0
            Object.keys(optionState).forEach((id)=>{
                if(optionState[id]){
                    count++
                }
            })
            return count
        }
        if(checkAmountActive() == 0 && required){
            return { valid: false, color: interacted? 'red' : 'default' }
        }
        return { valid: true, color: interacted? 'green' : 'default' }
    }
    const { valid, color } = selection()

    return(
        <div>
            <h1 className={inputStyles.label(color, size)}>{label}</h1>
            {options.map((option)=>(
            <div key={option.id} className="px-2 my-2">
                <input type={multiple? 'checkbox' : 'radio'}
                    className="cursor-pointer"
                    onChange={(e)=>{
                        if(onChange){
                            onChange(e, {...optionState})
                        }
                        setOptionState(optionState => {
                            const newOptionState = {...optionState}
                            if(!multiple){
                                Object.keys(optionState).forEach((id)=>{
                                    newOptionState[id] = false
                                })
                            }
                            newOptionState[option.id] = !optionState[option.id] || !multiple
                            return newOptionState
                        })
                        setInteracted(true)
                    }}
                    id={`${id}_${option.id}`}
                    checked={optionState[option.id] || false}
                />
                <label htmlFor={`${id}_${option.id}`} className="ml-2 cursor-pointer">{option.label}</label>
            </div>
            ))}
            <p className={[inputStyles.p(color),(!interacted || valid)? 'invisible' : ''].join(' ')}>
                This field is required
            </p>
            <input id={`${id}`} type="hidden" value={stringifyGustybobbySelection(options, optionState)} readOnly={true}/>
            <input id={`${id}_VALIDITY`} type="hidden" value={valid.toString()} readOnly={true}/>
        </div>
    )
}