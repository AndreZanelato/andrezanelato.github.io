document.addEventListener('DOMContentLoaded', function() {
    var listaMusicas = sessionStorage.getItem('musicas');
    listaMusicas = JSON.parse(listaMusicas) || [];

    var musicasListaElement = document.getElementById('musicas-lista');

    listaMusicas.forEach(function(musica) {
        var novaMusica = document.createElement('li');
        novaMusica.textContent = musica;
        musicasListaElement.appendChild(novaMusica);
    });
});
