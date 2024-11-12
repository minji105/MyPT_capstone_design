import { HashRouter as Router, Route } from 'react-router-dom';
import { Routes, Route as ReactRoute } from 'react-router-dom';
import Plank from './component/exercise/Plank.js';
import PushUp from './component/exercise/PushUp.js';
import Login from './component/Login.js';
import Main from './component/Main.js';
import Nav from './component/Nav.js';
import Register from './component/Register.js';
import PlankTutorial from './component/tutorial/Plank.js';
import PushUpTutorial from './component/tutorial/PushUp.js';
import TutorialContainer from './component/tutorial/TutorialContainer.js';
import BoardList from './component/community/BoardList.js';
import BoardWriteForm from './component/community/BoardWriteForm.js';
import BoardDetail from './component/community/BoardDetail.js';
import BoardEditForm from './component/community/BoardEditForm.js';
import { AuthProvider } from './contexts/AuthContext.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tutorial" element={<TutorialContainer />} />
            <Route path="/tutorial/plank" element={<PlankTutorial />} />
            <Route path="/tutorial/pushup" element={<PushUpTutorial />} />
            <Route path="/register" element={<Register />} />
            <Route path="/exercise/plank" element={<Plank />} />
            <Route path="/exercise/pushup" element={<PushUp />} />
            <Route path="/community" element={<BoardList />} />
            <Route path="/community/write" element={<BoardWriteForm />} />
            <Route path="/community/:postId" element={<BoardDetail />} />
            <Route path="/community/edit/:postId" element={<BoardEditForm />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

