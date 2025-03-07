import { FieldError, FieldValues, Path, UseFormRegister, UseFormWatch } from "react-hook-form";

export interface FormGeneralProps {
  formTitle?: string;
  loading?: boolean;
  setLoading: (loading: boolean) => void
}

export interface FormFieldProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  type: string;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export interface TextAreaProps<T extends FieldValues> extends Omit<FormFieldProps<T>, "type"> {
  maxLength?: number
  watch?: UseFormWatch<T>
}