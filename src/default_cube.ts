import {
    Mesh,
    MeshNormalMaterial,
    BoxGeometry,
    MeshLambertMaterial,
    TextureLoader,
    Vector3,
    FontLoader,
    Scene,

} from "three";

import TextGeometry, { BMFont, BMFontJsonParser, TextGeometryOption, TextAlign } from 'three-text-geometry'
// import { CSS3DRenderer, CSS3DObject }
//     from "three";

export enum TileColor {
    Orange,
    Red,
    Black,
    Blue,
    None,
}

export class DefaultCube {

    private color: TileColor
    private value: number


    constructor(color: TileColor, value: number) {
        this.color = color;
        this.value = value;
    }

    public getMesh(scene: Scene) {
        const geometry = new BoxGeometry(200, 200, 200);
        const material = new MeshNormalMaterial();

        const loader = new FontLoader();

        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            // Create 3D text geometry
            const geometry = new TextGeometry('Hello, 3D World!', {
                font: font,
                size: 1,
                height: 0.2,
                curveSegments: 12,
            });

            // Create the 3D text mesh
            const textMesh = new Mesh(geometry, material);
            scene.add(textMesh);

            // Position the text
            textMesh.position.set(-5, 0, 0);

        })
    }
}