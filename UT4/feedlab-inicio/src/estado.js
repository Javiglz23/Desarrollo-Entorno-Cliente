// TODO sesión 7: actualizarPublicacion sin mutar el array ni el post original.

export function actualizarPublicacionEnLista(lista, id, cambios) {
    return lista.map(publicacion => {
        if (publicacion.id === id) {
            return { ...publicacion, ...cambios };
        }
        return publicacion;
    });
}

export function alternarLikeLocal(lista, idPost) {
    return lista.map(publicacion => {
        if (publicacion.id === idPost) {
            const nuevoEstadoLike = !publicacion.liked;
            const nuevoConteoLikes = publicacion.likes + (nuevoEstadoLike ? 1 : -1);
            return { ...publicacion, liked: nuevoEstadoLike, likes: nuevoConteoLikes };
        }
        return publicacion;
    });
}
