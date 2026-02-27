import { Github, Send } from 'lucide-react'

const base = import.meta.env.BASE_URL

const contacts = [
  {
    name: 'Telegram',
    href: '#',
    icon: <Send className="size-4" />,
  },
  {
    name: '',
    href: '#',
    icon: <img src={`${base}icons/faceit.svg`} alt="FACEIT" width={80} />,
  },
  {
    name: '',
    href: '#',
    icon: <img src={`${base}icons/steam.png`} alt="Steam" width={60} />,
  },
  {
    name: 'GitHub',
    href: '#',
    icon: <Github className="size-4" />,
  },
]

export function AppFooter() {
  return (
    <footer className="border-t bg-chrome">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between md:px-0">
        <p className="text-sm text-muted-foreground">CS Guide — учебник по Counter-Strike 2</p>

        <div className="flex items-center gap-4">
          {contacts.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={name}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {icon}
              {name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
