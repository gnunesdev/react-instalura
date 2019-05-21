import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import FotoItem from "./Foto";

class Timeline extends Component {
  constructor() {
    super();
    this.state = {
      fotos: []
    };
  }

  componentDidMount() {
    let urlPerfil;

    if (this.props.match.params.login === undefined) {
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem(
        "auth-token"
      )}`;
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${
        this.props.match.params.login
      }`;
    }

    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        console.log(fotos);
        this.setState({ fotos: fotos });
      });
  }

  render() {
    return (
      <div className="fotos container">
        {this.state.fotos.map(foto => (
          <FotoItem key={foto.id} foto={foto} />
        ))}
      </div>
    );
  }
}

export default withRouter(Timeline);
