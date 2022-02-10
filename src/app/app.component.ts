import { Component } from '@angular/core';


declare const BABYLON:any;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
  	title = 'Sample-Load-Model-NG';

	ngAfterViewInit(){
		var canvas:any = document.getElementById("renderCanvas");

		var startRenderLoop = function (engine:any, canvas:any) {
			engine.runRenderLoop(function () {
				if (sceneToRender && sceneToRender.activeCamera) {
					sceneToRender.render();
				}
			});
		}

		var engine:any = null;
		var scene:any = null;
		var sceneToRender:any = null;
		var createDefaultEngine = function() { 
			return new BABYLON.Engine(canvas, true, { 
				preserveDrawingBuffer: true,
				stencil: true,  
				disableWebGL2Support: false
			}); 
		};
		var createScene = function () {
			var scene = new BABYLON.Scene(engine);

			var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, 3), scene);
			camera.setTarget(new BABYLON.Vector3(0, 1, 0));
			camera.attachControl(canvas, true);

			var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
			light.intensity = 2;
			camera.speed = 0.1

			console.log("loading object...")
			BABYLON.SceneLoader.ImportMesh(
				"",
				"",
				"assets/model.glb",
				scene,
				()=>{
					console.log("load object done!")
				}
			)
			return scene;
		};
		const initFunction = async function() {    
			var asyncEngineCreation = async function() {
				try {
					return createDefaultEngine();
				} catch(e) {
					console.log("the available createEngine function failed. Creating the default engine instead");
					return createDefaultEngine();
				}
			}

			engine = await asyncEngineCreation();
			if (!engine) throw 'engine should not be null.';
			startRenderLoop(engine, canvas);
			scene = createScene();
		};
		initFunction().then(() => {sceneToRender = scene});

		// Resize
		window.addEventListener("resize", function () {
			engine.resize();
		});
	}
}
