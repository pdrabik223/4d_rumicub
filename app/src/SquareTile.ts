import * as THREE from 'three';
import { Font, TextGeometry, FontLoader, OBJLoader } from 'three/examples/jsm/Addons.js';
import { components_map } from './globals';

export function getHexColor(colorId: number) {
    const colors = [0xf23a3a, 0xf2813a, 0x141212, 0x2361fc];
    if (colorId >= colors.length)
        throw new Error('Index out of range');

    return colors[colorId];
}


export class SquareTile {

    static tileMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x964B00 });
    static tileGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(2, 2, 2);

    private group = new THREE.Group();


    constructor() { }

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
        if (value >= 10) {
            mesh.scale.set(0.8, 0.8, 0.5 * 0.8);
            mesh.position.z += 1.6;
            mesh.position.x -= 0.6;
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



    public addToScene(scene: THREE.Scene) {

        (new OBJLoader()).load('assets/tile.obj', (object) => {

            object.scale.set(2, 2, 2);
            this.group.add(object);
            scene.add(object);
            console.log(object.uuid)
            components_map.set(object.uuid, () => { console.log(object) });
        }
        );

        (new FontLoader()).load('fonts/Roboto_Regular.json', (font) => {

            var numberMesh = this.getNumberMesh(font, 12, 2);
            this.group.add(numberMesh);
            scene.add(numberMesh);
            components_map.set(numberMesh.uuid, () => { console.log(numberMesh) });
        });
    }
}
