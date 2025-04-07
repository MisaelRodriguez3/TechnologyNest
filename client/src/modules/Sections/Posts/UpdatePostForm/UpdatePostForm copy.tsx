import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateFormProps } from "../../../../types/form.types";
import { updatePostFormData, updatePostSchema } from "../../../../schemas/post.schemas";
import { Post } from "../../../../types/posts.types";
import { updatePostRequest } from "../../../../services/posts.service";
import { useAuth } from "../../../../context/AuthProvider";
import { useTopic } from "../../../../context/TopicProvider";
import prevDataToForm from "../../../../utils/prevDataToForm";
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
import styles from './UpdatePostForm.module.css'

function UpdatePostForm({
    formTitle = 'Actualizar',
    prevData,
    id
}: Readonly<UpdateFormProps<Post>>) {
    
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
    } = useForm<updatePostFormData>({
        resolver: zodResolver(updatePostSchema),
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
            navigate('/login');
            return;
        }
        setIsModalOpen(true);
    };

    const onSubmit: SubmitHandler<updatePostFormData> = async () => {
        try {
            setLoading(true);
            if (changedCount === 0) {
                setIsModalOpen(false);
                return;
            }
            const updatedValues = getChangedFields();
            const result = await updatePostRequest(updatedValues, id);
            setIsModalOpen(false);
            setSuccess(result.data);
            reset({});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el post');
        } finally {
            setLoading(false);
        }
    };

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
                    <FormField<updatePostFormData>
                        label='Título'
                        id="title"
                        type="text"
                        register={register}
                        error={errors.title}    
                    />
                    <TextArea<updatePostFormData>
                        label='Descripción'
                        id="description"
                        register={register}
                        watch={watch}
                        maxLength={500}
                        error={errors.description}
                    />
                    <SelectField<updatePostFormData>
                        label='Tema'
                        id='topic_id'
                        register={register}
                        error={errors.topic_id}
                        options={topics?.map(topic => ({
                            value: topic.id,
                            label: topic.name
                        })) ?? []}
                    />
                    <TextArea<updatePostFormData>
                        label='Código'
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
    );
}

export default UpdatePostForm;
