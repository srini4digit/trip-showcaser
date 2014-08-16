$(document).ready(function(){
  $('a[href^="#"]').on('click',function (e) {
      e.preventDefault();

      var target = this.hash,
      $target = $(target);

      $('.parallax').stop().animate({
          'scrollTop': $target.offset().top
      }, 2500, 'easeInOutSine', function () {
          window.location.hash = target;
      });
  });
});