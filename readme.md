# Three.JS GLTF Model Image Generator
**Sam Athanas**
### Generate multiple images rotating around a 3D GLTF Model
---

Use the GUI Controller to load in the model, adjust the number of pictures, change the model/bg color and export the images.

The camera is a THREE.JS perspective camera, allowing you to rotate the camera before capturing the images.

**Settings configured from the GUI in the Program**
```
# Of Pictures: Number of pictures to take. Model yaw axis rotations will be based from the # of pictures to take.
```
```
Model Color: Set the color of the model.
```
```
BG Color: Set the color of the background.
```
```
Export File Name: Set the name of file exports. When exporting multiple images, the file name will be <EXPORT_FILE_NAME># where # responds to the index of the photo (1,count)
```
```
Load .GLTF File: Click this to load in the .GLTF File
```
```
Rotate & Save: Perform the rotations & create snapshots of each rotation. After full 360 degree rotation is complete, the program will prompt you to save all the snapshots in "jpeg" format that were captured. Captures are always relative to the current camera position, so you may zoom in/out or change the angle of the camera before capturing the images.
```