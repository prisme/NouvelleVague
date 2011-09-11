var createHudCamera = function(texture, size, shader) {
    var hudCamera = new osg.Camera();
    hudCamera.setProjectionMatrix(osg.Matrix.makeOrtho(0, size[0], 0, size[1], -5, 5));
    hudCamera.setReferenceFrame(osg.Transform.ABSOLUTE_RF);
    hudCamera.setRenderOrder(osg.Camera.PRE_RENDER, 0);
    hudCamera.setViewport(new osg.Viewport(0,0,size[0],size[1]));
    hudCamera.setClearColor([0.0, 0.0, 0.0, 0.0]);

    // texture attach to the camera to render the scene on
    var rttTexture = new osg.Texture();
    rttTexture.setTextureSize(size[0],size[1]);
    rttTexture.setMinFilter('LINEAR');
    rttTexture.setMagFilter('LINEAR');
    hudCamera.attachTexture(osg.FrameBufferObject.COLOR_ATTACHMENT0, rttTexture, 0);

    var quad = createTexturedQuad(texture, size, shader);
    var uniform = osg.Uniform.createFloat2([1.0/size[0], 1.0/size[1] ], "pixelSize");
    quad.getOrCreateStateSet().addUniform(uniform);

    hudCamera.addChild(quad);
    hudCamera.renderedTexture = rttTexture;
    return hudCamera;
};

var createNestedHudCamera = function(texture, size, shader) {
    var hudCamera = new osg.Camera();
    hudCamera.setProjectionMatrix(osg.Matrix.makeOrtho(0, size[0], 0, size[1], -5, 5));
    hudCamera.setReferenceFrame(osg.Transform.ABSOLUTE_RF);
    hudCamera.setRenderOrder(osg.Camera.NESTED_RENDER, 0);
    hudCamera.setViewport(new osg.Viewport(0,0,size[0],size[1]));
    hudCamera.setClearColor([0.0, 1.0, 0.0, 0.0]);

    var quad = createTexturedQuad(texture, size, shader);
    var uniform = osg.Uniform.createFloat2([1.0/size[0], 1.0/size[1] ], "pixelSize");
    quad.getOrCreateStateSet().addUniform(uniform);

    hudCamera.addChild(quad);
    return hudCamera;
};

var createTexturedQuad = function(texture, size, shader) {
    var getShader = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord0;",
            "varying vec2 FragTexCoord0;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}",
            "void main(void) {",
            "gl_Position = ftransform();",
            "  FragTexCoord0 = TexCoord0;",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "varying vec2 FragTexCoord0;",
            "uniform sampler2D Texture0;",
            "void main(void) {",
            "vec4 frag = texture2D(Texture0, FragTexCoord0);",
            "gl_FragColor = frag;",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
        return program;
    };

    var quad = osg.createTexturedQuad(0,0,0,
                                      size[0], 0 ,0,
                                      0, size[1] ,0);
    if (shader === undefined) {
        shader = getShader();
    }
    quad.getOrCreateStateSet().setTextureAttributeAndMode(0, texture);
    quad.getOrCreateStateSet().setAttributeAndMode(shader);
    return quad;
};

