import { Outlet } from "react-router-dom";
import "./App.css";
import { Header } from "./Header";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ui/toast";

function App() {
  return (
    <ToastProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Header />
        <Outlet />
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
