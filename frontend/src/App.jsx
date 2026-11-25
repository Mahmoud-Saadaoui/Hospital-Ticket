import {Header} from './compnents/Header';
import  Footer  from './compnents/Footer';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="app-shell">
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  );
}

export default App;
