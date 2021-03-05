import { Scene, Mesh, BufferGeometry, Vector3, Object3D, Color, Material, MeshPhongMaterial, DoubleSide, Geometry, LineSegments, BoxBufferGeometry } from "three";
import { Util } from "./utils";
import { AppComponent } from "../app.component";
import { GeometryManager } from "./geometry.manager";
import { MaterialManager } from "./material.manager";
import { GeometryInfo, Printing2DLine, ViewType, LineType, Printing2DGeometry, Printing2DGeometryType } from './models';
import { CONFIG as env, GEOMETRY_TYPE } from '../app.config';

export class RafterManager {
    private scene: Scene;
    private APP: AppComponent;
    private utils: Util;

    private geometryManager: GeometryManager;
//Tạo phôi của rafter
    public geo_rafter: GeometryInfo;
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
           this.material = new MeshPhongMaterial({color:new Color('Yellow')});
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
            this.geo_rafter = new GeometryInfo();
            this.geo_rafter.geometry = this.geometryManager.TYPE_C.C150.geometry.clone();
            this.geo_rafter.width = this.geometryManager.TYPE_C.C150.width;
            this.geo_rafter.length = this.geometryManager.TYPE_C.C150.length;
            this.geo_rafter.height = this.geometryManager.TYPE_C.C150.height;
            this.geo_rafter.geometry.translate(0,0,this.geo_rafter.length/2);
            this.geo_rafter.geometry.rotateY(Math.PI/2);
            
            console.log('LENGTH', this.geo_rafter);
            resolve();
        });
    }
    public load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.scene.remove(...this.scene.children.filter(x=> x.userData.type== 'Rafter'));
            let width = this.APP.sldEaveWidth.currentValue/2;
            let height = this.APP.sldExistingWallHeight.currentValue;
            let length = this.APP.sldExistingLength.currentValue/2;
            let pitch = this.APP.sldExistingPitch.currentValue;
            // rafter

            let soluongRafter = this.soluongo(length*2);
            let baySize = length*2/soluongRafter;
            let offsetZ = -length;
            for(let i=0; i <= soluongRafter; i++){  
                this.addRafter(offsetZ,width);
                offsetZ += baySize;
            }

            // let rafter1 = new Mesh(this.geo_rafter.geometry,this.material);
            // rafter1.userData = {type:'Rafter'};
            // rafter1.translateY(height);
            // rafter1.translateX(-width);
            // rafter1.translateZ(-length);
            // //console.log(pitch, width, this.geo_rafter.length, this.DoDaiRafter(pitch,width/2));            
            // rafter1.rotateZ(this.ConvertToRad(pitch));
            // rafter1.scale.set(this.DoDaiRafter(pitch,width)/this.geo_rafter.length, 1, 1);
            // //rafter1.scale.set(width/2/this.geo_rafter.length, 1, 1);
            // this.scene.add(rafter1);
            
            //  let rafter2 = new Mesh(this.geo_rafter.geometry,this.material);
            //  rafter2.userData = {type:'Rafter'};
            //  rafter2.translateY(height);
            //  rafter2.translateX(+width);
            //  rafter2.translateZ(-length);
            //  rafter2.rotateZ(this.ConvertToRad(180-pitch));
            //  rafter2.scale.set(this.DoDaiRafter(pitch,width)/this.geo_rafter.length, 1, 1);
            // // //rafter1.scale.set(width/2/this.geo_rafter.length, 1, 1);
            // this.scene.add(rafter2);

            // let rafter3 = new Mesh(this.geo_rafter.geometry,this.material);
            // rafter3.userData = {type:'Rafter'};
            // rafter3.translateY(height);
            // rafter3.translateX(-width);
            // rafter3.translateZ(+length);
            // rafter3.rotateZ(this.ConvertToRad(pitch));
            // rafter3.scale.set(this.DoDaiRafter(pitch,width)/this.geo_rafter.length, 1, 1);
            // this.scene.add(rafter3);
            
            //  let rafter4 = new Mesh(this.geo_rafter.geometry,this.material);
            //  rafter4.userData = {type:'Rafter'};
            //  rafter4.translateY(height);
            //  rafter4.translateX(+width);
            //  rafter4.translateZ(+length);
            //  rafter4.rotateZ(this.ConvertToRad(180-pitch));
            //  rafter4.scale.set(this.DoDaiRafter(pitch,width)/this.geo_rafter.length, 1, 1);
            //  this.scene.add(rafter4);
            resolve();
        });
    }
    private ConvertToRad(degree:number):number
    {
        return (degree/180)*Math.PI;
    }
    private DoDaiRafter(degree:number,canhday:number):number
    {
        let goc = this.ConvertToRad(degree);
        return (canhday/Math.cos(goc));
    }
    private update(preVal:number,curVal:number){
        this.load();
    }
  
    public addRafter(offsetX: any, X: any) {
        let rafter1 = new Mesh(this.geo_rafter.geometry,this.material);
        rafter1.userData = {type:'Rafter'};
        rafter1.translateX(-X);
        rafter1.translateY(this.APP.sldExistingWallHeight.currentValue);
        rafter1.translateZ(offsetX);
        rafter1.rotateZ(this.ConvertToRad(this.APP.sldExistingPitch.currentValue));
        rafter1.scale.set(this.DoDaiRafter(this.APP.sldExistingPitch.currentValue,this.APP.sldEaveWidth.currentValue/2)/this.geo_rafter.length, 1, 1);
        this.scene.add(rafter1);   

        let rafter2 = new Mesh(this.geo_rafter.geometry,this.material);
        rafter2.userData = {type:'Rafter'};
        rafter2.translateX(X);
        rafter2.translateY(this.APP.sldExistingWallHeight.currentValue);
        rafter2.translateZ(+offsetX);
        rafter2.rotateZ(this.ConvertToRad(180-this.APP.sldExistingPitch.currentValue));
        rafter2.scale.set(this.DoDaiRafter(this.APP.sldExistingPitch.currentValue,this.APP.sldEaveWidth.currentValue/2)/this.geo_rafter.length, 1, 1);            this.scene.add(rafter2);
    }
    private soluongo(X:number):number{
        let soluong = 1;
        while(soluong*2000<X)
            soluong++;
        return soluong;
    }
    public uiChanged(preVal: number, curVal): void {
        this.load();
    }
}