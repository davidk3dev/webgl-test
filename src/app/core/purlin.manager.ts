import { Scene, Mesh, BufferGeometry, Vector3, Object3D, Color, Material, MeshPhongMaterial, DoubleSide, Geometry, LineSegments, BoxBufferGeometry } from "three";
import { Util } from "./utils";
import { AppComponent } from "../app.component";
import { GeometryManager } from "./geometry.manager";
import { MaterialManager } from "./material.manager";
import { GeometryInfo, Printing2DLine, ViewType, LineType, Printing2DGeometry, Printing2DGeometryType } from './models';
import { CONFIG as env, GEOMETRY_TYPE } from '../app.config';

export class PurlinManager {
    private scene: Scene;
    private APP: AppComponent;
    private utils: Util;

    private geometryManager: GeometryManager;
//Tạo phôi
    public geo_purlin: GeometryInfo;
 //Material
    private material: Material;

    constructor() {
        this.utils = new Util();
        this.geometryManager = GeometryManager.Instance();
    }

    public init(app: AppComponent): Promise<void> {
        return new Promise((resolve, reject) => {
            this.APP = app;
            this.scene = app.scene;
           // this.material = MaterialManager.Instance().DEFAULT.clone();
           this.material = new MeshPhongMaterial({color:new Color('Red')});
           this.APP.sldEaveWidth.addAction(this.update.bind(this));
           this.APP.sldExistingWallHeight.addAction(this.update.bind(this));
           this.APP.sldExistingLength.addAction(this.update.bind(this));
           this.APP.sldExistingPitch.addAction(this.update.bind(this));
            resolve();
        });
    }
    public optimize() : Promise<void> {
        return new Promise((resolve, reject) => {
            //Rafter
            this.geo_purlin = new GeometryInfo();
            this.geo_purlin.geometry = this.geometryManager.PURLIN.TH61.geometry.clone();
            this.geo_purlin.width = this.geometryManager.PURLIN.TH61.width;
            this.geo_purlin.length = this.geometryManager.PURLIN.TH61.length;
            this.geo_purlin.height = this.geometryManager.PURLIN.TH61.height;
          //  this.geo_purlin.geometry.translate(0,this.APP.sldExistingWallHeight.currentValue,0);
        //    this.geo_purlin.geometry.translate(0, this.geometryManager.PURLIN.TH61.length/2, 0);
        //    console.log('LENGTH', this.geo_rafter);
            resolve();
        });
    }
    public load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.scene.remove(...this.scene.children.filter(x=> x.userData.type== 'Purlin of Roof'));
            
            let width = this.APP.sldEaveWidth.currentValue/2;
            let height = this.APP.sldExistingWallHeight.currentValue;
            let length = this.APP.sldExistingLength.currentValue/2;
            let pitch = this.APP.sldExistingPitch.currentValue;

            let baySize = 500;
            let soluongPurlin = Math.round(width/baySize);
            let offsetXLeft = 0;
            let offsetXRight = 0;
            for(let i=0; i < soluongPurlin; i++){  
                this.addPurlinLeft(offsetXLeft,width);
                offsetXLeft -= baySize;
            }
            for(let i = 0;i<soluongPurlin;i++)
            {
                this.addPurlinRight(offsetXRight,width)
                offsetXRight += baySize;
            }       
            resolve();
        });
    }
    private ConvertToRad(degree:number):number
    {
        return (degree/180)*Math.PI;
    }
    private update(preVal:number,curVal:number){
        this.load();
    }
    public addPurlinLeft(offsetX: any, X: any)
    {
        let purlin1 = new Mesh(this.geo_purlin.geometry, this.material);
        purlin1.userData = {type:'Purlin of Roof'};
        purlin1.translateY(this.APP.sldExistingWallHeight.currentValue);
        purlin1.translateX(offsetX);
        purlin1.translateY(this.ChieuCaoPurlin(this.APP.sldExistingPitch.currentValue,this.APP.sldEaveWidth.currentValue/2+offsetX));
        purlin1.scale.set(1,1,this.APP.sldExistingLength.currentValue/this.geometryManager.PURLIN.TH61.length);
        this.scene.add(purlin1);
    }
    public addPurlinRight(offsetX: any, X: any)
    {
        let purlin1 = new Mesh(this.geo_purlin.geometry, this.material);
        purlin1.userData = {type:'Purlin of Roof'};
        purlin1.translateY(this.APP.sldExistingWallHeight.currentValue);
        purlin1.translateX(offsetX);
        purlin1.translateY(this.ChieuCaoPurlin(this.APP.sldExistingPitch.currentValue,this.APP.sldEaveWidth.currentValue/2-offsetX));
        purlin1.scale.set(1,1,this.APP.sldExistingLength.currentValue/this.geometryManager.PURLIN.TH61.length);
        this.scene.add(purlin1);
    }
    private ChieuCaoPurlin(degree:number,canhday:number):number
    {
        let goc = this.ConvertToRad(degree);
        return(canhday*Math.tan(goc));
    }
    public uiChanged(preVal: number, curVal): void {
        this.load();
    }
}