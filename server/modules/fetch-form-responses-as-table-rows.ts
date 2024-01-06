import type { PrismaClient } from "@prisma/client"
import type { FormWithRowList } from "../classes/forms/eventformrowdata"
import EventFormRowData from "../classes/forms/eventformrowdata"
import { getPrismaFields } from "../typeconfig/form"

export default async function fetchFormResponsesAsTableDataRows(
    prisma: PrismaClient,
    { api_code, position_id, role_id }: { api_code: string, position_id: string, role_id: string },
    target_form_id: string | null,
){
    const allQueries = formQuries(api_code)
    const formIds = allQueries.map((query) => ({ id: query.form_id }))
    const allForms: FormWithRowList[] = (await prisma.eventForm.findMany({
        where:{
            OR: formIds
        },
        select:{
            id: true,
            response_type: true,
            global_position_access: { select:{ id: true } },
            global_role_access: { select:{ id: true } },
            field_order: true,
            form_fields: true,
            row_list: {
                select:{
                    id: true,
                    response: true,
                    created_at: true,
                    updated_at: true,
                    member_id: true,
                },
                orderBy:{
                    created_at: 'desc',
                }
            },
        }
    })).map((form) => {
        const safeFormFields = getPrismaFields(form.form_fields)
        return ({
            ...form,
            form_fields: safeFormFields,
            row_list: form.row_list.map((row) => {
                const safeResponse = row.response as { [key: string]: string }
                return ({ ...row, response: safeResponse })
            })
        })
    })
    const formResponses = compileFormResponses(allQueries, allForms, position_id, role_id, target_form_id)
    return formResponses
}

type FormQuery = {
    form_id: string
    orders: undefined
} | {
    form_id: string
    orders: Set<number>
}

const formQuries = (api_code: string): FormQuery[] => api_code.split('--').map((form_code) => {
    const [form_id,order_string] = form_code.split('_')
    if(order_string === 'all'){
        return { form_id: form_id, orders: undefined }
    }
    const orders = order_string.split('o').map((order) => Number(order))
    return { form_id: form_id, orders: new Set(orders) }
})

function compileFormResponses(
    allQueries: FormQuery[],
    allForms: FormWithRowList[],
    position_id: string,
    role_id: string,
    target_form_id: string | null
){
    let formRows: {
        [key: string]: {
            [key: string]: any
        }
    } = {}
    let prevRelationObject: {
        [key: string]: {
            [key: string]: any
        }
    } | null = null
    for(const { form_id, orders } of allQueries){
        const formData = allForms.find((form) => form.id === form_id)
        if(!formData){
            continue
        }
        if(orders !== undefined){
            formData.field_order = formData.field_order.filter((id,index) => orders.has(index))
        }
        const eventFormData = new EventFormRowData({ ...formData, id: form_id })
        if(eventFormData.hasAllColumnsAccess(position_id, role_id)){
            const rowsObject = eventFormData.getRowListAsTableDataRowsObject('id')
            formRows = { ...formRows, ...rowsObject }
            if(prevRelationObject){
                MapOneToManyRelation(prevRelationObject, formRows)
                prevRelationObject = null
            }
            if(formData.response_type === "SINGLE"){
                prevRelationObject = eventFormData.getRowListAsTableDataRowsObject('member_id',true)
            }
        } else{
            throw "UNAUTHORIZED"
        }
    }
    if(prevRelationObject){
        MapOneToManyRelation(prevRelationObject, formRows)
    }
    if(target_form_id){
        formRows = Object.fromEntries(Object.entries(formRows).filter(([res_id, res]) => res.form_id === target_form_id))
    }
    return formRows
}

function MapOneToManyRelation(relationObject: { [key: string]: { [key: string]: any } }, formData: { [key: string]: { [key: string]: any } }){
    for(const [key, entry] of Object.entries(formData)){
        const relatedObject = relationObject[entry.member_id]
        if(entry.member_id !== null && relatedObject && entry.id !== relatedObject?.id){
            const { id, form_id, ...restOfRows } = relatedObject
            formData[key] = { ...entry, ...restOfRows }
        }
    }
    return formData
}