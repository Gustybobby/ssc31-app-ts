import type { EventPosition, EventRole, Prisma, ResponseType } from "@prisma/client";
import type { EventConfigProperty } from "../classes/eventconfig";
import Link from "next/link";
import type ContentConfig from "../classes/forms/contentconfig";

export type EventConfigPosition = {
    [key in keyof EventPosition]?: EventPosition[key]
}

export type EventConfigRole = {
    [key in keyof EventRole]?: EventRole[key]
}

export type GustybobbyOption = {
    id: string
    label: string
    index: number
    active: boolean
}

export const formTypes = {
    JOIN: { 
        id:'JOIN',
        label:'Join',
        force: {
            public: true,
            response_type: 'SINGLE' as ResponseType,
            position_restricts: [] as { id: string }[],
            role_restricts: [] as { id: string }[],
        }
    },
    EVALUATE: {
        id:'EVALUATE',
        label:'Evaluate',
        force: null
    },
    OTHER: {
        id:'OTHER',
        label:'Others',
        force: null,
    },
}

export type DataType = keyof typeof dataTypes

export const dataTypes = {
    STRING: {
        id: 'STRING',
        label: 'Text',
        options: null,
        pattern: '[\u0E00-\u0E7F\\w\\s\.\,\'\(\)\-]',
        error: 'ก-ฮ,A-Z\',a-z,0-9,().',
        force: null,
        specialValid: null,
    },
    NUM: {
        id: 'NUM',
        label: 'Number',
        options: null,
        pattern: '[0-9]',
        error: '0-9',
        force: null,
        specialValid: (string: string, contentConfig?: ContentConfig) => {
            const num = Number(string)
            return !isNaN(num) && (num >= (contentConfig?.min_length ?? 0)) && (num <= (contentConfig?.max_length ?? 0))
        },
    },
    NUM_STRING: {
        id: 'NUM_STRING',
        label: 'Number Text',
        options: null,
        pattern: '[0-9]',
        error: '0-9',
        force: null,
        specialValid: null,
    },
    BOOLEAN: {
        id: 'BOOLEAN',
        label: 'Yes/No',
        pattern: '',
        error: '',
        options: () => [
            { id: "true", label: "Yes", open: true },
            { id: "false", label: "No", open: true },
        ],
        force: null,
        specialValid: null,
    },
    POSITION: {
        id: 'POSITION',
        label: 'Position',
        pattern: '',
        error: '',
        force: 'OPTIONS' as FieldType,
        options: (config: EventConfigProperty) => config.positions.map((position) => ({
            id: position.id, label: position.label, open: position.open
        })),
        specialValid: null,
    },
    ROLE: {
        id: 'ROLE',
        label: 'Role',
        pattern: '',
        error: '',
        force: 'OPTIONS' as FieldType,
        options: (config: EventConfigProperty) => config.roles.map((role) => ({
            id: role.id, label: role.label, open: true
        })),
        specialValid: null,
    },
    ACT_HOURS: {
        id: 'ACT_HOURS',
        label: 'Activity Hrs',
        pattern: '',
        error: '',
        options: null,
        force: 'ACT_HOURS' as FieldType,
        specialValid: (string: string) => {
            const [hours, date] = string.split('><')
            return hours !== null && !isNaN(Number(hours)) && new Date(date).toString() !== 'Invalid Date'
        }
    },
    HOURS_SEMS: {
        id: 'HOURS_SEMS',
        label: 'Scholarship Hrs',
        pattern: '',
        error: '',
        options: null,
        force: 'HOURS_SEMS' as FieldType,
        specialValid: null,
    }
}

export type FieldType = keyof typeof fieldTypes

