define(function() {
  var ui = {
    title: 'title', /* div# */
    
    main: 'main', /* div# */
    
    header: 'header', /* div# */
    options: 'options', /* div# */
    btnOptions: 'setOptions', /* div# */
    modeName: 'modeName', /* span# */
    dotsNumber: 'dotsNumber', /* input text# */
    speedNumber: 'speedNumber', /* input text# */
    
    wrapper: 'wrapper', /* div# */
    screenId: 'canvas', /* canvas# */
    
    modesBlock: 'modes', /* div# */
    modeClass: 'mode', /* div. */
    active: 'active', /* . */
    pauseBtn: 'pause', /* span# */ 
      
    footRow: 'footer', /* div# */  
    footer: 'foot' /* div# */
      
    ,  
    /* valuse */  
    marginBtwBtns: 5, /* % */
    imgSize: 40 /* px */
    /* active-border 5px */
    
    ,  
    /* modes info */
    rotate: '',
    scale: '',
    flex: '',
    watch: '',
    digital: '',
    follow: ''
      
  };
    
  return ui;
});