import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SliderInputComponent } from './component/slider-input/slider-input.component';
import { DropDownInputComponent } from './component/dropdown-input/dropdown-input.component';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { WebGLRenderer, Scene, Color, PerspectiveCamera, Vector3, Geometry, Line, LineBasicMaterial, DirectionalLight, Object3D, Mesh, BufferGeometry, Face3 } from 'three';
import { GeometryManager } from './core/geometry.manager';
import { DropdownInputItemModel } from './core/models';
import { Objects } from './core/objects';
import { CONFIG } from './app.config';

import { PrintingService } from './services/printing.service';
import { Util } from './core/utils';
import { TestManager } from './core/test.manager';



declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('rendererCanvas', { static: true }) public rendererCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('viewerContainer', { static: true }) public viewerContainer: ElementRef<HTMLDivElement>;
  @ViewChild('sldEaveWidth', { static: true }) public sldEaveWidth: SliderInputComponent;
  @ViewChild('sldEaveHeight', { static: true }) public sldExistingWallHeight: SliderInputComponent;
  @ViewChild('sldFasciaDepth', { static: true }) public sldFasciaDepth: SliderInputComponent;
  @ViewChild('sldExistingLength', { static: true }) public sldExistingLength: SliderInputComponent;
  @ViewChild('sltPitch', { static: true }) public sldExistingPitch: DropDownInputComponent;

  private testManager: TestManager

  public objects: Objects;
  public env = CONFIG;

  private utils: Util;

  public scene: THREE.Scene;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private control: OrbitControls;
  // private control: TrackballControls;

  private frameId: number = null;

  public loadCompleted = false;

  private geometryManager: GeometryManager;


  public pitchs: DropdownInputItemModel[];

  public sldExistingWidth2Visible = true;
  public sldExistingLength2Visible = true;
  public sldBuildingHeightMax: number;
  public isDisabledByExisting: boolean;
  public isDisabledByFascia: boolean;
  public constructor(private ngZone: NgZone, private printService: PrintingService) {
    this.utils = new Util();
    this.objects = new Objects();
    this.geometryManager = GeometryManager.Instance();
    this.testManager = new TestManager();
  }

  
  public ngAfterViewInit(): void {
    $('.ui.accordion').accordion();

    this.init3D().then(() => {
      this.geometryManager.loadAll()
      .then(() => {
        return Promise.all([
          this.testManager.init(this)
        ]);
      })
      .then(() => {
        return Promise.all([
          this.testManager.optimize()
        ]);
      })
      .then(() => {
        return Promise.all([
         this.testManager.load()
        ]);
      })
      .then(() => {
        
      });
      this.test();
    });
  }
  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  private init3D(): Promise<any> {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = this.rendererCanvas.nativeElement;

    this.canvas.width = this.viewerContainer.nativeElement.clientWidth;
    this.canvas.height = this.viewerContainer.nativeElement.clientHeight;

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      // alpha: true,    // transparent background
      antialias: true, // smooth edges
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.localClippingEnabled = true;
    // this.renderer.gammaOutput = true;
    // this.renderer.setClearColor( 0x000000 );
    // this.renderer.setPixelRatio( window.devicePixelRatio );
    // this.renderer.shadowMap.enabled = true;

    // create the scene
    this.scene = new Scene();
    this.scene.background = new Color(0xcce0ff);
    // this.scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

    // Camera
    this.camera = new PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 10000);
    //this.camera.position.set(0, 1000, 12967);
    this.camera.position.set(0,0,2000);
    // this.camera.position.set(91.02454523941192, 18.45966896006735, 5.692036175338248);
    this.scene.add(this.camera);

    this.addShadowedLight(0, 0, 1000, 0xffffff, 0.7);
    this.addShadowedLight(0, 0, -1000, 0xffffff, 0.7);
    this.addShadowedLight(0, 1000, 0, 0xffffff, 0.7);
    this.addShadowedLight(0, -1000, 0, 0xffffff, 0.7);
    this.addShadowedLight(1000, 0, 0, 0xffffff, 0.7);
    this.addShadowedLight(-1000, 0, 0, 0xffffff, 0.7);

    // control
    // this.control = new TrackballControls(this.camera, this.renderer.domElement);
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    // this.control.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    // this.control.dampingFactor = 0.05;
    // this.control.screenSpacePanning = false;
    // this.control.minDistance = 100;
    // this.control.maxDistance = 500;
    this.control.maxPolarAngle = this.utils.degreesToRadians(80);
    this.control.addEventListener('change', this.renderStatic.bind(this));

    window['scene'] = this.scene;
    window['camera'] = this.camera;

    this.animate();

    return Promise.resolve();
  }
  private test() {
    // let cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    // let cube = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({ color: 0x74d00b }));
    // this.scene.add(cube);

    // let p1 = new THREE.Vector3(10000,0,0);
    // let p2 = new THREE.Vector3(0,10000,0);
    // let p3 = new THREE.Vector3(10000,10000,0);


    let lineGeo = new Geometry();
    lineGeo.vertices.push(new Vector3(10000, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 10000, 0));
    this.scene.add(new Line(lineGeo, new LineBasicMaterial({ color: 0xff0000 })));

    lineGeo = new Geometry();
    lineGeo.vertices.push(new Vector3(-10000, 0, 0), new Vector3(0, 0, 0), new Vector3(0, -10000, 0));
    this.scene.add(new Line(lineGeo, new LineBasicMaterial({ color: 0xff0000 })));

    lineGeo = new Geometry();
    lineGeo.vertices.push(new Vector3(0, 0, 10000), new Vector3(0, 0, 0));
    this.scene.add(new Line(lineGeo, new LineBasicMaterial({ color: 0x0000ff })));


    // lineGeo = new THREE.Geometry();
    // lineGeo.vertices.push(p1, p2);
    // this.scene.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xff0000 })));

    // let cubeGeo = new THREE.BoxGeometry(1,1,1);
    // let cube = new THREE.Mesh(cubeGeo);
    // cube.position.set(p3.x, p3.y, p3.z);
    // this.scene.add(cube);



    // let axis = new THREE.Vector3(0,0,0);
    // axis.subVectors(p1, p2);
    // let degrees = 45;
    // let rad = degrees * (Math.PI / 180);
    // p3.applyAxisAngle(axis, rad);
    // cube.position.set(p3.x, p3.y, p3.z);

    // console.log('new point', p1);
    }

  
  private addShadowedLight(x, y, z, color, intensity): void {
    const directionalLight = new DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    this.scene.add(directionalLight);
  }
  private animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('DOMContentLoaded', () => {
        this.render();
      });

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }
  private render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.control.update();
    this.renderer.render(this.scene, this.camera);
  }
  private renderStatic() {
    // this.control.update();
    this.renderer.render(this.scene, this.camera);
  }

  private resize(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
