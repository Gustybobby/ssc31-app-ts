import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/editor-types"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import type ContentConfig from "@/server/classes/forms/contentconfig"
import type { ContentConfigProperty } from "@/server/classes/forms/contentconfig"
import type { FieldType } from "@prisma/client"

export interface ContentFieldProps {
    contentConfig: ContentConfigProperty
    eventConfig?: EventConfigProperty 
    defaultInteract: boolean
    editor: boolean
}

export interface ContentFieldComponentProps {
    contentConfig: ContentConfig
    eventConfig?: EventConfigProperty
    defaultInteract: boolean
    editor: boolean
}

export interface EditorContentFieldProps extends DispatchFormConfig{
    contentConfig: ContentConfigProperty
}

export interface EditorContentFieldComponentProps extends DispatchFormConfig{
    contentConfig: ContentConfig
}

export type ContentFieldsType = {
    [key in FieldType]: ({ contentConfig, eventConfig, defaultInteract, editor }: ContentFieldComponentProps) => JSX.Element
}

export type EditorContentFieldsType = {
    [key in FieldType]: ({ contentConfig, dispatchFormConfig }: EditorContentFieldComponentProps) => JSX.Element
}