var createStatue = function() {

    var getCanvasTexture = function(text) {
        var w,h;
        w = 1;
        h = 1;
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', 1);
        canvas.setAttribute('height', 1);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    };

    var getGroundShader = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord1;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "uniform mat4 CameraInverseMatrix;",
            "",
            "varying vec2 TexCoord1Frag;",
            "varying vec3 worldPosition;",
            "varying vec3 cameraPosition;",
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}",
            "",
            "void main(void) {",
            "TexCoord1Frag = TexCoord1;",
            "worldPosition = vec3((CameraInverseMatrix * ModelViewMatrix) * vec4(Vertex, 1.0));",
            "cameraPosition = vec3(CameraInverseMatrix[3][0], CameraInverseMatrix[3][1], CameraInverseMatrix[3][2]);",
            "gl_Position = ftransform();",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "vec4 fragColor;",
            "varying vec2 TexCoord1Frag;",
            "uniform sampler2D Texture0;",
            "uniform sampler2D Texture1;",
            "varying vec3 worldPosition;",
            "varying vec3 cameraPosition;",

            "void main(void) {",
            "vec4 color = texture2D( Texture1, TexCoord1Frag);",
            "color = vec4(vec3(0.0), 0.7*color.a);",
            "gl_FragColor = color;",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));

        program.trackAttributes = { 'textureAttributeKeys': [ ["Texture"] ] };
        return program;
    };


    var getShader = function() {
        var vertexshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec3 Normal;",
            "attribute vec2 TexCoord1;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "uniform mat4 NormalMatrix;",
            "uniform mat4 CameraInverseMatrix;",
            "",
            "varying vec3 NormalEyeFrag;",
            "varying vec3 VertexEyeFrag;",
            "varying vec2 TexCoord1Frag;",
            "varying vec3 worldPosition;",
            "varying vec3 cameraPosition;",
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}",
            "vec3 computeNormal() {",
            "return vec3(NormalMatrix * vec4(Normal, 0.0));",
            "}",
            "",
            "vec3 computeEyeDirection() {",
            "return vec3(ModelViewMatrix * vec4(Vertex,1.0));",
            "}",
            "",
            "",
            "void main(void) {",
            "VertexEyeFrag = computeEyeDirection();",
            "NormalEyeFrag = computeNormal();",
            "TexCoord1Frag = TexCoord1;",
            "worldPosition = vec3((CameraInverseMatrix * ModelViewMatrix) * vec4(Vertex, 1.0));",
            "cameraPosition = vec3(CameraInverseMatrix[3][0], CameraInverseMatrix[3][1], CameraInverseMatrix[3][2]);",
            "gl_Position = ftransform();",
            "}",
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "vec4 fragColor;",
            "uniform mat4 ModelViewMatrix;",
            "varying vec3 VertexEyeFrag;",
            "varying vec3 NormalEyeFrag;",
            "varying vec2 TexCoord1Frag;",
            "uniform sampler2D Texture0;",
            "uniform sampler2D Texture1;",

            "uniform vec4 MaterialAmbient;",
            "uniform vec4 MaterialDiffuse;",
            "uniform vec4 MaterialSpecular;",
            "uniform vec4 MaterialEmission;",
            "uniform float MaterialShininess;",

            "uniform bool Light0_enabled;",
            "uniform vec4 Light0_ambient;",
            "uniform vec4 Light0_diffuse;",
            "uniform vec4 Light0_specular;",
            "uniform vec3 Light0_direction;",
            "uniform float Light0_constantAttenuation;",
            "uniform float Light0_linearAttenuation;",
            "uniform float Light0_quadraticAttenuation;",
            "varying vec3 worldPosition;",
            "varying vec3 cameraPosition;",

            "uniform float envmapReflection;",
            "uniform float envmapReflectionStatue;",
            "uniform float envmapReflectionCircle;",

            "vec4 Ambient;",
            "vec4 Diffuse;",
            "vec4 Specular;",
            "vec3 EyeVector;",
            "vec3 NormalComputed;",
            "vec4 LightColor;",
            "",
            "void directionalLight(in vec3 lightDirection, in vec3 lightHalfVector, in float constantAttenuation, in float linearAttenuation, in float quadraticAttenuation, in vec4 ambient, in vec4 diffuse,in vec4 specular, in vec3 normal)",
            "{",
            "float nDotVP;         // normal . light direction",
            "float nDotHV;         // normal . light half vector",
            "float pf;             // power factor",
            "",
            "nDotVP = max(0.0, dot(normal, normalize(lightDirection)));",
            "nDotHV = max(0.0, dot(normal, lightHalfVector));",
            "",
            "if (nDotHV == 0.0)",
            "{",
            "pf = 0.0;",
            "}",
            "else",
            "{",
            "pf = pow(nDotHV, MaterialShininess);",
            "}",
            "Ambient  += ambient;",
            "Diffuse  += diffuse * nDotVP;",
            "Specular += specular * pf;",
            "}",
            "",
            "void flight(in vec3 lightDirection, in float constantAttenuation, in float linearAttenuation, in float quadraticAttenuation, in vec4 ambient, in vec4 diffuse, in vec4 specular, in vec3 normal)",
            "{",
            "vec4 localColor;",
            "vec3 lightHalfVector = normalize(EyeVector-lightDirection);",
            "// Clear the light intensity accumulators",
            "Ambient  = vec4 (0.0);",
            "Diffuse  = vec4 (0.0);",
            "Specular = vec4 (0.0);",
            "",
            "directionalLight(lightDirection, lightHalfVector, constantAttenuation, linearAttenuation, quadraticAttenuation, ambient, diffuse, specular, normal);",
            "",
            "vec4 sceneColor = vec4(0,0,0,0);",
            "localColor = sceneColor +",
            "MaterialEmission +",
            "Ambient  * MaterialAmbient +",
            "Diffuse  * MaterialDiffuse;",
            "localColor = clamp( localColor, 0.0, 1.0 );",
            "LightColor += localColor;",
            "}",

            "vec2 getTexEnvCoord(vec3 eye, vec3 normal) {",
            "vec3 r = normalize(reflect(eye, normal));",
            "float m = 2.0 * sqrt( r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0) );",
            "vec2 uv;",
            "uv[0] = r.x/m + 0.5;",
            "uv[1] = r.y/m + 0.5;",
            "return uv;",
            "}",
            "",
            "void getLightColor(vec3 normal) {",
            "vec3 Light0_directionNormalized = vec3(0.0,0.0,1.0);",
            "float Light0_NdotL = max(dot(normal, Light0_directionNormalized), 0.0);",
            "flight(Light0_directionNormalized, Light0_constantAttenuation, Light0_linearAttenuation, Light0_quadraticAttenuation, Light0_ambient, Light0_diffuse, Light0_specular, normal );",
            "}",

            "void main(void) {",
            "EyeVector = normalize(VertexEyeFrag);",
            "vec3 normal = normalize(NormalEyeFrag);",
            "LightColor = vec4(0,0,0,0);",
            "getLightColor(normal);",

            "vec2 uv = getTexEnvCoord(EyeVector, normal);",
            "vec4 refl = texture2D( Texture0, uv);",
            "refl *= envmapReflectionStatue;",
            "vec4 ambientOcclusion = texture2D( Texture1, TexCoord1Frag);",
            "vec4 color = ambientOcclusion*(LightColor + refl);",
            "gl_FragColor = color;",
            "}",
        ].join('\n');

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));

        program.trackAttributes = { 'attributeKeys': ["Light0", "Material"],
                                    'textureAttributeKeys': [ ["Texture"] ] };
        return program;
    };


    var grp = osgDB.parseSceneGraph(getStatue());
    var stateset = grp.getOrCreateStateSet();
    var prg = getShader();

    var statueFinder = new FindNodeVisitor("Statue");
    grp.accept(statueFinder);
    var statueStateSet = statueFinder.found[0].getOrCreateStateSet();

    var whiteTexture = getCanvasTexture();
    var t = new osg.Texture();
    t.setFromCanvas(whiteTexture);

    statueStateSet.setAttributeAndMode(prg);
    statueStateSet.setTextureAttributeAndMode(0, getTextureEnvMap());
    statueStateSet.setTextureAttributeAndMode(1, t);


    var groundFinder = new FindNodeVisitor("statue_shadow");
    grp.accept(groundFinder);
    var groundStateSet = groundFinder.found[0].getOrCreateStateSet();
    groundStateSet.setAttributeAndMode(getGroundShader());
    groundStateSet.setAttributeAndMode(getBlendState());


    grp.light = new osg.Light();
    grp.light.diffuse = [0.8,0.8,0.8,1];
    grp.light.ambient = [0,0,0,1];

    return grp;
};