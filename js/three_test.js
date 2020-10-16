import * as THREE from '../node_modules/three/build/three.module.js';
import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

var container,controls,light,stats;
let cam, scene, renderer;
let geometry, material, mesh;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    cam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    cam.position.set( 100, 200, 300 );

	scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();    

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    
    window.addEventListener('resize',()=>{
        renderer.setSize(window.innerWidth,window.innerHeight);
        cam.aspect = window.innerWidth/window.innerHeight        
        cam.updateProjectionMatrix();
    })

    controls = new OrbitControls( cam, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();

	var groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1500, 1500 ), new THREE.MeshPhongMaterial( { color: 0xaaaaaa, depthWrite: false } ) );
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    var grid = new THREE.GridHelper(2000, 30, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    stats = new Stats();
    container.appendChild( stats.dom );
                
    fbxLoad();


}

function fbxLoad(){
    var loader = new FBXLoader();
    loader.load( './3d/fbx/drone_02.FBX', function ( object ) {
        
        object.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

                const oldMat = child.material;

                child.material = new THREE.MeshLambertMaterial( {  
                    color: oldMat.color,
                    map: oldMat.map,
                    //etc
                } );

            }

        } );

        scene.add( object );

    } );
}
function animate()
{
	requestAnimationFrame( animate );

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.01;
    
    renderer.render( scene, cam );
    stats.update();
}