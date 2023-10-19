import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes/routes";
import AuthProvider from "./routes/AuthProvider";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {routes.map((route, index) => {
            const Layout = route.layout;
            const Page = route.component;

            return route.private ? (
              <Route
                key={index}
                path={route.path}
                element={
                  <AuthProvider>
                    <Layout>
                      <Page />
                    </Layout>
                  </AuthProvider>
                }
              />
            ) : (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
