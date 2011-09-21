var createCloud = function(name, nbVertexes) {
    if (nbVertexes === undefined) {
        nbVertexes = 5;
    }

    var getShader = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec4 Vertex;",
            "varying vec4 FragVertex;",

            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "uniform float scale;",
            "uniform float shrink;",
            "",


            "uniform float radius;",
            "vec4 position;",
            "",
            "vec4 ftransform() {",
            "position = ModelViewMatrix * vec4((vec3(Vertex.xyz) * vec3(1.0, 1.0, shrink) ) *radius, 1.0);",
            "return ProjectionMatrix * position;",
            "}",
            "",
            "void main(void) {",
            "vec4 pos = ftransform();",
            "gl_Position = pos;",
            "float depthNormalized = ( -position.z - gl_DepthRange.near)/gl_DepthRange.diff;",
            "gl_PointSize = scale*100000.0/(depthNormalized);",
            "FragVertex = Vertex;",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "vec4 fragColor;",
            "uniform mat4 ModelViewMatrix;",
            "uniform sampler2D Texture0;",
            "varying vec4 FragVertex;",
            "uniform float opacity;",
            "uniform float scaleV;",
            "uniform float scaleU;",

            "void main(void) {",
            "vec2 center = vec2(0.5, 0.5);",
            "vec2 uvCenter = vec2(gl_PointCoord.x, 1.0-gl_PointCoord.y) - center;",
            "uvCenter.y *= scaleV;",
            "uvCenter.x *= scaleU;",
            "vec2 uv;",
            "float angle = FragVertex.w;",
            "uv.x = cos(angle)*uvCenter.x - sin(angle)*uvCenter.y;",
            "uv.y = sin(angle)*uvCenter.x + cos(angle)*uvCenter.y;",
            "vec4 texel = texture2D(Texture0, uv+center);",
            "texel.a *= opacity;",
            "// darker under",
            "if (FragVertex.z < 0.0 && gl_PointCoord.y>0.5) {",
            "   texel.xyz *= (1.0-((gl_PointCoord.y-0.5)*2.0));",
            "}",
            "if (texel.w < 1e-03) {",
            "  discard;",
            "  return;",
            "}",
            "texel.xyz *= texel.w;",
            "//texel.xyz *= texel.w * 0.5*turbulence(vec3(uv,1.0)*2.0);",
            "gl_FragColor = vec4(texel);",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));
        program.trackAttributes = { 'attributeKeys': [],
                                    'textureAttributeKeys': [ ["Texture"] ] };

        return program;
    };

    var getRand = function() {
        var x = -0.5+Math.random();
        var y = -0.5+Math.random();
        var z = -0.5+Math.random()*0.2;
        var vec = [];
        osg.Vec3.normalize([x, y, z], vec);
        osg.Vec3.mult(vec, Math.random(), vec);
        vec[3] = Math.random()*Math.PI;
        return vec;
    };
    var geom = new osg.Geometry();
    var vertexes = [];

    for (var i = 0, l = nbVertexes; i < l; i++) {
        var vec = getRand();
        vertexes.push(vec);
    }

    var syncArray = function(bufferArray, vertexes) {
        var index = 0;
        var array = bufferArray.getElements();
        for (var i = 0, l = vertexes.length; i<l; i++) {
            array[index++] = vertexes[i][0];
            array[index++] = vertexes[i][1];
            array[index++] = vertexes[i][2];
            array[index++] = vertexes[i][3];
        }
        bufferArray.dirty();
    };

    geom.getAttributes().Vertex = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, new Array(nbVertexes*4), 4 );
    geom.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.POINTS, 0, nbVertexes));

    syncArray(geom.getAttributes().Vertex, vertexes);

    var texture = new osg.Texture();
    var img = new Image();
    img.src = "models/cloud.png";
    texture.setImage(img);

    var grp = geom;
    var stateset = grp.getOrCreateStateSet();
    var prg = getShader();
    prg.setName(name);
    stateset.setAttributeAndMode(prg);
    stateset.setTextureAttributeAndMode(0, texture);
    stateset.setAttributeAndMode(new osg.BlendFunc('SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA'));
    //stateset.setAttributeAndMode(new osg.BlendFunc('ONE', 'ONE'));
    //stateset.setAttributeAndMode(new osg.BlendFunc('SRC_COLOR', 'ONE_MINUS_SRC_ALPHA'));
    var depth = new osg.Depth();
    depth.setWriteMask(false);
    stateset.setAttributeAndMode(depth);

    var sort = function(cameraPosition)  {
        var pos = cameraPosition;
        var cmp = function(a, b) {
            var pa0 = pos[0] - a[0];
            var pa1 = pos[1] - a[1];
            var pa2 = pos[2] - a[2];
            var sqra = pa0*pa0 + pa1*pa1 + pa2*pa2;

            var pb0 = pos[0] - b[0];
            var pb1 = pos[1] - b[1];
            var pb2 = pos[2] - b[2];
            var sqrb = pb0*pb0 + pb1*pb1 + pb2*pb2;
            
            return sqrb-sqra;
        };
        vertexes.sort(cmp);
        syncArray(geom.getAttributes().Vertex, vertexes);
    };

    var UpdateCallback = function() {
        this.update = function(node, nv) {
            var pos = CameraManager.getEyePosition();
            sort(pos);
            return true;
        };
    };


    var radius = osg.Uniform.createFloat1(10.0,"radius");

    var params = new osgUtil.ShaderParameterVisitor();
    params.setTargetHTML(document.getElementById("Parameters"));

    params.types.float.params['radius'] = {
        min: 1,
        max: 100.0,
        step: 0.5,
        value: function() { return [1]; }
    };

    params.types.float.params['opacity'] = {
        min: 0,
        max: 1.0,
        step: 0.001,
        value: function() { return [1.0]; }
    };

    params.types.float.params['scale'] = {
        min: 0.01,
        max: 5.0,
        step: 0.02,
        value: function() { return [1.0]; }
    };

    params.types.float.params['turbulenceExponent'] = {
        min: 0.0,
        max: 5.0,
        step: 0.001,
        value: function() { return [0.002]; }
    };

    grp.accept(params);

    var mt = new osg.MatrixTransform();
    mt.addChild(grp);
    mt.addUpdateCallback(new UpdateCallback());
    return mt;
};