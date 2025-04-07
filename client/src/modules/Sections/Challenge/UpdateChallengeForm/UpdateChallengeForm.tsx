import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateFormProps } from "../../../../types/form.types";
import { updateChallengeFormData, updateChallengeSchema } from "../../../../schemas/challenge.schemas";
import { Challenge } from "../../../../types/challenges.types";
import { updateChallengeRequest } from "../../../../services/challenges.service";
import { useAuth } from "../../../../context/AuthProvider";
import { useTopic } from "../../../../context/TopicProvider";
import useFormChanges from "../../../../hooks/useFormChanges";
import prevDataToForm from "../../../../utils/prevDataToForm";
import AppForm from "../../../../components/ui/Form/Form";
import FormField from "../../../../components/ui/Input/Input";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import SelectField from "../../../../components/ui/SelectField/SelectField";
import Button from "../../../../components/ui/Button/Button";
import ModalForm from "../../../../components/ui/ModalForm/ModalForm";
import SuccessNotification from "../../../../components/ui/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/ui/ErrorNotification/ErrorNotification";
import formStyles from '../../../../styles/Form.module.css'
import styles from './UpdateChallengeForm.module.css'

function UpdateChallengeForm({
    formTitle = 'Actualizar',
    prevData,
    id,
    onSuccess
}: Readonly<UpdateFormProps<Challenge>>) {
    const [loading, setLoading] = useState(false);
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
        formState: { errors, dirtyFields },
        reset
    } = useForm<updateChallengeFormData>({
        resolver: zodResolver(updateChallengeSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        if (prevData) {
            reset(prevDataToForm(prevData));
        }
    }, [prevData, reset]);

    const {getChangedFields, changedCount} = useFormChanges({watch, dirtyFields});

    const openForm = () => {
        if (!user) {
            navigate('/login')
        }
        setIsModalOpen(true)
    }
    const onSubmit: SubmitHandler<updateChallengeFormData> = async (data) => {
        try {
            setLoading(true)
            if(changedCount === 0) {
                setIsModalOpen(false)
                return
            }
            const updatedValues = getChangedFields()
            const result = await updateChallengeRequest(updatedValues, id)
            setIsModalOpen(false)
            setSuccess(result.data)
            onSuccess?.()
            reset(data)
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
                <Button action="update" fn={openForm} content="Editar"></Button>
            </div>
            <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>{formTitle}</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)}>
                    <FormField<updateChallengeFormData>
                        label='Título'
                        id="title"
                        type="text"
                        register={register}
                        error={errors.title}    
                    />
                    <TextArea<updateChallengeFormData>
                        label='Descripción'
                        id="description"
                        register={register}
                        watch={watch}
                        maxLength={500}
                        error={errors.description}
                    />
                    <SelectField<updateChallengeFormData>
                        label='Tema'
                        id='topic_id'
                        register={register}
                        error={errors.topic_id}
                        options={topics?.map(topic => ({
                            value: topic.id,
                            label: topic.name
                        })) ?? []}
                    />

                    <SelectField<updateChallengeFormData>
                        label='Dificultad'
                        id="difficulty"
                        register={register}
                        error={errors.difficulty}
                        options={difficulty}
                    />
                    <div className={formStyles.button_container}>
                        <Button
                            action="update"
                            content="Actualizar"
                            content_loading="Actualizando..."
                            loading={loading}
                        />
                    </div>
                </AppForm>
            </ModalForm>
        </div>
    )
}

export default UpdateChallengeForm