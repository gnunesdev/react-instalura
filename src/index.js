import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch, Redirect, matchPath } from "react-router-dom";
import history from "./history";

import App from "./App";
import Login from "./components/Login";
import Logout from "./components/Logout";

import "./css/reset.css";
import "./css/timeline.css";
import "./css/login.css";

import * as serviceWorker from "./serviceWorker";

function verificaAutenticacao(nextState, replace) {
  const match = matchPath("/timeline", {
    path: nextState.match.url,
    exact: true
  });

  let valida = false;
  if (match !== null) {
    valida = match.isExact;
  }

  if (valida && localStorage.getItem("auth-token") === null) {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { msg: "Faça login para acessar esta página" }
        }}
      />
    );
  }
  return <App />;
}

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/timeline/:login?" render={verificaAutenticacao} />
      <Route path="/logout" component={Logout} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
