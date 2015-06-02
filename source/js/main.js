/**
 * Created by nazariibanakh on 13.05.15.
 */

// Popup blur options
// --------------------------------------------
var bodyContentCloud = $(".clouds"),
    buttonClosePopup = $(".hold-page-popup-btn");

var popupWrapper = $('.hold-page-popup-wrapper').blurbox({
  blur: 15,
  animateBlur: true,
  duratio: 500,
  //autosize: true,
  bgColor: 'rgba(255,255,255,0.7)',
  bodyContent: null,
  closeOnBackgroundClick: true
});
buttonClosePopup.on('click', function(){
  bodyContentCloud.removeClass('clouds-blur');
});
$("#open-popup").on('click', function(){
  popupWrapper.show();
  bodyContentCloud.addClass('clouds-blur');
});


