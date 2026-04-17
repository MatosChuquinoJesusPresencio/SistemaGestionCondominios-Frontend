import AppRouter from "./routers/AppRouter";
import { AuthProvider } from "./providers/AuthProvider"

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;