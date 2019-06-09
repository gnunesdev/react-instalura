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

    Pubsub.subscribe("atualiza-liker", (topico, infoLiker) => {
      const fotoAchada = this.state.fotos.find(
        foto => foto.id === infoLiker.fotoId
      );

      fotoAchada.likeada = !fotoAchada.likeada;

      const possibleLiker = fotoAchada.likers.find(
        liker => liker.login === infoLiker.liker.login
      );

      if (possibleLiker === undefined) {
        fotoAchada.likers.push(infoLiker.liker);
      } else {
        const newLikers = fotoAchada.likers.filter(
          liker => liker.login !== infoLiker.liker.login
        );
        fotoAchada.likers = newLikers;
      }
      this.setState({ fotos: this.state.fotos });
    });

    Pubsub.subscribe("novos-comentarios", (topico, infoComentario) => {
      const fotoAchada = this.state.fotos.find(
        foto => foto.id === infoComentario.fotoId
      );
      fotoAchada.comentarios.push(infoComentario.novoComentario);
      this.setState({ fotos: this.state.fotos });
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

  like(fotoId) {
    const requestDetails = {
      method: "POST"
    };

    fetch(
      `https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem(
        "auth-token"
      )}`,
      requestDetails
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Não foi possível realizar o like da foto");
        }
      })
      .then(liker => {
        Pubsub.publish("atualiza-liker", {
          fotoId: fotoId,
          liker: liker
        }); //property shorthand
      });
  }

  comenta(fotoId, textComentary) {
    const requestInfo = {
      method: "POST",
      body: JSON.stringify({
        texto: textComentary
      }),
      headers: new Headers({
        "Content-type": "application/json"
      })
    };

    fetch(
      `https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem(
        "auth-token"
      )}`,
      requestInfo
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Não foi possível comentar");
        }
      })
      .then(novoComentario => {
        Pubsub.publish("novos-comentarios", {
          fotoId: fotoId,
          novoComentario //shorthand
        });
      });
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
              like={this.like}
              comenta={this.comenta}
            />
          ))}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default withRouter(Timeline);
