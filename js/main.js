(function () {
  'use strict';

  // 768px 이하에서는 풀페이지 스냅을 끄고 그냥 문서 스크롤로 동작
  var FULLPAGE_MIN_WIDTH = 768;

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('fs');
    if (!root) return;

    var mql = window.matchMedia('(min-width: ' + FULLPAGE_MIN_WIDTH + 'px)');

    function sync(isDesktop) {
      root.classList.toggle('fs--stacked', !isDesktop);
      document.documentElement.classList.toggle('fs--stacked', !isDesktop);

      if (isDesktop && !window.fsPage) {
        window.fsPage = new FullPage(root, {
          lockTime: 900,
          onChange: function (index) {
            // 필요 시 섹션 진입 트래킹 등을 여기에
            // console.log('section', index);
          }
        });
      } else if (!isDesktop && window.fsPage) {
        window.fsPage.destroy();
        window.fsPage = null;
        root.querySelectorAll('.fs__page').forEach(function (page) {
          page.style.transform = '';
        });
      }
    }

    sync(mql.matches);
    mql.addEventListener('change', function (e) { sync(e.matches); });

    initKvParallax();
  });

  function initKvParallax() {
    var kv = document.querySelector('.kv');
    if (!kv) return;

    var layers = kv.querySelectorAll('[data-depth]');
    if (!layers.length) return;

    var targetX = 0, targetY = 0; // -1 ~ 1
    var raf = null;

    function render() {
      raf = null;
      for (var i = 0; i < layers.length; i++) {
        var depth = parseFloat(layers[i].getAttribute('data-depth')) || 0;
        var x = targetX * depth;
        var y = targetY * depth;
        layers[i].style.transform = 'translate3d(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px, 0)';
      }
    }

    function requestRender() {
      if (!raf) raf = requestAnimationFrame(render);
    }

    kv.addEventListener('mousemove', function (e) {
      var rect = kv.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      requestRender();
    });

    kv.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      requestRender();
    });
  }
})();
