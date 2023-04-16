/// <reference types="node" />
import gm from "gm";
import fs from "fs-extra";
import { WriteImageResponse } from "./types/writeImageResponse";
import { Options } from "./types/options";
import { ToBase64Response } from "./types/toBase64Response";
export declare class Graphics {
    private quality;
    private format;
    private width;
    private height;
    private density;
    private savePath;
    private saveFilename;
    private compression;
    private gm;
    generateValidFilename(page?: number): string;
    gmBaseCommand(stream: fs.ReadStream, filename: string): gm.State;
    toBase64(stream: fs.ReadStream, page?: number): Promise<ToBase64Response>;
    writeImage(stream: fs.ReadStream, page?: number): Promise<WriteImageResponse>;
    identify(filepath: string | fs.ReadStream, argument?: string): Promise<gm.ImageInfo | string>;
    setQuality(quality: number): Graphics;
    setFormat(format: string): Graphics;
    setSize(width: number, height?: number): Graphics;
    setDensity(density: number): Graphics;
    setSavePath(savePath: string): Graphics;
    setSaveFilename(filename: string): Graphics;
    setCompression(compression: string): Graphics;
    setGMClass(gmClass: string | boolean): Graphics;
    getOptions(): Options;
}
