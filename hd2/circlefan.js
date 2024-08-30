/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Teikna nálgun á hring sem TRIANGLE_FAN
//
//    Hjálmtýr Hafsteinsson, ágúst 2024
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

// numCirclePoints er fjöldi punkta á hringnum
// Heildarfjöldi punkta er tveimur meiri (miðpunktur + fyrsti punktur kemur tvisvar)
var numCirclePoints = 3;       

var radius = 0.5;
var center = vec2(0, 0);

var points = [];

function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	// Create the circle
    //createCirclePoints( center, radius, numCirclePoints );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    document.getElementById("slider").onchange = function(event) {
        numCirclePoints = event.target.value;
        render();
    };

    render();
}


// Create the points of the circle
function createCirclePoints( cent, rad, k )
{
    points = [];
    points.push( center );
    
    var dAngle = 2*Math.PI/k;
    for( i=k; i>=0; i-- ) {
    	a = i*dAngle;
    	var p = vec2( rad*Math.sin(a) + cent[0], rad*Math.cos(a) + cent[1] );
    	points.push(p);
    }
}

window.onload = init;

function render() {
    createCirclePoints( center, radius, numCirclePoints );

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    // Draw circle using Triangle Fan
    gl.drawArrays( gl.TRIANGLE_FAN, 0, points.length );
    points = [];
    //window.requestAnimFrame(render);
}
