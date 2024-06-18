function pedirMusica() {
    var musicaInput = document.getElementById('musica-input').value;

    if (musicaInput.trim() !== '') {
        var listaMusicas = sessionStorage.getItem('musicas') || '[]';
        listaMusicas = JSON.parse(listaMusicas);

        listaMusicas.push(musicaInput);

        sessionStorage.setItem('musicas', JSON.stringify(listaMusicas));

        // Limpar o campo de entrada após pedir a música
        document.getElementById('musica-input').value = '';
    }
}
