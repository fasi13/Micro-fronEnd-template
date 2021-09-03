export default function  generateUniqueKey(pathName: string, pathId: string): string {
  return pathName.split(' ').join('__').toLowerCase()	.toString().concat('____', pathId.toString());
}
