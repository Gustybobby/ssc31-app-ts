import type { FormType, ResponseType } from "@prisma/client"
import EventConfig from "../eventconfig"
import { setConnections } from "@/server/set"
import type { EventConfigPosition, EventConfigRole, FormResponse, PrismaFieldConfig } from "@/server/typeconfig/form"
import type { FieldConfigProperty } from "./fieldconfig"
import FieldConfig from "./fieldconfig"

type OptionalEventForm = {
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

type FormConfigProperty = {
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
    } | 'NO_CHANGE'
    field_order?: string[] | 'NO_CHANGE'
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
    } | 'NO_CHANGE'
    field_order?: string[] | 'NO_CHANGE'

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
        clonedFormConfig.field_order = formConfig.field_order === 'NO_CHANGE'? 'NO_CHANGE' : [...formConfig.field_order??[]] 
        if(clonedFormConfig.form_fields && clonedFormConfig.form_fields !== 'NO_CHANGE'){
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
        if(this.field_order === 'NO_CHANGE'){
            return []
        }
        return this.field_order?.map((id) => {
            if(this.form_fields === 'NO_CHANGE'){
                return null
            }
            return this.form_fields?.[id] ?? null
        }) ?? []
    }

    setFieldsNoChange(){
        this.form_fields = 'NO_CHANGE'
    }

    validateFormFields(){
        if(this.field_order !== 'NO_CHANGE' && (new Set(this.field_order ?? [])).size !== (this.field_order ?? []).length){
            throw 'form fields contain duplicate ids'
        }
        if(this.form_fields !== 'NO_CHANGE'){
            for(const [id, field] of Object.entries(this.form_fields ?? {})){
                try{
                    (new FieldConfig(field)).validate()
                } catch(e){
                    throw { field_id: id, exception: e }
                }
            }
        }
    }

    validateFormResponse(formResponse: FormResponse, eventConfig: EventConfig){
        const validatedResponse: FormResponse = {}
        if(this.form_fields === 'NO_CHANGE'){
            return
        }
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

    getPackedRequest(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            submitted_area: this.submitted_area,
            type: this.type,
            response_type: this.response_type,
            open: this.open,
            public: this.public,
            email_restricts: this.email_restricts,
            position_restricts: this.position_restricts,
            role_restricts: this.role_restricts,
            global_position_access: this.global_position_access,
            global_role_access: this.global_role_access,
            field_order: this.field_order,
            form_fields: this.form_fields === 'NO_CHANGE'? 'NO_CHANGE' : 
                Object.fromEntries(Object.entries(this.form_fields ?? {}).map(([id, field]) => (
                    [id, (new FieldConfig(field)).getPackedRequest()]
                )))
        }
    }

    updateWithInstructions(data: FormConfigProperty, instructions?: { [key: string]: 'DELETE' }){
        const { field_order, form_fields, ...otherProps } = data
        if(field_order !== 'NO_CHANGE'){
            this.field_order = field_order
        }
        if(this.form_fields && this.form_fields !== 'NO_CHANGE'){
            if(form_fields !== 'NO_CHANGE'){
                this.form_fields = { ...this.form_fields, ...form_fields }
            }
            for(const [id, code] of Object.entries(instructions ?? {})){
                if(code === 'DELETE'){
                    delete this.form_fields[id]
                }
            }
        }
        this.title = otherProps.title
        this.description = otherProps.description
        this.submitted_area = otherProps.submitted_area
        this.type = otherProps.type
        this.response_type = otherProps.response_type
        this.open = otherProps.open
        this.public = otherProps.public
        this.email_restricts = otherProps.email_restricts
        this.position_restricts = otherProps.position_restricts
        this.role_restricts = otherProps.role_restricts
        this.global_position_access = otherProps.global_position_access
        this.global_role_access = otherProps.global_role_access
    }

    getAsPrismaCreateQuery(event_id: string){
        return this.getAsPrismaQuery(event_id, 'connect')
    }

    getAsPrismaUpdateQuery(){
        return this.getAsPrismaQuery(undefined, 'set')
    }

    getAsPrismaQuery(event_id: string | undefined, key: string){
        return {
            title: this.title ?? undefined,
            description: this.description ?? undefined,
            submitted_area: this.submitted_area ?? undefined,
            type: this.type ?? undefined,
            response_type: this.response_type ?? undefined,
            open: this.open ?? undefined,
            public: this.public ?? undefined,
            email_restricts: this.email_restricts ?? undefined,
            position_restricts: setConnections(key, this.position_restricts),
            role_restricts: setConnections(key, this.role_restricts),
            global_position_access: setConnections(key, this.global_position_access),
            global_role_access: setConnections(key, this.global_role_access),
            event_id: event_id,
            form_fields: this.form_fields === 'NO_CHANGE'? undefined : this.form_fields,
            field_order: this.field_order === 'NO_CHANGE'? undefined : this.field_order,
        }
    }
}