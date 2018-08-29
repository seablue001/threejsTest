/*
1、创建场景
2、创建相机
3、渲染器
4、光源
5、物体
*/

// 全局变量
var scene, camera, fov, aspect, near, far, WIDTH, HEIGHT, renderer, container;

// 获取窗口宽高
WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;

// 场景
scene = new THREE.Scene();

// 相机
fov = 60;
aspect = WIDTH / HEIGHT;
near = 0.1;
far = 1000;
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// 设置相机位置
camera.position.x = 0;  
camera.position.z = 200;    
// camera.position.y = 100;
camera.position.y = 180;
// 渲染器
renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
});

// 设置大小
renderer.setSize(WIDTH, HEIGHT);

container = document.querySelector('#world');
container.appendChild(renderer.domElement);

// 光源
/*var light = new THREE.PointLight(0xff0000, 1, 300);
light.position.set(0, 350, 50);
scene.add(light);*/

var shadowLight = new THREE.DirectionalLight(0xffffff, 1);
shadowLight.position.set(500, 350, 1650);
scene.add(shadowLight);

var ambient = new THREE.AmbientLight( 0xff0000 );
        scene.add( ambient );

// 添加物体
var geometry = new THREE.BoxGeometry(20,20,20);
var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
var cube  =  new THREE.Mesh(geometry, material);
cube.position.y = 100;

scene.add(cube);


// 添加物体
var geometry2 = new THREE.BoxGeometry(20,20,20);
var material2 = new THREE.MeshPhongMaterial({ color: 0xffffff });
var cube2  =  new THREE.Mesh(geometry2, material2);
cube2.position.x = 100;
cube2.position.y = 200;
scene.add(cube2);


var geom = new THREE.CylinderGeometry(600,600,800,40,10);

// 在 x 轴旋转几何体
geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2))

// 创建材质
var mat = new THREE.MeshPhongMaterial({
	color: 0x0000fff,
	transparent: true,
	opacity: 6,
	shading: THREE.FlatShading
});


var sea = new THREE.Mesh(geom, mat);
sea.receiveShadow = true;

sea.position.y = -600;
scene.add(sea);
console.log(cube);

var helper = new THREE.GridHelper( 2000, 60 ,0x0000ff, 0x0000ff);
scene.add( helper );


var axes = new THREE.AxisHelper(500);
scene.add(axes);

// 渲染
loop();
function loop() {
	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}

window.addEventListener('click', function(e) {
	shadowLight.position.y = e.clientY;
	console.log(e);
});

/*window.addEventListener('click', onDocumentMouseDown);
function onDocumentMouseDown(e) {
    e.preventDefault();
    var mouse = {};
    //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    //新建一个三维单位向量 假设z方向就是0.5
    //根据照相机，把这个向量转换到视点坐标系
      var vector = new THREE.Vector3(mouse.x, mouse.y,0.5).unproject(camera);

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    //射线和模型求交，选中一系列直线
    var intersects = raycaster.intersectObjects(scene.children);
    console.log('imtersrcts=' + intersects)

    if (intersects.length > 0) {
        //选中第一个射线相交的物体
        SELECTED = intersects[0].object;
        var intersected = intersects[0].object;
        console.log(intersects[0].object);

        camera.lookAt(SELECTED);
    }


}*/


//监听鼠标滚动事件
window.addEventListener('mousewheel', mousewheel, false);
//鼠标滑轮-鼠标上下滑轮实现放大缩小效果
function mousewheel(e) {
            e.preventDefault();
            //e.stopPropagation();
            if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
                if (e.wheelDelta > 0) { //当滑轮向上滚动时
                    fov -= (near < fov ? 1 : 0);
                }
                if (e.wheelDelta < 0) { //当滑轮向下滚动时
                    fov += (fov < far ? 1 : 0);
                }
            } else if (e.detail) {  //Firefox滑轮事件
                if (e.detail > 0) { //当滑轮向上滚动时
                    fov -= 1;
                }
                if (e.detail < 0) { //当滑轮向下滚动时
                    fov += 1;
                }
            }
            //改变fov值，并更新场景的渲染
            camera.fov = fov;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            //updateinfo();
}


// 物体跟随鼠标移动
window.addEventListener('click', onDocumentMouseMove);
function onDocumentMouseMove(event) {
    event.preventDefault();
    var mouse3D = convertTo3DCoordinate(0,0,0.5);
    // cube.position.copy(mouse);
    // cube.position.y = mouse.y;
    console.log(mouse3D);
}

// 坐标转化函数
function convertTo3DCoordinate(clientX,clientY) {
    var mv = new THREE.Vector3((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1, 0.5 );
    mv.unproject(camera);   //这句将一个向量转成threejs坐标
    return mv;
}


// 拖拽插件
// 添加拖拽控件
initDragControls();
function initDragControls() {
    // 添加平移控件
    var transformControls = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transformControls);

    // 过滤不是 Mesh 的物体,例如辅助网格对象
    var objects = [];
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].isMesh) {
            objects.push(scene.children[i]);
        }
    }
    // 初始化拖拽控件
    var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);

    // 鼠标略过事件
    dragControls.addEventListener('hoveron', function (event) {
        // 让变换控件对象和选中的对象绑定
        transformControls.attach(event.object);
    });
    // 开始拖拽
    dragControls.addEventListener('dragstart', function (event) {
        dragControls.enabled = false;
    });
    // 拖拽结束
    dragControls.addEventListener('dragend', function (event) {
        dragControls.enabled = true;
    });
}