var createRTT= function(scene, size, clouds) {

    var getShader = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}",
            "void main(void) {",
            "gl_Position = ftransform();",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "void main(void) {",
            "gl_FragColor = vec4(0.0,0.0,0.0,0.0);",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
        return program;
    };

    var clearAlpha = osg.createTexturedQuad(0,0,0,
                                            size[0], 0 ,0,
                                            0, size[1] ,0);
    clearAlpha.getOrCreateStateSet().setAttributeAndMode(getShader());
    var blendFunc = new osg.BlendFunc(osg.BlendFunc.DST_COLOR, osg.BlendFunc.ONE,
                                      osg.BlendFunc.ZERO, osg.BlendFunc.ZERO);
    clearAlpha.getOrCreateStateSet().setAttributeAndMode(blendFunc);

    // we create a ortho camera to clear alpha
    var hudCamera = new osg.Camera();
    hudCamera.setProjectionMatrix(osg.Matrix.makeOrtho(0, size[0], 0, size[1], -5, 5));
    hudCamera.setRenderOrder(osg.Camera.NESTED_RENDER, 0);
    hudCamera.setReferenceFrame(osg.Transform.ABSOLUTE_RF);
    hudCamera.addChild(clearAlpha);

  
    var camera = new osg.Camera();
    camera.setName("RTT");
    camera.setRenderOrder(osg.Camera.PRE_RENDER, 0);
    camera.setViewport(new osg.Viewport(0,0,size[0],size[1]));
    camera.setClearColor([1.0, 0.0, 0.0, 0.0]);

    // texture attach to the camera to render the scene on
    var rttTexture = new osg.Texture();
    rttTexture.setTextureSize(size[0],size[1]);
    rttTexture.setMinFilter('LINEAR');
    rttTexture.setMagFilter('LINEAR');
    camera.attachTexture(osg.FrameBufferObject.COLOR_ATTACHMENT0, rttTexture, 0);
    camera.attachRenderBuffer(osg.FrameBufferObject.DEPTH_ATTACHMENT, osg.FrameBufferObject.DEPTH_COMPONENT16);

    clouds.getOrCreateStateSet().setAttributeAndMode(new osg.BlendFunc('ONE','ZERO'));
    camera.addChild(scene);

    var clear = new osg.Geometry();
    clear.drawImplementation = function(state) {
        var gl = state.getGraphicContext();
        gl.enable(gl.COLOR_WRITEMASK);
        gl.colorMask(false, false, false, true);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(osg.Camera.COLOR_BUFFER_BIT);
        gl.colorMask(true, true, true, true);
        gl.disable(gl.COLOR_WRITEMASK);
    };
    clear.computeBoundingBox = function(boundingBox) { return boundingBox; };

    camera.addChild(clear);
    camera.addChild(clouds);
    camera.renderedTexture = rttTexture;

    return camera;
};

var blurTexture = function(texture, cloud2) {

    var getShaderX = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord0;",
            "varying vec2 FragTexCoord0;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}",
            "void main(void) {",
            "gl_Position = ftransform();",
            "FragTexCoord0 = TexCoord0;",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "uniform vec2 pixelSize;",
            "varying vec2 FragTexCoord0;",
            "uniform sampler2D Texture0;",
            "void main(void) {",
            "vec2 offset = vec2(pixelSize[0], 0.0);",
            "vec4 frag = texture2D(Texture0, FragTexCoord0);",
            "frag += texture2D(Texture0, FragTexCoord0 - (3.0*offset));",
            "frag += texture2D(Texture0, FragTexCoord0 - (2.0*offset));",
            "frag += texture2D(Texture0, FragTexCoord0 - offset);",
            "frag += texture2D(Texture0, FragTexCoord0 + offset);",
            "frag += texture2D(Texture0, FragTexCoord0 + (2.0*offset));",
            "frag += texture2D(Texture0, FragTexCoord0 + (3.0*offset));",
            "gl_FragColor = frag/7.0;",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
        return program;
    };


    var getShaderY = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord0;",
            "varying vec2 FragTexCoord0;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}",
            "void main(void) {",
            "gl_Position = ftransform();",
            "FragTexCoord0 = TexCoord0;",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "uniform vec2 pixelSize;",
            "varying vec2 FragTexCoord0;",
            "uniform sampler2D Texture0;",
            "void main(void) {",
            "vec2 offset = vec2(0.0, pixelSize[1]);",
            "vec4 frag = texture2D(Texture0, FragTexCoord0);",
            "frag += texture2D(Texture0, FragTexCoord0 - (3.0*offset));",
            "frag += texture2D(Texture0, FragTexCoord0 - (2.0*offset));",
            "frag += texture2D(Texture0, FragTexCoord0 - offset);",
            "frag += texture2D(Texture0, FragTexCoord0 + offset);",
            "frag += texture2D(Texture0, FragTexCoord0 + (2.0*offset));",
            "frag += texture2D(Texture0, FragTexCoord0 + (3.0*offset));",
            "gl_FragColor = frag/7.0;",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
        return program;
    };

    var grp = new osg.Node();
    var ratio = 4.0;
    //var size = [ texture.getWidth(), texture.getHeight() ] ;
    var size = [ texture.getWidth()/ratio, texture.getHeight()/ratio ] ;
    var hudx = createHudCamera(texture, size, getShaderX());
    var hudy = createHudCamera(hudx.renderedTexture, size, getShaderY());
    grp.addChild(hudx);
    grp.addChild(hudy);

    var windowSize = [window.innerWidth, window.innerHeight];
    size = windowSize;

    var camera = new osg.Camera();
    camera.setName("RTT2");
    camera.setRenderOrder(osg.Camera.PRE_RENDER, 1);
    camera.setViewport(new osg.Viewport(0,0,size[0],size[1]));
    camera.setClearColor([0.0, 0.0, 0.0, 0.0]);

    // texture attach to the camera to render the scene on
    var rttTexture = new osg.Texture();
    rttTexture.setTextureSize(size[0],size[1]);
    rttTexture.setMinFilter('LINEAR');
    rttTexture.setMagFilter('LINEAR');
    camera.attachTexture(osg.FrameBufferObject.COLOR_ATTACHMENT0, rttTexture, 0);
    camera.attachRenderBuffer(osg.FrameBufferObject.DEPTH_ATTACHMENT, osg.FrameBufferObject.DEPTH_COMPONENT16);

    var hudCamera1 = createNestedHudCamera(hudy.renderedTexture, windowSize);
    var blend = new osg.BlendFunc('SRC_ALPHA','ONE_MINUS_SRC_ALPHA');

    hudCamera1.getOrCreateStateSet().setAttributeAndMode(blend);
    hudCamera1.getOrCreateStateSet().setAttributeAndMode(new osg.Depth('DISABLE'), osg.StateAttribute.OVERRIDE);
    cloud2.getOrCreateStateSet().setAttributeAndMode(new osg.BlendFunc('SRC_ALPHA','ONE_MINUS_SRC_ALPHA', 'ONE' , 'ZERO'));

    camera.addChild(hudCamera1);
    camera.addChild(cloud2);
    grp.addChild(camera);

    //grp.renderedTexture = hudy.renderedTexture;
    grp.renderedTexture = rttTexture;
    return grp;
};


