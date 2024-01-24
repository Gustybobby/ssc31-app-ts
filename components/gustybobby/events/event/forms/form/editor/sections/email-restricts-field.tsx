import { sectionStyles } from "@/components/styles/sections"
import { InputField } from "@/components/tools/input"
import { memo } from "react"
import type { DispatchFormConfig } from "../editor-types"

interface EmailRestrictsFieldProps extends DispatchFormConfig {
    emailRestricts: string[]
}

function EmailRestrictsFieldComponent({ emailRestricts, dispatchFormConfig }: EmailRestrictsFieldProps){
    return(
        <div className={sectionStyles.box.gray({ round: false, shadow: false })}>
            <div className="p-4 rounded-lg bg-gray-200 dark:bg-black/70">
                <InputField
                    id="email_restricts_field"
                    label="Restrict Form Access by Emails"
                    type="textarea"
                    size="lg"
                    defaultValue={emailRestricts.join(',')}
                    placeholder="comma seperated search "
                    pattern={/^[\w\s\@\.\_\,]{0,1024}$/}
                    success="Restriction is valid."
                    error="a-z, A-Z, 0-9, @._, max 1024 chars."
                    onChange={(e) => {
                        const newEmailRestricts = e.target.value == ''? [] : e.target.value.replace(' ','').replace('\n','').split(',')
                        dispatchFormConfig({ type: 'edit_email_restricts', value: newEmailRestricts })
                    }}
                    required={false}
                    autoComplete="off"
                />
            </div>
        </div>
    )
}
const EmailRestrictsField = memo(EmailRestrictsFieldComponent)
export default EmailRestrictsField