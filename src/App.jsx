// AllRecipes/src/App.jsx

import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './components/layout/toggle-switch.css';
import Pages from './pages/Pages';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <div className="app-container"> 
          <Pages />
        </div>
      </FavoritesProvider>
    </ThemeProvider>
  )
}

export default App;