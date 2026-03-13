import { Link, useRoutes } from 'react-router-dom';
import { appRoutes } from './routes';

export function App(): JSX.Element {
  const content = useRoutes(appRoutes);

  return (
    <div className="layout">
      <header className="header">
        <h1>React SPA Starter</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/health">Health</Link>
        </nav>
      </header>
      <main className="main">{content}</main>
    </div>
  );
}
