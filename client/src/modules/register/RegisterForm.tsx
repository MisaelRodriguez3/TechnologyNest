import { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../../context/AuthProvider';
import { RegisterFormData, registerSchema } from '../../schemas/user.schema';
import FormField from '../../components/ui/Input/Input';
import { RegisterFormProps } from '../../types/register.types';
import AppForm from '../../components/ui/Form/Form';
import Button from '../../components/ui/Button/Button';
import formStyles from  '../../styles/Form.module.css'

/**
 * Formulario de registro
 * @param {RegisterFormProps} props Argumentos necesarios para el formulario de registro, los algumentos son: `recaptchaSiteKey`, `formTitle`,
 * `loading` y `setLoading`
 * @returns {JSX.Element} Devuelve el formuario de registro
 */
const RegisterForm = ({
  recaptchaSiteKey,
  formTitle = 'Crear Cuenta'
}: RegisterFormProps) => {
  const {signup, loading} = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors }
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
    await signup(data)
  };

  return (
    <div className={formStyles.form_container}>
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
          className={formStyles.recaptcha}
        />
        {errors.recaptcha && (
          <p className={formStyles.error_message}>{errors.recaptcha.message}</p>
        )}
        
        <div className={formStyles.button_container}>
          <Button
            action='auth'
            content='Registrarse'
            content_loading='Registrando...'
            loading={loading}
          />
        </div>

      </AppForm>

      <a className={formStyles.link} href="/login">¿Ya tienes cuenta?</a>
    </div>
  );
};

export default RegisterForm;