var createDebugRTT = function(node) {
    var texture = node.renderedTexture;
    var textureSize = [ texture.getWidth(), texture.getHeight() ];

    var getShader = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord0;",
            "varying vec2 FragTexCoord0;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}",
            "void main(void) {",
            "gl_Position = ftransform();",
            "  FragTexCoord0 = TexCoord0;",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "varying vec2 FragTexCoord0;",
            "uniform sampler2D Texture0;",
            "void main(void) {",
            "vec4 frag = texture2D(Texture0, FragTexCoord0);",
            // Here 1.0 is for debug !!!!!
            "frag.a = 1.0;",
            "gl_FragColor = frag;",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
        return program;
    };

    var rttCamera = new osg.Camera();
    rttCamera.setName("DebugCamera");
    var ratio = textureSize[1] / textureSize[0];
    var size = [ 480 ];
    size[1] = size[0]*ratio;

    // we create a ortho camera to display the rtt in hud like
    var hudCamera = new osg.Camera();

    hudCamera.setProjectionMatrix(osg.Matrix.makeOrtho(0, size[0], 0, size[1], -5, 5));
    //hudCamera.setViewMatrix(osg.Matrix.makeTranslate(25,25,0));
    hudCamera.setRenderOrder(osg.Camera.NESTED_RENDER, 0);
    hudCamera.setReferenceFrame(osg.Transform.ABSOLUTE_RF);
    hudCamera.setViewport(new osg.Viewport(0,0,size[0],size[1]));

    var q = createTexturedQuad(texture, size, getShader());

    hudCamera.addChild(q);

    return hudCamera;
};


var renderCloud = function(originalTexture, node, scene) {
    var texture = node.renderedTexture;
    var textureSize = [ texture.getWidth(), texture.getHeight() ];
    var windowSize = [ window.innerWidth,
                       window.innerHeight ];

    // we create a ortho camera to display the rtt in hud like
    var hudCamera0 = createNestedHudCamera(originalTexture, windowSize);
    hudCamera0.getOrCreateStateSet().setAttributeAndMode( new osg.BlendFunc('ONE', 'ZERO'));
    var hudCamera1 = createNestedHudCamera(texture, windowSize);
    var blend = new osg.BlendFunc('SRC_ALPHA','ONE_MINUS_SRC_ALPHA');
    hudCamera1.getOrCreateStateSet().setAttributeAndMode(blend);

    var grp = new osg.Node();
    hudCamera1.getOrCreateStateSet().setAttributeAndMode(new osg.Depth('DISABLE'));

    //grp.addChild(hudCamera0);
    grp.addChild(scene);
    grp.addChild(hudCamera1);

    return grp;
};