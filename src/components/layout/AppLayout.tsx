
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
