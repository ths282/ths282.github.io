"use strict";

var canvas;
var gl;

var gun = [];
var bullet = vec2(0, 0);

var bullety;
var bulletx;
var movey = 0.1;
var gunShot = false;

//var mouseX = 0; // Old value of x-coordinate

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  gun = [vec2(-0.05, -0.9), vec2(0, -0.75), vec2(0.05, -0.9)];

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * Math.pow(3, 6), gl.DYNAMIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Event listeners for mouse
  canvas.addEventListener("mousemove", function (e) {
    var xpos = (2 * e.offsetX) / canvas.width - 1;

    gun[0][0] = xpos - 0.05;
    gun[1][0] = xpos;
    gun[2][0] = xpos + 0.05;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(gun));
  });

  canvas.addEventListener("mousedown", function (e) {
    if (!gunShot) {
      bulletx = (2 * e.offsetX) / canvas.width - 1;
      bullety = -0.75;
      bullet = vec2(bulletx, bullety);

      gunShot = true;
    }
  });

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, gun.length);

  
  bullet = vec2(bulletx, bullety);
  bullety += movey;

  gl.bufferSubData(gl.ARRAY_BUFFER, 8 * gun.length, flatten(bullet));
  gl.drawArrays(gl.POINT, gun.length, 2);

  window.requestAnimFrame(render);
}



