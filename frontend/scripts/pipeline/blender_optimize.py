import bpy
import sys
import os

# Argument format: blender -b -P blender_optimize.py -- <input_glb> <output_glb> [max_texture_res]

args = sys.argv
if "--" not in args:
    print("Error: Missing arguments delimiter '--'")
    sys.exit(1)

custom_args = args[args.index("--") + 1:]
if len(custom_args) < 2:
    print("Usage: blender -b -P blender_optimize.py -- <input_glb> <output_glb> [max_texture_res]")
    sys.exit(1)

input_path = os.path.abspath(custom_args[0])
output_path = os.path.abspath(custom_args[1])
max_res = int(custom_args[2]) if len(custom_args) > 2 else 1024

print(f"=== Riyadah Elite Blender Optimizer ===")
print(f"Input: {input_path}")
print(f"Output: {output_path}")
print(f"Max Texture Resolution: {max_res}px")

# Clear existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import GLTF/GLB
bpy.ops.import_scene.gltf(filepath=input_path)

# Optimize textures in memory
resized_count = 0
for img in bpy.data.images:
    if img.size[0] > max_res or img.size[1] > max_res:
        orig_w, orig_h = img.size[0], img.size[1]
        # Calculate aspect-ratio preserved size
        scale_factor = min(max_res / orig_w, max_res / orig_h)
        new_w = max(1, int(orig_w * scale_factor))
        new_h = max(1, int(orig_h * scale_factor))
        img.scale(new_w, new_h)
        resized_count += 1
        print(f"Resized image '{img.name}': {orig_w}x{orig_h} -> {new_w}x{new_h}")

print(f"Total textures resized: {resized_count}")

# Export optimized GLTF binary (GLB)
os.makedirs(os.path.dirname(output_path), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_image_format='AUTO',
    export_image_quality=85,
    export_apply=False, # Keep transform hierarchy intact
    export_unused_images=False,
    export_unused_textures=False
)

print(f"Export completed: {output_path}")
