/* //////     CONFIG    /////// */
require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: 'js/lib',
    paths: {
        'src': '../src'
    },
    enforceDefine: true
});

/* //////     MAIN    /////// */
define(["jquery", "src/view", "src/ui", "src/input"], function($, View, ui, Input) {
    /* // vars // */
    var view = new View(),
        speedNum, dotsNum, currMode = "empty",
        start = false,
        input = Input.init({
          wrapId: 'input-wrap',
          buttonsId: 'input-buttons',
          keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        });
    
    /* //   set default values   // */
    updateOptionValues();
        
    /* //   update values on click   // */
    $('#' + ui.btnOptions).on('mouseup touchend', function(){
        updateOptionValues();
        if (currMode !== "empty")
          view.reSet(currMode, dotsNum,speedNum);
    });
    
    /* ///   activate mode   /// */
    $('.' + ui.modeClass).on('click', function(){
        var that = $(this), activeBorder, pauseBtnSize;
        currMode = that.data("mode");        
        start = true;
        view.reSet(currMode, dotsNum,speedNum);
        activeBorder = parseInt( $('.' + ui.active).css('border-width') ) * 2;
        pauseBtnSize = ui.imgSize - activeBorder;
        $('#' + ui.pauseBtn).show()
            .css('width', pauseBtnSize + 2 + 'px')
            .css('height', pauseBtnSize + 'px')
            .appendTo(that)
            .css('background-image', 'url("img/_pause.png")');     
    });   
    
    /* /// pause toggle /// */
    $('#' + ui.pauseBtn).on('click',function(e){
        var that = $(this);
        start = (start) ? false : true;
        e.stopPropagation();
        if (start)
          that.css('background-image', 'url("img/_pause.png")');
        else
          that.css('background-image', 'url("img/_play.png")');
    });
    
    /* ///    on resize    /// */
    $(window).resize(function(){
        start = false;
        currMode = "empty";
        $('#' + ui.modeName).text(currMode);
        view.reRenderModeButtons();
        updateOptionValues();
        $('#' + ui.pauseBtn).hide();
    });
    
    /* ////  loop  //// */
    function animate(){
      if (start) {
        view.render();
      }   
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
    
    $('#' + ui.dotsNumber).on('click', function(e){
        input.reset($(this));
    });
    $('#' + ui.speedNumber).on('click', function(e){
        input.reset($(this));
    });
    
    /*//   update options values   //*/
    function updateOptionValues(){
      var inputDotsNumber = $('#' + ui.dotsNumber), 
          inputSpeedNumber = $('#' + ui.speedNumber);
      speedNum = parseInt( inputSpeedNumber[0].innerHTML );
      speedNum = (speedNum > 25) ? 25 : speedNum;
      inputSpeedNumber[0].innerHTML = speedNum;
      dotsNum = parseInt( inputDotsNumber[0].innerHTML );
      dotsNum = (dotsNum > 25) ? 25 : dotsNum;    
      inputDotsNumber[0].innerHTML = dotsNum;      
    };
    
    /* ////     request animation frame    //// */
    window.requestAnimationFrame = window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000/60);
        };
});