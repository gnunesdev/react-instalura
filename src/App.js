import React from "react";

import Header from "./components/Header";
import Timeline from "./components/Timeline";

import LogicaTimeline from "./logicas/LogicaTimeline";

const logicaTimeline = new LogicaTimeline([]);

function App(props) {
  return (
    <div id="root">
      <div className="main">
        <Header />
        <Timeline logicaTimeline={logicaTimeline} />
      </div>
    </div>
  );
}

export default App;
