import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGeneralProps } from "../../../../types/form.types";
import { createPostFormData, createPostSchema } from "../../../../schemas/post.schemas";
import { createPostRequest } from "../../../../services/posts.service";
import { useAuth } from "../../../../context/AuthProvider";
import { useTopic } from "../../../../context/TopicProvider";
import AppForm from "../../../../components/ui/Form/Form";
import FormField from "../../../../components/ui/Input/Input";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import Button from "../../../../components/ui/Button/Button";
import SelectField from "../../../../components/ui/SelectField/SelectField";
import ModalForm from "../../../../components/ui/ModalForm/ModalForm";
import SuccessNotification from "../../../../components/ui/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/ui/ErrorNotification/ErrorNotification";
import formStyles from '../../../../styles/Form.module.css'
import modalFormStyles from '../../../../styles/ModalForm.module.css'

function CreatePostForm({
    formTitle = 'Crear Publicación',
    onSuccess
}: Readonly<FormGeneralProps>) {
    const [loading, setLoading] = useState(false)
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
        formState: { errors },
        reset
    } = useForm<createPostFormData>({
        resolver: zodResolver(createPostSchema),
        mode: 'onBlur'
    });

    const openForm = () => {
        if(!user) {
            navigate('/login')
        }
        setIsModalOpen(true)
    }

    const onSubmit: SubmitHandler<createPostFormData> = async (data) => {
        try {
            setLoading(true);
            const result = await createPostRequest(data);
            setIsModalOpen(false)
            onSuccess?.()
            setSuccess(result.data)
            reset({})
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el ejemplo');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {success && <SuccessNotification message={success}/>}
            {error && <ErrorNotification message={error}/>}

            <div className={modalFormStyles.buttonContainer}>
                <Button action="create" fn={openForm} content="Crear Post"></Button>
            </div>
            <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>{formTitle}</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)}>
                    <FormField<createPostFormData>
                        label='Título'
                        id="title"
                        type="text"
                        register={register}
                        error={errors.title}    
                    />
                    <TextArea<createPostFormData>
                        label='Descripción'
                        id="description"
                        register={register}
                        watch={watch}
                        maxLength={500}
                        error={errors.description}
                    />
                    <SelectField<createPostFormData>
                        label='Tema'
                        id='topic_id'
                        register={register}
                        error={errors.topic_id}
                        options={topics?.map(topic => ({
                            value: topic.id,
                            label: topic.name
                        })) ?? []}
                    />

                    <TextArea<createPostFormData>
                        id='code'
                        label='Código'
                        register={register}
                        watch={watch}
                        maxLength={5000}
                        error={errors.code}
                    />

                    <div className={formStyles.button_container}>
                        <Button
                            action="create"
                            content="Crear Post"
                            content_loading="Creado..."
                            loading={loading}
                        />
                    </div>
                </AppForm>
            </ModalForm>
        </div>
    )
}

export default CreatePostForm;