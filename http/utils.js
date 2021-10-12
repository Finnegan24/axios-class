export function uuid() {
  const url = URL.createObjectURL(new Blob([]));
  const uuid = url.substring(url.lastIndexOf("/") + 1);
  URL.revokeObjectURL(url);
  return uuid;
}
