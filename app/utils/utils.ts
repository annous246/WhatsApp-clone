export function alreadyDotted(p: string) {
  let c = 0;
  for (let k of p) {
    if (k == ".") c++;
    if (c == 2) return true;
  }
  return false;
}
export function timeDiff(d1: Date, d2: Date): number {
  return Math.abs(d1.getTime() - d2.getTime()) / 1000;
}
