import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SquareTile } from './SquareTile';
import { board, components_map } from './globals';
import { NewSectionTile } from './NewSectionTile';
import { ActionType, Mode } from './CollisionPlanePosition';
import { Position, Cell } from '../logic/Board';



export default class App {
    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera | THREE.OrthographicCamera;

    private controls!: OrbitControls;

    private pointer!: THREE.Vector2;
    private raycaster!: THREE.Raycaster;


    constructor() {
        this.initScene();
        this.initListeners();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        // this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera = new THREE.OrthographicCamera(window.innerWidth / - 100, window.innerWidth / 100, window.innerHeight / 100, window.innerHeight / - 100, 1, 1000);

        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        board.setCell(new Cell(3, 1), new Position(0, 0, 0));
        board.setCell(new Cell(4, 2), new Position(1, 0, 0));
        board.setCell(new Cell(5, 3), new Position(0, 1, 0));
        board.setCell(new Cell(53, 0), new Position(1, 1, 0));
        board.setCell(new Cell(3, 1), new Position(-1, 0, 0));
        board.setCell(new Cell(4, 2), new Position(-1, 0, 0));
        board.setCell(new Cell(5, 3), new Position(0, -1, 0));
        board.setCell(new Cell(53, 0), new Position(-1, -1, 0));
        board.setCell(new Cell(99, 0), new Position(-4, -1, 0));
        // board.setCell(new Cell(63, 2), new Position(4, 0, 0));

        board.forEach((pos: Position, cell: Cell) => {

            (new SquareTile(cell.value, cell.color, new THREE.Vector3(pos.x * 2.1, pos.y * 2.1, pos.z * 2.1), Mode.Mode3D)).addToScene(this.scene);

        });

        // (new NewSectionTile(new THREE.Vector3(0, 3, 0))).addToScene(this.scene);

        this.initCameraControls();
        this.initLights();
        this.animate();
    }

    private initCameraControls() {

        this.controls.minPolarAngle = Math.PI / 2;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.controls.minAzimuthAngle = 0;
        this.controls.maxAzimuthAngle = 0;

        this.controls.zoomToCursor = true;

        // this.controls.touches = {
        //     ONE: THREE.TOUCH.ROTATE,
        //     TWO: THREE.TOUCH.DOLLY_PAN
        // }
    }
    private initLights() {

        const lightAmbient = new THREE.AmbientLight(0xA0A0A0);
        this.scene.add(lightAmbient);

        const dirLight = new THREE.DirectionalLight(0x99ff99, 4);
        dirLight.position.set(100, 100, 100);
        this.scene.add(dirLight);

        const dirLightB = new THREE.DirectionalLight(0xff9999, 4);
        dirLightB.position.set(-100, -100, -100);
        this.scene.add(dirLightB);

        const dirLightC = new THREE.DirectionalLight(0xaaaaff, 4);
        dirLightC.position.set(-100, 100, 100);
        this.scene.add(dirLightC);

        const dirLightD = new THREE.DirectionalLight(0xaaaaff, 4);
        dirLightD.position.set(100, -100, 100);
        this.scene.add(dirLightD);

        const dirLightE = new THREE.DirectionalLight(0xaaaaff, 4);
        dirLightE.position.set(100, -100, -100);
        this.scene.add(dirLightE);
    }

    initListeners() {
        window.addEventListener('keydown', (event) => {
            const { key } = event;

            switch (key) {
                case 'e':
                    console.log("Pressed E");
                    break;
                default:
                    break;
            }
        });

        window.addEventListener('mousemove', (event) => {

            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);

            const intersects = this.raycaster.intersectObjects(this.scene.children);
            var intersectId: string | null = null;

            if (intersects.length > 0) {
                intersectId = intersects[0].object.uuid;
                if (components_map.has(intersectId)) {
                    components_map.get(intersectId)!(this.scene, ActionType.Hover);
                }

            }
            components_map.forEach((value: (scene: THREE.Scene, action: ActionType) => void, key: string) => {
                if (intersectId !== null && key != intersectId) {
                    value!(this.scene, ActionType.Empty);
                }
            });

        }, false
        );
        window.addEventListener('mouseup', (event) => {

            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);

            const intersects = this.raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                if (components_map.has(intersects[0].object.uuid)) {
                    components_map.get(intersects[0].object.uuid)!(this.scene, ActionType.Press);
                }
            }
        }, false
        );
    }


    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });

        if (this.controls) this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
}
