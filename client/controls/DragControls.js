import * as THREE from 'three';
THREE.DragControls = function ( _objects, _camera, _domElement, _scene) {

	if ( _objects instanceof THREE.Camera ) {

		console.warn( 'THREE.DragControls: Constructor now expects ( objects, camera, domElement )' );
		var temp = _objects; _objects = _camera; _camera = temp;

	}

	var _plane = new THREE.Plane();
	var _raycaster = new THREE.Raycaster();

	var _mouse = new THREE.Vector2();
	var _offset = new THREE.Vector3();
	var _intersection = new THREE.Vector3();

	var _selected = null, _hovered = null;
	//

	var scope = this;

	function activate() {

		_domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		_domElement.addEventListener( 'mouseup', onDocumentMouseCancel, false );//able to release
    _domElement.addEventListener( 'mouseleave', onDocumentMouseCancel, false );
		// _domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
		// _domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
    // _domElement.addEventListener( 'touchend', onDocumentTouchEnd, false );
    // _domElement.addEventListener( 'scroll', onDocumentscroll, false );
    // _domElement.addEventListener( 'gesturechange', onDocumentGestureChange, false );
    // _domElement.addEventListener( 'gestureend', onDocumentGestureEnd, false );
    // _domElement.addEventListener( 'dblclick', onDoubleClick, false );

	}

	function deactivate() {

		_domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.removeEventListener( 'mousedown', onDocumentMouseDown, false );
		_domElement.removeEventListener( 'mouseup', onDocumentMouseCancel, false );
		_domElement.removeEventListener( 'mouseleave', onDocumentMouseCancel, false );
		// _domElement.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		// _domElement.removeEventListener( 'touchstart', onDocumentTouchStart, false );
    // _domElement.removeEventListener( 'touchend', onDocumentTouchEnd, false );
    // _domElement.removeEventListener( 'gesturestart', onDocumentGestureStart, false );
    // _domElement.removeEventListener( 'gesturechange', onDocumentGestureChange, false );
    // _domElement.removeEventListener( 'gestureend', onDocumentGestureEnd, false );

	}

	function dispose() {

		deactivate();

	}

	function onDocumentMouseMove( event ) {

		event.preventDefault();

		var rect = _domElement.getBoundingClientRect();
		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_selected.position.copy( _intersection.sub( _offset ) );

			}

			return;

    }
    
		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );
		if ( intersects.length > 0 ) {
			var object = intersects[ 0 ].object;

			_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), object.position );

			if ( _hovered !== object ) {

				_domElement.style.cursor = 'pointer';
				_hovered = object;

			}

		} else {

			if ( _hovered !== null ) {

				_domElement.style.cursor = 'auto';
				_hovered = null;

			}

		}

  }
  
  function onDocumentKeyDown(event) {
    if (event.which === 87) {
      _selected.position.z -= 1;
      _intersection.z -= 1;
      _offset.z += 1;
    } else if (event.which === 83) {
      _selected.position.z += 1;
      _intersection.z += 1;
      _offset.z -= 1;
    }
  }

	function onDocumentMouseDown( event ) {

		event.preventDefault();
		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			_selected = intersects[ 0 ].object;
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

        _offset.copy( _intersection ).sub( _selected.position );
        window.addEventListener('keydown', onDocumentKeyDown, false);

			}

			_domElement.style.cursor = 'move';
      

		} else {
      var position = _mouse;
		  var box = new THREE.BoxGeometry( 1, 1, 1 );
			var boxMaterial = new THREE.MeshNormalMaterial();
			var cube = new THREE.Mesh( box, boxMaterial );
			var geo = new THREE.EdgesGeometry( cube.geometry );
			var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
			var wireframe = new THREE.LineSegments( geo, mat );
			wireframe.renderOrder = 1;
			cube.add( wireframe );
			cube.position.x = position.x;
			cube.position.y = position.y;
			cube.position.z = 0;
			cube.overdraw = true;
			_scene.add( cube );
			console.log(cube, _scene,  _intersection);
    }


	}

	function onDocumentMouseCancel( event ) {

		event.preventDefault();

		if ( _selected ) {

      scope.dispatchEvent( { type: 'dragend', object: _selected } );
      
      window.removeEventListener('keydown', onDocumentKeyDown, false);

      _selected = null;

		}

		_domElement.style.cursor = _hovered ? 'pointer' : 'auto';

	}

	function onDocumentTouchMove( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();
		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_selected.position.copy( _intersection.sub( _offset ) );

			}

			return;

		}

	}

	function onDocumentTouchStart( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			_selected = intersects[ 0 ].object;

			_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _selected.position );

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_offset.copy( _intersection ).sub( _selected.position );

			}

			_domElement.style.cursor = 'move';


		}


	}

	function onDocumentTouchEnd( event ) {

		event.preventDefault();

		if ( _selected ) {


			_selected = null;

		}

		_domElement.style.cursor = 'auto';

  }
  


	activate();

	// API

	this.enabled = true;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;

	// Backward compatibility

	this.setObjects = function () {

		console.error( 'THREE.DragControls: setObjects() has been removed.' );

	};

	this.on = function ( type, listener ) {

		console.warn( 'THREE.DragControls: on() has been deprecated. Use addEventListener() instead.' );
		scope.addEventListener( type, listener );

	};

	this.off = function ( type, listener ) {

		console.warn( 'THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.' );
		scope.removeEventListener( type, listener );

	};

	this.notify = function ( type ) {

		console.error( 'THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.' );
		scope.dispatchEvent( { type: type } );

	};

};

THREE.DragControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DragControls.prototype.constructor = THREE.DragControls;

export default THREE.DragControls;