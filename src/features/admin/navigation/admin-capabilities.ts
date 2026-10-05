export function isAdminPathActive(currentPath: string, targetPath: string): boolean {
  if (currentPath === targetPath) return true;
  if (targetPath === '/admin') return currentPath === '/admin';
  return currentPath.startsWith(targetPath);
}

export function findActiveAdminItem<T extends { path: string }>(items: T[], currentPath: string): T | undefined {
  return items.find(item => isAdminPathActive(currentPath, item.path));
}
