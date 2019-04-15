/* eslint-disable no-console */
import React from /* ,{ Fragment } */ 'react';
// import Footer from "./components/Footer/Footer";
// import Header from "./components/Header/Header";

// BrowserRouter is the router implementation for HTML5 browsers (vs Native).
// Link is your replacement for anchor tags.
// Route is the conditionally shown component based on matching a path to a URL.
// Switch returns only the first matching route rather than all matching routes.
import {
  BrowserRouter as Router,
  // Link,
  Route,
  Switch,
} from 'react-router-dom';

import Dashboard from './components/Dashboard/Dashboard';
import Form from './components/Form/Form';
import './App.scss';

/* We give each route either a target `component`,
or we can send functions in `render` or `children` */

/* that return valid nodes.
`children` always returns the given node whether there is a match or not. */
const App = () => (
  <Router basename={`${process.env.PUBLIC_URL}/`}>
    <div>
      {/* <Fragment>
        <Header /> */}
      {/* <Link to="/">Dashboard</Link>{' '} */}
      {/* <Link to={{pathname: '/form'}}>Form</Link>{' '} */}
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/form" component={Form} />
        <Route render={() => <h1>Page not found</h1>} />
      </Switch>
      {/* <Footer />
      </Fragment> */}
    </div>
  </Router>
);

export default App;
