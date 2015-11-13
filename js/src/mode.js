define(["jquery", "src/ui"], function($, ui) {
    var Mode = function(el, cfg){
      this.name = cfg.name;
      this.formator = cfg.formator;
      this.changer = cfg.changer;
      this.addons = cfg.addons || null;
      this.btn = function(){
        return el;
      };
    };
   
    Mode.add = function(config){
      /* // dom btn create // */
      var btn = $(document.createElement('span'));
      btn
      .css('background-image', 'url("img/modes/' + config.name + '.png")')
      .css('background-size', 'cover');
      btn.addClass(ui.modeClass);
      btn.data('mode', config.name);
      $('#' + ui.modesBlock).append(btn);
            
      /* // dom btn event // */    
      btn.on('click', function(){
        var el = $(this);
        $('.' + ui.modeClass).removeClass(ui.active);
        el.addClass(ui.active);
        $('#' + ui.modeName).text(config.name);
      });
    
      /* // create new mode // */    
      var mode = new Mode(btn, config);
      return mode;
    };
    
    return Mode;
});