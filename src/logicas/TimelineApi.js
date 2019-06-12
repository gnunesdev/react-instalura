export default class TimelineApi {

  static lista(urlPerfil) {
    return (dispatch) => {
      fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
          dispatch({ type: 'LISTAGEM', fotos }) //shorthand
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
          dispatch({ type: 'LIKE', fotoId, liker });
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
          dispatch({ type: 'COMENTARIO', fotoId, novoComentario }); //shorthand
          return novoComentario;
        });
    }
  }
}
