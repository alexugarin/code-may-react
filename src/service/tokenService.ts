export function encodeToBase64(email: string, code: string): string {
    return btoa(`${email}:${code}`);
  }
export function hideStr(str: string):string {
  return '*'.repeat(str.length);
}