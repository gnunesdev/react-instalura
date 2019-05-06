import React from "react";

import Header from "./components/Header";
import Timeline from "./components/Timeline";

function App() {
  return (
    <div id="root">
      <div className="main">
        <Header />
        <Timeline />
      </div>
    </div>
  );
}

export default App;
