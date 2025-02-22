import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
//import LessonPlanForm from './components/LessonPlanForm';
import PlannerPage from './Pages/PlannerPage';

const App = () => {
  return (
   <Router>
   <Routes>
    <Route path="/" element={<LoginPage/>} />
    <Route path='/planner' element={<PlannerPage/>}/>
   </Routes>
   </Router>
  )
}

export default App
