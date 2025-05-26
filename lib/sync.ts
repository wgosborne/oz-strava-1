// lib/sync.ts
let hasSynced = false;

export function shouldSync() {
  if (!hasSynced) {
    hasSynced = true;
    return true;
  }
  return false;
}
