import { FormGeneralProps } from "./form.types";

export interface RegisterFormProps extends FormGeneralProps {
  recaptchaSiteKey: string;
}