export function RightAside() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold">На этой странице</p>
      <ul className="flex flex-col gap-1 border-l border-border pl-3">
        <li>
          <a href="#" className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Введение
          </a>
        </li>
        <li>
          <a href="#" className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Установка
          </a>
        </li>
      </ul>
    </div>
  )
}
