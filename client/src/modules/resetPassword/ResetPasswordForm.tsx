import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../../services/auth.service';
import { FormGeneralProps } from '../../types/form.types';
import AppForm from '../../components/ui/Form/Form';
import FormField from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { resetPasswordSchema, ResetPasswordFormData } from '../../schemas/auth.schemas';
import SuccessNotification from '../../components/ui/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../components/ui/ErrorNotification/ErrorNotification';
import formStyles from '../../styles/Form.module.css';

export default function ResetPasswordForm({
    formTitle = "Restablecer Contraseña"
}: Readonly<FormGeneralProps>) {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onBlur"
    });

    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = searchParams.get("token");

    const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        try {
            setLoading(true)
            setError('')
            setSuccess('')
            console.log(data)
            const response = await resetPasswordRequest(data, token ?? '')
            console.log(response)
            setSuccess(response.data)
            setTimeout(() => {navigate("/login")}, 5300)
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

                    <FormField<ResetPasswordFormData>
                        label='Nueva contraseña'
                        id='password'
                        type='password'
                        register={register}
                        error={errors.password}
                    />

                    <FormField<ResetPasswordFormData>
                        label='Confirma la contraseña'
                        id='confirm_password'
                        type='password'
                        register={register}
                        error={errors.confirm_password}
                    />

                    <Button
                        action='auth'
                        content='Restablecer'
                        content_loading='Restableciendo...'
                        loading={loading}
                    />
                </AppForm>
            </div>
        </>
    )
}