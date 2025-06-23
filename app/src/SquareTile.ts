import * as THREE from 'three';
import { Font, TextGeometry, FontLoader, OBJLoader } from 'three/examples/jsm/Addons.js';
import { components_map, PI } from './globals';
import { ActionType, CollisionPlanePosition, Mode } from './CollisionPlanePosition';

export function getHexColor(colorId: number) {
    const colors = [0xf23a3a, 0xf2813a, 0x141212, 0x2361fc];
    if (colorId >= colors.length)
        throw new Error('Index out of range');

    return colors[colorId];
}


export class SquareTile {

    static tileMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x964B00 });
    static tileGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(2, 2, 2);

    private mode: Mode;
    private group = new THREE.Group();

    protected position: THREE.Vector3 = new THREE.Vector3();

    constructor(position: THREE.Vector3, mode: Mode) {
        this.position = position;
        this.mode = mode
    }

    private static numberMaterial(color: number) {
        return new THREE.MeshPhongMaterial({ color: getHexColor(color) });
    }

    protected getNumberMesh(font: Font, value: number, color: number): THREE.Mesh {
        const geometry = new TextGeometry(value.toString(), {
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

        var mesh = new THREE.Mesh(geometry, SquareTile.numberMaterial(color));

        mesh.position.set(this.position.x, this.position.y, this.position.z);

        if (value >= 10) {
            mesh.scale.set(0.8, 0.8, 0.5 * 0.8);
            mesh.position.z += 1.6;
            mesh.position.x -= 0.68;
            mesh.position.y -= 0.4;
        }
        else {
            mesh.scale.set(1, 1, 0.5);
            mesh.position.z += 1.5;
            mesh.position.x -= 0.4;
            mesh.position.y -= 0.43;
        }
        return mesh;
    };


    private getCollisionPlane(position: CollisionPlanePosition) {

        const geometryPlane = new THREE.PlaneGeometry(1.6, 1.6, 1, 1);
        const materialPlane = new THREE.MeshStandardMaterial({
            transparent: true,
            opacity: 0,
            color: 0x666666
        });

        var plane = new THREE.Mesh(geometryPlane, materialPlane);

        plane.position.x = this.position.x
        plane.position.y = this.position.y
        plane.position.z = this.position.z + 1

        switch (position) {
            case CollisionPlanePosition.Top: {
                geometryPlane.rotateX((-90 * PI) / 180);
                plane.position.y += 1.01;
                break;
            }
            case CollisionPlanePosition.Bottom: {
                geometryPlane.rotateX((90 * PI) / 180);
                plane.position.y -= 1.01;
                break;
            }
            case CollisionPlanePosition.Front: {
                plane.position.z += 1.01;
                break;
            }
            case CollisionPlanePosition.Back: {
                geometryPlane.rotateX((180 * PI) / 180);
                plane.position.z -= 1.01;
                break;
            }
            case CollisionPlanePosition.Right: {
                geometryPlane.rotateY((90 * PI) / 180);
                plane.position.x += 1.01;
                break;
            }

            case CollisionPlanePosition.Left: {
                geometryPlane.rotateY((-90 * PI) / 180);
                plane.position.x -= 1.01;
                break;
            }
        }

        components_map.set(plane.uuid, (scene: THREE.Scene, action: ActionType) => {

            if (action === ActionType.Hover)
                materialPlane.opacity = 0.7;

            if (action === ActionType.Empty)
                materialPlane.opacity = 0.0;

            // if (action === ActionType.Press)
            //     this.addBeginningBlock(scene);

        });
        return plane
    }

    private get2DCollisionPlane(position: CollisionPlanePosition) {


        const geometryPlane = new THREE.PlaneGeometry(0.26, 1.6, 1, 1);
        const materialPlane = new THREE.MeshStandardMaterial({
            transparent: true,
            opacity: 0,
            color: 0x666666
        });
        var plane = new THREE.Mesh(geometryPlane, materialPlane);

        plane.position.x = this.position.x
        plane.position.y = this.position.y
        plane.position.z = this.position.z + 1.9

        switch (position) {
            case CollisionPlanePosition.Top2D: {
                geometryPlane.rotateY((-45 * PI) / 180);
                geometryPlane.rotateZ((-90 * PI) / 180);
                plane.position.y += 0.91;
                break;
            }
            case CollisionPlanePosition.Bottom2D: {
                geometryPlane.rotateY((45 * PI) / 180);
                geometryPlane.rotateZ((-90 * PI) / 180);
                plane.position.y -= 0.91;
                break;
            }
            case CollisionPlanePosition.Right2D: {
                geometryPlane.rotateY((45 * PI) / 180);
                plane.position.x += 0.91;
                break;
            }

            case CollisionPlanePosition.Left2D: {
                geometryPlane.rotateY((-45 * PI) / 180);
                plane.position.x -= 0.91;
                break;
            }
            default: {
                console.log("error")
            }
        }

        components_map.set(plane.uuid, (scene: THREE.Scene, action: ActionType) => {

            if (action === ActionType.Hover)
                materialPlane.opacity = 0.7;

            if (action === ActionType.Empty)
                materialPlane.opacity = 0.0;

            // if (action === ActionType.Press)
            //     this.addBeginningBlock(scene);

        });
        return plane
    }

    public addToScene(scene: THREE.Scene) {

        (new OBJLoader()).load('assets/tile.obj', (object) => {

            object.scale.set(2, 2, 2);
            object.position.set(this.position.x, this.position.y, this.position.z);
            this.group.add(object);
            scene.add(object);

        }
        );

        (new FontLoader()).load('fonts/Roboto_Regular.json', (font) => {

            var numberMesh = this.getNumberMesh(font, 12, 2);
            this.group.add(numberMesh);
            scene.add(numberMesh);

        });

        switch (this.mode) {
            case Mode.Mode3D: {
                scene.add(this.getCollisionPlane(CollisionPlanePosition.Top));
                scene.add(this.getCollisionPlane(CollisionPlanePosition.Bottom));
                scene.add(this.getCollisionPlane(CollisionPlanePosition.Front));
                scene.add(this.getCollisionPlane(CollisionPlanePosition.Back));
                scene.add(this.getCollisionPlane(CollisionPlanePosition.Right));
                scene.add(this.getCollisionPlane(CollisionPlanePosition.Left));
            }

            case Mode.Mode2D: {
                scene.add(this.get2DCollisionPlane(CollisionPlanePosition.Top2D));
                scene.add(this.get2DCollisionPlane(CollisionPlanePosition.Bottom2D));
            }

            case Mode.Mode1D: {
                scene.add(this.get2DCollisionPlane(CollisionPlanePosition.Right2D));
                scene.add(this.get2DCollisionPlane(CollisionPlanePosition.Left2D));
            }

        }



    }

}
