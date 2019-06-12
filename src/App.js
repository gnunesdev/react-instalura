import React from "react";

import Header from "./components/Header";
import Timeline from "./components/Timeline";

import TimelineStore from "./logicas/TimelineStore";

const timelineStore = new TimelineStore([]);

function App(props) {
  return (
    <div id="root">
      <div className="main">
        <Header />
        <Timeline store={timelineStore} />
      </div>
    </div>
  );
}

export default App;
