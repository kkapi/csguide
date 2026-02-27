import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

function App() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Button onClick={() => alert('hello world')}>Click me</Button>
    </div>
  )
}

export default App