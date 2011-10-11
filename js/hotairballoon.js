var createAirBalloon = function() {

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

            "varying vec2 TexCoord1Frag;",
            "varying vec3 worldPosition;",
            "varying vec3 cameraPosition;",

            "uniform float envmapReflection;",
            "uniform float envmapReflectionStatue;",
            "uniform float envmapReflectionCircle;",

            "uniform float density;",

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
            "vec3 Light0_directionNormalized = vec3(0.0, 0.0, 1.0);",
            "float Light0_NdotL = max(dot(normal, Light0_directionNormalized), 0.0);",
            "flight(Light0_directionNormalized, Light0_constantAttenuation, Light0_linearAttenuation, Light0_quadraticAttenuation, Light0_ambient, Light0_diffuse, Light0_specular, normal );",
            "}",

            "vec4 fog(vec4 inputColor){",
            "  float d = density; //0.001;",
            "  float f = gl_FragCoord.z/gl_FragCoord.w;",
            "  f = clamp(exp2(-d*d * f*f * 1.44), 0.0, 1.0);",
            "  float range = 0.7;",
            "  float alpha = min(f , range)/range;",
            "  vec4 color = mix(vec4(1.0), MaterialAmbient, 1.0-alpha);",
            "  color = inputColor;",
            "  vec4 result = mix(vec4(f,f,f,f), color, f);",
            "  result.a = alpha;",
            "  return result;",
            "}",

            "vec4 fog2(vec4 c){",
            "  float d = density; //0.001;",
            "  float f = length(vec3(worldPosition.x, worldPosition.y,0))/200.0;",
            "  //f = clamp(exp2(-d*d * f*f * 1.44), 0.0, 1.0);",
            "  f = exp(-d*d/0.1 * (1000.0*f*f) * 1.44);",
            "  f = clamp(f, 0.0, 1.0);",
            "  vec4 color = mix(vec4(1.0), MaterialAmbient, f);",
            "  vec4 result = mix(vec4(f,f,f,f), color, 1.0-f);",
            "  result.a = f;",
            "  return result;",
            "}",

            "FOG_CODE_INJECTION",

            "void main(void) {",
            "EyeVector = normalize(VertexEyeFrag);",
            "vec3 normal = normalize(NormalEyeFrag);",
            "LightColor = vec4(0,0,0,1);",
            "getLightColor(normal);",

            "vec2 uv = getTexEnvCoord(EyeVector, normal);",
            "vec4 refl = texture2D( Texture0, uv);",
            "refl *= envmapReflection;",
            "vec4 tex = texture2D( Texture1, TexCoord1Frag);",
            "float alpha = 1.0-tex.w;",
            "vec4 color = mix((LightColor + refl), vec4(vec3(0.0), 1.0), alpha);",
            "vec4 fogColor = fog2(color);",
            "gl_FragColor = fog3(color);",
            "gl_FragColor = gl_FragColor * (Light0_diffuse.w);",
            "}",
        ].join('\n');

        fragmentshader = fragmentshader.replace("FOG_CODE_INJECTION", getFogFragmentCode());

        var program = new osg.Program(new osg.Shader(gl.VERTEX_SHADER, vertexshader),
                                      new osg.Shader(gl.FRAGMENT_SHADER, fragmentshader));

        program.trackAttributes = { 'attributeKeys': ["Light0", "Material"],
                                    'textureAttributeKeys': [ ["Texture"] ] };
        return program;
    };

    var root = osgDB.parseSceneGraph(getAirballoon());
    root.accept(new SetShadowTextureInternalFormatVisitor());
    var modelFinder = new FindNodeVisitor("airballoon");
    root.accept(modelFinder);
    var item = modelFinder.found[0];

    var stateset = item.getOrCreateStateSet();
    var prg = getShader();
    stateset.setAttributeAndMode( prg );
    stateset.setTextureAttributeAndMode(0, getTextureEnvMap() , osg.StateAttribute.ON | osg.StateAttribute.OVERRIDE);


    var shadowFinder = new FindNodeVisitor("airballoon_shadow");
    root.accept(shadowFinder);
    var shadow = shadowFinder.found[0];
    shadow.setStateSet(getShadowStateSet());

    (function() {
        for (var i = 0; i < shadow.parents.length; i++) {
            shadow.removeParent(shadow.parents[i]);
        }
    })();

    (function() {
        for (var i = 0; i < item.parents.length; i++) {
            item.removeParent(item.parents[i]);
        }
    })();

    return [item, shadow];
};