import * as THREE from 'three';
		import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
		//import Stats from 'three/examples/jsm/libs/stats.module.js';
		import { InstancedFlow } from 'three/examples/jsm/modifiers/CurveModifier.js';
		import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
		import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
		// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
		// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';


		const ACTION_SELECT = 1, ACTION_NONE = 0;
		const curveHandles = [];
		const mouse = new THREE.Vector2();

		//let stats;
		let scene,
			camera,
			renderer,
			rayCaster,
			control,
			flows = [],
			action = ACTION_NONE;

		init();
		animate();

		function init() {

			scene = new THREE.Scene();
      //scene.background =  new THREE.Color(0xffffff);
      scene.fog = new THREE.Fog(0xcc0044, 0, 10);
      

			camera = new THREE.PerspectiveCamera(
				50,
				window.innerWidth / window.innerHeight,
				1000,
				1
			);
			camera.position.set(2, 3, 3);
			camera.lookAt(scene.position);

			const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
			const boxMaterial = new THREE.MeshBasicMaterial();

			const height = 60;
			const radius = 0.8;

			let points = [];
      let factor = 1.2;
			for (let i = 0; i < 100*factor; i++) {
        let radiusInst = radius + Math.random()*0.1;
				let theta = (i / 20) * Math.PI * 2 + Math.PI  ;
				points.push(new THREE.Vector3(
					Math.sin(theta) * radiusInst,
					i / height * 1.2 - 1,
					Math.cos(theta) * radiusInst
				));
			}

			points.reverse();

			//coneole.log(points);
			const curves = [new THREE.CatmullRomCurve3(points)].map(function (curvePoints) {

				// const curveVertices = curvePoints.map( function ( handlePos ) {

				// 	const handle = new THREE.Mesh( boxGeometry, boxMaterial );
				// 	handle.position.copy( handlePos );
				// 	curveHandles.push( handle );
				// 	scene.add( handle );
				// 	return handle.position;

				// } );

				const curve = curvePoints;
				curve.curveType = 'centripetal';
				curve.closed = true;

				//const points = curve.getPoints( 50 );
				// const line = new THREE.LineLoop(
				// 	new THREE.BufferGeometry().setFromPoints( points ),
				// 	new THREE.LineBasicMaterial( { color: 0x000000 } )
				// );

				// scene.add( line );

				return {
					curve,
					//line
				};

			});


			//

			const light = new THREE.DirectionalLight(0xff0000);
			light.position.set(- 30, 0, 0);
			light.intensity = 1.0;
			scene.add(light);

			const light2 = new THREE.SpotLight(0x0033ff);
      light2.position.set(30, 30, -10);
			light2.intensity = 1.0;
			scene.add(light2);

			//

			const loader = new FontLoader();
			loader.load('fonts/helvetiker_bold.typeface.json', function (font) {

				const text = ['GUILT', 'RESENTMENT'];
				for (let k = 0; k < text.length; k++) {
					const geometry = new TextGeometry(text[k], {
						font: font,
						size: 0.2,
						height: 0.01,
						curveSegments: 100,
						bevelEnabled: true,
						bevelThickness: 0.01,
						bevelSize: 0.01,
						bevelOffset: 0,
						bevelSegments: 1,
					});

					geometry.rotateY(k === 0 ? 2*Math.PI : 0);
					const localPlane = new THREE.Plane(new THREE.Vector3(0, 0, k === 0 ? 1 : -1), 0);
          //localPlane.rotateY(Math.PI/8);


					const material = new THREE.MeshPhongMaterial({
						color: k === 0 ? 0xffffff : 0x3333ff,
						clippingPlanes: [localPlane],
						clipShadows: true
					});

					let numberOfInstances = k === 0 ? 30 : 15;
          numberOfInstances = numberOfInstances * factor;
					flows.push(new InstancedFlow(numberOfInstances, curves.length, geometry, material));

					for (let j = 0; j < flows.length; j++) {
            //console.log(flows[j]);
						curves.forEach(function ({ curve }, i) {
              //console.log(curve);
							flows[j].updateCurve(i, curve);
							scene.add(flows[j].object3D);

						});
					
						for (let i = 0; i < numberOfInstances; i++) {
							const curveIndex = i % curves.length;
							flows[j].setCurve(i, curveIndex);
							flows[j].moveIndividualAlongCurve(i, i * 1 / numberOfInstances);
						}
						//flow.object3D.setColorAt( i, new THREE.Color( 0xffffff * Math.random() ) );

					}
				}


			});

			//

			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.localClippingEnabled = true;
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			renderer.domElement.addEventListener('pointerdown', onPointerDown);

			rayCaster = new THREE.Raycaster();
			control = new TransformControls(camera, renderer.domElement);
			control.addEventListener('dragging-changed', function (event) {

				if (!event.value) {
					for (let j = 0; j < flows.length; j++) {
						curves.forEach(function ({ curve, line }, i) {

							const points = curve.getPoints(50);
							line.geometry.setFromPoints(points);

							flows[j].updateCurve(i, curve);


						});
					}

				}

			});

			//stats = new Stats();
			//document.body.appendChild(stats.dom);

			window.addEventListener('resize', onWindowResize);

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);

		}

		function onPointerDown(event) {

			action = ACTION_SELECT;
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

		}

		function animate() {

			requestAnimationFrame(animate);

			if (action === ACTION_SELECT) {

				rayCaster.setFromCamera(mouse, camera);
				action = ACTION_NONE;
				const intersects = rayCaster.intersectObjects(curveHandles, false);
				if (intersects.length) {

					const target = intersects[0].object;
					control.attach(target);
					scene.add(control);

				}

			}

			if (flows && flows.length > 0) {
				for (let j = 0; j < flows.length; j++) {
					flows[j].moveAlongCurve(0.0004);
				}

			}

			render();

		}

		function render() {

			renderer.render(scene, camera);

			//stats.update();

		}