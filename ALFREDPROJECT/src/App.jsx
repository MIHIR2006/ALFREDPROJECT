import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './components/Common/PrivateRoute';
import Navbar from './components/Common/Navbar';
import DarkModeToggle from './components/Common/DarkModeToggle';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import FlashcardList from './components/Flashcards/FlashcardList';
import CreateFlashcard from './components/Flashcards/CreateFlashcard';
import EditFlashcard from './components/Flashcards/EditFlashcard';
import ReviewSession from './components/Review/ReviewSession';
import Profile from './components/Profile/Profile';
import Settings from './components/Profile/Settings';
import './styles/styles.css';
import AllFlashcards from './components/Flashcards/AllFlashcards';

const App = () => {
  const { auth } = useContext(AuthContext);

  const routes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/dashboard', element: <PrivateRoute component={Dashboard} /> },
    { path: '/flashcards', element: <PrivateRoute component={FlashcardList} /> },
    { path: '/all-flashcards', element: <PrivateRoute component={AllFlashcards} /> },
    { path: '/create-flashcard', element: <PrivateRoute component={CreateFlashcard} /> },
    { path: '/edit-flashcard/:id', element: <PrivateRoute component={EditFlashcard} /> },
    { path: '/review', element: <PrivateRoute component={ReviewSession} /> },
    { path: '/profile', element: <PrivateRoute component={Profile} /> },
    { path: '/settings', element: <PrivateRoute component={Settings} /> },
    { path: '/', element: auth?.token ? <Dashboard /> : <Login /> }
  ];

  return (
    <div className="App">
      <Navbar />
      <DarkModeToggle />
      <div className="container">
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </div>
  );
};

export default App;