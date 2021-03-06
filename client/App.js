import * as THREE from 'three';
import DragControls from './controls/DragControls';


import React, { Component } from 'react';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var mx = 1.5;
var objects = [];

for (let i = 0; i < 10; i ++) {
  var box = new THREE.BoxGeometry( 1, 1, 1 );
  var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff7373});
  var cube = new THREE.Mesh( box, boxMaterial );
  var geo = new THREE.EdgesGeometry( cube.geometry );
  var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
  var wireframe = new THREE.LineSegments( geo, mat );
  wireframe.renderOrder = 1;
  cube.add( wireframe );
  scene.add( cube );
  cube.position.x = -7.5 + mx;
  objects.push(cube);
  mx += 1.5;
}

camera.position.z = 10;

var animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();

function addCube(x, y, z) {
  var box = new THREE.BoxGeometry( 1, 1, 1 );
  var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff7373});
  var cube = new THREE.Mesh( box, boxMaterial );
  var geo = new THREE.EdgesGeometry( cube.geometry );
  var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
  var wireframe = new THREE.LineSegments( geo, mat );
  wireframe.renderOrder = 1;
  cube.add( wireframe );
  scene.add(cube);
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;
  cube.overdraw = true;
  objects.push(cube)
  console.log('added cube')
}

class App extends Component {
  async componentDidMount() {
    await animate();
    let dragControls = new DragControls(objects, camera, renderer.domElement, scene);
    renderer.domElement.addEventListener('click', function(event) {
      dragControls = new DragControls(objects, camera, renderer.domElement, scene);
      return addCube(event.clinetX, event.clientY, 0);
    })
  }

  render() {
    return (
      <div>
        Hello World!
      </div>
    )
    
  }
}

export default App