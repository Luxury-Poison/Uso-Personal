$(function () {
    // Validación básica para asegurarnos de que la playlist esté disponible
    if (!window.playlist || !Array.isArray(window.playlist)) {
        console.error("No se ha definido 'window.playlist'");
        return;
    }

    let current = 0;

    // Elementos clave del reproductor
    const $audio = $('#audio');
    const $title = $('#song-title');
    const $progress = $('#progress');

    // Función para cargar una canción
    function loadSong(index) {
        $audio.attr('src', window.playlist[index].url);
        $title.text(window.playlist[index].name);
        $audio[0].load();
        $('#play').show();
        $('#pause').hide();
        updateProgressStyle(0); // Reinicia barra visual
    }

    // Reproducir la canción actual
    function playSong() {
        $audio[0].play().catch(err => console.log("Bloqueado por el navegador:", err));
        $('#play').hide();
        $('#pause').show();
    }

    // Pausar la canción actual
    function pauseSong() {
        $audio[0].pause();
        $('#pause').hide();
        $('#play').show();
    }

    // Pasar a la siguiente canción
    function nextSong() {
        current = (current + 1) % window.playlist.length;
        loadSong(current);
        playSong();
    }

    // Volver a la canción anterior
    function prevSong() {
        current = (current - 1 + window.playlist.length) % window.playlist.length;
        loadSong(current);
        playSong();
    }

    // Actualizar visual de barra de progreso con degradado dinámico
    function updateProgressStyle(percent) {
        $progress.css('background', `linear-gradient(to right, #ff4081 0%, #ff4081 ${percent}%, #ccc ${percent}%, #ccc 100%)`);
    }

    // Eventos
    $('#play').on('click', playSong);
    $('#pause').on('click', pauseSong);
    $('#next').on('click', nextSong);
    $('#prev').on('click', prevSong);

    // Al avanzar el tiempo del audio
    $audio.on('timeupdate', function () {
        const percent = ($audio[0].currentTime / $audio[0].duration) * 100;
        $progress.val(percent || 0);
        updateProgressStyle(percent || 0);
    });

    // Cuando el usuario mueve manualmente la barra de progreso
    $progress.on('input', function () {
        const value = $(this).val();
        $audio[0].currentTime = ($audio[0].duration * value) / 100;
        updateProgressStyle(value);
    });

    // Al terminar una canción, pasar a la siguiente
    $audio.on('ended', nextSong);

    // Cargar la primera canción
    loadSong(current);
});


// Color degrade
// const range = document.querySelector('input[type="range"]');
// range.addEventListener('input', () => {
//     const percent = (range.value / range.max) * 100;
//     range.style.setProperty('--progress', `${percent}%`);
// });





$(function(){
var nombreUserProfile = '.p-name'; /*Clase donde se encuentra la variable {USERNAME} en tu perfil sencillo*/

$('a.mentiontag').each(function(){
var $self = $(this);
var link = $self.attr('href');
$self.removeAttr('title'); /*Limpieza del title de las menciones, que personalmente opino que sobra*/
$.get(link, function(data){
if ($(data).find(nombreUserProfile+' span[style]').length) {
$self.attr('style',$(data).find(nombreUserProfile+' span[style]').attr('style'));
}
});
});
});



$(function(){
    var nombreUserProfile = '.p-name span';
    $('a.mentiontag').each(function(){
        var $self = $(this);
        var link = $self.attr('href');
        $self.removeAttr('title');
        $.get(link, function(data){
            var $spanColor = $(data).find(nombreUserProfile + ' span[style]').first();
            if($spanColor.length){
                $self.attr('style', $spanColor.attr('style'));
            }
        });
    });
});