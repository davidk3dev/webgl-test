import { Injectable } from "@angular/core";
import { Mesh, BufferGeometry, EdgesGeometry, Box3, Vector3, Geometry, Plane, Line3, Object3D, Points, PointsMaterial, TextBufferGeometry, MeshBasicMaterial, Line, Shape, LineBasicMaterial } from 'three';
import * as THREE from 'three';
import { MaterialManager } from "./material.manager";

export class Util {
  public getGeometryLength(geometry: THREE.BufferGeometry, axis: THREE.Vector3): number {
    geometry.computeBoundingBox();
    let box = geometry.boundingBox;
    if (axis.x > 0) {
      return box.max.x - box.min.x;
    }
    else if (axis.y > 0) {
      return box.max.y - box.min.y;
    }
    else {
      return box.max.z - box.min.z;
    }
  }
  private drawBoundingBox(object: THREE.Object3D): void {
    // geometry.computeBoundingBox();
    //   var box = geometry.boundingBox;
    // let cubeGeo = new THREE.BoxGeometry(10, 10, 10);
    // let cube = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({ color: 0x74d00b }));

    // cube.position.set(box.min.x, box.min.y, box.min.z);
    // this.scene.add(cube);

    // cube = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({ color: 0x74d00b }));
    // cube.position.set(box.max.x, box.max.y, box.max.z);
    // this.scene.add(cube);
  }
  private fitCameraToSelection(camera, controls, selection, fitOffset = 1.2) {

    const box = new Box3();

    for (const object of selection) box.expandByObject(object);

    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = controls.target.clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance);

    controls.maxDistance = distance * 10;
    controls.target.copy(center);

    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    camera.position.copy(controls.target).sub(direction);

    controls.update();

  }
  fitCameraToObject(camera, object, offset, controls) {

    offset = offset || 1.25;

    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(object);

    let center: THREE.Vector3;
    boundingBox.getCenter(center);
    let size: THREE.Vector3;
    boundingBox.getSize(size);

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    camera.position.z = cameraZ;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    if (controls) {

      // set camera to rotate around center of loaded object
      controls.target = center;

      // prevent camera from zooming out far enough to create far plane cutoff
      controls.maxDistance = cameraToFarEdge * 2;

      controls.saveState();

    } else {

      camera.lookAt(center)

    }
  }
  degreesToRadians(degrees: number) {
    var pi = Math.PI;
    return this.round(degrees * (pi / 180));
  }
  round(num: number): number{
    return parseFloat(num.toFixed(3));
  }
  sin(degrees:number): number{
    return this.round(Math.sin(this.degreesToRadians(degrees)));
  }
  cos(degrees:number): number{
    return this.round(Math.cos(this.degreesToRadians(degrees)));
  }
  tan(degrees:number): number{
    return this.round(Math.tan(this.degreesToRadians(degrees)));
  }

  getOutlineGeometry(geo: Geometry | BufferGeometry, threshold: number): EdgesGeometry{
    return new EdgesGeometry( geo, threshold );
  }
  getOutlineGeometryFromMesh(mesh: Mesh, threshold: number){
    let geo = mesh.geometry.clone();
    geo.scale(mesh.scale.x, mesh.scale.y, mesh.scale.z);
    return new EdgesGeometry( geo, threshold );
  }
  getOutlineGeometryFromMeshNoScale(mesh: Mesh, threshold: number){
    let geo = mesh.geometry.clone();
    //geo.scale(mesh.scale.x, mesh.scale.y, mesh.scale.z);
    return new EdgesGeometry( geo, threshold );
  }
  clipOutline(geo: EdgesGeometry, plane: Plane): BufferGeometry{
    let vertices = geo.getAttribute('position').array;
    let newVertices = [];

    let intersectPoints: Vector3[] = [];

    for(let i = 0; i < vertices.length; i += 6){      
      let v1 = new Vector3(vertices[i], vertices[i+1], vertices[i+2]);
      let v2 = new Vector3(vertices[i+3], vertices[i+4], vertices[i+5]);

      let line = new Line3(v1, v2);
      let intersectPoint = new Vector3();
      let rs = plane.intersectLine(line, intersectPoint);

      let dis1 = plane.distanceToPoint(v1);
      let dis2 = plane.distanceToPoint(v2);

      if(dis1 < 0 && dis2 < 0)
        continue;

      if(rs){
        if(dis1 > 0){
          newVertices.push(v1);
        }
        else{
          newVertices.push(v2);
        }

        newVertices.push(intersectPoint);
        intersectPoints.push(intersectPoint);
      }
      else{
        newVertices.push(v1, v2);
      }
    }

    for(let i = 0; i < intersectPoints.length - 1; i ++){
      newVertices.push(intersectPoints[i]);
      newVertices.push(intersectPoints[i + 1]);

      // if(intersectPoints.length > 2 && i == intersectPoints.length - 2){
      //   newVertices.push(intersectPoints[i+2]);
      //   newVertices.push(intersectPoints[0]);
      // }
    }

    return new BufferGeometry().setFromPoints(newVertices);
  }
  public getStartEndPoint(box: Box3): Vector3[]{
    let maxHeight = 0;
    let p1: Vector3;
    let p2: Vector3;

    if(box.max.x - box.min.x > maxHeight){
        maxHeight = box.max.x - box.min.x;

        p1 = new Vector3(box.min.x, (box.max.y + box.min.y)/2, (box.max.z + box.min.z)/2);
        p2 = new Vector3(box.max.x, (box.max.y + box.min.y)/2, (box.max.z + box.min.z)/2);
    }
    if(box.max.y - box.min.y > maxHeight){
        maxHeight = box.max.y - box.min.y;

        p1 = new Vector3((box.max.x + box.min.x)/2, box.min.y, (box.max.z + box.min.z)/2);
        p2 = new Vector3((box.max.x + box.min.x)/2, box.max.y, (box.max.z + box.min.z)/2);
    }
    if(box.max.z - box.min.z > maxHeight){
        p1 = new Vector3((box.max.x + box.min.x)/2, (box.max.y + box.min.y)/2, box.min.z);
        p2 = new Vector3((box.max.x + box.min.x)/2, (box.max.y + box.min.y)/2, box.max.z);
    }

    return [p1, p2];
}
}

