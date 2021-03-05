import { BufferGeometry, Vector3, PlaneBufferGeometry, BoxBufferGeometry } from 'three';
import { environment as env } from 'src/environments/environment';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Util } from '../core/utils';
import { GeometryInfo } from './models';



export class GeometryManager {

    private constructor() {
        this.utils = new Util();
        this.loader = new STLLoader();
    }
    private static instance: GeometryManager;
    private loader: STLLoader;

    private utils: Util;


    public COLUMN: {
        S63x3: GeometryInfo,
        S100x3: GeometryInfo,
    } = {
        S63x3: null,
        S100x3: null
    };
    public TYPE_C: {
        C100: GeometryInfo,
        C150: GeometryInfo,
    } = {
        C100: null,
        C150: null
    };

    public PURLIN: {
        TH61: GeometryInfo,
        TH22: GeometryInfo,
    } = {
        TH61: null,
        TH22: null
    };
    public KNEE:{
        CPDKP15003_left : GeometryInfo;
        CPDKP15003_right : GeometryInfo;
        CPDKP15005_left : GeometryInfo;
        CPDKP15005_right : GeometryInfo;
        CPDKP15007_left : GeometryInfo;
        CPDKP15007_right : GeometryInfo;
    } = {
        CPDKP15003_left: null,
        CPDKP15003_right:null,
        CPDKP15005_left: null,
        CPDKP15005_right:null,
        CPDKP15007_left: null,
        CPDKP15007_right:null
    }
    
    static Instance(): GeometryManager {
        if (!GeometryManager.instance) {
            GeometryManager.instance = new GeometryManager();
        }
        return GeometryManager.instance;
    }

    public loadAll(): Promise<any> {
        return Promise.all([
            // this.loadColumn(),
            // this.loadTypeC(),
            // this.loadPurlin(),
            // this.loadKNEE()
        ]);
    }

    private downloadFile(fileName: string): Promise<BufferGeometry> {
        return new Promise((resolve, reject) => {
            this.loader.load(env.modelBaseUrl + '/assets/models/' + fileName, (geometry) => {
                geometry.center();
                resolve(geometry);
            });
        });
    }

    public loadColumn(): Promise<any> {
        return this.downloadFile('SHS 65x3.stl')
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.COLUMN.S63x3 = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('SHS 100x3.stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.COLUMN.S100x3 = new GeometryInfo(geometry, width, height, length);
        });
    }
    public loadTypeC(): Promise<any> {
        return this.downloadFile('C100-(3D).stl')
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.TYPE_C.C100 = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('C150-(3D).stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.TYPE_C.C150 = new GeometryInfo(geometry, width, height, length);
        });
    }
    public loadPurlin(): Promise<any> {
        return this.downloadFile('TH22-(3D).stl')
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.PURLIN.TH22 = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('TH61-(3D).stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.PURLIN.TH61 = new GeometryInfo(geometry, width, height, length);
        });
    }
    public loadKNEE(): Promise<any> {
        return this.downloadFile('CPDKP15003 (3D)_left.stl')
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.KNEE.CPDKP15003_left = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('CPDKP15003 (3D)_right.stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.KNEE.CPDKP15003_right = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('CPDKP15005 (3D)_left.stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.KNEE.CPDKP15005_left = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('CPDKP15005 (3D)_right.stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.KNEE.CPDKP15005_right = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('CPDKP15007 (3D)_left.stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.KNEE.CPDKP15007_left = new GeometryInfo(geometry, width, height, length);
            return this.downloadFile('CPDKP15007 (3D)_right.stl');
        })
        .then((geometry) => {
            geometry.center();
            const width = this.utils.getGeometryLength(geometry, new Vector3(1, 0, 0));
            const height = this.utils.getGeometryLength(geometry, new Vector3(0, 1, 0));
            const length = this.utils.getGeometryLength(geometry, new Vector3(0, 0, 1));
            this.KNEE.CPDKP15007_right = new GeometryInfo(geometry, width, height, length);
        });
    }
}
