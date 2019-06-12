import Pubsub from "pubsub-js";

export default class LogicaTimeline {
  constructor(fotos) {
    this.fotos = fotos;
  }

  lista(urlPerfil) {
    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.fotos = fotos;
        Pubsub.publish("timeline", this.fotos);
      });
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
        const fotoAchada = this.fotos.find(foto => foto.id === fotoId);

        fotoAchada.likeada = !fotoAchada.likeada;

        const possibleLiker = fotoAchada.likers.find(
          likerAtual => likerAtual.login === liker.login
        );

        if (possibleLiker === undefined) {
          fotoAchada.likers.push(liker);
        } else {
          const newLikers = fotoAchada.likers.filter(
            likerAtual => likerAtual.login !== liker.login
          );
          fotoAchada.likers = newLikers;
        }
        Pubsub.publish("timeline", this.fotos);
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
        const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
        fotoAchada.comentarios.push(novoComentario);
        Pubsub.publish("timeline", this.fotos);
      });
  }

  subscribe(callback) {
    Pubsub.subscribe("timeline", (topico, fotos) => {
      callback(fotos);
    });
  }
}
