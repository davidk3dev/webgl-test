import { BufferGeometry, Vector3, Geometry, Material, Mesh, Face3 } from 'three';

export interface DropdownInputItemModel {
    id: number;
    value: any;
}

export interface IBay {
    index: number;
    value: number;
}

export class GeometryInfo {
    private _geometry: BufferGeometry;
    public get geometry(): BufferGeometry {
        return this._geometry;
    }
    public set geometry(value) {
        this._geometry = value;
    }

    private _width = 0;
    public get width(): number {
        return this._width;
    }
    public set width(value) {
        this._width = value;
    }
    private _height = 0;
    public get height(): number {
        return this._height;
    }
    public set height(value) {
        this._height = value;
    }
    private _length = 0;
    public get length(): number {
        return this._length;
    }
    public set length(value) {
        this._length = value;
    }

    constructor(geometry?: BufferGeometry, width?: number, height?: number, length?: number){
        this._geometry = geometry;
        this._width = width;
        this._height = height;
        this._length = length;
    }
}

export interface Printing2DData {
    lines: Printing2DLine[],
    texts: Print2DText[],
    sceenshoot: string,
    meshes: Printing3DGeometry[]
}
export interface Printing2DGeometry {
    lines: Printing2DLine[],
    texts: Print2DText[]
}
export interface Printing3DGeometry {
    vertices: Vector3[],
    faces: Face[]
}
export interface Face {
    a: number,
    b: number,
    c: number
}

export interface Print3DFace {
    a: number,
    b: number,
    c: number
}

export interface Printing2DLine {
    vertices: Vector3[]
    type: Printing2DGeometryType
    views: Print2DView[]
}

export interface Print2DText
{
    value: string
    position: Vector3
    rotation: Vector3
    views: Print2DView[]
}

export interface Print2DView {
    viewType: ViewType
    lineType: LineType
}

export enum Printing2DGeometryType {
    Line,
    LineCap
}
export enum ViewType {
    FRONT,
    LEFT,
    RIGHT,
    PLAN
}
export enum LineType
{
    CONTINOUS,
    DASHED
}

export interface CSG {
    fromGeometry: (geo: Geometry | BufferGeometry) => CSG,
    fromMesh: (mesh: Mesh) => CSG,
    toMesh: (csg: CSG, mat: Material) => Mesh,
    subtract: (csg: CSG) => CSG
}
