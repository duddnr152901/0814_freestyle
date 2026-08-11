// KV 좌/우 여백 채우기용 3D 구름 장식
// 참고 코드(perspective + translateZ 레이어드 구름)를 여러 인스턴스에서 재사용 가능하도록 일반화.
// 마우스 드래그로 시점을 돌리는 기능/휠 줌은 장식 용도에 맞지 않아 제외하고,
// 각 구름 조각이 스스로 천천히 회전하는 애니메이션만 유지한다.
(function () {
  'use strict';

  function createCloud(world, layers) {
    var base = document.createElement('div');
    base.className = 'kv-cloud3d__base';

    var x = 256 - (Math.random() * 512);
    var y = 256 - (Math.random() * 512);
    var z = 256 - (Math.random() * 512);
    base.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(' + z + 'px)';
    world.appendChild(base);

    var count = 5 + Math.round(Math.random() * 10);
    for (var j = 0; j < count; j++) {
      var cloud = document.createElement('div');
      cloud.className = 'kv-cloud3d__layer';
      cloud.style.opacity = .8;

      var lx = (256 - (Math.random() * 512)) * .2;
      var ly = (256 - (Math.random() * 512)) * .2;
      var lz = 100 - (Math.random() * 200);
      var a = Math.random() * 360;
      var s = .25 + Math.random();

      cloud.data = { x: lx, y: ly, z: lz, a: a, s: s, speed: .1 * Math.random() };
      cloud.style.transform = 'translateX(' + lx + 'px) translateY(' + ly + 'px) translateZ(' + lz + 'px) rotateZ(' + a + 'deg) scale(' + s + ')';

      base.appendChild(cloud);
      layers.push(cloud);
    }
  }

  function initCloud3D(viewport) {
    var world = viewport.querySelector('.kv-cloud3d__world');
    if (!world) return;

    var layers = [];
    for (var j = 0; j < 3; j++) {
      createCloud(world, layers);
    }

    function update() {
      for (var i = 0; i < layers.length; i++) {
        var d = layers[i].data;
        d.a += d.speed;
        layers[i].style.transform =
          'translateX(' + d.x + 'px) translateY(' + d.y + 'px) translateZ(' + d.z + 'px) rotateZ(' + d.a + 'deg) scale(' + d.s + ')';
      }
      requestAnimationFrame(update);
    }

    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var viewports = document.querySelectorAll('.kv-cloud3d');
    viewports.forEach(function (viewport) { initCloud3D(viewport); });
  });
})();
