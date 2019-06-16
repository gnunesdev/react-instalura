import { listagem, comentario, like, notifica } from './../actions/actionCreator'

export default class TimelineApi {

  static lista(urlPerfil) {
    return (dispatch) => {
      fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
          dispatch(listagem(fotos)); //shorthand
          return fotos;
        });
    }
  }

  static like(fotoId) {
    return (dispatch) => {
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
          dispatch(like(fotoId, liker))
          return liker;
        });
    }
  }

  static comenta(fotoId, textComentary) {
    return dispatch => {

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
          dispatch(comentario(fotoId, novoComentario)); //shorthand
          return novoComentario;
        });
    }
  }

  static pesquisa(login) {
    return dispatch => {
      fetch(
        `https://instalura-api.herokuapp.com/api/public/fotos/${
        login
        }`
      )
        .then(response => response.json())
        .then(fotos => {
          if (fotos.length === 0) {
            dispatch(notifica('usuario não encontrado'));
          } else {
            dispatch(notifica('usuario encontrado'));
          }

          dispatch(listagem(fotos));
          return fotos;
        });
    }
  }
}
