import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateFormProps } from "../../../../types/form.types";
import { updateExampleFormData, updateExampleSchema } from "../../../../schemas/example.schemas";
import { Example } from "../../../../types/examples.types";
import { updateExampleRequest } from "../../../../services/examples.service";
import { useAuth } from "../../../../context/AuthProvider";
import { useTopic } from "../../../../context/TopicProvider";
import useFormChanges from "../../../../hooks/useFormChanges";
import AppForm from "../../../../components/ui/Form/Form";
import FormField from "../../../../components/ui/Input/Input";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import SelectField from "../../../../components/ui/SelectField/SelectField";
import Button from "../../../../components/ui/Button/Button";
import ModalForm from "../../../../components/ui/ModalForm/ModalForm";
import SuccessNotification from "../../../../components/ui/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/ui/ErrorNotification/ErrorNotification";
import formStyles from '../../../../styles/Form.module.css'
import styles from './UpdateExampleForm.module.css'
import prevDataToForm from "../../../../utils/prevDataToForm";

function UpdateExampleForm({
    formTitle = 'Actualizar',
    prevData,
    id
}: Readonly<UpdateFormProps<Example>>) {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {topics} = useTopic();
    const {user} = useAuth();

    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
        reset
    } = useForm<updateExampleFormData>({
        resolver: zodResolver(updateExampleSchema),
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

    const onSubmit: SubmitHandler<updateExampleFormData> = async () => {
        try {
            setLoading(true)
            if(changedCount === 0) {
                setIsModalOpen(false)
                return
            }
            const updatedValues = getChangedFields()
            const result = await updateExampleRequest(updatedValues, id)
            setIsModalOpen(false)
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
                <Button action="update" fn={openForm} content="Editar"></Button>
            </div>
            <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>{formTitle}</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)}>
                    <FormField<updateExampleFormData>
                        label='Título'
                        id="title"
                        type="text"
                        register={register}
                        error={errors.title}    
                    />
                    <TextArea<updateExampleFormData>
                        label='Descripción'
                        id="description"
                        register={register}
                        watch={watch}
                        maxLength={500}
                        error={errors.description}
                    />
                    <SelectField<updateExampleFormData>
                        label='Tema'
                        id='topic_id'
                        register={register}
                        error={errors.topic_id}
                        options={topics?.map(topic => ({
                            value: topic.id,
                            label: topic.name
                        })) ?? []}
                    />

                    <TextArea<updateExampleFormData>
                        label='Dificultad'
                        id="code"
                        register={register}
                        error={errors.code}
                        watch={watch}
                        maxLength={5000}
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

export default UpdateExampleForm