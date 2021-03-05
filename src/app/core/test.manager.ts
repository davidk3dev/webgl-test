import { Scene, Mesh, BufferGeometry, Vector3, Object3D, Color, Material, MeshPhongMaterial, DoubleSide, Geometry, LineSegments, BoxBufferGeometry, Box3Helper, MeshBasicMaterial, PlaneBufferGeometry, Group, Box3, Line, Matrix4, TextureLoader, Texture, RepeatWrapping, MeshLambertMaterial, BoxHelper, Plane, PlaneHelper, Line3, FontLoader } from "three";
import * as utils from "./utils";
import { AppComponent } from "../app.component";
import { GeometryManager } from "./geometry.manager";
import { MaterialManager } from "./material.manager";
import { GeometryInfo, Printing2DLine, ViewType, LineType, Printing2DGeometry, Printing2DGeometryType } from './models';
import { CONFIG as env, GEOMETRY_TYPE } from '../app.config';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { environment } from 'src/environments/environment';
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier';

export class TestManager {
    private scene: Scene;
    private APP: AppComponent;

    private material: MeshLambertMaterial;
    
    
    private geo: BufferGeometry;
    private texture: Texture;
    private modifier = new SimplifyModifier();

    private fontParameters;
    
    constructor() {
        this.material = new MeshLambertMaterial({ color: 'blue' });
    }

