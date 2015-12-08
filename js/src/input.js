define(["jquery", "src/ui"], function($, ui) {
    var Input = function(wrap, cfg){
      var text = '', target;

      $('#input-backspace').on('click', function(e){
        if (text.length)
          text = text.slice(0,-1);
          target[0].innerHTML = text;
      });
     
      $('.bcol').on('click', function(e){
        text += $(this)[0].children[0].innerHTML;
        target[0].innerHTML = text;
      });
      
      $('#input-close').on('click',function(e){
        wrap.css('display', 'none');
        target.css('text-decoration', 'none');
      });
      
      /* reset */
      this.reset = function(el){
        var element = el[0].getBoundingClientRect(),
            tmpLeft, ww = window.innerWidth;
        text = el[0].innerHTML;
        if (target) target.css('text-decoration', 'none');
        target = el;
        target.css('text-decoration', 'underline');
          
        if (element.left + cfg.wrapWidth + 20 >= ww){
            tmpLeft = ww - 20 - cfg.wrapWidth;
        } else tmpLeft = element.left;
          
        wrap.css('display', 'block').css('left', tmpLeft)
            .css('top', element.top + element.height);
      };
    };
   
    Input.init = function(cfg){
      var wrap, buttonsWrap, colSize, 
        wrapId = cfg.wrapId || 'input-wrap',
        i, keys = cfg.keys,
        keysLength = keys.length,        
        buttonsId = cfg.buttonsId || 'input-buttons',
        marginLeft = cfg.margin || 3,
        margin, inRow = 3, wrapWidth,
        backspaceId = 'input-backspace';
    
    wrap = $('#' + wrapId);
    buttonsWrap = $('#' + buttonsId)[0];     
      
    /* create keys */
    for (i=0; i<keysLength; i++){
      buttonsWrap.innerHTML += '<div class="bcol"><span class="mtext">' + keys[i] + '</span></div>';
    }  
    
    /* count button size */  
    if (window.innerWidth <= 120){
        wrapWidth = window.innerWidth;
        fullWidth = true;
    }
    else wrapWidth = 120;  
      
    wrap.css('width', wrapWidth + 'px');
    colSize = (100 - ((inRow + 1) * marginLeft)) / inRow; 
    colSize *= wrapWidth * 0.01;
    margin = wrapWidth * 0.01 * marginLeft;
      
    /* set backspace key */  
    $('#' + backspaceId)
     .css('height', colSize + 'px')
     .css('width', colSize * 2 + marginLeft  + 'px')
     .css('margin-left', margin + 'px')
     .css('margin-top', margin + 'px');
    
      /* set other keys */  
    $('.bcol')
        .css('width', colSize+'px')
        .css('height', colSize + 'px')
        .css('margin-left', margin + 'px')
        .css('margin-top', margin + 'px');          
    
    var fontSize = parseInt($('.mtext').css('font-size'));  
    $('.mtext').css('line-height', colSize / fontSize);  
    
    cfg.wrapWidth = wrapWidth;  
      
    var input = new Input(wrap, cfg);   
    return input;
    };
    
    return Input;
});