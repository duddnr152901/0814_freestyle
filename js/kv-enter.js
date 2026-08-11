// KV 등장 애니메이션 (jQuery) : 좌측 캐릭터는 좌→우, 우측 캐릭터는 우→좌, 타이틀 묶음은 위→아래,
// 배경 라인(1시/7시)은 맨 마지막 순서로 각각 위→아래 / 아래→위로 등장
jQuery(function ($) {
  var sequence = [
    { selector: '.kv__char-top .kv__enter', delay: 0 },
    { selector: '.kv__char-lt .kv__enter', delay: 150 },
    { selector: '.kv__char-rt .kv__enter', delay: 250 },
    { selector: '.kv__char-lb .kv__enter', delay: 400 },
    { selector: '.kv__char-rb .kv__enter', delay: 500 },
    { selector: '.kv__logo', delay: 650 },
    { selector: '.kv__kicker', delay: 780 },
    { selector: '.kv__title', delay: 910 },
    { selector: '.kv__info', delay: 1040 },
    { selector: '.kv__cta', delay: 1170 },
    { selector: '.kv__bgline--pos1 .kv__bgline-enter', delay: 1300 },
    { selector: '.kv__bgline--pos7 .kv__bgline-enter', delay: 1300 }
  ];

  $.each(sequence, function (i, step) {
    setTimeout(function () {
      $(step.selector).addClass('is-in');
    }, step.delay);
  });
});
