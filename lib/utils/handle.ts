// lib/utils/handle.ts

// remove @ from prefixedHandle
export function extractHandleFromParam(prefixedHandle: string): string {
  return decodeURIComponent(prefixedHandle).slice(1);
}

// add @ to handle
export function formatHandleForUrl(handle: string): string {
  return encodeURIComponent(`@${handle}`);
}