    public init(app: AppComponent): Promise<void> {
        return new Promise((resolve, reject) => {
            this.APP = app;
            this.scene = app.scene;
            //this.material = MaterialManager.Instance().DEFAULT.clone();     
            //this.material = new MeshPhongMaterial({ color: new Color('Red') });
            this.registerEvents();
            resolve();
        });
    }
    registerEvents() {
        this.APP.sldEaveWidth.addAction(this.update.bind(this));
        this.APP.sldExistingWallHeight.addAction(this.update.bind(this));
        this.APP.sldExistingLength.addAction(this.update.bind(this));
    }
    public optimize(): Promise<void> {
        return this.loadSTLFile('Trimdek 3D.stl').then(geo => {
            this.geo = geo;
        });
    }
    public load(): Promise<void> {
        return new Promise<void>(resolve => {
            //this.testCreateLine();
            this.textVectorNormal();
            //this.testMatrix();
            resolve();
        });
        // return new Promise<void>(resolve => {
        //     var loader = new FontLoader();
        //     loader.load( environment.modelBaseUrl + '/assets/fonts/helvetiker_regular.typeface.json', (font) => {
        //         this.fontParameters = {
        //             font: font,
        //             size: 100,
        //             height: 5,
        //             curveSegments: 1
        //         }
    
        //         resolve();
        //     })
        // }).then(() => {
        //     this.testClipOutline();
        // })
        
        // return new Promise((resolve, reject) => {
        //     //this.addObjects();
        //     //this.testOBJLoader();
        //     //this.testGLTFLoader();
        //     this.testClipOutline();
        //     resolve();
        // });
    }
    private textVectorNormal(){
        let p1 = new Vector3(100, 0, 0);
        let p2 = new Vector3(0,0,-100);
        
        let v = new Vector3().subVectors(p1, p2);

        let up = new Vector3(0,1,0);
        
        let p3 = v.cross(up);

        console.log('cross result', p3);
    }
    private testMatrix(){
        let v1 = new Vector3(1,0,0);
        let v2 = new Vector3(-100,100,0);

        let angle = v2.angleTo(v1);

        console.log('ANGLE TO VECTOR', angle * 180 / Math.PI);

        let matBox = new MeshLambertMaterial({ color: 'red' });
        let matPlane = new MeshLambertMaterial({ color: 'white' });

        let planeGeo = new PlaneBufferGeometry(1000, 100);
        let plane = new Mesh(planeGeo, matPlane);
        plane.position.set(500,500,500);
        plane.rotateZ(Math.PI/4);

        plane.updateWorldMatrix(true, true);
        plane.updateMatrixWorld(true);


        // let box = new Mesh(new BoxBufferGeometry(100, 100, 100), matBox)
        // box.position.set(0, 500, 0);

        // box.updateMatrixWorld(true);

        //let m1 = box.matrixWorld.multiply(plane.matrixWorld);

        //box.applyMatrix4(plane.matrixWorld);


        // let m = new Matrix4().extractRotation(plane.matrixWorld);
        let m = plane.matrixWorld;

        let p1 = new Vector3(500, 500, 0);

        p1.applyMatrix4(m);

        utils.addPoints([p1], this.scene);

        this.scene.add(plane);
    }
    private loadObjFile(filename: string){
        return new Promise(resolve => {
            let loader = new OBJLoader();
            loader.load(environment.modelBaseUrl + '/assets/models/Trimdek 3D.stl', (group) => {
                console.log('LOAD TEXTURE', group);
                // this.geo = group.children[0]['geometry'] as BufferGeometry;
                // this.geo.center();

                //console.log('LOAD TEXTURE', this.geo);

                let tmpGeo = new Geometry().fromBufferGeometry(group.children[0]['geometry'] as BufferGeometry);
                tmpGeo.computeFaceNormals();
                tmpGeo.mergeVertices();
                tmpGeo.computeVertexNormals();
                this.geo = this.modifier.modify(tmpGeo, Math.floor(tmpGeo.vertices.length * 0.85));

                const textureLoader = new TextureLoader( );
                textureLoader.load( environment.modelBaseUrl + '/assets/images/textures/galv_spangle.bmp', (texture)=>{
                    this.texture = texture;
                    this.texture.wrapS = this.texture.wrapT = RepeatWrapping;
                    this.texture.anisotropy = 1;

                    //this.geo = newGeo;
                    
                    //let mesh = new Mesh(this.geo, new MeshPhongMaterial({ color: new Color('Red'), map: texture }));
                    //mesh.translateX(-250);
                    //this.scene.add(mesh);

                    resolve(tmpGeo);
                } );
    
                
            });
        });
    }
    private loadSTLFile(filename: string){
        return new Promise<BufferGeometry>(resolve => {
            let loader = new STLLoader();
            loader.load(environment.modelBaseUrl + '/assets/models/' + filename, (geo) => {
                geo.center();
                geo.rotateX(Math.PI/2);
                //geo.rotateY(Math.PI/2)
                resolve(geo);
            });
        });
    }
    private addObjects() {
        var group = new Group();
        var dimLineGeo = new PlaneBufferGeometry(500, 50);
        var dimLine = new Mesh(dimLineGeo, new MeshBasicMaterial({ color: 'red' }));

        let arrows = this.addArrow(new Vector3(-250, 0, 0));
        
        for(let arrow of [...arrows, dimLine]){
            // var geo = new PlaneBufferGeometry(100, 30);
            // geo.translate(50, 0, 0);
            // var arrow = new Mesh(geo);
            // arrow.position.set(-250, 0, 0);
            // arrow.rotation.set(0, 0, Math.PI / 4);

            arrow.updateWorldMatrix(true, true);
            let arrowCloned = arrow.clone();
            arrowCloned.applyMatrix4(new Matrix4().getInverse(arrow.matrixWorld));

            

            var box = new Box3().setFromObject(arrowCloned);
            //box.applyMatrix4(arrow.matrixWorld);
            //let boxHelper = new Box3Helper(box);
            //arrow.updateWorldMatrix(true, true);
            //arrow.updateMatrixWorld();
            //boxHelper.applyMatrix4(arrow.matrixWorld);
            //boxHelper.translateX(50);
            //boxHelper.translateX(-250)
            //boxHelper.rotation.set(0, 0, Math.PI / 4);
            //this.scene.add(boxHelper);

            var points = this.getStartEndPoint(box);

            let line = new Line(new Geometry().setFromPoints(points));

            
            line.geometry.applyMatrix4(arrow.matrixWorld);

            


            line.translateZ(100);
            this.scene.add(line);
        }

        group.add(dimLine, ...arrows);
        group.rotation.set(0, 0, -Math.PI/2);
        this.scene.add(group);
    }
    private addArrow(pos) {
        var geo = new PlaneBufferGeometry(100, 30);
        geo.translate(50, 0, 0);
        var mesh1 = new Mesh(geo);
        mesh1.position.set(pos.x, pos.y, pos.z);
        mesh1.rotation.set(0, 0, Math.PI / 4);

        var mesh2 = new Mesh(geo);
        mesh2.position.set(pos.x, pos.y, pos.z);
        mesh2.rotation.set(0, 0, -Math.PI / 4);
        return [mesh1, mesh2];
    }
    private testOBJLoader(){
        this.scene.remove(...this.scene.children.filter(c => c.userData.type == "OBJ"));

        this.texture.repeat.set(1, this.APP.sldExistingLength.currentValue/256);
        //this.material.map = this.texture;

        let mesh = new Mesh(this.geo, this.material);
        mesh.userData = { type: "OBJ" }
        let length = new utils.Util().getGeometryLength(this.geo, new Vector3(0,1,0));
        mesh.scale.set(1, this.APP.sldExistingLength.currentValue/length,1);
        this.scene.add(mesh);

        // let stlLoader = new STLLoader();
        // stlLoader.load(environment.modelBaseUrl + '/assets/models/SHS 100x3_2.stl', (geo) => {
        //     console.log('LOAD STL', geo);
        //     geo.center();
        //     let mesh = new Mesh(geo, new MeshPhongMaterial({ color: new Color('Red') }));
        //     mesh.translateX(250);
        //     this.scene.add(mesh);
        // });
    }
    private testGLTFLoader(){
        let loader = new GLTFLoader().setPath(environment.modelBaseUrl + '/assets/models/');
        loader.load('SHS 100x3.glb', (gltf) => {
            let geo = gltf.scene.children[0]['geometry'] as BufferGeometry;
            console.log('LOAD GLTF', gltf);

            // geo.center();

            const textureLoader = new TextureLoader( );
            const texture = textureLoader.load( environment.modelBaseUrl + '/assets/images/textures/galv_spangle.bmp', (texture)=>{
                console.log('LOAD TEXTURE', texture);
                let mesh = new Mesh(geo, new MeshPhongMaterial({ color: new Color('Red'), map: texture }));
                mesh.scale.set(1,1,1);
                //mesh.translateX(-250);
                this.scene.add(mesh);
            } );

            //gltf.scene.userData = { type: 'MODEL' };
            //gltf.scene.scale.set(1,1,1);
            //this.scene.add(gltf.scene);
        });
    }
    private testClipOutline(){
        //Object
        let panel = new Mesh(this.geo.scale(1,1,10), this.material);
        let box = new BoxHelper(panel);
        
        //Plane 1
        let plane = new Plane(new Vector3(0,-1,0));
        let matrix = new Matrix4().makeRotationZ(Math.PI/8);
        plane.applyMatrix4(matrix);
        plane.translate(new Vector3(0,150,0));
        let planeHelper = new PlaneHelper(plane, 1500);

        //Plane 2
        let plane2 = new Plane(new Vector3(0,-1,0));
        matrix = new Matrix4().makeRotationZ(-Math.PI/2);
        plane2.applyMatrix4(matrix);
        plane2.translate(new Vector3(200,0,0));
        let planeHelper2 = new PlaneHelper(plane2, 1500);

        //Clipped box
        let clippedgeo = utils.clipOutline2(box.geometry as BufferGeometry, plane);
        clippedgeo = utils.clipOutline2(clippedgeo, plane2);
        let newBox = new LineSegments(clippedgeo);
        //let newBox = new LineSegments(box.geometry);

        console.log('vertices', (box.geometry as BufferGeometry).attributes['position'].array, clippedgeo.attributes['position'].array);

        let vertices = (box.geometry as BufferGeometry).attributes['position'].array;

        let newBoxGeo =utils.addBoxFromVertices(vertices);
        //let newBox = new LineSegments(newBoxGeo);


        console.log('BOX GEO', box.geometry, newBoxGeo);

        // for(let i = 0; i < vertices.length; i += 6){
        //     let p1 = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        //     let p2 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
        //     //let line = new LineSegments(new BufferGeometry().setFromPoints([p1, p2]));

        //     //this.scene.add(line);

        //     utils.addPoints([p1, p2], this.scene);
        // }

        //utils.addVerticeIndex(clippedgeo.attributes['position'].array, this.fontParameters, this.scene);
        //utils.addVerticeIndex(vertices, this.fontParameters, this.scene);

        //console.log('vertices', vertices);

        // for (let i = 0; i < vertices.length; i += 3) {
        //     console.log('add point');
        //     let p = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        //     utils.addPoints([p], this.scene);
        // }

        // let lines = new LineSegments(box.geometry);
        // this.scene.add(lines);

        //------Count vertices--------
        // let index = 0;
        // let interval = setInterval(() => {
        //     console.log('Insert point');

        //     let p1 = new Vector3(vertices[index], vertices[index + 1], vertices[index + 2]);
        //     //let p2 = new Vector3(vertices[index + 3], vertices[index + 4], vertices[index + 5]);
        //     utils.addPoints([p1], this.scene);
        //     index += 3;

        //     if(index >= vertices.length - 1){
        //         clearInterval(interval);
        //     }
        // }, 1000)
        //----------------------------

        // let p1 = new Vector3(0, 0, 0);
        // let dis1 = plane.distanceToPoint(p1);
        // console.log('p1 distance to plane', dis1);

        // let p2 = new Vector3(0,500,0);
        // let dis2 = plane.distanceToPoint(p2);
        // console.log('p2 distance to plane', dis2);

        // let connectLine = new Line3(p1, p2);
        // let intersectPoint = new Vector3();
        // plane.intersectLine(connectLine, intersectPoint);
        
        // utils.addPoints([intersectPoint],this.scene);


        //--------test line segment
        // let p0 = new Vector3(500, 500, 100);
        // let p1 = new Vector3(-500, 500, 100);
        // let p2 = new Vector3(-500, -500, 100);
        // let p3 = new Vector3(500, -500, 100);

        // let p4 = new Vector3(500, 500, -100);
        // let p5 = new Vector3(-500, 500, -100);
        // let p6 = new Vector3(-500, -500, -100);
        // let p7 = new Vector3(500, -500, -100);

        // let segments = new LineSegments(new BufferGeometry().setFromPoints([p0, p1, p2, p3, p4, p5, p6, p7]));
        //this.scene.add(segments);
        //---------------------------

        //this.scene.add(planeHelper);
        //this.scene.add(planeHelper2);
        this.scene.add(newBox);
    }
    private testCreateLine(){
        let p1 = new Vector3(0,0,0);
        let p2 = new Vector3(0,1,0);

        

        let lineGeo = new BoxBufferGeometry(50, 1000);
        lineGeo.translate(0, 500, 0);
        lineGeo.rotateX(Math.PI/2);
        let line = new Mesh(lineGeo);
        line.position.set(500,500,0);
        let v = new Vector3(1000,1000,0);
        line.lookAt(v);
        this.scene.add(line);

        utils.createCircleLineGeo(this.scene, 100);
    }

