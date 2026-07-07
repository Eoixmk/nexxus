/**
 * Estado compartido de visibilidad del sidebar del shell.
 * Se usa desde el toolbar (toggle) y el layout (render).
 */
export function useSidebar() {
  const collapsed = useState('app-sidebar-collapsed', () => false)

  function toggle() {
    collapsed.value = !collapsed.value
  }

  return {
    collapsed,
    toggle,
  }
}
