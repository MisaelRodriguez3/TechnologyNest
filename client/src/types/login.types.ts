import { FormGeneralProps } from "./form.types";

export interface LoginFormProps extends FormGeneralProps {
  recaptchaSiteKey: string;
}