import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import AboutLayout from '../src/layouts/AboutLayout';
import HomeLayout from '../src/layouts/HomeLayout';
import InvestigationsLayout from './layouts/InvestigationsLayout';
import SearchLayout from './layouts/SearchLayout';
import RootLayout from './layouts/RootLayout';
import ToolsLayout from '../src/layouts/ToolsLayout';

// Pages
import AboutPage from './pages/about';
import HomePage from './pages/home';
import InvestigationsDirectoryPage from './pages/investigations';
import InvestigationsDetailPage from './pages/investigations/detail';
import SearchPage from './pages/search';
import ToolsDirectoryPage from './pages/tools';

// ErrorBoundaries
import RootErrorBoundary from './pages/errors/RootErrorBoundary'

//import SearchApp from './components/SearchApp/SearchApp';
import './App.css';
import InstrumentsLayout from "./layouts/InstrumentsLayout";
import InstrumentsDirectoryPage from "./pages/instruments";
import InstrumentDetailPage from "./pages/instruments/detail";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        Component: HomeLayout,
        children: [
          {
            index: true,
            element: <HomePage />
          }
        ]
      },
      {
        path: "about",
        Component: AboutLayout,
        children: [
          {
            index: true,
            element: <AboutPage />
          }
        ]
      },
      {
        path: "instruments",
        Component: InstrumentsLayout,
        children: [
          {
            index: true,
            element: <InstrumentsDirectoryPage />,
          },
          {
            path: ":instrumentLid/:tabLabel",
            element: <InstrumentDetailPage />
          }
        ]
      },
      {
        path: "investigations",
        Component: InvestigationsLayout,
        children: [
          {
            index: true,
            element: <InvestigationsDirectoryPage />,
          },
          {
            path: ":investigationLid/:tabLabel",
            element: <InvestigationsDetailPage />,
          }
        ]
      },
      {
        path: "search",
        Component: SearchLayout,
        children: [
          {
            index: true,
            element: <SearchPage />
          },
          {
            path: ":searchText",
            element: <SearchPage />,
          }
        ]
      },
      {
        path: "tools",
        Component: ToolsLayout,
        children: [
          {
            index: true,
            element: <ToolsDirectoryPage />
          }
        ]
      }
    ]
  }
], { basename: "/portal/"})

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
