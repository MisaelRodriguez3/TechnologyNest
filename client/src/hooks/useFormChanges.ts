import { UseFormWatch } from "react-hook-form";

const useFormChanges = <T extends Record<string, unknown>>({
  watch,
  dirtyFields,
}: {
  watch: UseFormWatch<T>;
  dirtyFields: Partial<Record<keyof T, boolean>>;
}) => {
  const formData = watch(); // Se llama correctamente para obtener los valores

  const getChangedFields = (): Partial<T> => {
    return Object.keys(dirtyFields).reduce((changes, key) => {
      if (dirtyFields[key as keyof T]) {
        changes[key as keyof T] = formData[key as keyof T];
      }
      return changes;
    }, {} as Partial<T>);
  };

  return {
    getChangedFields,
    changedCount: Object.keys(dirtyFields).length,
  };
};

export default useFormChanges;
