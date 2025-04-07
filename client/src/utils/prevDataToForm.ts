import { Data } from "../types/common.types";

function prevDataToForm<T extends Data>(entity: T) {
    return {
        title: entity.title,
        description: entity.description,
        ...(entity.code !== undefined && { code: entity.code }), // Solo incluye si existe
        ...(entity.difficulty !== undefined && { difficulty: entity.difficulty }), // Solo incluye si existe
        topic_id: entity.topic.id,
    };
}

export default prevDataToForm;