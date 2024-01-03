import type{ PrismaClient } from "@prisma/client";
import { getPrismaFields, type PrismaFieldConfig } from "../typeconfig/form";
import { TableColumnConfig } from "../typeconfig/table";

interface PermittableForm {
    id: string
    title: string
    field_order: string[]
    form_fields: {
        [key: string]: PrismaFieldConfig
    }
    global_position_access: { id: string }[]
    global_role_access: { id: string }[]
}

export async function getAllPermittedFields(
    prisma: PrismaClient,
    whereParams: { [key: string]: any } | undefined,
    {
        event_id,
        position_id,
        role_id,
        default_active
    }: {
        event_id: string,
        position_id: string,
        role_id: string,
        default_active: boolean
    },
    target_form_id: string | null,
    additional_fields?: {
        [key: string]: {
            [key: string]: PrismaFieldConfig
        }
    },
){
    const admin = position_id === 'ADMIN' && role_id === 'ADMIN'
    const allForms: PermittableForm[] = (await prisma.eventForm.findMany({
        where:{
            ...whereParams,
            event_id: event_id
        },
        select:{
            id: true,
            title: true,
            field_order: true,
            form_fields: true,
            global_position_access: {
                select:{
                    id: true,
                },
            },
            global_role_access: {
                select:{
                    id: true,
                },
            },
        },
    })).map((form) => ({ ...form, form_fields: getPrismaFields(form.form_fields)}))
    const columnGroup: {
        [key: string]: {
            [key: string]: TableColumnConfig
        }
    } = {}
    const formInfo: { [key: string]: { title: string } } = {}
    for(const form of allForms){
        const permittedFormFields = getPermittedFormFields({
            form,
            admin,
            position_id,
            role_id,
            default_active,
            additional_fields,
            target_form_id
        })
        columnGroup[form.id] = permittedFormFields
        if(Object.keys(permittedFormFields).length === 0){
            continue
        }
        formInfo[form.id] = { title: form.title }
    }
    return [columnGroup, formInfo]
}

function getPermittedFormFields({
    form,
    admin,
    position_id,
    role_id,
    default_active,
    additional_fields,
    target_form_id,
}: {
    form: PermittableForm,
    admin: boolean,
    position_id: string,
    role_id: string,
    default_active: boolean,
    additional_fields?: {
        [key: string]: {
            [key: string]: PrismaFieldConfig
        }
    },
    target_form_id: string | null
}): { [key: string]: TableColumnConfig }{
    const formFields: { [key: string]: TableColumnConfig } = {}
    const globalPositionAccess = form.global_position_access.map((position) => position.id).includes(position_id)
    const globalRoleAccess = form.global_role_access.map((role) => role.id).includes(role_id)
    const hasGlobalAccess = admin || (globalPositionAccess && globalRoleAccess)
    form.field_order.forEach((id, index) => {
        const field = form.form_fields[id]
        if(!hasGlobalAccess && !(field.position_access.includes(position_id) && field.role_access.includes(role_id))){
            return
        }
        const isTargetForm = !target_form_id || form.id === target_form_id
        const isNotTargetForm = !!(target_form_id && form.id !== target_form_id)
        const isAdditionalColumn = !!additional_fields?.[form.id][id]
        if(isTargetForm || (isNotTargetForm && isAdditionalColumn)){
            formFields[id] = {
                id: id,
                order: index,
                label: field.label,
                data_type: field.data_type,
                field_type: field.field_type,
                options: field.options,
                form_id: form.id,
                active: default_active ?? false,
            }
        }
        if(isAdditionalColumn){
            formFields[id].active = true
        }
    })
    return formFields
}