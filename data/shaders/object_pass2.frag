#ifdef Use_Bindless_Texture
layout(bindless_sampler) uniform sampler2D Albedo;
layout(bindless_sampler) uniform sampler2D SpecMap;
#else
uniform sampler2D Albedo;
uniform sampler2D SpecMap;
#endif

uniform vec2 color_change;

in vec2 uv;
in vec4 color;
out vec4 FragColor;

vec3 getLightFactor(vec3 diffuseMatColor, vec3 specularMatColor, float specMapValue, float emitMapValue);
float rgbToValue(vec3 c);
vec3 hsvToRgb(vec3 c);

void main(void)
{
#ifdef Use_Bindless_Texture
    vec4 col = texture(Albedo, uv);
#ifdef SRGBBindlessFix
    col.xyz = pow(col.xyz, vec3(2.2));
#endif
#else
    vec4 col = texture(Albedo, uv);
#endif

    if (color_change.x > 0.0)
    {
        vec3 new_color = hsvToRgb(vec3(color_change.x, color_change.y, rgbToValue(col.rgb)));
        col = vec4(new_color.b, new_color.g, new_color.r, col.a);
    }

    col.xyz *= pow(color.xyz, vec3(2.2));
    float specmap = texture(SpecMap, uv).g;
    float emitmap = texture(SpecMap, uv).b;
    FragColor = vec4(getLightFactor(col.xyz, vec3(1.), specmap, emitmap), 1.);
}
