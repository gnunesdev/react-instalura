export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return action.fotos;
  }

  if (action.type === 'COMENTARIO') {
    const fotoAchada = state.find(foto => foto.id === action.fotoId);
    fotoAchada.comentarios.push(action.novoComentari);

    return state;
  }

  if (action.type === 'LIKE') {
    const fotoAchada = state.find(foto => foto.id === action.fotoId);

    fotoAchada.likeada = !fotoAchada.likeada;

    const possibleLiker = fotoAchada.likers.find(
      likerAtual => likerAtual.login === action.liker.login
    );

    if (possibleLiker === undefined) {
      fotoAchada.likers.push(action.liker);
    } else {
      const newLikers = fotoAchada.likers.filter(
        likerAtual => likerAtual.login !== action.liker.login
      );
      fotoAchada.likers = newLikers;
    }

    return state;
  }

  return state;
}