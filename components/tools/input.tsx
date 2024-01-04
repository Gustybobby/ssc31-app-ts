import { stringifyGustybobbySelection } from "@/server/inputfunction"
import { GustybobbyOption } from "@/server/typeconfig/form"
import { type ChangeEvent, useEffect, useState } from "react"
import { textColorClassVariants } from "../styles/class-variants"

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
        } else{
            setValid(!!value.match(pattern))
        }
    },[input, required, pattern])

    function onChangeInput(e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        setInteracted(true)
        setInput(e.target.value)
        if(onChange){
            onChange(e)
        }
    }

    function InputType(type: InputFieldConfig['type']){
        switch(type){
            case 'text':
                return(
                    <input 
                        type="text" 
                        id={id}
                        onChange={onChangeInput}
                        value={input}
                        className={styles.inputBox(color, size)}
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
                        className={[styles.inputBox(color, size), 'h-32'].join(' ')}
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

    const { valid: customValidFlag, message: customValidMessage } = customValid? customValid(id) : { valid: true, message:'' }
    const validation = valid && customValidFlag
    const color = (!interacted || staticField)? 'default' : (validation? 'green' : 'red')

    return(
        <div>
            {label &&
            <label htmlFor={id} className={styles.label(color, size)}>
                {label}
            </label>
            }
            {InputType(type)}
            <p className={[styles.p(color),interacted? '':'invisible'].join(' ')}>
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
        setOptionState(optionState => {
            const newOptionState = {...optionState}
            if(defaultChecked !== ''){
                for(const option of defaultChecked.split('|')){
                    const optionId = option.split(':')[0]
                    newOptionState[optionId] = true
                }
            } else{
                options.forEach((option) => { newOptionState[option.id] = optionState[option.id] ?? false })
            }
            return newOptionState
        })
        setInteracted(true)
    },[options, defaultChecked])

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
        if(!interacted){
            return { valid: !required, color: 'default' }
        }
        if(checkAmountActive() == 0 && required){
            return { valid: false, color: 'red' }
        }
        return { valid: true, color: 'green' }
    }

    const { valid, color } = selection()
    
    return(
        <div>
            <h1 className={styles.label(color, size)}>{label}</h1>
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
            <p className={[styles.p(color),(!interacted || valid)? 'invisible' : ''].join(' ')}>
                This field is required
            </p>
            <input id={`${id}`} type="hidden" value={stringifyGustybobbySelection(options, optionState)} readOnly={true}/>
            <input id={`${id}_VALIDITY`} type="hidden" value={valid.toString()} readOnly={true}/>
        </div>
    )
}

type FieldColor = 'green' | 'red' | 'default'
type FieldSize = 'sm' | 'md' | 'lg'

export const styles = {
    label: (color: FieldColor,size: FieldSize) => [
        'block mb-2',
        'font-bold',
        'transition-colors',
        sizeVariants[size].label,
        colorVariants[color].text,
    ].join(' '),
    inputBox: (color: FieldColor,size: FieldSize) => [
        'w-full block',
        sizeVariants[size].padding,
        'rounded-lg shadow-lg',
        'transition-colors bg-transparent border-2',
        'focus:outline-none focus:ring-0',
        colorVariants[color].inputBox
    ].join(' '),
    p: (color: FieldColor) => [
        'mt-2 text-sm transition-colors',
        colorVariants[color].text
    ].join(' ')
}

const sizeVariants = {
    'lg': {
        label: 'text-xl',
        padding: 'p-2.5'
    },
    'md': {
        label: 'text-lg',
        padding: 'p-2',
    },
    'sm': {
        label: 'text-sm',
        padding: 'p-1',
    }
}

const colorVariants = {
    green:{
        text: textColorClassVariants.green,
        inputBox: [
            'border-green-400',
            textColorClassVariants.green,
            'placeholder-gray-400',
            'focus:ring-green-500 focus:border-green-500'
        ].join(' ')
    },
    red:{
        text: textColorClassVariants.red,
        inputBox: [
            'border-red-400',
            textColorClassVariants.red,
            'placeholder-gray-400',
            'focus:ring-red-500 focus:border-red-500'
        ].join(' ')
    },
    default:{
        text: textColorClassVariants.default,
        inputBox: [
            'border-gray-400',
            textColorClassVariants.default,
            'placeholder-gray-400',
            'focus:ring-gray-500 focus:border-gray-500'
        ].join(' ')
    }
}