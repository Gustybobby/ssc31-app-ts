import type { PrismaFieldConfig } from "@/server/typeconfig/form"
import type { ResponseType } from "@prisma/client"

export interface FormWithRowList {
    id: string
    response_type: ResponseType
    global_position_access: { id: string }[]
    global_role_access: { id: string }[]
    field_order: string[]
    form_fields: {
        [key: string]: PrismaFieldConfig
    }
    row_list: {
        id: string
        response: {
            [key: string]: string
        }
        created_at: Date | null
        updated_at: Date | null
        member_id: string | null
    }[]
}

export default class EventFormRowData {
    id: string
    global_position_access_ids: string[]
    global_role_access_ids: string[]
    field_order: string[]
    form_fields: FormWithRowList['form_fields']
    row_list: FormWithRowList['row_list']

    constructor({
        id,
        global_position_access,
        global_role_access,
        field_order,
        form_fields,
        row_list,
    }: FormWithRowList){
        this.id = id
        this.global_position_access_ids = global_position_access.map((position) => position.id)
        this.global_role_access_ids = global_role_access.map(position => position.id)
        this.field_order = field_order,
        this.form_fields = form_fields,
        this.row_list = row_list
    }

    getRowListAsTableDataRowsObject(unique_key: 'id' | 'member_id', ghosted: boolean = false){
        const rowsObject: { [key: string ]: { [key:string]: any }} = {}
        for(const row of this.row_list){
            const allDataObject = row.response
            const dataObject = {
                id: row.id,
                member_id: row.member_id,
                [`${this.id}>>created_at`]: row.created_at,
                [`${this.id}>>updated_at`]: row.updated_at,
                form_id: this.id
            }
            for(const field_id of this.field_order){
                dataObject[`${this.id}>>${field_id}`] = (allDataObject[field_id] ?? '') + (ghosted? '>>GHOSTED' : '')
            }
            rowsObject[row[unique_key] ?? ''] = dataObject
        }
        return rowsObject
    }

    hasAllColumnsAccess(position_id: string, role_id: string){
        if(this.hasGlobalAccess(position_id, role_id)){
            return true
        }
        for(const field_id of this.field_order){
            let hasAccess = false
            if(this.form_fields[field_id].position_access.includes(position_id)){
                hasAccess = true
            }
            if(this.form_fields[field_id].role_access.includes(role_id)){
                hasAccess = true
            }
            if(!hasAccess){
                return false
            }
        }
        return true
    }

    hasGlobalAccess(position_id: string, role_id: string){
        if(position_id === "ADMIN" && role_id === "ADMIN"){
            return true
        }
        if(this.global_position_access_ids.includes(position_id)){
            return true
        }
        if(this.global_role_access_ids.includes(role_id)){
            return true
        }
        return false
    }
}