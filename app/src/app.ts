import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SquareTile } from './SquareTile';
import { components_map } from './globals';


export default class App {
    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;

    private lightAmbient!: THREE.AmbientLight;
    private controls!: OrbitControls;

    private pointer!: THREE.Vector2;
    private raycaster!: THREE.Raycaster;

    private plane!: THREE.Mesh;


    constructor() {
        this.initScene();
        this.initListeners();
    }


    initScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.lightAmbient = new THREE.AmbientLight(0xf0f0f0);
        this.scene.add(this.lightAmbient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(50, 50, 50);
        this.scene.add(dirLight);

        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();


        (new SquareTile()).addToScene(this.scene);

        const geometryPlane = new THREE.PlaneGeometry(6, 6, 1, 1);
        const materialPlane = new THREE.MeshPhongMaterial({ color: 0x666666 });

        this.plane = new THREE.Mesh(geometryPlane, materialPlane);
        this.plane.position.z = -2;
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);

        this.animate();
    }

    initListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

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

            if (intersects.length > 0) {
                if (components_map.has(intersects[0].object.uuid)) {
                    components_map.get(intersects[0].object.uuid)!();
                }
                else {
                    for (var i in intersects)
                        console.log(intersects[i].object.uuid, "not found");
                }
            }
        }


        );
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });

        if (this.controls) this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
}
