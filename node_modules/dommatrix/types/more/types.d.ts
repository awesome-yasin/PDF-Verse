export interface PointTuple {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface JSONMatrix {
    m11: number;
    m12: number;
    m13: number;
    m14: number;
    m21: number;
    m22: number;
    m23: number;
    m24: number;
    m31: number;
    m32: number;
    m33: number;
    m34: number;
    m41: number;
    m42: number;
    m43: number;
    m44: number;
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    is2D: boolean;
    isIdentity: boolean;
}

export type matrix = [number, number, number, number, number, number]
export type matrix3d = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]
