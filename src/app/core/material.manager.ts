import { MeshLambertMaterial, TextureLoader, MeshBasicMaterial, RepeatWrapping, DoubleSide, MeshPhongMaterial, LineBasicMaterial, Color, Texture, PointsMaterial } from "three";
import { environment as env } from 'src/environments/environment';

export class MaterialManager {
    private textureLoader: TextureLoader;

    public DEFAULT: MeshPhongMaterial;
    public WALL: MeshLambertMaterial;
    public EAVE: MeshPhongMaterial;
    public FASCIA: MeshPhongMaterial;
    public EXISTING_ROOF: MeshPhongMaterial;
    public GROUND: MeshLambertMaterial;

    public EXISTING_WALL_L1_TEXTURE: Texture;
    public EXISTING_WALL_W1_TEXTURE: Texture;
    public EXISTING_WALL_L2_TEXTURE: Texture;
    public EXISTING_WALL_W2_TEXTURE: Texture;

    public POINT_HELPER = new PointsMaterial({ size: 5, sizeAttenuation: false, alphaTest: 0.5, transparent: true, color: 'blue' });

    public EXISTING_ROOF_TEXTURE: {
        L1: Texture,
        L2: Texture,
        W1: Texture,
        W2: Texture
    } = {
        L1: null,
        L2: null,
        W1: null,
        W2: null
    }

    public DIMENSION_TEXT: MeshBasicMaterial;

    public MESH_OUTLINE: LineBasicMaterial;

    private static instance: MaterialManager;
    static Instance(): MaterialManager{
        if (!MaterialManager.instance) {
            MaterialManager.instance = new MaterialManager();
        }
        return MaterialManager.instance;
    }

    private constructor(){
        this.textureLoader = new TextureLoader();

        //default
        this.DEFAULT = new MeshPhongMaterial({
            color: 0x6D6C6E,
            side: DoubleSide
        });

        //Eave
        this.EAVE = new MeshPhongMaterial({
            color: new Color('white'),
            side: DoubleSide
        });

        //Eave
        this.FASCIA = new MeshPhongMaterial({
            color: new Color('white'),
            side: DoubleSide
        });

        //Ground
        var groundTexture = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/grass-dark.jpg" );
        groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
        groundTexture.repeat.set( 25, 25 );
        groundTexture.anisotropy = 16;
        this.GROUND = new MeshLambertMaterial({
            side: DoubleSide, 
            map: groundTexture
        });

        //Existing roof
        // var existingRoofTexture = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/131_Concrete roof tile texture-seamless.jpg" );
        // existingRoofTexture.wrapS = existingRoofTexture.wrapT = RepeatWrapping;
        // existingRoofTexture.repeat.set( 2, 2 );
        // existingRoofTexture.anisotropy = 16;
        this.EXISTING_ROOF = new MeshPhongMaterial({
            side: DoubleSide
        });

        //wall texture
        this.EXISTING_WALL_L1_TEXTURE = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/brick4.png" );
        this.EXISTING_WALL_L1_TEXTURE.wrapS = this.EXISTING_WALL_L1_TEXTURE.wrapT = RepeatWrapping;
        this.EXISTING_WALL_L1_TEXTURE.anisotropy = 1;

        this.EXISTING_WALL_L2_TEXTURE = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/brick4.png" );
        this.EXISTING_WALL_L2_TEXTURE.wrapS = this.EXISTING_WALL_L2_TEXTURE.wrapT = RepeatWrapping;
        this.EXISTING_WALL_L2_TEXTURE.anisotropy = 1;

        this.EXISTING_WALL_W1_TEXTURE = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/brick4.png" );
        this.EXISTING_WALL_W1_TEXTURE.wrapS = this.EXISTING_WALL_W1_TEXTURE.wrapT = RepeatWrapping;
        this.EXISTING_WALL_W1_TEXTURE.anisotropy = 1;

        this.EXISTING_WALL_W2_TEXTURE = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/brick4.png" );
        this.EXISTING_WALL_W2_TEXTURE.wrapS = this.EXISTING_WALL_W2_TEXTURE.wrapT = RepeatWrapping;
        this.EXISTING_WALL_W2_TEXTURE.anisotropy = 1;

        

        //Existing roof texture
        this.EXISTING_ROOF_TEXTURE.L1 = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/131_Concrete roof tile texture-seamless.jpg" );
        this.EXISTING_ROOF_TEXTURE.L1.wrapS = this.EXISTING_ROOF_TEXTURE.L1.wrapT = RepeatWrapping;
        this.EXISTING_ROOF_TEXTURE.L1.anisotropy = 1;

        this.EXISTING_ROOF_TEXTURE.L2 = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/131_Concrete roof tile texture-seamless.jpg" );
        this.EXISTING_ROOF_TEXTURE.L2.wrapS = this.EXISTING_ROOF_TEXTURE.L2.wrapT = RepeatWrapping;
        this.EXISTING_ROOF_TEXTURE.L2.anisotropy = 1;

        this.EXISTING_ROOF_TEXTURE.W1 = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/131_Concrete roof tile texture-seamless.jpg" );
        this.EXISTING_ROOF_TEXTURE.W1.wrapS = this.EXISTING_ROOF_TEXTURE.W1.wrapT = RepeatWrapping;
        this.EXISTING_ROOF_TEXTURE.W1.anisotropy = 1;

        this.EXISTING_ROOF_TEXTURE.W2 = this.textureLoader.load( env.modelBaseUrl + "/assets/images/textures/131_Concrete roof tile texture-seamless.jpg" );
        this.EXISTING_ROOF_TEXTURE.W2.wrapS = this.EXISTING_ROOF_TEXTURE.W2.wrapT = RepeatWrapping;
        this.EXISTING_ROOF_TEXTURE.W2.anisotropy = 1;

        //Wall
        this.WALL = new MeshLambertMaterial({
            side: DoubleSide, 
            //map: this.BRICK_TEXTURE
        });

         //text
         this.DIMENSION_TEXT = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide });

         this.MESH_OUTLINE = new LineBasicMaterial( { color: 0x363636 } );
    }
}