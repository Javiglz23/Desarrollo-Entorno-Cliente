// Regla única de la unidad: 10 puntos por tema de interés + min(likes, 20).
// TODO sesión 3: crear una función pura de puntuación.

export function puntuarPublicacion(publicacion, intereses) {
    if (!publicacion || typeof publicacion !== 'object' || !Number.isInteger(publicacion.likes) || !Array.isArray(intereses)) {
        throw new Error('Datos inválidos');
    }

    const puntosTema = intereses.includes(publicacion.topic) ? 25 : 0;
    const puntosLikes = Math.min(publicacion.likes, 20);

    return puntosTema + puntosLikes;
}

export function crearPuntudador(intereses) {
    if (!Array.isArray(intereses)) {
        throw new Error('Intereses debe ser un array');
    }

    const interesesUsuario=[...intereses];
    
    return function(publicacion) {
        return puntuarPublicacion(publicacion, interesesUsuario);
    };
}


// TODO sesión 10: recuperar páginas del catálogo para evaluar todo el conjunto y ordenarParaTi(lista, intereses) con desempate por id.
