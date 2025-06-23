import * as THREE from 'three';
import { ActionType } from './CollisionPlanePosition';


export var components_map: Map<string, (scene: THREE.Scene, action: ActionType) => void> = new Map<string, (scene: THREE.Scene, action: ActionType) => void>()


export const PI: number = 3.14159265

