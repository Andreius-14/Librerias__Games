import * as THREE from 'three';

// 🌱 Puntos clave [Scene - Camaera - renderer]

// Campo [Scene - Camera - Renderer]
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
const renderer = new THREE.WebGLRenderer();

// Propiedad [Camara - Renderer]
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// 🌱 Creamos Geometria -- blue LineBasicMaterial

//Puntos que seran interconectados
const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 15, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 0, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
const line = new THREE.Line( geometry, material );

// Insercion
scene.add( line );


// 🌱 Render
renderer.render( scene, camera );
