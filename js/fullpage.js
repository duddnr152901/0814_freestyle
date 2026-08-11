/**
 * FullPage — 휠 1회 = 1페이지 스냅 이동
 * 마지막 페이지는 내부 일반 스크롤을 우선 처리한다.
 */
(function (global) {
  'use strict';

  function FullPage(root, options) {
    var opts = options || {};
    this.root = root;
    this.pages = Array.prototype.slice.call(root.querySelectorAll('.fs__page'));
    this.navBtns = Array.prototype.slice.call(root.querySelectorAll('.fs__nav-btn'));
    this.index = 0;
    this.locked = false;
    this.lockTime = opts.lockTime || 900;
    this.touchY = 0;
    this.onChange = opts.onChange || function () {};

    this._bind();
    this._renderInitial();
  }

  FullPage.prototype._bind = function () {
    var self = this;

    this._onWheel = function (e) {
      if (self._scrollableAt(e.target, e.deltaY)) return;   // 내부 스크롤 우선
      e.preventDefault();
      if (self.locked || Math.abs(e.deltaY) < 8) return;
      self.go(self.index + (e.deltaY > 0 ? 1 : -1));
    };

    this._onKey = function (e) {
      if (['ArrowDown', 'PageDown', ' '].indexOf(e.key) > -1) { e.preventDefault(); self.go(self.index + 1); }
      if (['ArrowUp', 'PageUp'].indexOf(e.key) > -1) { e.preventDefault(); self.go(self.index - 1); }
    };

    this._onTouchStart = function (e) { self.touchY = e.touches[0].clientY; };

    this._onTouchEnd = function (e) {
      var d = self.touchY - e.changedTouches[0].clientY;
      if (Math.abs(d) > 50) self.go(self.index + (d > 0 ? 1 : -1));
    };

    window.addEventListener('wheel', this._onWheel, { passive: false });
    window.addEventListener('keydown', this._onKey);
    window.addEventListener('touchstart', this._onTouchStart, { passive: true });
    window.addEventListener('touchend', this._onTouchEnd, { passive: true });

    this.navBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.go(parseInt(btn.getAttribute('data-go'), 10));
      });
    });
  };

  /** 이벤트 발생 지점의 조상 중 실제 스크롤 가능한 박스가 있는지 */
  FullPage.prototype._scrollableAt = function (el, dy) {
    while (el && el !== document.body) {
      var oy = getComputedStyle(el).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 2) {
        var atTop = el.scrollTop <= 0;
        var atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        if ((dy > 0 && !atBottom) || (dy < 0 && !atTop)) return true;
      }
      el = el.parentElement;
    }
    return false;
  };

  FullPage.prototype.go = function (n) {
    var next = Math.max(0, Math.min(this.pages.length - 1, n));
    if (next === this.index) return;

    var last = this.pages[this.pages.length - 1];
    if (last && next !== this.pages.length - 1) last.scrollTop = 0;

    this.index = next;
    this.locked = true;
    this.render();
    this.onChange(next);

    var self = this;
    setTimeout(function () { self.locked = false; }, this.lockTime);
  };

  /** 최초 배치는 transition 없이 즉시 적용해 로드 시 슬라이드 다운 현상을 방지 */
  FullPage.prototype._renderInitial = function () {
    this.pages.forEach(function (page) { page.style.transition = 'none'; });
    this.render();
    void this.root.offsetHeight; // 강제 리플로우로 transition:none을 확정
    this.pages.forEach(function (page) { page.style.transition = ''; });
    // CSS의 "KV만 표시" 안전장치를 해제하고 transform 기반 정상 동작으로 전환
    this.root.classList.add('fs--ready');
  };

  FullPage.prototype.render = function () {
    var i = this.index;
    this.pages.forEach(function (page, n) {
      page.style.transform = 'translateY(' + ((n - i) * 100) + '%)';
    });
    this.navBtns.forEach(function (btn, n) {
      btn.classList.toggle('is-active', n === i);
    });
  };

  FullPage.prototype.destroy = function () {
    window.removeEventListener('wheel', this._onWheel);
    window.removeEventListener('keydown', this._onKey);
    window.removeEventListener('touchstart', this._onTouchStart);
    window.removeEventListener('touchend', this._onTouchEnd);
  };

  global.FullPage = FullPage;
})(window);