export function clipOutline(geo: BufferGeometry, plane: Plane, scene: Object3D){
  let vertices: ArrayLike<number>;
  vertices = geo.attributes['position'].array;
  let newVertices: Vector3[] = [];

  for (let i = 0; i < vertices.length; i += 3) {
    const currentPoint = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    const dis = plane.distanceToPoint(currentPoint);

    if(dis >= 0){
      newVertices.push(currentPoint);
      //addPoints([currentPoint], scene)
    }
    else{
      let secondPoint: Vector3;      
      
      if(i % 2 == 0){ //so chan
        //lay point phia sau
        secondPoint = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
      }
      else{//so le
        //lay point phia truoc
        secondPoint = new Vector3(vertices[i - 3], vertices[i - 2], vertices[i - 1]);
      }
      
      const intersectPoint = new Vector3();
      let line = new Line3(currentPoint, secondPoint);
      const isIntersect = plane.intersectLine(line, intersectPoint);

      if(isIntersect){
        newVertices.push(intersectPoint);
      }
    }
  }

  return new BufferGeometry().setFromPoints(newVertices);
}
export function clipOutline2(geo: BufferGeometry, plane: Plane){
  let vertices: any;
  vertices = geo.attributes['position'].array;
  vertices = vertices.slice(0, 12);

  let newVertices: Vector3[] = [];
  
  for (let i = 0; i < vertices.length; i += 3) {
    const currentPoint = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    const dis = plane.distanceToPoint(currentPoint);

    if(dis >= 0){
      newVertices.push(currentPoint);
      //addPoints([currentPoint], scene)
    }

    //first point
    if(i < 3){
      //Check with end point
      let endPoint = new Vector3(vertices[vertices.length-3], vertices[vertices.length-2], vertices[vertices.length-1]);
      let line = new Line3(currentPoint, endPoint);
      let intersectPoint = new Vector3();
      if(plane.intersectLine(line, intersectPoint)){
        newVertices.push(intersectPoint);
      }
    }
    
    if(i < vertices.length - 3){
      //check with next point
      let nextPoint = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
      let line = new Line3(currentPoint, nextPoint);
      let intersectPoint2 = new Vector3();
      if(plane.intersectLine(line, intersectPoint2)){
        newVertices.push(intersectPoint2);
      }
    }
  }

  let index = [];
  for (let i = 0; i < newVertices.length; i++) {
    if(i == newVertices.length - 1){
      index.push(i, 0);
    }
    else{
      index.push(i, i+1);
    }
  }

  let newGeo = new BufferGeometry().setFromPoints(newVertices);
  newGeo.setIndex(index);

  return newGeo;
}

export function addPoints(points: Array<Vector3>, parent: Object3D){
  parent.add(new Points(new BufferGeometry().setFromPoints(points), MaterialManager.Instance().POINT_HELPER))
}

export function addVerticeIndex(vertices: ArrayLike<number>, params, scene: Object3D){
  for (let i = 0; i < vertices.length; i += 3) {
    let p = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    let textGeo = new TextBufferGeometry((i/3).toString(), params);
    textGeo.center();
    let textMesh = new Mesh(textGeo, new MeshBasicMaterial({ color: 'white' }));
    textMesh.position.set(p.x, p.y, p.z);

    //addPoints([p], scene);
    
    scene.add(textMesh);
  }
}
export function addBoxFromVertices(vertices: ArrayLike<number>){
  let points: Vector3[] = [];
  for (let i = 0; i < vertices.length; i += 3) {
    let p = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    points.push(p);
  }
  return new BufferGeometry().setFromPoints(points);
}

export function createCircleLineGeo(scene: Object3D, radius: number){
  // const shape = new Shape()
  //   .moveTo( 0, radius )
  //   .quadraticCurveTo( radius, radius, radius, 0 )
  //   .quadraticCurveTo( radius, - radius, 0, - radius )
  //   .quadraticCurveTo( - radius, - radius, - radius, 0 )
  //   .quadraticCurveTo( - radius, radius, 0, radius );

  // const shape = new THREE.Shape()
	// 				.moveTo( 40, 40 )
	// 				.lineTo( 40, 160 )
	// 				.absarc( 60, 160, 20, Math.PI, 0, true )
	// 				.lineTo( 80, 40 )
  // 				.absarc( 60, 40, 20, 2 * Math.PI, Math.PI, true );
  
  const shape = new THREE.Shape()
					.moveTo( 0, 0 )
					.absarc( 0, 0, radius, 0, Math.PI * 2, false );
    
  shape.autoClose = true;
  const points = shape.getPoints();
  let geometry =  new BufferGeometry().setFromPoints( points );

  let mat = new LineBasicMaterial( { color: 0xffffff } );

  //let geometry = new THREE.ShapeBufferGeometry( shape );

  let mesh = new Line(geometry, mat);
  scene.add(mesh);
}