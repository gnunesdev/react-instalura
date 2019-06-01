import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Pubsub from "pubsub-js";
import { CSSTransitionGroup } from "react-transition-group";

import FotoItem from "./Foto";

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fotos: []
    };
    this.login = this.props.login;
  }

  componentWillMount() {
    Pubsub.subscribe("timeline", (topico, fotos) => {
      this.setState({ fotos });
    });
  }

  carregaFotos(props) {
    let urlPerfil;
    if (this.login === undefined) {
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem(
        "auth-token"
      )}`;
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${
        this.login
      }`;
    }

    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.setState({ fotos: fotos });
      });
  }

  componentDidMount() {
    this.carregaFotos();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.login !== undefined) {
      this.login = nextProps.match.params.login;
      this.carregaFotos(nextProps);
    }
  }

  render() {
    return (
      <div className="fotos container">
        <CSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.state.fotos.map(foto => (
            <FotoItem key={foto.id} foto={foto} />
          ))}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default withRouter(Timeline);
