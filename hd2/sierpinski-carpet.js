"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2( -1,  1 ),
        vec2(  1,  1 ),
        vec2(  1, -1 )
    ];

    divideSquare( vertices[0], vertices[1], vertices[2], vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function square( a, b, c, d )
{
    points.push( a, b, c, a, c, d );
}


function divideSquare( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        square( a, b, c, d );
    }
    else {

        --count;

        //bisect the sides
        var ab1 = mix( a, b, 0.333 );
        var ab2 = mix( a, b, 0.667 );
        var bc1 = mix( b, c, 0.333 );
        var bc2 = mix( b, c, 0.667 );
        var cd1 = mix( c, d, 0.333 );
        var cd2 = mix( c, d, 0.667 );
        var ad1 = mix( d, a, 0.333 );
        var ad2 = mix( d, a, 0.667 );

        var ma = mix( ab1, cd2, 0.333 );
        var md = mix( ab1, cd2, 0.667 );
        var mb = mix( ab2, cd1, 0.333 );
        var mc = mix( ab2, cd1, 0.667 );

        // three new triangles
        divideSquare(a, ab1, ma, ad2, count );
        divideSquare(ab1, ab2, mb, ma, count );
        divideSquare( ab2, b, bc1, mb, count );
        divideSquare( mb, bc1, bc2, mc, count );
        divideSquare( mc, bc2, c, cd1, count );
        divideSquare( md, mc, cd1, cd2, count );
        divideSquare( ad1, md, cd2, d, count );
        divideSquare( ad2, ma, md, ad1, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}