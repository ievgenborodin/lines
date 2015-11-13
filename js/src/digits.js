define(function(){
  var dlib = {
    parts: [
      ["a", "b", "c", "d", "e", "f", "z", "x"],
      ["b", "c", "z", "x", "x", "x", "x", "x"],
      ["a", "b", "g", "e", "d", "z", "x", "x"],
      ["a", "b", "c", "d", "g", "z", "x", "x"],
      ["f", "b", "g", "c", "z", "x", "x", "x"],
      ["a", "f", "g", "c", "d", "z", "x", "x"],
      ["a", "f", "c", "d", "e", "g", "z", "x"],
      ["a", "b", "c", "z", "x", "x", "x", "x"],
      ["a", "b", "c", "d", "e", "f", "g", "z"],
      ["a", "b", "g", "f", "c", "d", "z", "x"]
    ],
    
    ratios: {
      a: { x1: 0, y1: 0, x2: 1, y2: 0, hor:true },
      b: { x1: 1, y1: 0, x2: 1, y2: 1, hor:false },
      c: { x1: 1, y1: 1, x2: 1, y2: 2, hor:false },
      d: { x1: 0, y1: 2, x2: 1, y2: 2, hor:true },
      e: { x1: 0, y1: 1, x2: 0, y2: 2, hor:false },
      f: { x1: 0, y1: 0, x2: 0, y2: 1, hor:false },
      g: { x1: 0, y1: 1, x2: 1, y2: 1, hor:true },
      x: { x1: 0, x2: 0 },
      z: {  end: true }
    }
  };
  return dlib;
});