    private getStartEndPoint(box) {
        let maxHeight = 0;
        let p1;
        let p2;

        if (box.max.x - box.min.x > maxHeight) {
            maxHeight = box.max.x - box.min.x;

            p1 = new Vector3(box.min.x, (box.max.y + box.min.y) / 2, (box.max.z + box.min.z) / 2);
            p2 = new Vector3(box.max.x, (box.max.y + box.min.y) / 2, (box.max.z + box.min.z) / 2);
        }
        if (box.max.y - box.min.y > maxHeight) {
            maxHeight = box.max.y - box.min.y;

            p1 = new Vector3((box.max.x + box.min.x) / 2, box.min.y, (box.max.z + box.min.z) / 2);
            p2 = new Vector3((box.max.x + box.min.x) / 2, box.max.y, (box.max.z + box.min.z) / 2);
        }
        if (box.max.z - box.min.z > maxHeight) {
            p1 = new Vector3((box.max.x + box.min.x) / 2, (box.max.y + box.min.y) / 2, box.min.z);
            p2 = new Vector3((box.max.x + box.min.x) / 2, (box.max.y + box.min.y) / 2, box.max.z);
        }

        return [p1, p2];
    }

    private update(preVal: number, curVal: number) {
        this.load();
    }
    public uiChanged(preVal: number, curVal): void {
        this.load();
    }
}