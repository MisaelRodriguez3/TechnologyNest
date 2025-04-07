import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGeneralProps } from "../../../../types/form.types";
import { createChallengeFormData, createChallengeSchema } from "../../../../schemas/challenge.schemas";
import { createChallengeRequest } from "../../../../services/challenges.service";
import { useAuth } from "../../../../context/AuthProvider";
import { useTopic } from "../../../../context/TopicProvider";
import AppForm from "../../../../components/ui/Form/Form";
import FormField from "../../../../components/ui/Input/Input";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import SelectField from "../../../../components/ui/SelectField/SelectField";
import Button from "../../../../components/ui/Button/Button";
import ModalForm from "../../../../components/ui/ModalForm/ModalForm";
import SuccessNotification from "../../../../components/ui/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/ui/ErrorNotification/ErrorNotification";
import formStyles from '../../../../styles/Form.module.css'
import styles from './CreateChallengeForm.module.css'

function CreateChallengeForm({
    formTitle = 'Crear Reto',
    onSuccess
}: Readonly<FormGeneralProps>) {
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {topics} = useTopic();
    const {user} = useAuth();

    const navigate = useNavigate();

    const difficulty = [
        {value: 'Fácil', label: 'Fácil'},
        {value: 'Medio', label: 'Medio'},
        {value: 'Alto', label: 'Alto'},
        {value: 'Extremo', label: 'Extremo'}]
        
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<createChallengeFormData>({
        resolver: zodResolver(createChallengeSchema),
        mode: 'onBlur'
    });

    const openForm = () => {
        if (!user) {
            navigate('/login')
        }
        setIsModalOpen(true)
    }

    const onSubmit: SubmitHandler<createChallengeFormData> = async (data) => {
        try {
            setLoading(true)
            const result = await createChallengeRequest(data)
            setIsModalOpen(false)
            onSuccess?.()
            setSuccess(result.data)
            reset({})
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el reto');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {success && <SuccessNotification message={success}/>}
            {error && <ErrorNotification message={error}/>}
            <div className={styles.buttonContainer}>
                <Button action="create" fn={openForm} content="Crear Reto"></Button>
            </div>
            <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>{formTitle}</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)}>
                    <FormField<createChallengeFormData>
                        label='Título'
                        id="title"
                        type="text"
                        register={register}
                        error={errors.title}    
                    />
                    <TextArea<createChallengeFormData>
                        label='Descripción'
                        id="description"
                        register={register}
                        watch={watch}
                        maxLength={500}
                        error={errors.description}
                    />
                    <SelectField<createChallengeFormData>
                        label='Tema'
                        id='topic_id'
                        register={register}
                        error={errors.topic_id}
                        options={topics?.map(topic => ({
                            value: topic.id,
                            label: topic.name
                        })) ?? []}
                    />

                    <SelectField<createChallengeFormData>
                        label='Dificultad'
                        id="difficulty"
                        register={register}
                        error={errors.difficulty}
                        options={difficulty}
                    />
                    <div className={formStyles.button_container}>
                        <Button
                            action="create"
                            content="Crear Reto"
                            content_loading="Creado..."
                            loading={loading}
                        />
                    </div>
                </AppForm>
            </ModalForm>
        </div>
    )
}

export default CreateChallengeForm;