import type { FormResponse } from "@/server/typeconfig/form";
import type { EventConfigProperty } from "../eventconfig";
import type { FieldConfigProperty } from "./fieldconfig";
import FieldVisibility from "./fieldvisibility";

export interface FormPaginationProperty {
    pagedFields: FieldConfigProperty[][]
    eventConfig: EventConfigProperty
    responses: FormResponse
    page: number
}

export default class FormPagination {
    pagedFields: FormPaginationProperty['pagedFields']
    eventConfig: FormPaginationProperty['eventConfig']
    responses: FormPaginationProperty['responses']
    page: FormPaginationProperty['page']

    constructor(formPagination: FormPaginationProperty){
        this.pagedFields = formPagination.pagedFields
        this.eventConfig = formPagination.eventConfig
        this.responses = formPagination.responses
        this.page = formPagination.page
    }

    static initialize({ field_order, form_fields, eventConfig, responses, page = 0
    }: {
        field_order: string[],
        form_fields: { [key: string]: FieldConfigProperty },
        eventConfig: EventConfigProperty,
        responses: FormResponse
        page?: number
    }){
        return new FormPagination({
            pagedFields: FormPagination.getPagedFields(field_order, form_fields),
            eventConfig,
            responses,
            page,
        })
    }

    static getPagedFields(fieldOrder: string[], formFields: { [key: string]: FieldConfigProperty }): FieldConfigProperty[][]{
        let triggerIds: string[] = []
        for(const id of fieldOrder){
            const fieldVisibility = FieldVisibility.fromString(formFields[id].visible_conds)
            triggerIds = triggerIds.concat(Object.keys(fieldVisibility.triggerFieldOptions ?? {}))
        }
        const triggerIdSet = new Set<string>(triggerIds)
        const newPagedFields: FieldConfigProperty[][] = []
        let lastIsTrigger = false
        for(const id of fieldOrder){
            if(triggerIdSet.has(id)){
                newPagedFields.push([formFields[id]])
                lastIsTrigger = true
            }
            else if(lastIsTrigger || newPagedFields.length === 0){
                newPagedFields.push([formFields[id]])
                lastIsTrigger = false
            } else {
                newPagedFields.at(-1)?.push(formFields[id])
            }
        }
        return newPagedFields
    }

    getCurrentPageFields(page?: number): FieldConfigProperty[]{
        const visibleFields: FieldConfigProperty[] = []
        for(const field of this.pagedFields[page ?? this.page]){
            if(FieldVisibility.fromString(field.visible_conds).isVisible(this.responses)){
                visibleFields.push(field)
            }
        }
        return visibleFields
    }

    getCleanFormResponses(){
        const cleanFormResponses: { [key: string]: string } = {}
        for(var i=0;i<this.pagedFields.length;i++){
            const visibleFields = this.getCurrentPageFields(i)
            for(const field of visibleFields){
                cleanFormResponses[field.id] = this.responses[field.id]
            }
        }
        return cleanFormResponses
    }
}