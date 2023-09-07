export default function setPageTitle(routerTitle?: string): void {
  (window as any).document.title = routerTitle;
}
