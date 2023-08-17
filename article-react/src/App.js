
import './App.css';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ArticlePage from './Pages/ArticlePage';
import ArticlesListPage from './Pages/ArticlesListPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import NotFound from './Pages/NotFoundPage';
import CreateAccountPage from './Pages/CreatAccountPage';
import LoginPage from './Pages/LoginPage';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <div id="page-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/articles" element={<ArticlesListPage />} />
            <Route path="/article/:articleId" element={<ArticlePage />} />
            <Route path="/create-account" element={<CreateAccountPage/>}/>
            <Route path="login" element={<LoginPage/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
