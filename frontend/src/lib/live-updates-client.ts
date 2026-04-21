export function shouldRefreshUpdates(currentVersion: string, incomingVersion: string): boolean {
  return currentVersion !== incomingVersion;
}

export function getFallbackRefreshMessage(): string {
  return "Live refresh is temporarily unavailable. Retrying automatically.";
}
