import React from 'react';
import { Routes, Route, Link } from "react-router-dom";

// Layouts
import AboutLayout from '../src/layouts/AboutLayout';
import HomeLayout from '../src/layouts/HomeLayout';
import InvestigationsLayout from './layouts/InvestigationsLayout';
import SearchLayout from './layouts/SearchLayout';
import ToolsLayout from '../src/layouts/ToolsLayout';

// Pages
import About from './pages/about';
import Home from './pages/home';
import Investigations from './pages/investigations';
import Search from './pages/search';
import Tools from './pages/tools';

import NotFound from './pages/error-pages/not-found';

import Header from './components/header/header';
import Footer from './components/footer/footer';

//import SearchApp from './components/SearchApp/SearchApp';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="investigations" element={<InvestigationsLayout />}>
            <Route index element={<Investigations />} />
          </Route>
          <Route path="tools" element={<ToolsLayout />}>
            <Route index element={<Tools />} />
          </Route>
          <Route path="about" element={<AboutLayout />}>
            <Route index element={<About />} />
          </Route>
          <Route path="search" element={<SearchLayout />}>
            <Route index element={<Search />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App
