import 'ts-replace-all';
export function removeUnderscore(n: string): string {
  return n.replaceAll('_', '');
}
