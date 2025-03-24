import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordRequest } from '../../services/auth.service';
import { FormGeneralProps } from '../../types/form.types';
import AppForm from '../../components/ui/Form/Form';
import FormField from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../schemas/auth.schemas';
import SuccessNotification from '../../components/ui/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../components/ui/ErrorNotification/ErrorNotification';
import formStyles from '../../styles/Form.module.css';

const ForgotPasswordForm = ({
  formTitle = "Recuperar cuenta"
}: FormGeneralProps) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur"
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      console.log(data)
      const result = await forgotPasswordRequest(data);
      console.log(result)
      setSuccess(result.data)
    } catch (err) {
      console.log(err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && <ErrorNotification message={error} duration={5000}/>}
      {success && <SuccessNotification message={success} duration={5000}/>}
      <div className={formStyles.form_container}>
        <h2>{formTitle}</h2>

        <AppForm parentMethod={handleSubmit(onSubmit)}>

          <FormField<ForgotPasswordFormData>
            label="Username"
            id='username'
            type='text'
            register={register}
            error={errors.username}
          />

          <FormField<ForgotPasswordFormData>
            label='Email'
            id='email'
            type='eamil'
            register={register}
            error={errors.email}
          />

          <Button
            action='auth'
            content='Enviar Petición'
            content_loading='Enviando...'
            loading={loading}
          >

          </Button>
        </AppForm>
      </div>
    </>
  )
};

export default ForgotPasswordForm;