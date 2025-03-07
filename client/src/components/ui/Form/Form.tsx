import { FormEventHandler, ReactNode } from "react"
import styles from "./form.module.css"

interface Props {
  children: ReactNode;
  parentMethod: FormEventHandler
}

function AppForm ({ children, parentMethod }: Readonly<Props>) {

  return (
    <form onSubmit={parentMethod} className={styles.form}>
      {children}
    </form>
  )
}

export default AppForm