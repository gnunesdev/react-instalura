import React from "react";
import queryString from "query-string";

import Header from "./components/Header";
import Timeline from "./components/Timeline";

function App() {
  return (
    <div id="root">
      <div className="main">
        <Header />
        <Timeline login={queryString.parse(this.props.location.search)} />
      </div>
    </div>
  );
}

export default App;
