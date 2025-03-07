import { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';
import { RegisterFormData, registerSchema } from '../../schemas/user.schema';
import FormField from '../../components/ui/Input/Input';
import { RegisterFormProps } from '../../types/register.types';
import AppForm from '../../components/ui/Form/Form';
import { registerRequest } from '../../services/auth.service';
import { useNavigate } from "react-router-dom";
import Button from '../../components/ui/Button/Button';
import styles from "./RegisterForm.module.css"

/**
 * Formulario de registro
 * @param {RegisterFormProps} props Argumentos necesarios para el formulario de registro, los algumentos son: `recaptchaSiteKey`, `formTitle`,
 * `loading` y `setLoading`
 * @returns {JSX.Element} Devuelve el formuario de registro
 */
const RegisterForm = ({
  recaptchaSiteKey,
  formTitle = 'Crear Cuenta',
  loading = false,
  setLoading
}: RegisterFormProps) => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    getValues
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur"
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleRecaptchaChange = (token: string | null) => {
    setValue('recaptcha', token ?? '');
    trigger('recaptcha');
  };

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      setLoading(true);
      console.log(data)
      const result = await registerRequest(data);
      console.log(result.data)
      navigate("/confirm-email", {state: {email: getValues("email")}})
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form_container}>
      <h2>{formTitle}</h2>

      <AppForm parentMethod={handleSubmit(onSubmit)}>

        <FormField<RegisterFormData>
          label="Nombres"
          id="first_name"
          type="text"
          register={register}
          error={errors.first_name}
        />

        <FormField<RegisterFormData>
          label="Apellidos"
          id="last_name"
          type="text"
          register={register}
          error={errors.last_name}
        />

        <FormField<RegisterFormData>
          label="Usuario"
          id="username"
          type="text"
          register={register}
          error={errors.username}
        />
        
        <FormField<RegisterFormData>
          label="Email"
          id="email"
          type="email"
          register={register}
          error={errors.email}
        />
        
        <FormField<RegisterFormData>
          label="Contraseña"
          id="password"
          type="password"
          register={register}
          error={errors.password}
        />

        <FormField<RegisterFormData>
          label="Confirmar Contraseña"
          id="confirm_password"
          type="password"
          register={register}
          error={errors.confirm_password}
        />
        
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={recaptchaSiteKey}
          onChange={handleRecaptchaChange}
          className={styles.recaptcha}
        />
        {errors.recaptcha && (
          <p className={styles.error_message}>{errors.recaptcha.message}</p>
        )}
        
        <div className={styles.button_container}>
          <Button
            action='auth'
            content='Registrarse'
            content_loading='Registrando...'
            loading={loading}
          />
        </div>

      </AppForm>
    </div>
  );
};

export default RegisterForm;
