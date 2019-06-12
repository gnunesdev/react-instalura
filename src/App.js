import React from "react";

import Header from "./components/Header";
import Timeline from "./components/Timeline";

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { timeline } from './reducers/timeline';
const store = createStore(timeline, applyMiddleware(thunkMiddleware));

function App(props) {
  return (
    <div id="root">
      <div className="main">
        <Header />
        <Timeline store={store} />
      </div>
    </div>
  );
}

export default App;
