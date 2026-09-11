export {
    categoryExists,
    findActiveById,
    findById,
    findByIdForUpdate,
    findAll,
    findAllActive,
} from "./products.read.repository.js";

export { create } from "./products.create.repository.js";
export { deactivate, touch, update } from "./products.update.repository.js";

export {
    findCurrentProductImage,
    hasCurrentProductImage,
    replaceCurrentProductImage,
} from "./products.image.repository.js";
