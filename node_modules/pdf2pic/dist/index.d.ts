/// <reference types="node" />
import { Convert } from "./types/convert";
export declare function fromPath(filePath: string, options?: import("./types/options").Options): Convert;
export declare function fromBuffer(buffer: Buffer, options?: import("./types/options").Options): Convert;
export declare function fromBase64(b64string: string, options?: import("./types/options").Options): Convert;
