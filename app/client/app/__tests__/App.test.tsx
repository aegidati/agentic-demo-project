import App from '../src/App';

describe('App Component', () => {
  it('exports a valid React component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