export const fieldTypes = {
    SHORTANS: {
        id: 'SHORTANS',
        label: 'Short Answer',
        max_length: '64',
        allowed: [
            'STRING',
            'NUM',
            'NUM_STRING',
        ],
        input_field: 'input',
        user_field_tail: 'INPUTFIELD',
        fixed_label: null,
        short_label: undefined
    },
    PARAGRAPH: {
        id: 'PARAGRAPH',
        label: 'Paragraph',
        max_length: '2048',
        allowed: [
            'STRING'
        ],
        input_field: 'textarea',
        user_field_tail: 'INPUTFIELD',
        fixed_label: null,
        short_label: undefined
    },
    OPTIONS: {
        id: 'OPTIONS',
        label: 'Options',
        max_length: '32',
        allowed:[
            'STRING',
            'NUM',
            'NUM_STRING',
            'BOOLEAN',
            'POSITION',
            'ROLE'
        ],
        input_field: 'singleselect',
        user_field_tail: 'SELECTOPTIONS',
        fixed_label: null,
        short_label: undefined
    },
    MULTISELECT: {
        id: 'MULTISELECT',
        label: 'Multi-Select',
        max_length: '32',
        allowed: [
            'STRING',
            'NUM',
            'NUM_STRING',
        ],
        input_field: 'multiselect',
        user_field_tail: 'SELECTOPTIONS',
        fixed_label: null,
        short_label: undefined
    },
    PRIVACYPOLICY: {
        id: 'PRIVACYPOLICY',
        label: 'PDPA',
        allowed: [
            'BOOLEAN'
        ],
        input_field: 'singleselect',
        user_field_tail: 'SELECTOPTIONS',
        fixed_label: (
            <>
                Do you agree to our {' '}
                <Link href="/privacy-policy" target="_blank" 
                    className="text-center text-blue-600 dark:text-blue-500 underline underline-offset-2">
                    Privacy Policy
                </Link>
                ?
            </>
        ),
        short_label: 'Accept Privacy Policy'
    },
    INFO: {
        id: 'INFO',
        label: 'Info',
        allowed: [
            'STRING'
        ],
        user_field_tail: '',
        fixed_label: null,
        short_label: undefined
    },
    ACT_HOURS: {
        id: 'ACT_HOURS',
        label: 'Activity Hrs',
        allowed: [
            'ACT_HOURS'
        ],
        user_field_tail: 'ACTHOURS',
        fixed_label: null,
        short_label: undefined
    },
    HOURS_SEMS: {
        id: 'HOURS_SEMS',
        label: 'Scholarship Hrs',
        allowed: [
            'HOURS_SEMS'
        ],
        user_field_tail: 'HOURSSEMS',
        fixed_label: null,
        short_label: undefined
    }
}

export const typePermission = {
    dataType: {
        allowCustomLength: new Set<DataType>(['STRING','NUM','NUM_STRING']),
        allowCustomOptions: new Set<DataType>(['STRING','NUM','NUM_STRING']),
    },
    fieldType: {
        allowCustomLength: new Set<FieldType>(['SHORTANS','PARAGRAPH']),
        allowCustomHelper: new Set<FieldType>(['SHORTANS','PARAGRAPH']),
        optionsLikeField: new Set<FieldType>(['OPTIONS','MULTISELECT','PRIVACYPOLICY']),
        disableAccessMod: new Set<FieldType>(['INFO']),
        disableRequired: new Set<FieldType>(['INFO']),
    }
}

export type PrismaFieldConfig = {
    id: string
    label: string
    options: GustybobbyOption[]
    required: boolean
    data_type: DataType
    field_type: FieldType
    success: string
    error: string
    placeholder: string
    default_value: string
    max_length: number
    min_length: number
    position_access: string[]
    role_access: string[]
    visible_conds: string
}

export type FormResponse = {
    [key: string]: string
}

export function getPrismaFields(form_fields: Prisma.JsonValue){
    const safeFormFields: { [key: string ]: PrismaFieldConfig } = {}
    for(const [id, config] of Object.entries(form_fields?? {})){
        const prismaFieldConfig: PrismaFieldConfig = {
            id: config.id,
            label: config.label,
            options: config.options,
            required: config.required,
            data_type: config.data_type,
            field_type: config.field_type,
            success: config.success,
            error: config.error,
            placeholder: config.placeholder,
            default_value: config.default_value,
            max_length: config.max_length,
            min_length: config.min_length,
            position_access: config.position_access,
            role_access: config.role_access,
            visible_conds: config.visible_conds,
        }
        safeFormFields[id] = prismaFieldConfig
    }
    return safeFormFields
}