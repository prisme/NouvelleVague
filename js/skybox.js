var createSkyBox = function() {

    var createBox = function(centerx, centery, centerz,
                             sizex, sizey, sizez) {

        var g = new osg.Geometry();
        var dx,dy,dz;
        dx = sizex/2.0;
        dy = sizey/2.0;
        dz = sizez/2.0;

        var vertexes = [];
        var uv = [];
        var normal = [];

        // -ve y plane
        vertexes[0] = centerx - dx;
        vertexes[1] = centery - dy;
        vertexes[2] = centerz + dz;
        normal[0] = 0;
        normal[1] = -1;
        normal[2] = 0;
        uv[0] = 0;
        uv[1] = 1;

        vertexes[3] = centerx - dx;
        vertexes[4] = centery - dy;
        vertexes[5] = centerz - dz;
        normal[3] = 0;
        normal[4] = -1;
        normal[5] = 0;
        uv[2] = 0;
        uv[3] = 0;

        vertexes[6] = centerx + dx;
        vertexes[7] = centery - dy;
        vertexes[8] = centerz - dz;
        normal[6] = 0;
        normal[7] = -1;
        normal[8] = 0;
        uv[4] = 1;
        uv[5] = 0;

        vertexes[9] =  centerx + dx;
        vertexes[10] = centery - dy;
        vertexes[11] = centerz + dz;
        normal[9] = 0;
        normal[10] = -1;
        normal[11] = 0;
        uv[6] = 1;
        uv[7] = 1;


        // +ve y plane
        vertexes[12] = centerx + dx;
        vertexes[13] = centery + dy;
        vertexes[14] = centerz + dz;
        normal[12] = 0;
        normal[13] = 1;
        normal[14] = 0;
        uv[8] = 0;
        uv[9] = 1;

        vertexes[15] = centerx + dx;
        vertexes[16] = centery + dy;
        vertexes[17] = centerz - dz;
        normal[15] = 0;
        normal[16] = 1;
        normal[17] = 0;
        uv[10] = 0;
        uv[11] = 0;

        vertexes[18] = centerx - dx;
        vertexes[19] = centery + dy;
        vertexes[20] = centerz - dz;
        normal[18] = 0;
        normal[19] = 1;
        normal[20] = 0;
        uv[12] = 1;
        uv[13] = 0;

        vertexes[21] = centerx - dx;
        vertexes[22] = centery + dy;
        vertexes[23] = centerz + dz;
        normal[21] = 0;
        normal[22] = 1;
        normal[23] = 0;
        uv[14] = 1;
        uv[15] = 1;
        

        // +ve x plane
        vertexes[24] = centerx + dx;
        vertexes[25] = centery - dy;
        vertexes[26] = centerz + dz;
        normal[24] = 1;
        normal[25] = 0;
        normal[26] = 0;
        uv[16] = 0;
        uv[17] = 1;

        vertexes[27] = centerx + dx;
        vertexes[28] = centery - dy;
        vertexes[29] = centerz - dz;
        normal[27] = 1;
        normal[28] = 0;
        normal[29] = 0;
        uv[18] = 0;
        uv[19] = 0;

        vertexes[30] = centerx + dx;
        vertexes[31] = centery + dy;
        vertexes[32] = centerz - dz;
        normal[30] = 1;
        normal[31] = 0;
        normal[32] = 0;
        uv[20] = 1;
        uv[21] = 0;

        vertexes[33] = centerx + dx;
        vertexes[34] = centery + dy;
        vertexes[35] = centerz + dz;
        normal[33] = 1;
        normal[34] = 0;
        normal[35] = 0;
        uv[22] = 1;
        uv[23] = 1;

        // -ve x plane
        vertexes[36] = centerx - dx;
        vertexes[37] = centery + dy;
        vertexes[38] = centerz + dz;
        normal[36] = -1;
        normal[37] = 0;
        normal[38] = 0;
        uv[24] = 0;
        uv[25] = 1;

        vertexes[39] = centerx - dx;
        vertexes[40] = centery + dy;
        vertexes[41] = centerz - dz;
        normal[39] = -1;
        normal[40] = 0;
        normal[41] = 0;
        uv[26] = 0;
        uv[27] = 0;

        vertexes[42] = centerx - dx;
        vertexes[43] = centery - dy;
        vertexes[44] = centerz - dz;
        normal[42] = -1;
        normal[43] = 0;
        normal[44] = 0;
        uv[28] = 1;
        uv[29] = 0;

        vertexes[45] = centerx - dx;
        vertexes[46] = centery - dy;
        vertexes[47] = centerz + dz;
        normal[45] = -1;
        normal[46] = 0;
        normal[47] = 0;
        uv[30] = 1;
        uv[31] = 1;

        // top
        // +ve z plane
        vertexes[48] = centerx - dx;
        vertexes[49] = centery + dy;
        vertexes[50] = centerz + dz;
        normal[48] = 0;
        normal[49] = 0;
        normal[50] = 1;
        uv[32] = 0;
        uv[33] = 1;

        vertexes[51] = centerx - dx;
        vertexes[52] = centery - dy;
        vertexes[53] = centerz + dz;
        normal[51] = 0;
        normal[52] = 0;
        normal[53] = 1;
        uv[34] = 0;
        uv[35] = 0;

        vertexes[54] = centerx + dx;
        vertexes[55] = centery - dy;
        vertexes[56] = centerz + dz;
        normal[54] = 0;
        normal[55] = 0;
        normal[56] = 1;
        uv[36] = 1;
        uv[37] = 0;

        vertexes[57] = centerx + dx;
        vertexes[58] = centery + dy;
        vertexes[59] = centerz + dz;
        normal[57] = 0;
        normal[58] = 0;
        normal[59] = 1;
        uv[38] = 1;
        uv[39] = 1;

        // bottom
        // -ve z plane
        vertexes[60] = centerx + dx;
        vertexes[61] = centery + dy;
        vertexes[62] = centerz - dz;
        normal[60] = 0;
        normal[61] = 0;
        normal[62] = -1;
        uv[40] = 1;
        uv[41] = 0;

        vertexes[63] = centerx + dx;
        vertexes[64] = centery - dy;
        vertexes[65] = centerz - dz;
        normal[63] = 0;
        normal[64] = 0;
        normal[65] = -1;
        uv[42] = 1;
        uv[43] = 1;

        vertexes[66] = centerx - dx;
        vertexes[67] = centery - dy;
        vertexes[68] = centerz - dz;
        normal[66] = 0;
        normal[67] = 0;
        normal[68] = -1;
        uv[44] = 0;
        uv[45] = 1;

        vertexes[69] = centerx - dx;
        vertexes[70] = centery + dy;
        vertexes[71] = centerz - dz;
        normal[69] = 0;
        normal[70] = 0;
        normal[71] = -1;
        uv[46] = 0;
        uv[47] = 0;

        var indexes = [];
        indexes[0] = 0;
        indexes[1] = 1;
        indexes[2] = 2;
        indexes[3] = 0;
        indexes[4] = 2;
        indexes[5] = 3;

        indexes[6] = 4;
        indexes[7] = 5;
        indexes[8] = 6;
        indexes[9] = 4;
        indexes[10] = 6;
        indexes[11] = 7;

        indexes[12] = 8;
        indexes[13] = 9;
        indexes[14] = 10;
        indexes[15] = 8;
        indexes[16] = 10;
        indexes[17] = 11;

        indexes[18] = 12;
        indexes[19] = 13;
        indexes[20] = 14;
        indexes[21] = 12;
        indexes[22] = 14;
        indexes[23] = 15;

        indexes[24] = 16;
        indexes[25] = 17;
        indexes[26] = 18;
        indexes[27] = 16;
        indexes[28] = 18;
        indexes[29] = 19;

        indexes[30] = 20;
        indexes[31] = 21;
        indexes[32] = 22;
        indexes[33] = 20;
        indexes[34] = 22;
        indexes[35] = 23;

        g.getAttributes().Vertex = osg.BufferArray.create(gl.ARRAY_BUFFER, vertexes, 3 );
        g.getAttributes().Normal = osg.BufferArray.create(gl.ARRAY_BUFFER, normal, 3 );
        g.getAttributes().TexCoord0 = osg.BufferArray.create(gl.ARRAY_BUFFER, uv, 2 );
        
        var primitive = new osg.DrawElements(gl.TRIANGLES, osg.BufferArray.create(gl.ELEMENT_ARRAY_BUFFER, indexes, 1 ));
        g.getPrimitives().push(primitive);
        return g;
    };


    var getShader = function() {
        vertex = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord0;",
            "attribute vec3 Normal;",
            "",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "",
            "varying vec2 FragTexCoord0;",
            "varying vec3 FragNormal;",
            "",
            "vec4 ftransform() {",
            "    mat3 rotate = mat3(vec3(ModelViewMatrix[0]),vec3(ModelViewMatrix[1]),vec3(ModelViewMatrix[2]));",
            "    return ProjectionMatrix * vec4(rotate*Vertex, 1.0);",
            "}",
            "",
            "void main(void) {",
            "    gl_Position = ftransform();",
            "    FragTexCoord0 = TexCoord0;",
            "    FragNormal = Normal;",
            "}"
        ].join('\n');

        fragment = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "",
            "varying vec2 FragTexCoord0;",
            "varying vec3 FragNormal;",
            "uniform sampler2D Texture0;",
            "uniform sampler2D Texture1;",
            "uniform sampler2D Texture2;",
            "uniform sampler2D Texture3;",
            "uniform sampler2D Texture4;",
            "uniform sampler2D Texture5;",
            "",
            "void main(void) {",
            "    if (FragNormal[0] > 0.999) {",
            "        gl_FragColor = texture2D( Texture0, FragTexCoord0);",
            "        return;",
            "    } else if (FragNormal[0] < -0.999) {",
            "        gl_FragColor = texture2D( Texture1, FragTexCoord0);",
            "        return;",
            "    } else if (FragNormal[1] > 0.999) {",
            "        gl_FragColor = texture2D( Texture2, FragTexCoord0);",
            "        return;",
            "    } else if (FragNormal[1] < -0.999) {",
            "        gl_FragColor = texture2D( Texture3, FragTexCoord0);",
            "        return;",
            "    } else if (FragNormal[2] > 0.999) {",
            "        gl_FragColor = texture2D( Texture4, FragTexCoord0);",
            "        return;",
            "    } else if (FragNormal[2] < -0.999) {",
            "        gl_FragColor = texture2D( Texture5, FragTexCoord0);",
            "        return;",
            "    }",
            "    gl_FragColor = vec4(1.0,0.0,1.0, 1.0);",
            "}",
        ].join('\n');

        var program = osg.Program.create(osg.Shader.create(gl.VERTEX_SHADER, vertex),
                                         osg.Shader.create(gl.FRAGMENT_SHADER, fragment));
        return program;
    };

    var size = 1000;
    var box = createBox(0,0,0, size, size, size);
    var stateset = box.getOrCreateStateSet();
    var prg = getShader();
    stateset.setAttributeAndMode( prg );



    var posx = osg.Texture.createFromImage(osgDB.readImage("models/skybox/posx.png"));
    var negx = osg.Texture.createFromImage(osgDB.readImage("models/skybox/negx.png"));
    var posy = osg.Texture.createFromImage(osgDB.readImage("models/skybox/posy.png"));
    var negy = osg.Texture.createFromImage(osgDB.readImage("models/skybox/negy.png"));
    var posz = osg.Texture.createFromImage(osgDB.readImage("models/skybox/posz.png"));
    var negz = osg.Texture.createFromImage(osgDB.readImage("models/skybox/negz.png"));
    posx.setMinFilter(osg.Texture.LINEAR_MIPMAP_LINEAR);
    posy.setMinFilter(osg.Texture.LINEAR_MIPMAP_LINEAR);
    posz.setMinFilter(osg.Texture.LINEAR_MIPMAP_LINEAR);
    negx.setMinFilter(osg.Texture.LINEAR_MIPMAP_LINEAR);
    negy.setMinFilter(osg.Texture.LINEAR_MIPMAP_LINEAR);
    negz.setMinFilter(osg.Texture.LINEAR_MIPMAP_LINEAR);

    stateset.setTextureAttributeAndMode(0, posx);
    stateset.setTextureAttributeAndMode(1, negx);
    stateset.setTextureAttributeAndMode(2, posy);
    stateset.setTextureAttributeAndMode(3, negy);
    stateset.setTextureAttributeAndMode(4, posz);
    stateset.setTextureAttributeAndMode(5, negz);
    
    stateset.addUniform(osg.Uniform.createInt1(0, 'Texture0'));
    stateset.addUniform(osg.Uniform.createInt1(1, 'Texture1'));
    stateset.addUniform(osg.Uniform.createInt1(2, 'Texture4'));
    stateset.addUniform(osg.Uniform.createInt1(3, 'Texture5'));
    stateset.addUniform(osg.Uniform.createInt1(4, 'Texture3'));
    stateset.addUniform(osg.Uniform.createInt1(5, 'Texture2'));

    stateset.setAttributeAndMode(new osg.BlendFunc('ONE','ZERO'));
    var m = new osg.MatrixTransform();
    m.setMatrix(osg.Matrix.makeScale(-1,1,1, []));
    m.addChild(box);
    return m;
};