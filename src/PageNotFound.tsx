import { useRouteError } from "react-router-dom";

type RouteError = {
  statusText?: string;
  message?: string;
};

export default function PageNotFound() {
  const error = useRouteError() as RouteError; // Explicitly cast the type
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, seems like the page doesn't exist.</p>
      <p>
        <i>{error.statusText || error.message || "Unknown error"}</i>
      </p>
    </div>
  );
}
