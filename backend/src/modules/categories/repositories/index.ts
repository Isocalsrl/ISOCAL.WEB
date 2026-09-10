export {
    create,
} from "./categories.create.repository.js";

export {
    findActiveById,
    findActiveProductsByCategoryId,
    findAll,
    findAllActive,
    findById,
    hasAssociatedProducts,
} from "./categories.read.repository.js";

export {
    deactivate,
    update,
} from "./categories.update.repository.js";
