import * as THREE from 'three';
import { Font, TextGeometry, FontLoader, OBJLoader } from 'three/examples/jsm/Addons.js';
import { components_map } from './globals';
import { ActionType, Mode } from './CollisionPlanePosition';
import { SquareTile } from './SquareTile';

export class NewSectionTile {

    static tileMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x964B00 });
    static tileGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(2, 2, 2);

    private group = new THREE.Group();

    protected position: THREE.Vector3 = new THREE.Vector3();

    constructor(position: THREE.Vector3) {
        this.position = position;
    }

    protected getNumberMesh(font: Font): THREE.Mesh {
        const geometry = new TextGeometry('+', {
            font: font,
            size: 1,
            depth: 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2
        });

        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xff0000 }));

        mesh.position.set(this.position.x, this.position.y, this.position.z);

        mesh.scale.set(1, 1, 0.5);
        mesh.position.z += 1.5;
        mesh.position.x -= 0.4;
        mesh.position.y -= 0.43;

        return mesh;
    };

    private getCollisionPlane(): THREE.Mesh {

        const geometryPlane = new THREE.PlaneGeometry(1.6, 1.6, 1, 1);
        const materialPlane = new THREE.MeshStandardMaterial({
            transparent: true,
            opacity: 0,
            color: 0x666666
        });
        materialPlane.transparent = true
        var plane = new THREE.Mesh(geometryPlane, materialPlane);

        plane.position.x = this.position.x
        plane.position.y = this.position.y
        plane.position.z = this.position.z + 1

        plane.position.z += 1.01;

        components_map.set(plane.uuid, (scene: THREE.Scene, action: ActionType) => {
            if (action === ActionType.Hover)
                materialPlane.opacity = 0.7;

            if (action === ActionType.Empty)
                materialPlane.opacity = 0.0;

            if (action === ActionType.Press)
                this.addBeginningBlock(scene);
        });
        return plane
    }

    private addBeginningBlock(scene: THREE.Scene) {

        scene.remove(this.group);

        (new NewSectionTile(new THREE.Vector3(this.position.x, this.position.y + 3, this.position.z))).addToScene(scene);

        // remove original block
        // add new block in it's place 
        // add new original block back
    }

    public addToScene(scene: THREE.Scene) {

        (new OBJLoader()).load('assets/tile.obj', (object) => {

            object.scale.set(2, 2, 2);
            object.position.set(this.position.x, this.position.y, this.position.z);
            this.group.add(object);

        }
        );

        (new FontLoader()).load('fonts/Roboto_Regular.json', (font) => {

            var numberMesh = this.getNumberMesh(font);
            this.group.add(numberMesh);


        });


        this.group.add(this.getCollisionPlane())
        scene.add(this.group);
    }

}
