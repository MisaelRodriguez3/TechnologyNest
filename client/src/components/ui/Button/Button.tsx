import styles from "./styles.module.css"

interface ButtonProps {
    action: "auth" | "create" | "update" | "delete"
    fn?: () => void
    content: string
    content_loading?: string
    loading?: boolean
}

function Button({action, fn, content, content_loading, loading}: Readonly<ButtonProps>) {
    return (
        <button 
            type={action === "delete" ? "button" : "submit"} 
            {...(fn ? { onClick: fn } : {})}
            className={`${styles.button} ${styles[action]}`}
            {...(loading ? {disabled:true} : {})}
        >
            {loading ? content_loading : content}
        </button>
    )
}

export default Button;