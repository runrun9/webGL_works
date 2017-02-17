(function(){
  var stats;
  var beard, camera, scene, renderer;
  var helper;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var clock = new THREE.Clock();
  var modelReady = false;
  var musicReady = false;
  var controls;
  var composer,glitchPass;
  var meshes = {
    "fox": null,
    "rain": null,
    "unity_chan": null,
    "pronama": null
  }

  init();
  loop();

  function init() {
    // シーンの作成
    scene = new THREE.Scene();

    // FPSの表示
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);

    // 光の作成
    var ambient = new THREE.AmbientLight(0xeeeeee);
    scene.add(ambient);
    var light1 = new THREE.DirectionalLight(0x888888, 0.3);
    light1.position.set(-50, 15, 30);
    scene.add(light1);
    var light2 = new THREE.DirectionalLight(0x888888, 0.3);
    light2.position.set(50, 15, 30);
    scene.add(light2);

    // 画面表示の設定
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowWidth, windowHeight);
    // renderer.setClearColor(new THREE.Color( 0xffffff));
    document.body.appendChild(renderer.domElement);

    // カメラの作成
    camera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 1, 1000);
    camera.position.set(0, 10, 35);
    scene.add(camera);
    // VR表示へ変換
    effect = new THREE.StereoEffect(renderer);
    //pcの場合ドラッグ操作
    controls = new THREE.OrbitControls(camera, effect.domElement);
    // スマートフォンの場合はジャイロセンサーでの操作へ変更
    function setOrientationControls(e) {
      if (!e.alpha) {
        return;
      }

      controls = new THREE.DeviceOrientationControls(camera, true);
      controls.connect();
      controls.update();
      window.removeEventListener("deviceorientation", setOrientationControls, true);
    }
    window.addEventListener("deviceorientation", setOrientationControls, true);
    //controls.rotateUp(Math.PI / 4);
    controls.target.set(
      camera.position.x,
      camera.position.y,
      camera.position.z-0.15
    );
    controls.noZoom = true;
    controls.noPan = true;
    controls.update();

    // ステージの作成
    var sGeometry = new THREE.PlaneGeometry(300, 300);
    var stageTexture = THREE.ImageUtils.loadTexture('sirokuroA.jpg');
    stageTexture.wrapS = stageTexture.wrapT = THREE.RepeatWrapping;
    stageTexture.repeat.set(100, 100);
    var sMaterial = new THREE.MeshLambertMaterial({map:stageTexture, side: THREE.DoubleSlide});
    var stage = new THREE.Mesh(sGeometry, sMaterial);
    stage.position.set(0, -10, 0)
    stage.rotation.x = -90 * Math.PI / 180;
    scene.add(stage);

    // バックベアードの作成
    sGeometry = new THREE.PlaneGeometry(20, 20);
    var bbTexture = THREE.ImageUtils.loadTexture('BackBeard.png');
    var sMaterial = new THREE.MeshLambertMaterial({map:bbTexture, side: THREE.DoubleSlide, transparent: true});
    beard = new THREE.Mesh(sGeometry, sMaterial);
    beard.position.set(0, 45, 35)
    scene.add(beard);

    // モデル読み込み(キツネ)
    // パーサーを作ります
    var parser = new vox.Parser();
    // *.voxファイルを読み込みます
    parser.parse("models/vox/chr_fox.vox").then(function(voxelData) { // ←ボクセルデータが取れます
      // // データ全体の大きさ
      // voxelData.size; // => { x: number, y: number, z: number }
      // // ボクセルの配列
      // voxelData.voxels; // => [Voxel, Voxel, Voxel, ...]
      // // ボクセル一個のデータ
      // voxelData.voxels[0]; // => { x: number, y: number, z: number, colorIndex: number }
      // // カラーパレット
      // voxelData.palette; // => [Color, Color, Color, ...]
      // voxelData.palette[0]; // => { r: number, g: number, b: number, a: number }

      // ビルダーを作ります。引数にボクセルデータをわたします
      var builder = new vox.MeshBuilder(voxelData);
      // THREE.Meshを作ります
      meshes.fox = builder.createMesh();
      // THREE.Sceneに追加するなどして使ってください
      // mesh.material.specular="0xffff00";
      meshes.fox.material.specular.r=0;
      meshes.fox.material.specular.g=255;
      meshes.fox.material.specular.b=255;
      meshes.fox.material.shininess=1000;
      meshes.fox.material.transparent=true;
      meshes.fox.material.opacity=0.7;
      scene.add(meshes.fox);
      var edge = new THREE.EdgesHelper( meshes.fox, "#000" );
      edge.material.linewidth = 2;
      scene.add(edge);
      meshes.fox.castShadow = true;
      meshes.fox.receiveShadow = true;
    });

    //↑同じくrainを作る
    parser.parse("models/vox/chr_rain.vox").then(function(voxelData) {
      // ビルダーを作ります。引数にボクセルデータをわたします
      var builder = new vox.MeshBuilder(voxelData);
      // THREE.Meshを作ります
      meshes.rain = builder.createMesh();
      // THREE.Sceneに追加するなどして使ってください
      // mesh.material.specular="0xffff00";
      meshes.rain.material.specular.r=0;
      meshes.rain.material.specular.g=255;
      meshes.rain.material.specular.b=255;
      meshes.rain.material.shininess=1000;
      meshes.rain.material.transparent=true;
      meshes.rain.material.opacity=0.7;
    meshes.  rain.position.set(35,0,35);
      scene.add(meshes.rain);
      var edge = new THREE.EdgesHelper( meshes.rain, "#000" );
      edge.material.linewidth = 2;
      scene.add(edge);
      meshes.rain.castShadow = true;
      meshes.rain.receiveShadow = true;
    });

    //↑同じくユニティちゃんを作る
    parser.parse("models/vox/unity.vox").then(function(voxelData) {
      // ビルダーを作ります。引数にボクセルデータをわたします
      var builder = new vox.MeshBuilder(voxelData);
      // THREE.Meshを作ります
      meshes.unity_chan = builder.createMesh();
      // THREE.Sceneに追加するなどして使ってください
      // mesh.material.specular="0xffff00";
      meshes.unity_chan.material.specular.r=0;
      meshes.unity_chan.material.specular.g=255;
      meshes.unity_chan.material.specular.b=255;
      meshes.unity_chan.material.shininess=1000;
      meshes.unity_chan.material.transparent=true;
      meshes.unity_chan.material.opacity=0.7;
      meshes.unity_chan.position.set(-35,0,35);
      scene.add(meshes.unity_chan);
      var edge = new THREE.EdgesHelper( meshes.unity_chan, "#000" );
      edge.material.linewidth = 2;
      scene.add(edge);
      meshes.unity_chan.castShadow = true;
      meshes.unity_chan.receiveShadow = true;
    });

    //↑同じくプロ生ちゃんを作る
    parser.parse("models/vox/pronama.vox").then(function(voxelData) {
      // ビルダーを作ります。引数にボクセルデータをわたします
      var builder = new vox.MeshBuilder(voxelData);
      // THREE.Meshを作ります
      meshes.pronama = builder.createMesh();
      // THREE.Sceneに追加するなどして使ってください
      // mesh.material.specular="0xffff00";
      meshes.pronama.material.specular.r=0;
      meshes.pronama.material.specular.g=255;
      meshes.pronama.material.specular.b=255;
      meshes.pronama.material.shininess=1000;
      meshes.pronama.material.transparent=true;
      meshes.pronama.material.opacity=0.7;
      meshes.pronama.position.set(0,0,70);
      scene.add(meshes.pronama);
      var edge = new THREE.EdgesHelper( meshes.pronama, "#000" );
      edge.material.linewidth = 2;
      scene.add(edge);
      meshes.pronama.castShadow = true;
      meshes.pronama.receiveShadow = true;
    });

    //パーティクル作成
    var particles = new THREE.Geometry();
    var material = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.1,
      transparent: true
    });
    for (var i = 0;i < 1000;i++){
      var px = Math.random()*500-250,
      py = Math.random()*500-250,
      pz = Math.random()*500-250;
      var particle = new THREE.Vector3( px, py, pz);
      particles.vertices.push( particle );
    }
    pointCloud = new THREE.Points( particles, material );
    console.log(particles[0]);
    scene.add(pointCloud);

    ////////////////////////////////////////
    // shadow
    light1.castShadow = true;
    light2.castShadow = true;
    stage.receiveShadow = true;
    renderer.shadowMapEnabled = true;

    ////////////////////////////////////////

    // リサイズ時
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();
  }

  function onWindowResize() {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      camera.aspect = windowWidth / windowHeight;
      camera.updateProjectionMatrix();
      effect.setSize(windowWidth, windowHeight);
  }

  function loop() {
    requestAnimationFrame(loop);
    render();
  }

  function render() {
      // renderer.clear();
      effect.render(scene, camera);
      stats.update();
      controls.update();

      meshes.fox.rotation.y += 0.015;
      meshes.rain.rotation.y += 0.015;
      meshes.unity_chan.rotation.y += 0.015;
      meshes.pronama.rotation.y += 0.015;
      beard.rotation.setFromRotationMatrix(camera.matrix);
      // fox.scale.x += 0.0005;
      // fox.scale.y += 0.0005;
      // fox.scale.z += 0.0005;
  }
})();
