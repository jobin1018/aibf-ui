import { Outlet } from "react-router-dom";
import "./App.css";
import { Header } from "./Header";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ui/toast";
import { Footer } from "./components/Footer";

function App() {
  return (
    <ToastProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
