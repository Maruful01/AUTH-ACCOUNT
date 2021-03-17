import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Error from "./components/Error/Error";
import Home from "./components/Home/Home";

function App() {
  return (
    <div className="App-header">
      <Router>
      <header>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/home">About</Link></li>
            </ul>
          </header>
      <Switch>
           <Route path="/home"> 
            <Home/>
           </Route>

          <Route exact path="/">
            <Home />
          </Route>
          
          <Route path="*">
            <Error/>
          </Route>
        </Switch>
    </Router>
    </div>
  );
}

export default App;
