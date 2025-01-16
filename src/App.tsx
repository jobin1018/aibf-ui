import { Outlet } from "react-router-dom";
import "./App.css";
import { Header } from "./Header";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <Outlet />
      </ThemeProvider>
    </>
  );
}

export default App;
