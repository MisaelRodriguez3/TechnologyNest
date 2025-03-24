import {  useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../context/AuthProvider";
import FormField from "../../components/ui/Input/Input";
import { LoginFormProps } from "../../types/login.types";
import AppForm from "../../components/ui/Form/Form";
import Button from "../../components/ui/Button/Button";
import { LoginFormData, loginSchema } from "../../schemas/user.schema";
import formStyles from  '../../styles/Form.module.css'

/**
 * FOrmulario de Inicio de sesión
 * @param {LoginFormProps} props Argumentos necesarios para el formulario de registro, los algumentos son: `recaptchaSiteKey`, `formTitle`,
 * `loading` y `setLoading`
 * @returns {JSX.Element} Retorna el formulario de inicio de sesión
 */
const LoginForm = ({
    recaptchaSiteKey,
    formTitle = "Iniciar Sesión"
}: LoginFormProps) => {
    const {login, loading} = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur"
    });

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const handleRecaptchaChange = (token: string | null) => {
        setValue('recaptcha', token ?? '');
        trigger('recaptcha');
    };

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        await login(data)
    }

    return (
        <div className={formStyles.form_container}>
            <h2>{formTitle}</h2>
            <AppForm parentMethod={handleSubmit(onSubmit)}>
                <FormField<LoginFormData>
                    label="Usuario"
                    id="username"
                    type="text"
                    register={register}
                    error={errors.username}
                />
                <FormField<LoginFormData>
                    label="Contraseña"
                    id="password"
                    type="password"
                    register={register}
                    error={errors.password}
                />
                <a className={formStyles.link} href="/forgot-password">¿Olvidaste tu contraseña?</a>
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
                        action="auth"
                        content="Iniciar sesión"
                        content_loading="Iniciando sesión..."
                        loading={loading}
                    />
                </div>
            </AppForm>
            <p className={formStyles.text}>¿Necesitas una cuenta? <a className={formStyles.link} href="/register">Registrate</a></p>
        </div>
    )
}

export default LoginForm;