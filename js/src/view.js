define(["jquery", "src/modes", "src/ui"], function($, modesArray, ui) {
    var View = function(config){
      
      /* // VARS // */
      var canvas, context, cw, ch, background,
          modes = [], mode, dots = [], speed = 1, loc={};
        
      canvas = $('#' + ui.screenId);
      context = canvas[0].getContext('2d');
      modes = modesArray;
        
      updateScreen();
      fixBtnStyle();    
      setBackground("#000");    
        
      /* ///   Render   /// */    
      this.render = function(){
        clr();
        setBackground();
        update(dots, speed);
        draw();
      };
        
      /* /// rerender mode buttons /// */
      this.reRenderModeButtons = function(){
        updateScreen();
        fixBtnStyle();
      };
    
      /* ///   reSet    /// */
      this.reSet = function(modeName, dotsNum, speedNum){
        mode = search(modeName);
        dots = mode.formator({
          width: cw,
          height: ch,
          loc: loc
        }, dotsNum, mode.addons);
        speed = speedNum;
        checkEvents(dots);
        update = mode.changer;
      };    
        
      /* /////   Clear Screen   ///// */    
      var clr = function(){
        context.clearRect(0, 0, cw, ch);
      },       
        tmpFunc = new Object(),  
      /* /////////////      DRAW     ///////////// */    
      draw = function(){
        var i, length, tmp, x, y, xn, yn,
        info = dots[0];
        context.fillStyle = info.fillColor || '#00f';
        context.strokeStyle = info.strokeColor || '#00f';
        context.lineWidth = (info.lineWidth) ? info.lineWidth : 1;
        
        for (i=1; i<dots.length; i++){
          if (!dots[i].x) break;
          x = dots[i].x;
          y = dots[i].y;
          context.fillRect(x-1, y-1, 2.5, 2);
        };
        if (info.combine)
            combine();
        if (info.adds){
          for (i=0, length=info.adds.length; i<length; i++){
            switch (info.adds[i].type){
              case "circle": 
                circle(info.adds[i].cfg);
                break;
              case "rect": 
                rect(info.adds[i].cfg);
                break;
              case "text": 
                text(info.adds[i].cfg);
                break;
              case "line": 
                line(info.adds[i].cfg);
                break;
            }
          };
        };   
      };  
        
      /* /////////////////   EVENTS SUPPORT  ///////////////////*/    
      function checkEvents(dots){
        var windowScroll = $(window).scrollTop();
          
        /*///// move //////*/  
        if (dots[0].move){
          canvas.on('mousemove touchstart touchmove', function(e){
            e.preventDefault();
            e.stopPropagation();
            switch (e.type){
              case 'mousemove':
                  dots[0].loc = getBoundingBox(canvas,e.clientX,e.clientY);
                  canvas.off('touchstart touchmove');
                  break;
              default:
                  dots[0].loc = getBoundingBox(canvas, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY - windowScroll);
            } 
          });
        }
        
        /*///// click ////*/ 
        if (dots[0].click){
          canvas.on('mousedown mouseup touchstart touchend', function(e){
            e.preventDefault();
            e.stopPropagation();
            switch (e.type){
              case 'mousedown':
                  dots[0].loc = getBoundingBox(canvas,e.clientX,e.clientY);
                  canvas.off('touchstart touchend');
                  break;
              case 'mouseup':
                  dots[0].loc = null;
                  break;
              default:
                  dots[0].loc = getBoundingBox(canvas, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY - windowScroll);
            } 
          });
        }
          
        /* /////   drag   ///// */  
        if (dots[0].drag){
          canvas.on('touchstart touchmove touchend mousedown mousemove mouseup', function(e) { 
 	        e.preventDefault();
            e.stopPropagation();
            switch (e.type){
              case 'mousedown':
                dots[0].loc = getBoundingBox(canvas,e.clientX,e.clientY);   
                dots[0].dragging = true;
                canvas.off('touchstart touchmove touchend');
              case 'mousemove':
                dots[0].loc = (dots[0].dragging) ? getBoundingBox(canvas,e.clientX,e.clientY) : dots[0].loc;
                break;
              case 'mouseup':
                dots[0].dragging = false;
                break;
              default:
              dots[0].loc = getBoundingBox(canvas, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY - windowScroll);
            }
          });
        }
      };
                   
        
      /* ADDS functions //////////////////// */
      function circle(cfg){
          var ox = cfg.ox || cw / 2,
              oy = cfg.oy || ch / 2,
              radius = cfg.radius || 0; 
          context.fillStyle = context.strokeStyle = (cfg.color) ? cfg.color : "#00f";
          context.lineWidth = (cfg.lineWidth) ? cfg.lineWidth : 1;
          context.beginPath();
          context.arc(ox, oy, radius, 0, Math.PI * 2, true);
          if (!cfg.fill) context.stroke();
          else context.fill();
      }
      function rect(cfg){
          context.strokeStyle = (cfg.color) ? cfg.color : "#00f";
          context.lineWidth = (cfg.lineWidth) ? cfg.lineWidth : 1;
          context.strokeRect(cfg.ox, cfg.oy, cfg.width, cfg.height);    
      }
      function line(cfg){
          context.strokeStyle = (cfg.color) ? cfg.color : "#00f";
          context.lineWidth = (cfg.lineWidth) ? cfg.lineWidth : 1;
          context.beginPath();
          context.moveTo(cfg.xo, cfg.yo); 
          context.lineTo(cfg.xn, cfg.yn);
          context.stroke();
      }
      function text(cfg){
          context.fillStyle = context.strokeStyle = (cfg.color) ? cfg.color : "#00f";
          context.lineWidth = (cfg.lineWidth) ? cfg.lineWidth : 1;
          context.fillText(cfg.str, cfg.ox, cfg.oy);    
      }
      
      /* Combine function //////////////*/
      function combine(){
        for (i=1; i<dots.length; i++){
              if (dots[i].br) continue;
              context.beginPath();
              context.fillStyle = context.strokeStyle = (dots[i].color) ? dots[i].color : "#00f";
              x = dots[i].x;
              y = dots[i].y;
              context.moveTo(x, y);
              xn = (dots[i+1]) ? dots[i+1].x : dots[1].x;
              yn = (dots[i+1]) ? dots[i+1].y : dots[1].y;
              context.lineTo(xn, yn);
              context.stroke();
        }
      } 
            
      /* //// */
      function update(){};    
        
      /* ////   Set screen resolution   //// */
      function updateScreen(){
          var w = $(window),
              headerHeight = $('#' + ui.header).height(),
             // footerHeight = $('#' + ui.footRow).height(),
              windowWidth = w.width(),
              windowHeight = w.height(),// - footerHeight,
              tempHeight, 
              wrapper = $('#' + ui.wrapper),
              wrapperWidth = wrapper.width(); 
          tempHeight = (windowWidth < 1200) ? windowHeight - headerHeight : windowHeight;
        wrapper.height(tempHeight + 'px');
        cw = canvas.width();
        ch = canvas.height();
        ui.imgSize = (cw>940) ? 50 : (cw>400) ? 40 : (cw>245) ? 35 : 30;
        ui.marginBtwBtns = (cw > 400) ? 5 : (cw > 298) ? 3 : 0;
        canvas.attr('width', cw + 'px')
              .attr('height', ch + 'px');
      };    
        
      /* //// Set Background color //// */
      function setBackground(color){
        background = color || background;
        context.fillStyle = background;
        context.fillRect(0,0, cw, ch);
      };    
      
      /* ////  Fix Positioning for Mods buttons  //// */
      function fixBtnStyle(){
        var percents, marPerc, length,
            imgSize, firstMargin;
        imgSize = (ui.imgSize * 100) / cw;
        length = modes.length;
        marPerc = ui.marginBtwBtns;
        margin = (length + 1) * marPerc;
        percents = (100-margin) / length;
        firstMargin = (percents - imgSize) * length / 2;
        $('.' + ui.modeClass)
            .width(imgSize + '%')
            .height(ui.imgSize + 'px')
            .css('margin-left', marPerc + '%')
            .removeClass('active');
        $('.' + ui.modeClass + ':first')
            .css('margin-left', marPerc + firstMargin + '%');
      };
        
      /* ////   Update Display Size   //// */    
      function updateDisplaySize(){
        cw = canvas.width();
        ch = canvas.height();
      };    
        
      /* ////  Search  //// */
      function search(modeName){
        var m = modes.filter(function(mode){
           return (mode.name === modeName);
        });
        return  m[0];
      };   
    };
   
    /* ////  Bounding Box  //// */
    function getBoundingBox(element, x, y) {
        var bbox = element[0].getBoundingClientRect();
        return { x: x - bbox.left * (element[0].width / bbox.width),
            y: y - bbox.top * (element[0].height / bbox.height)
        };
    }
    
    return View;
});