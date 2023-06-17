import Canvas from "canvas";
type Factory = {
    canvas: Canvas.Canvas | null;
    context: Canvas.CanvasRenderingContext2D | null;
};
type NonNullableFactory = {
    [K in keyof Factory]: NonNullable<Factory[K]>;
};
export declare class NodeCanvasFactory {
    create(width: number, height: number): NonNullableFactory;
    reset(canvasAndContext: Factory, width: number, height: number): void;
    destroy(canvasAndContext: Factory): void;
}
export {};
