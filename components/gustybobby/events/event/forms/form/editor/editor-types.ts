import type { Dispatch } from "react";
import type { FormConfigReducerAction } from "./hooks/form-config-reducer";

export interface DispatchFormConfig {
    dispatchFormConfig: Dispatch<FormConfigReducerAction>
}