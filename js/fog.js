var getFogVertexCode = function() {
    
};

var getFogFragmentCode = function() {

    var fragmentshader = [
        "uniform vec3 position0;",
        "uniform vec3 scale0;",
        "uniform float radius0;",

        "uniform vec3 position1;",
        "uniform vec3 scale1;",
        "uniform float radius1;",

        "float getFunction(float value) {",
        "   return value*0.01;",
        "}",
        "float getFunctionScale(float value) {",
        "   return 1.0;",
        "   return 1.0-smoothstep(0.0, 0.3, abs(value));",
        "}",
        "float getLengthSqr(vec3 position, float radius, vec3 scale) {",
        "  mat3 scaleMe = mat3(vec3(1.0/scale[0],0.0,0.0), vec3(0.0,1.0/scale[1],0.0), vec3(0.0,0.0,1.0/scale[2]));",
        "  vec3 worldPositionTransformed = scaleMe*worldPosition;",
        "  vec3 center = scaleMe*position;",
        "  vec3 cameraPositionTransformed = scaleMe*cameraPosition;",
        "  float radiusSqr = radius*radius;",
        "  vec3 vpc = center - worldPositionTransformed;",
        "  vec3 dir = cameraPositionTransformed - worldPositionTransformed;",
        "  vec3 l = normalize(dir);",
        "  float proj = dot(l,vpc);",
        "  vec3 pc = worldPositionTransformed + (l * proj);",
        "  if (proj < 0.0) {",
        "     if (dot(vpc,vpc) >= radiusSqr) {",
        "       return 0.0;",
        "     } else {",
        "       vec3 projectedFromCenter = pc-center;",
        "       float distSqrFromCenter = dot(projectedFromCenter,projectedFromCenter);",
        "       vec3 delta = pc - worldPositionTransformed;",
        "       float di1Sqr = (radiusSqr - distSqrFromCenter) - dot(delta,delta);",
        "       return di1Sqr;",
        "     }",
        "  } else {",
        "     float distSqrFromCenter = dot(center-pc,center-pc);",
        "     if (distSqrFromCenter >= radiusSqr) {",
        "         return 0.0;",
        "     }",
        "     float distSqr = radiusSqr - distSqrFromCenter;",
        "     vec3 pcp = pc - worldPositionTransformed;",
        "     float distPcpSqr = dot(pcp,pcp);",
        "     if (dot(vpc,vpc) > radiusSqr) {",
        "         vec3 enterPosition = worldPositionTransformed + l*sqrt((distPcpSqr-distSqr));",
        "         float coef = getFunction(distSqr/radius);",
        "         //coef *= getFunctionScale((enterPosition.x-center.x)/radius);",
        "         return 2.0*distSqr;",
        "     } else {",
        "         return distPcpSqr+distSqr;",
        "     }",
        "  }",
        "  return 0.0;",
        "}",
        "float getFogDist(float radius, vec3 position, vec3 scale) {",
        "   float distSqr = getLengthSqr(position, radius, scale);",
        "  distSqr *= getFunction(distSqr/(2.0*radius));",
        "  float value = clamp(1.0-distSqr/(radius*radius), 0.0, 1.0);",
        "  return value;",
        "}",

        "  //vec3 position0(100.0,0.0, 100.0);",
        "  //vec3 scale0 = 10.0*vec3(0.3,1.0,0.2);",
        "  //float radius0 = 40.0;",



        "//",
        "// Description : Array and textureless GLSL 2D/3D/4D simplex ",
        "//               noise functions.",
        "//      Author : Ian McEwan, Ashima Arts.",
        "//  Maintainer : ijm",
        "//     Lastmod : 20110822 (ijm)",
        "//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.",
        "//               Distributed under the MIT License. See LICENSE file.",
        "//               https://github.com/ashima/webgl-noise",
        "// ",
        "",
        "vec3 mod289(vec3 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",
        "",
        "vec4 mod289(vec4 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",
        "",
        "vec4 permute(vec4 x) {",
        "     return mod289(((x*34.0)+1.0)*x);",
        "}",
        "",
        "vec4 taylorInvSqrt(vec4 r)",
        "{",
        "  return 1.79284291400159 - 0.85373472095314 * r;",
        "}",
        "",
        "float snoise(vec3 v)",
        "  { ",
        "  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;",
        "  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",
        "",
        "// First corner",
        "  vec3 i  = floor(v + dot(v, C.yyy) );",
        "  vec3 x0 =   v - i + dot(i, C.xxx) ;",
        "",
        "// Other corners",
        "  vec3 g = step(x0.yzx, x0.xyz);",
        "  vec3 l = 1.0 - g;",
        "  vec3 i1 = min( g.xyz, l.zxy );",
        "  vec3 i2 = max( g.xyz, l.zxy );",
        "",
        "  //   x0 = x0 - 0.0 + 0.0 * C.xxx;",
        "  //   x1 = x0 - i1  + 1.0 * C.xxx;",
        "  //   x2 = x0 - i2  + 2.0 * C.xxx;",
        "  //   x3 = x0 - 1.0 + 3.0 * C.xxx;",
        "  vec3 x1 = x0 - i1 + C.xxx;",
        "  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y",
        "  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y",
        "",
        "// Permutations",
        "  i = mod289(i); ",
        "  vec4 p = permute( permute( permute( ",
        "             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
        "           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) ",
        "           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",
        "",
        "// Gradients: 7x7 points over a square, mapped onto an octahedron.",
        "// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)",
        "  float n_ = 0.142857142857; // 1.0/7.0",
        "  vec3  ns = n_ * D.wyz - D.xzx;",
        "",
        "  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)",
        "",
        "  vec4 x_ = floor(j * ns.z);",
        "  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)",
        "",
        "  vec4 x = x_ *ns.x + ns.yyyy;",
        "  vec4 y = y_ *ns.x + ns.yyyy;",
        "  vec4 h = 1.0 - abs(x) - abs(y);",
        "",
        "  vec4 b0 = vec4( x.xy, y.xy );",
        "  vec4 b1 = vec4( x.zw, y.zw );",
        "",
        "  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;",
        "  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;",
        "  vec4 s0 = floor(b0)*2.0 + 1.0;",
        "  vec4 s1 = floor(b1)*2.0 + 1.0;",
        "  vec4 sh = -step(h, vec4(0.0));",
        "",
        "  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;",
        "  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;",
        "",
        "  vec3 p0 = vec3(a0.xy,h.x);",
        "  vec3 p1 = vec3(a0.zw,h.y);",
        "  vec3 p2 = vec3(a1.xy,h.z);",
        "  vec3 p3 = vec3(a1.zw,h.w);",
        "",
        "//Normalise gradients",
        "  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
        "  p0 *= norm.x;",
        "  p1 *= norm.y;",
        "  p2 *= norm.z;",
        "  p3 *= norm.w;",
        "",
        "// Mix final noise value",
        "  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
        "  m = m * m;",
        "  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), ",
        "                                dot(p2,x2), dot(p3,x3) ) );",
        "  }",


        "vec4 fogGround(vec4 inputColor) {",
        "  float value = getFogDist(radius0, position0, scale0);",
        "  vec3 fogColor = vec3(1.0);",
        "  vec4 color = mix(vec4(fogColor,1.0), inputColor, value);",
        "  return color;",
        "}",
        "vec4 fog3(vec4 inputColor) {",
        "  float fogfar = 1.0 - smoothstep(500.0,700.0, length(worldPosition));",
        "  float value = getFogDist(radius0, position0, scale0)*fogfar;",
        "  //vec3 fogColor = vec3(snoise(worldPosition*0.01));",
        "  vec3 fogColor = vec3(1.0);",
        "  vec4 color = mix(vec4(fogColor,1.0), inputColor, value);",
        "  color *=  fogfar;",
        "  return color;",
        "}"
    ].join('\n');
    
    return fragmentshader;
};
