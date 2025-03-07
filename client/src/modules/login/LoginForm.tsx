import {  useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import FormField from "../../components/ui/Input/Input";
import { LoginFormProps } from "../../types/login.types";
import AppForm from "../../components/ui/Form/Form";
import { loginRequest } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import { LoginFormData, loginSchema } from "../../schemas/user.schema";
import styles from "./LoginForm.module.css"

/**
 * FOrmulario de Inicio de sesión
 * @param {LoginFormProps} props Argumentos necesarios para el formulario de registro, los algumentos son: `recaptchaSiteKey`, `formTitle`,
 * `loading` y `setLoading`
 * @returns {JSX.Element} Retorna el formulario de inicio de sesión
 */
const LoginForm = ({
    recaptchaSiteKey,
    formTitle = "Iniciar Sesión",
    loading = false,
    setLoading
}: LoginFormProps) => {
    const navigate = useNavigate()
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
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
        })

        try {
            setLoading(true)
            const result = await loginRequest(formData);
            console.log(result)
            if ("mfa_active" in result.data){
                localStorage.setItem("username", data.username)
                navigate("/otp")
                return
            }
            localStorage.setItem("token", result.data.access_token)
            navigate("/")
        } catch (error) {
            console.error("Error de login:", error instanceof Error ? error.message : error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.form_container}>
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
                        action="auth"
                        content="Iniciar sesión"
                        content_loading="Iniciando sesión..."
                        loading={loading}
                    />
                </div>
            </AppForm>
        </div>
    )
}

export default LoginForm;