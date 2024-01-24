"use client"

import type { EventConfigProperty } from "@/server/classes/eventconfig"
import { Card } from "../../card"
import ContentField from "../sections/field-content/user-content-fields-map"
import { type Dispatch, type SetStateAction, memo } from "react"
import { ZoomIn } from "../../transition"
import { typePermission } from "@/server/typeconfig/form"
import FieldDataAccessListBox from "../sections/editor/field-data-access-list-box"
import FieldDeleteButton from "../sections/editor/field-delete-button"
import EditorContentField from "../sections/field-content/editor-content-fields-map"
import FieldSwapButtons from "../sections/editor/field-swap-buttons"
import FieldGeneralConfigs from "../sections/editor/field-configs/field-general-configs"
import FieldValidationConfigs from "../sections/editor/field-configs/field-validation-configs"
import FieldOptionsConfigs from "../sections/editor/field-configs/field-options-configs"
import FieldLengthConfigs from "../sections/editor/field-configs/field-length-configs"
import FieldVisibilityConditions from "../sections/editor/field-visibility-conditions"
import type { EditorFieldConfigProperty } from "@/components/gustybobby/events/event/forms/form/editor/hooks/form-config-reducer"
import { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/editor-types"

interface EditorFieldCardProps extends DispatchFormConfig {
    fieldConfig: EditorFieldConfigProperty
    eventConfig: EventConfigProperty
    visible: boolean
    index: number
    edge: 'only' | 'first' | 'last' | 'none'
    setInvisibles: Dispatch<SetStateAction<Set<string>>>
}

function EditorFieldCardComponent({
    fieldConfig,
    eventConfig,
    index,
    edge,
    visible,
    setInvisibles,
    dispatchFormConfig
}: EditorFieldCardProps){
    return(
        <ZoomIn show={visible} as="div">
            <Card variant="white-gray" extraClass="px-2 pt-2 pb-20">
                <div className="grid grid-cols-2 mb-2">
                    <div className="w-full">
                        <EditorContentField
                            contentConfig={fieldConfig}
                            dispatchFormConfig={dispatchFormConfig}
                        />
                        <div className="mb-4">
                            <ContentField
                                contentConfig={fieldConfig}
                                eventConfig={eventConfig}
                                defaultInteract={false}
                                editor={true}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-4">
                        <FieldDeleteButton
                            fieldId={fieldConfig.id}
                            setInvisibles={setInvisibles}
                            dispatchFormConfig={dispatchFormConfig}
                        />
                        <FieldSwapButtons
                            fieldId={fieldConfig.id}
                            index={index}
                            edge={edge}
                            dispatchFormConfig={dispatchFormConfig}
                            setInvisibles={setInvisibles}
                        />
                        {!typePermission.fieldType.disableAccessMod.has(fieldConfig.field_type) &&
                        <FieldDataAccessListBox
                            eventConfig={eventConfig}
                            fieldId={fieldConfig.id}
                            fieldPositionAccess={fieldConfig.position_access}
                            fieldRoleAccess={fieldConfig.role_access}
                            dispatchFormConfig={dispatchFormConfig}
                        />
                        }
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 mb-2">
                    <FieldGeneralConfigs
                        fieldId={fieldConfig.id}
                        required={fieldConfig.required}
                        dataType={fieldConfig.data_type}
                        fieldType={fieldConfig.field_type}
                        dispatchFormConfig={dispatchFormConfig}
                    />
                    {typePermission.fieldType.allowCustomHelper.has(fieldConfig.field_type) &&
                    <FieldValidationConfigs
                        fieldId={fieldConfig.id}
                        fieldPlaceholder={fieldConfig.placeholder}
                        fieldSuccess={fieldConfig.success}
                        fieldError={fieldConfig.error}
                        dispatchFormConfig={dispatchFormConfig}
                    />
                    }
                    {typePermission.dataType.allowCustomOptions.has(fieldConfig.data_type) &&
                    typePermission.fieldType.optionsLikeField.has(fieldConfig.field_type) &&
                    <FieldOptionsConfigs
                        fieldId={fieldConfig.id}
                        dataType={fieldConfig.data_type}
                        fieldOptions={fieldConfig.options}
                        dispatchFormConfig={dispatchFormConfig}
                    />
                    }
                    {typePermission.dataType.allowCustomLength.has(fieldConfig.data_type) &&
                    typePermission.fieldType.allowCustomLength.has(fieldConfig.field_type) &&
                    <FieldLengthConfigs
                        fieldId={fieldConfig.id}
                        dataType={fieldConfig.data_type}
                        fieldMinLength={fieldConfig.min_length}
                        fieldMaxLength={fieldConfig.max_length}
                        dispatchFormConfig={dispatchFormConfig}
                    />
                    }
                    {fieldConfig.allPreviousOptions.length > 0 &&
                    <FieldVisibilityConditions
                        fieldId={fieldConfig.id}
                        visibleConds={fieldConfig.visible_conds}
                        allPreviousOptions={fieldConfig.allPreviousOptions}
                        dispatchFormConfig={dispatchFormConfig}
                    />
                    }
                </div>
            </Card>
        </ZoomIn>
    )
}
const EditorFieldCard = memo(EditorFieldCardComponent)
export default EditorFieldCard