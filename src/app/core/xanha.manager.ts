import { Scene, Mesh, BufferGeometry, Vector3, Object3D, Color, Material, MeshPhongMaterial, DoubleSide, Geometry, LineSegments, BoxBufferGeometry, LinearToneMapping } from "three";
import { Util } from "./utils";
import { AppComponent } from "../app.component";
import { GeometryManager } from "./geometry.manager";
import { MaterialManager } from "./material.manager";
import { GeometryInfo, Printing2DLine, ViewType, LineType, Printing2DGeometry, Printing2DGeometryType } from './models';
import { CONFIG as env, GEOMETRY_TYPE } from '../app.config';

export class xanhaManager {
    private scene: Scene;
    private APP: AppComponent;

    private utils: Util;

    private geometryManager: GeometryManager;
//Tao phoi
    public geo_xanha: GeometryInfo;
//Material  
    private material: Material;

    private geoXanhaHeight: number = 500;
    private geoXanhaWidth: number = 8000;
    private geoXanhaLength: number = 500;
    constructor() {
        this.utils = new Util();
        this.geometryManager = GeometryManager.Instance();
    }

    public init(app: AppComponent): Promise<void> {
        return new Promise((resolve, reject) => {
            this.APP = app;
            this.scene = app.scene;
            //this.material = MaterialManager.Instance().DEFAULT.clone();     
            this.material = new MeshPhongMaterial({color: new Color('Red')});   
            this.APP.sldEaveWidth.addAction(this.update.bind(this));  
            this.APP.sldExistingWallHeight.addAction(this.update.bind(this));
            this.APP.sldExistingLength.addAction(this.update.bind(this));
            resolve();
        });
    }
    public optimize() : Promise<void> {
        return new Promise((resolve, reject) => {

            this.geo_xanha = new GeometryInfo();
            this.geo_xanha.geometry = this.geometryManager.COLUMN.S63x3.geometry.clone();
            this.geo_xanha.width = this.geometryManager.COLUMN.S63x3.width;
            this.geo_xanha.length = this.geometryManager.COLUMN.S63x3.length;
            this.geo_xanha.height = this.geometryManager.COLUMN.S63x3.height;
            //this.geo_xanha.geometry = new BoxBufferGeometry(this.geoXanhaWidth, this.geoXanhaHeight, this.geoXanhaLength);
            //this.geo_xanha.geometry.translate(0, 3000, 0);
            
            // .clone()
            // .rotateY(Math.PI / 2)
            // .translate(0, translateHeight, translateLength);
            // this.geo_colum.width = this.geometryManager.EXISTING_WALL.EXISTING_WALL.width;
            // this.geo_colum.length = this.geometryManager.EXISTING_WALL.EXISTING_WALL.length;
            // this.geo_colum.height = this.geometryManager.EXISTING_WALL.EXISTING_WALL.height;

            
            resolve();
        });
    }
    public load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.scene.remove(...this.scene.children.filter(x=> x.userData.type == 'xanha'));
            // this.scene.remove(...this.scene.children.filter(x => x.userData.type == GEOMETRY_TYPE.EXISTING_WALL));
            // this.scene.remove(...this.scene.children.filter(x => x.userData.type == "EXISTING_WALL_OUTLINE"));
            
            let width = this.APP.sldEaveWidth.currentValue/2;
            let height = this.APP.sldExistingWallHeight.currentValue;
            let length = this.APP.sldExistingLength.currentValue/2;

            let xanha1 = new Mesh(this.geo_xanha.geometry, this.material);
            xanha1.userData = {type:'xanha' };           
            xanha1.scale.set(1, 1, length/this.geoXanhaLength*2);
            xanha1.translateX(width);
            xanha1.translateY(height);

            let xanha2 = new Mesh(this.geo_xanha.geometry, this.material);
            xanha2.userData = {type:'xanha' };
            xanha2.scale.set(1, 1, length/this.geoXanhaLength*2);
            xanha2.translateX(-width);
            xanha2.translateY(height);

            let xanha3 = new Mesh(this.geo_xanha.geometry, this.material);
            xanha3.userData = {type:'xanha' };
            xanha3.rotateY(Math.PI/2);
            xanha3.scale.set(1, 1,2*width/this.geoXanhaLength);
            xanha3.translateX(length);
            xanha3.translateY(height);

            let xanha4 = new Mesh(this.geo_xanha.geometry, this.material);
            xanha4.userData = {type:'xanha' };
            xanha4.rotateY(Math.PI/2);
            xanha4.scale.set(1,1,2*width/this.geoXanhaLength);
            xanha4.translateX(-length);
            xanha4.translateY(height);
            
            this.scene.add(xanha1,xanha2,xanha3,xanha4);
            resolve();
        });
    }
    private update(preVal:number,curVal:number) {
        this.load();
    }
    public addEaveWall(userDataPos: any) {
        
    }

    public uiChanged(preVal: number, curVal): void {
        this.load();
    }
}