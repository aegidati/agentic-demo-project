import { Link } from 'react-router-dom';

export function HomePage(): JSX.Element {
  return (
    <section>
      <h2>Home</h2>
      <p>This is a minimal React SPA starter for full-stack projects.</p>
      <p>
        Check backend connectivity on the <Link to="/health">Health page</Link>.
      </p>
    </section>
  );
}
