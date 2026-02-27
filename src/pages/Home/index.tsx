import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Button onClick={() => alert('hello world')}>Click me</Button>
    </div>
  )
}
