import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import store from "./service/redux/store";
import { Home } from "./pages/home/Home";
import { Navbar } from "./components/navbar/Navbar";
import Books from "./pages/bookmarks/Books";

const clerkPubKey = import.meta.env.VITE_KEY_CLERK;

function App() {
  return (
    <Provider store={store}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <Router>
          <Routes>

            {/* Home (Default route) */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />

            {/* Home route (explicit) */}
            <Route
              path="/home"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />

            {/* Bookmarked Games Page */}
            <Route
              path="/library"
              element={
                <>
                  <Navbar />
                  <Books />
                </>
              }
            />

            {/* Authentication */}
            <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
          </Routes>
        </Router>
      </ClerkProvider>
    </Provider>
  );
}

export default App;
