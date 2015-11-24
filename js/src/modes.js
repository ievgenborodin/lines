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
/* menu */ modes.push(Mode.add({
      name: 'menu',
      formator: function(screen, dotsNum, a){
        var dots = [], vel=2,
            osX = screen.width / 2,
            osY = screen.height / 2,
            h20 = screen.height * 0.2,
            blocksInRow = 4, cArr, blockSpots;
          
        /* preset block positions */
        cArr = a.setBlockDots(screen.width, dotsNum, blocksInRow);  
        
        /* create block spots array */
        blockSpots = cArr.filter(function(b){
          return b.avail;
        });
          
        dots[0] = {
          state1: true,
          click: true,
          block: {
            spots: blockSpots,
            inRow: blocksInRow,
            notAvail: [],
            lastClick: null
          },
          fn: a,
          osX: osX,     osY: osY,
          velX: vel,    velY: vel,
          bArr: a.setTurnDots(osX, h20*2, h20, -15),
          ci: 0,
          combine: true,
          adds: []
        };
          
        /* create blocks */  
        a.createBloacks(dots[0].adds, dotsNum);
        
        /* create dots */  
        a.createDots(dots, osX, h20, vel*10, dotsNum, cArr);
        
        return dots;
      },
      changer: function(dots, speedNum){
        var i, dot, ci, a,
            info = dots[0], 
            blocks = info.adds,
            velX, velY, blen,
            block = info.block,
            spots = block.spots;
            
        info.velX = info.velY = speedNum;

        if(info.state1){  
            velX = info.velX;
            velY = info.velY;
            blen = info.bArr.length-1;
            
          for(i=1; i<dots.length; i++){
            dot = dots[i];

            if (Math.abs(dot.x - dot.x0) < velX) dot.x = dot.x0; 
            else dot.x = (dot.x < dot.x0) ? dot.x + velX : dot.x - velX;
            if (Math.abs(dot.y - dot.y0) < velY) dot.y = dot.y0;
            else dot.y = (dot.y < dot.y0) ? dot.y + velY : dot.y - velY;
              
            switch (dot.state){
                case 'a':
                    if (dot.x === dot.x0) {
                        dot.state = 'b';
                        dot.x0 = info.bArr[0].x;
                        dot.y0 = info.bArr[0].y;
                    }
                    break;
                case 'b':
                    if (dot.x === dot.x0 && dot.y === dot.y0) {
                        if(dot.bi < blen){
                          dot.bi++;
                          dot.x0 = info.bArr[dot.bi].x;
                          dot.y0 = info.bArr[dot.bi].y;
                        } 
                        else { 
                          dot.state = 'c'; 
                          dot.x0 = dot.cx;
                          dot.y0 = dot.cy;
                        }
                    } 
                    break;
                case 'c':
                  if(dot.x === dot.x0 && dot.y === dot.y0 && i%4!==0 && dot.br) {
                    dot.br = false;
                    info.ci++;
                  }
                  break;
            }
            if (info.ci === (blocks.length * 3)){
                info.state1 = false;
                info.fn.showBlocks(blocks, dots);
                
                /* set block params */
                block.x0 = blocks[0].cfg.ox;
                block.y0 = blocks[0].cfg.oy;
                block.toNext = (blocks.length > 1) ? blocks[1].cfg.ox - blocks[0].cfg.ox : null;
                block.width = blocks[0].cfg.width;
                
                /* remove dots */
                dots.length = 1;
            } 
          }
        } else {            
            /* check if any blocks should be moved */
            for(i=0; i<blocks.length; i++){
              a = blocks[i].cfg;
              /* x */    
              if (Math.abs(a.ox - a.x) < speedNum) a.ox = a.x; 
              else a.ox = (a.ox < a.x) ? a.ox+speedNum : a.ox-speedNum;
              /* y */
              if (Math.abs(a.oy - a.y) < speedNum) a.oy = a.y;
              else a.oy = (a.oy < a.y) ? a.oy+speedNum : a.oy-speedNum;
              /* width */
              if (Math.abs(a.width - a.w) < speedNum) a.width = a.w; 
              else a.width = (a.width < a.w) ? a.width+speedNum : a.width-speedNum;
              /* height*/
              if (Math.abs(a.height - a.h) < speedNum) a.height = a.h; 
              else a.height = (a.height < a.h) ? a.height+speedNum : a.height-speedNum;
            }
            
            if (info.loc){                
                ci = info.fn.checkCollisions(info, blocks);
                if (ci) {
                    ci = +ci;
                    
                    /* set default values for blocks */
                    info.fn.defaultizeBlocks(block, blocks);
                    
                    /* switch all spots to available */
                    spots.length = blocks.length;
                    block.notAvail = [];
                    for(i=0; i<spots.length; i++){
                        spots[i].avail = true;
                    }
                    
                    /* toggle */
                    if (block.lastClick !== ci){
                        /* reserve spots for clicked block */
                        if (ci !== 0 && (ci+1) % block.inRow === 0){
                           block.notAvail
                               .push(ci, ci-1, ci+block.inRow, ci-1+block.inRow);
                           blocks[ci].cfg.x = blocks[ci-1].cfg.x;
                           blocks[ci].cfg.y = blocks[ci-1].cfg.y;
                           info.fn.shiftRight(ci-1, blocks[ci-1], block);
                        } else {
                           block.notAvail
                            .push(ci, ci+1, ci+block.inRow, ci+1+block.inRow);
                        }
                        block.lastClick = ci;
                        blocks[ci].cfg.w = blocks[ci].cfg.h = block.width + block.toNext;
                        for (i=ci+1; i<blocks.length; i++){
                          info.fn.shiftRight(i, blocks[i], block);
                        }       
                    } else block.lastClick = null;
                }
            }
        }
      },
      addons: {
          createDots: function(arr, maxX, maxY, dist, blocksNum, blockCoords){
              var currDist =0, i, length, dot={};
                for(i=0, length=blocksNum*4; i<length; i++){
                  dot ={};
                  dot.x0 = maxX;
                  dot.x = currDist;
                  dot.y0 = dot.y = maxY;
                  dot.state = 'a';
                  dot.bi = 0;
                  dot.br = true;
                  dot.cx = blockCoords[i].x;
                  dot.cy = blockCoords[i].y;
                  arr.push(dot);
                  currDist -= dist;
                };
              arr[arr.length-1].br = true;
          },
          setTurnDots: function(ox, oy, r, startAngle){  
            var bArr = [], b = {}, 
                bCurrAngle = startAngle,
                bAngl;

            for(i=0; bCurrAngle < 0; i++){
                b={};
                bCurrAngle += 1;
                bAngl = Math.PI / 30 * bCurrAngle;
                b.x = ox + Math.cos(bAngl) * r;
                b.y = oy + Math.sin(bAngl) * r;
                bArr.push(b);
            }
            return bArr;
          },
          setBlockDots: function(width, blocks, mRatio){
            var cSize, cMar, i, 
                x1,x2,x3,x4, y1,y2,y3,y4, 
                arr=[];
            
            cSize = width / (mRatio + (mRatio + 1) * 0.1); /* margin 5% */
            cMar = cSize * 0.1;
            for(i=0; i<blocks; i++){
                x1 = x4 = (i % mRatio) * (cSize + cMar) + cMar;
                x2 = x3 = x1 + cSize;
                y1 = y2 = parseInt(i / mRatio) * (cSize + cMar) + cMar;
                y3 = y4 = y1 + cSize;
                arr.push({ x:x1, y:y1, avail:true },
                  { x:x2, y:y2 },
                  { x:x3, y:y3 },
                  { x:x4, y:y4 }
                );
            };
            return arr;
          },
          createBloacks: function(arr, len){
            var cfg = {};
            for(i=0; i<len; i++){
                cfg={};
                cfg.ox = cfg.oy = cfg.width = cfg.height = 0;
                cfg.color = '#00f';
                arr.push({
                  type: 'rect',
                  cfg: cfg
                });
            }
          },
          showBlocks: function(blocks, dots){
            var i, j, rect;
            for(i=0; i<blocks.length; i++){
              rect = blocks[i].cfg;
              j = i * 4 + 1;
              rect.ox = rect.x = dots[j].x;
              rect.oy = rect.y = dots[j].y;
              rect.width = rect.w = dots[j+2].x - dots[j].x;
              rect.height = rect.h = dots[j+2].y - dots[j].y;
            }
          },
          checkCollisions: function(info, blocks){ 
              var i, b, res,
                  loc = info.loc;
              for (i=0; i<blocks.length; i++){
                b = blocks[i].cfg;
                if (loc.x >= b.ox && loc.x <= b.ox + b.width 
                  && loc.y >= b.oy && loc.y <= b.oy + b.height){
                    res = i+'';
                    break;
                }
              }
              info.loc = null;
              return res;
          },
          defaultizeBlocks: function(blockParams, blocks){
            var i, b,
                bp = blockParams;
            for(i=0; i<blocks.length; i++){
              b = blocks[i].cfg;
              b.x = bp.x0 + bp.toNext * (i % bp.inRow);
              b.y = bp.y0 + bp.toNext * parseInt(i / bp.inRow);
              b.w = b.h = bp.width;
            }
          },          
          shiftRight: function(index, block, infoBlock){
            var spots = infoBlock.spots, na = infoBlock.notAvail, 
                i, res, tmp, x,y;
            
            /* go through the rest of spots */ 
            for (i=index; i<spots.length; i++){
                if (na.indexOf(i)===-1 && spots[i].avail){
                    res = i;
                    break;
                }
            }
              
            /* if none alailable - create new spot */  
            if (!res) {
              do {
                  tmp = spots.length;
                  if (tmp % infoBlock.inRow === 0) {
                    x = infoBlock.x0;
                    y = spots[tmp-1].y + infoBlock.toNext;
                  } else {
                    x = spots[tmp-1].x + infoBlock.toNext;
                    y = spots[tmp-1].y;
                  }
                  spots.push({
                    x: x,
                    y: y
                  });
                  res = (na.indexOf(tmp)===-1) ? tmp : null;
                } while(!res);
              }
             
              /* set block's new position */  
              block.cfg.x = spots[res].x;
              block.cfg.y = spots[res].y;
              spots[res].avail = false;
            }    
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
    return modes;
});