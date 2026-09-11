import { env } from "../../config/env.js";
import { LocalFileStorageProvider } from "./providers/localFileStorage.provider.js";
import type { BinaryStorage } from "./storage.types.js";

export const binaryStorage: BinaryStorage = new LocalFileStorageProvider(env.fileStorageRoot);
