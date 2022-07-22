import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import Home from './components/Home/Home.jsx';
import Form from './components/CreateForm/Form.jsx';
import Detail from './components/Detail/Detail.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/create' element={<Form />} />
        <Route path='/detail/:id' element= {<Detail />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
