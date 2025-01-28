import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Progress } from "./components/ui/progress";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              🚧 Site Under Construction 🚧
            </h1>
            <p className="text-lg text-muted-foreground">
              We're working hard to bring you something amazing!
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <Progress value={80} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              80% Complete
            </p>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
