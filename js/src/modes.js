define(["jquery", "src/mode", "src/digits"], function($, Mode, dlib) {
    var modes = [];
    
    /*      FORMAT 
    modes.push(Mode.add({
      name: '',
      formator: function(screen, dotsNum, a){
        var dots = [];
        dots[0] = { info };
        return dots;
      },
      changer: function(dots, speedNum){
        var i, info = dots[0];
      },
      addons: {}
    }));
    */
    
/* rotate */ modes.push(Mode.add({
      name: 'rotate',
        
      formator: function(screen, dotsNum, a){
        var dots = [], i,
            osX = screen.width / 2,
            osY = screen.height / 2 - 0.05 * screen.height;
        /* info block */
        dots[0] = {
          osX: osX,
          osY: osY,
          distance: a.distance,
          combine: true
        };
        for(i=0; i<dotsNum; i++){
          var dot ={};
          dot.angle = (Math.PI * 2 / dotsNum) * i;
          dot.x0 = dot.x = osX + Math.cos(dot.angle) * a.distance;
          dot.y0 = dot.y = osY + Math.sin(dot.angle) * a.distance;     
          dots.push(dot);
        }
        return dots;
      },
        
      changer: function(dots, speedNum){
        var i, angl,
            speed = (speedNum) ? speedNum : 1,
            k = 0.01 * speed,
            osX = dots[0].osX,
            osY = dots[0].osY,
            dist = dots[0].distance;
        for(i=1; i<dots.length; i++){
          dots[i].angle += k;
          dots[i].x = osX + Math.cos(dots[i].angle) * dist;
          dots[i].y = osY + Math.sin(dots[i].angle) * dist;     
        }
      },
        
      addons: {
        distance: 160 
        //add option.add({}); opposite duraction, ...
      }
    }));    
/* scale */ modes.push(Mode.add({
      name: 'scale',
        
      formator: function(screen, dotsNum, a){
        var dots = [], i,
            osX = screen.width / 2,
            osY = screen.height / 2 - 0.05 * screen.height;
        /* info block */
        dots[0] = {
          width: screen.width,
          height: screen.height,
          osX: osX,
          osY: osY,
          distance: a.distance,
          combine: true
        };
        for(i=0; i<dotsNum; i++){
          var dot ={};
          dot.angle = (Math.PI * 2 / dotsNum) * (i-60);
          dot.x0 = dot.x = osX;
          dot.y0 = dot.y = osY;
          dot.currDist = 0;
          dots.push(dot);
        }
        return dots;
      },
        
      changer: function(dots, speedNum){
        var i, angl,
            speed = (speedNum) ? speedNum : 1,
            k = 1 * speed,
            osX = dots[0].osX,
            osY = dots[0].osY,
            dist = (osX < osY) ? osX : osY;
        for(i=1; i<dots.length; i++){
          dots[i].currDist += k;
          if (dots[i].currDist > dist){
            dots[i].currDist = 0;
          }
          dots[i].x = osX + Math.cos(dots[i].angle) * dots[i].currDist;
          dots[i].y = osY + Math.sin(dots[i].angle) * dots[i].currDist;     
        }
      },
        
      addons: {
        distance: 160 
        //add option.add({}); opposite duraction, ...
      }
    }));    
/* flex */ modes.push(Mode.add({
      name: 'flex',
        
      /* formator */
      formator: function(screen, dotsNum, a){
        var dots = [], i,
            osX = screen.width / 2,
            osY = screen.height / 2 - 0.05 * screen.height;
        /* info block */
        dots[0] = {
          osX: osX,
          osY: osY,
          distance: a.distance,
          combine: true
        };
        for(i=0; i<dotsNum; i++){
          var dot ={};
          dot.angle = (Math.PI * 2 / dotsNum) * i;
          dot.x0 = dot.x = osX + Math.cos(dot.angle) * a.distance;
          dot.y0 = dot.y = osY + Math.sin(dot.angle) * a.distance;     
          dot.angle = 6 - dot.angle;
          dot.currDist = 0;
          dot.inc = -(Math.random());
          dots.push(dot);
        }
        return dots;
      },
        
      /* changer */
      changer: function(dots, speedNum){
        var i, angl,
            speed = (speedNum) ? speedNum : 1,
            osX = dots[0].osX,
            osY = dots[0].osY,
            dist = dots[0].distance, d,
            maxDist = dist * 2;
        for(i=1; i<dots.length; i++){
          dots[i].currDist += dots[i].inc;
            if (dots[i].currDist <= 0){
                dots[i].inc = Math.random();
                dots[i].inc *= speed;
            } else if (dots[i].currDist >= maxDist){
                dots[i].inc = Math.random();
                dots[i].inc *= speed;
                dots[i].inc *= -1;
            }
            d = dist - dots[i].currDist;
          dots[i].x = osX + Math.cos(dots[i].angle) * d;
          dots[i].y = osY + Math.sin(dots[i].angle) * d;  
        }
      },
        
      /* addons */
      addons: {
        distance: 160,
        inc: 1
      }
    }));
/* watch */ modes.push(Mode.add({
      name: 'watch',
    
      formator: function(screen, dotsNum, a){
        var dots = [],i,len,
            osX = screen.width / 2,
            osY = screen.height / 2 - 0.05 * screen.height,
            mar = a.margin * screen.width,
            rand = function(){
              var r = Math.floor(Math.random() * 255),
                g = Math.floor(Math.random() * 255),
                b = Math.floor(Math.random() * 255);
              return "rgb(" + r + "," + g + "," + b + ")";
            };
        dots[0] = { 
          dotsNum: dotsNum,
          osX: osX,
          osY: osY,
          lineWidth: 2,
          c1: rand(),
          c2: rand(),
          c3: rand(),
          mar: mar,
          adds: [
            {
              type: "circle",
              cfg: { 
                ox: osX,
                oy: osY,
                radius: (osX > osY) ? osY*0.8 : osX*0.8,
                currAngle: 0
              }
            },
            {
              type: "circle",
              cfg: { 
                ox: osX,
                oy: osY,
                radius: 8,
                currAngle: 0,
                fill: true
              }
            },
            {
              type: "circle",
              cfg: { 
                ox: osX,
                oy: osY,
                radius: 6,
                currAngle: 0,
                fill: true,
                color: "#000"
              }
            }
          ]
          ,combine: true
        };
        var sp3 = 0.1, sp2 = 0.4, sp1 = 0.7, k=0;
        for(i=0, len=dotsNum*3; i<len; i++, k++){
          var dot ={};
          dot.x0 = dot.x = osX;
          dot.y0 = dot.y = osY;     
          if (i<dotsNum){ 
            dot.speed = sp1;
            sp1 +=0.1;
          } else if (i<dotsNum*2){ 
            dot.speed = sp2;
            sp3 +=0.1;
          } else { 
            dot.speed = sp3;
            sp1 +=0.1;
          }
          
          if (k===dotsNum-1){
            dot.br = true;
            k=-1;
          }
          dots.push(dot);
        };
        return dots;
          
      },
      changer: function(dots, speedNum){
        var info = dots[0], dotsNum = info.dotsNum,
            i, length, oX, oY, lg, md, sm, tmp, 
            time, seconds, minutes, hours, secAngle, minAngle, hourAngle,
            circleAngle, circle = info.adds[0].cfg, core = info.adds[1].cfg,
            core2 = info.adds[2].cfg;
        
        /* circle movement */  
        circleAngle = Math.PI/180 * circle.currAngle;
        circle.currAngle+=2;
        circle.ox = circle.ox + Math.cos(circleAngle) * 0.2;
        circle.oy = circle.oy + Math.sin(circleAngle) * 0.2;
        
        /* smooth ticking */  
        dots.forEach(function(dot){
          dot.x = (dot.x < dot.x0) ? dot.x += dot.speed : dot.x -= dot.speed;
          dot.y = (dot.y < dot.y0) ? dot.y += dot.speed : dot.y -= dot.speed;
        });  
          
        time = new Date();
        if (!info.currSec || time.getSeconds() !== info.currSec){ 
            info.currSec = seconds = time.getSeconds();
            oX = info.osX;
            oY = info.osY;
            lg = (oX<oY)? oX/(dotsNum-1)-info.mar : oY/(dotsNum-1)-info.mar;
            md = lg / 1.5;
            sm = lg / 2;
            secAngle = Math.PI / 30 * (seconds - 15);
            minutes = time.getMinutes();
            minAngle = Math.PI / 30 * (minutes - 15);
            tmpHours = time.getHours();
            hours = (tmpHours > 12) ? tmpHours-12 : tmpHours;
            hourAngle = Math.PI / 6 * (hours - 3);

            for(i=1; i<=dotsNum; i++){
              tmp = lg * (i-1); 
              dots[i].color = info.c1;
              dots[i].x0 = oX + Math.cos(secAngle) * tmp;  
              dots[i].y0 = oY + Math.sin(secAngle) * tmp;
              tmp = md * (i-1);
              dots[i+dotsNum].color = info.c2;
              dots[i+dotsNum].x0 = oX + Math.cos(minAngle) * tmp;  
              dots[i+dotsNum].y0 = oY + Math.sin(minAngle) * tmp;
              tmp = sm * (i-1);
              dots[i+dotsNum*2].color = info.c3;
              dots[i+dotsNum*2].x0 = oX + Math.cos(hourAngle) * tmp;  
              dots[i+dotsNum*2].y0 = oY + Math.sin(hourAngle) * tmp;
            };                
        }
        if (dotsNum!==1){
            core.ox = core2.ox = dots[1].x0;
            core.oy = core2.oy = dots[1].y0;
        } else {
            core.ox = core2.ox = circle.ox;
            core.oy = core2.oy = circle.oy;
        }
      },
      addons: {
        margin: 0.01 /* %/100 */
      }
    }));
/* digital */ modes.push(Mode.add({
      name: 'digital',
      formator: function(screen, dotsNum, a){
        var dots = [],i,len,
            size = a.size,
            margin = a.margin,
            cr = a.colonRatio * size,
            osX = (screen.width - size*6 - margin*7 - cr*2)/2,
            osY = screen.height/2 - size * a.yratio, colonX, colonY;
        
        /* check values on screen fitting */
        if (osX<0){
            size += (osX)/3;
            cr = a.colonRatio * size;
            osX = (screen.width - size*6 - margin*7 - cr*2)/2;
        }
        
        /* colons x,y */
        colonX = osX + (size + margin) * 2 + cr/2;  
        colonY = osY + (size * a.yratio)/2;
          
        dots[0] = { 
          colonRatio: cr,
          size : size,
          gap : a.gap,
          margin : margin,
          oX: osX,
          oY: osY,
          yratio : a.yratio,
          adds: [
            {
              type: "circle",
              cfg: { 
                ox: colonX - a.gap,
                oy: colonY,
                radius: a.gap/2
              }
            },
            {
              type: "circle",
              cfg: { 
                ox: colonX - a.gap,
                oy: colonY + size * a.yratio,
                radius: a.gap/2
              }
            },
            {
              type: "circle",
              cfg: { 
                ox: colonX*2 +cr/2 - a.gap - osX,
                oy: colonY,
                radius: a.gap/2
              }
            },
            {
              type: "circle",
              cfg: { 
                ox: colonX*2 +cr/2 - a.gap - osX,
                oy: colonY + size * a.yratio,
                radius: a.gap/2
              }
            }
          ]
          ,combine: true
        };
        for(i=0; i<84; i++){
          var dot ={};
          dot.x0 = dot.x = osX;
          dot.y0 = dot.y = osY;
          dots.push(dot);
        } 
        return dots;
      },
      changer: function(dots, speedNum){
        var info = dots[0], i,j,length, oX=info.oX, oY=info.oY, yratio = info.yratio, 
            size = info.size, gap=info.gap, margin=info.margin,mar, 
            lib=dlib, time, hours, minutes, seconds,d=[], crmar,
            evalDigits, sendDigit;
        var xd, yd;
      dots.forEach(function(dot){
          dot.y = (dot.y0 && dot.y-dot.y0>100 || dot.y0-dot.y<speedNum) ? dot.y0 : (dot.y0 < dot.y) ? dot.y -= speedNum : dot.y += speedNum;
          dot.x = (dot.x0 && dot.x-dot.x0>100 || dot.x0-dot.x<speedNum) ? dot.x0 : (dot.x0 < dot.x) ? dot.x -= speedNum : dot.x += speedNum;
      });
          
      time = new Date();
      if (!info.currSec || time.getSeconds() !== info.currSec){
        info.currSec = seconds = time.getSeconds();  
        seconds = seconds +"";
        minutes = time.getMinutes() +"";
        hours = time.getHours() +"";
        mar = info.size + info.margin;
        crmar = info.colonRatio;
          
        /* evaluate digits for parts,ratios func ////*/
        evalDigits = function(val, lib, d){
          var parts = lib.parts[val], i; 
          for(i=0; i<parts.length; i++){
            d.push(lib.ratios[parts[i]]); 
          } 
        };
        
        /* send a digit func ////*/
        sendDigit = function(arr){
          if (arr.length===1){
            evalDigits(0, lib, d);
            evalDigits(arr, lib, d);
          } else {
            evalDigits(arr[0], lib, d);
            evalDigits(arr[1], lib, d);
          }
        };        
        
        sendDigit(hours);
        sendDigit(minutes);
        sendDigit(seconds);
        var digs=0;
        /* set coords */
        for(i=1, j=0, length=d.length; j<length; j++, i+=2){ 
          if (d[j].end) { 
            i-=2; digs++; 
            oX +=mar;
            if (digs%2===0) oX += crmar; 
            continue;
          }
            /*dot A*/
          dots[i].x0 = oX + d[j].x1 * size; 
          dots[i].y0 = oY + (d[j].y1 * yratio) * size;
          if (d[j].hor) 
            dots[i].x0 += gap; 
          else 
            dots[i].y0 += gap;
          dots[i].br = false;
            /*dot B*/
          dots[i+1].x0 = oX + d[j].x2 * size;
          dots[i+1].y0 = oY + (d[j].y2 * yratio) * size;
          if (d[j].hor) 
            dots[i+1].x0 -= gap; 
          else 
            dots[i+1].y0 -= gap;    
          dots[i+1].br = true;
        };
      }
      },
      addons: {
        size: 50,
        margin: 15,
        gap: 6,
        colonRatio: 0.9,
        yratio: 2
      }
    })); 
/* follow */ modes.push(Mode.add({
      name: 'follow',
      formator: function(screen, dotsNum, a){
        var dots = [],i,
            osX = screen.width / 2,
            osY = screen.height / 2;
        dots[0] = {
          counter: 0,
          move: true,
          isSet: false,
          preSet: a.preSetDots,
          osX: osX,
          osY: osY,
          combine: true,
          adds: [
            {
            type: "text",
              cfg: { 
                str: '',
                ox: 10,
                oy: 10,
                color: "#90ee90"
              }
            }
          ]
        };
        var v = 38 / dotsNum, index=0;
        for(i=0; i<dotsNum; i++){
          var dot ={};
          dot.x0 = dot.x = osX;
          dot.y0 = dot.y = osY;
          dots.push(dot);
        };
        dots[dots.length-1].br = true;
        return dots;
      },
      changer: function(dots, speedNum){
        var i, c, j, d1, d2,
            length=dots.length, 
            info = dots[0], 
            text = info.adds[0].cfg,
            loc = info.loc, 
            delay = (speedNum < 5) ? 5 - speedNum : 0;  
            
        c = info.counter = (!delay || info.counter === delay+1) ? 0 : info.counter += 1;
          
        if (loc && c === delay){
           /* preset all dots */
          if (!info.isSet) info.isSet = info.preSet(dots, loc);
          
          /* bubble each dot */
          if (length>2)
            for(i=1; i<length-1; i++){
              d1 = dots[i];
              d2 = dots[i+1];
              if (d1.x === d2.x && d1.y === d2.y) continue;
              d1.x = d2.x;
              d1.y = d2.y;  
            }
          /* set head */
          dots[length-1].x = loc.x;
          dots[length-1].y = loc.y;
        }
      },
      addons: {
        preSetDots: function(dots, loc){
          var i, len, dot;
          for (i=1, len=dots.length; i<len; i++){
            dot = dots[i];
            dot.x = loc.x;
            dot.y = loc.y;
          }
          return true;
        }
      }
    })); 
    
    return modes;
});