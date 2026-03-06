import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function LessonLayout() {
  return (
    <div className="min-h-screen bg-surface-subtle">
      <Header />
      <main className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
