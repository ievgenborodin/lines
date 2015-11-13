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
define(["jquery", "src/view", "src/ui"], function($, View, ui) {
    /* // vars // */
    var view = new View(),
        speedNum, dotsNum, currMode = "empty",
        start = false;
    
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
    
    /*//   update options values   //*/
    function updateOptionValues(){
      var inputDotsNumber = $('#' + ui.dotsNumber), 
          inputSpeedNumber = $('#' + ui.speedNumber);
      speedNum = parseInt( inputSpeedNumber.val() ); 
      dotsNum = parseInt( inputDotsNumber.val() );
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