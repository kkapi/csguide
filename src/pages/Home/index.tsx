import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";

export function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Button onClick={() => alert("hello world")}>Click me</Button>
      <Link to="/maps/mirage/smokes?nade=mirage-smoke-window-1" className="text-lg font-bold md:w-52 md:shrink-0">
        ГРАНАТА ААААААААААААА
      </Link>
    </div>
  );
}
