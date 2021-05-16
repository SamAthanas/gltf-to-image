import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as dat from 'dat.gui'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
//import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'

// Debug
const gui = new dat.GUI();

var pictures = { value: 15 };
var lightParams = { color:0xFFFFFF, bgColor:0xFFFFFF };
var textParams = { text: "export_name" };
var modelRotation = { x:0,y:0,z:0 };

gui.add(modelRotation, 'z', 0, Math.PI*2).step(Math.PI / 4).name("Rotation Z").onChange(() => { if (loadedModel) loadedModel.rotation.z = modelRotation.z});
gui.add(pictures, 'value', 1, 100).step(1).name("# Of Pictures");
gui.addColor(lightParams,"color").name("Model Color").onChange( () => pointLight.color.set(lightParams.color));
gui.addColor(lightParams,"bgColor").name("BG Color").onChange( () => renderer.setClearColor(lightParams.bgColor,1));
gui.add(textParams, "text").name("Export File Name");
gui.add({ loadFile: () => document.getElementById('myInput').click() }, 'loadFile').name('Load .GLTF file');
gui.add({ saveFile: () => rotateAndSave() }, 'saveFile').name('Rotate & Save');

document.getElementById('myInput').addEventListener('change', event => {
    readFile(event);
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
var loadedModel = undefined;

function readFile(evt) {
    try {
        var file = evt.target.files[0];
        const reader = new FileReader();
        reader.addEventListener( 'load', function ( event ) {
            const contents = event.target.result;
            const loader = new GLTFLoader();

            loader.parse( contents, '', function ( gltf ) {
                if (loadedModel !== undefined)
                    scene.remove(loadedModel);

                loadedModel = gltf.scene;
                scene.add(loadedModel);
            } );

        }, false );
        reader.readAsArrayBuffer( file );
    }
    catch(err) {
        alert("Error reading file, please check file type and make sure it is in GLTF binary format.");
    }
}

async function rotateAndSave() {
    if (typeof loadedModel === "undefined") {
        alert("Please load a file first!");
        return;
    }

    const delay = time => new Promise(resolve => setTimeout(resolve,time));

    let max = (Math.PI * 2);
    let inc = max / pictures.value;
    let imgData = [];
    for(let i = 0; i < max; i+=inc) {
        await delay(100);
        loadedModel.rotation.y += inc;
        imgData.push(renderer.domElement.toDataURL("image/jpeg") );
    }

    for(let i = 0; i < imgData.length;i++) {
        saveAsImage(imgData[i],i);
        await delay(1000);
    }
}

function saveAsImage(imgData,index) {
    var imgData;

    try {
        var strMime = "image/jpeg";
        saveFile(imgData.replace(strMime, "image/octet-stream"),`${textParams.text}${index+1}.jpg`);
    }
    catch (e) {
        console.log(e);
        return;
    }
}

function saveFile(strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link);
    } 
    else
        location.replace(uri);
}

const pointLight = new THREE.PointLight(0xFFFFFF, 3);
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 80;
pointLight.color = new THREE.Color(lightParams.color);
scene.add(pointLight);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0xffffff, 0.5);

const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

//const glitchPass = new GlitchPass();
//composer.addPass( glitchPass );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );

camera.far = 500;
camera.updateProjectionMatrix();

const tick = () => {
    composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();