import type { FormType, ResponseType } from "@prisma/client"
import EventConfig from "../eventconfig"
import type { EventConfigPosition, EventConfigRole, FormResponse, PrismaFieldConfig } from "@/server/typeconfig/form"
import type { FieldConfigProperty } from "./fieldconfig"
import FieldConfig from "./fieldconfig"

export type OptionalEventForm = {
    id?: string
    title?: string
    description?: string | null
    submitted_area?: string | null
    type?: FormType
    response_type?: ResponseType
    open?: boolean
    public?: boolean
    email_restricts?: string[]
    position_restricts?: EventConfigPosition[]
    role_restricts?: EventConfigRole[]
    global_position_access?: EventConfigPosition[]
    global_role_access?: EventConfigRole[]
    form_fields?: {
        [key: string]: PrismaFieldConfig
    }
    field_order?: string[]
}

export type FormConfigProperty = {
    id?: string
    title?: string
    description?: string | null
    submitted_area?: string | null
    type?: FormType
    response_type?: ResponseType
    open?: boolean
    public?: boolean
    email_restricts?: string[]
    position_restricts?: { id: string }[]
    role_restricts?: { id: string }[]
    global_position_access?: { id: string }[]
    global_role_access?: { id: string }[]
    form_fields?: {
        [key: string]: FieldConfigProperty
    }
    field_order?: string[]
}

export default class FormConfig{
    id?: string
    title?: string
    description?: string | null
    submitted_area?: string | null
    type?: FormType
    response_type?: ResponseType
    open?: boolean
    public?: boolean
    email_restricts?: string[]
    position_restricts?: { id: string }[]
    role_restricts?: { id: string }[]
    global_position_access?: { id: string }[]
    global_role_access?: { id: string }[]
    form_fields?: {
        [key: string]: FieldConfigProperty
    }
    field_order?: string[]

    constructor(formConfig: FormConfigProperty){
        this.id = formConfig.id
        this.title = formConfig.title
        this.description = formConfig.description
        this.submitted_area = formConfig.submitted_area
        this.type = formConfig.type
        this.response_type = formConfig.response_type
        this.open = formConfig.open
        this.public = formConfig.public
        this.email_restricts = formConfig.email_restricts
        this.position_restricts = formConfig.position_restricts
        this.role_restricts = formConfig.role_restricts
        this.global_position_access = formConfig.global_position_access
        this.global_role_access = formConfig.global_role_access
        this.form_fields = formConfig.form_fields ?? {}
        this.field_order = formConfig.field_order ?? []
    }

    static clone(formConfig: FormConfigProperty){
        const clonedFormConfig = {...formConfig}
        clonedFormConfig.email_restricts = [...formConfig.email_restricts??[]]
        clonedFormConfig.position_restricts = [...formConfig.position_restricts??[]]
        clonedFormConfig.role_restricts = [...formConfig.role_restricts??[]]
        clonedFormConfig.global_position_access = [...formConfig.global_position_access??[]]
        clonedFormConfig.global_role_access = [...formConfig.global_role_access??[]]
        clonedFormConfig.field_order = [...formConfig.field_order??[]] 
        if(clonedFormConfig.form_fields){
            for(const id of Object.keys(clonedFormConfig.form_fields ?? {})){
                if(!clonedFormConfig.form_fields[id]){
                    continue
                }
                clonedFormConfig.form_fields[id] = {
                    ...FieldConfig.clone(new FieldConfig(clonedFormConfig.form_fields[id]))
                }
            }
        }
        return new FormConfig(clonedFormConfig)
    }

    static defaultConfig(){
        return new FormConfig({
            title: 'Untitled Form',
            response_type: 'SINGLE',
            type: 'OTHER',
            open: true,
            public: false,
            email_restricts: [],
            position_restricts: [],
            role_restricts: [],
            global_position_access: [],
            global_role_access: [],
            description: '',
            submitted_area: 'Your response has been recorded.',
            form_fields: {},
            field_order: []
        })
    }

    static fromDatabase(prismaObject: OptionalEventForm){
        return new FormConfig({
            ...prismaObject,
            position_restricts: prismaObject.position_restricts?.map(({ id }) => ({ id: id ?? '' })) ?? [],
            role_restricts: prismaObject.role_restricts?.map(({ id }) => ({ id: id ?? '' })) ?? [],
            global_position_access: prismaObject.global_position_access?.map(({ id }) => ({ id: id ?? '' })) ?? [],
            global_role_access: prismaObject.global_role_access?.map(({ id }) => ({ id: id ?? '' })) ?? [],
            form_fields: Object.fromEntries(Object.entries(prismaObject.form_fields ?? {}).map(([id, field]) => (
                [id, {...FieldConfig.fromDatabase(field)}]
            )))
        })
    }

    getPublicConfig(){
        const publicConfig = new FormConfig({...this})
        publicConfig.email_restricts = undefined
        publicConfig.position_restricts = undefined
        publicConfig.role_restricts = undefined
        publicConfig.global_position_access = undefined
        publicConfig.global_role_access = undefined
        return publicConfig
    }

    getFormFieldsAsArray(){
        return this.field_order?.map((id) => {
            return this.form_fields?.[id] ?? null
        }) ?? []
    }

    validateFormFields(){
        if((new Set(this.field_order ?? [])).size !== (this.field_order ?? []).length){
            throw 'form fields contain duplicate ids'
        }
        for(const [id, field] of Object.entries(this.form_fields ?? {})){
            try{
                (new FieldConfig(field)).validate()
            } catch(e){
                throw { field_id: id, exception: e }
            }
        }
    }

    validateFormResponse(formResponse: FormResponse, eventConfig: EventConfig){
        const validatedResponse: FormResponse = {}
        for(const [id, field] of Object.entries(this.form_fields ?? {})){
            const fieldData = formResponse[id] ?? '' 
            if(!(new FieldConfig(field)).dataIsValid(fieldData, eventConfig)){
                throw `Invalid response "${fieldData}" at ${id}`
            }
            validatedResponse[id] = formResponse[id]
        }
        return validatedResponse
    }

    userCanAccess(user: { email: string, position_id: string | null, role_id: string | null }){
        if(this.email_restricts?.length == 0 && this.position_restricts?.length == 0 && this.role_restricts?.length == 0){
            return true
        }
        if(!this.position_restricts || !this.role_restricts){
            return false
        }
        for(const restrict of this.email_restricts ?? []){
            if(user.email.includes(restrict)){
                return true
            }
        }
        if(this.position_restricts.length != 0 && this.role_restricts.length == 0){
            if(this.position_restricts?.find((position) => position.id && position.id == user.position_id)){
                return true
            }
        }
        else if(this.position_restricts.length == 0 && this.role_restricts.length !=0){
            if(this.role_restricts?.find((role) => role.id && role.id == user.role_id)){
                return true
            }
        }
        else if(this.position_restricts.length > 0 && this.role_restricts.length > 0){
            if(this.position_restricts?.find((position) => position.id && position.id == user.position_id)
            && this.role_restricts?.find((role) => role.id && role.id == user.role_id)){
                return true
            }
        }
        return false
    }
}