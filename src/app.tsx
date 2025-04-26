import { useEffect } from 'react';
import AppRouter from './components/app-router';
import { checkAuth } from './services/auth-service';
function App() {
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <>
      <main>
        <AppRouter />
      </main>
    </>
  );
}

export default App;
