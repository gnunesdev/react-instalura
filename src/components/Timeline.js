import React, { Component } from "react";
import { withRouter } from "react-router-dom";

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
    this.props.logicaTimeline.subscribe(fotos => {
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

    this.props.logicaTimeline.lista(urlPerfil);
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

  like(fotoId) {
    this.props.logicaTimeline.like(fotoId);
  }

  comenta(fotoId, textComentary) {
    this.props.logicaTimeline.comenta(fotoId, textComentary);
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
            <FotoItem
              key={foto.id}
              foto={foto}
              like={this.like.bind(this)}
              comenta={this.comenta.bind(this)}
            />
          ))}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default withRouter(Timeline);
