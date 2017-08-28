var puntos = 0,
        movimientos = 0,
        tiempoJuego = 5, // segundos
        tiempoRestante,
        tiempo,
        indColor = 0,
        indEstado = 0,
        colores = ['white', 'yellow'];
dimension = 7;
var arrayImagenes = ['image/1.png', 'image/2.png', 'image/3.png', 'image/4.png'];
var cantidadImagenes = arrayImagenes.length;
var matriz = new Array([], [], [], [], [], [], []);

$(function () {


    var cambiarTitulo = function () {
        setInterval(function () {
            if (indColor == colores.length)
                indColor = 0;
            $('.main-titulo').css('color', colores[indColor]);
            indColor++;
        }, 1000);
    }

    $(".btn-reinicio").click(iniciar)

    function iniciar() {
        $('.btn-reinicio').text('Reiniciar');
        if (indEstado == 0) {
            indEstado = 1;
            iniciarTiempo();
        } else {
            reiniciar();
        }
    }

    function reiniciar() {

        puntos = 0;
        movimientos = 0;
        tiempoRestante = tiempoJuego;
        actualizarTiempo();
        clearTimeout(tiempo);
        $('.panel-tablero').slideToggle("slow", function () {
            iniciarTiempo();
        });
        $('.time').show();
        $('.finalizacion').hide();
        $('.panel-score').css({'width': '25%'});
        $('.panel-score').resize({
            animate: true
        });
        cargarTablero();
    }

    function iniciarTiempo() {
        tiempoRestante = tiempoJuego;
        tiempo = setTimeout(contadorTiempo, 1000);
    }

    function contadorTiempo() {
        tiempoRestante -= 1;
        console.log(tiempoRestante);
        actualizarTiempo();
        if (tiempoRestante == 0) {
            return finalizacion();
        }
        tiempo = setTimeout(contadorTiempo, 1000);
    }

    function actualizarTiempo() {
        $('#timer').html(formatoTiempo(tiempoRestante));
    }

    function actualizarPuntos() {
        $('#score-text').html(puntos);
    }

    function actualizarMovimientos() {
        $('#movimientos-text').html(movimientos);
    }

    function finalizacion() {
        $('.panel-tablero').slideToggle("slow", function () {
            $('.time').hide();
            $('.finalizacion').show();
            $('.panel-score').css({'width': '100%'});
            $('.panel-score').resize({
                animate: true
            });
        });
    }

    function cargarTablero() {
        for (var x = 0; x < dimension; x++) {
            for (var j = 0; j < dimension; j++) {
                var imagenPonemos = Math.floor((Math.random() * cantidadImagenes));
                matriz[x][j] = arrayImagenes[imagenPonemos];
                $('#img' + x + j).html("<img src='" + matriz[x][j] + "' alt=''/>");
                $('#img' + x + j).draggable(
                        {
                            containment: '.panel-tablero',
                            cursor: 'move',
                            snap: '.panel-tablero',
                            distance: '1',
                            stack: '.panel-tablero',
                            revert: true
                        });
            }
        }
    }

    var temporizador = function () {
        var $timer,
                tiempo = 1000;
        incrementador = 70,
                actualizarTiempo = function () {
                    $timer.html(formatTime(tiempo));
                    if (tiempo == 0) {
                        temporizador.Timer.stop();
                        return;
                    }
                    tiempo -= incrementador / 10;
                    if (tiempo < 0) {
                        tiempo = 0;
                        tiempoCompleto();
                    }

                },
                tiempoCompleto = function () {
                    alert('Tiempo completado');
                },
                init = function () {
                    $timer = $('#timer');
                    temporizador.Timer = $.timer(actualizarTiempo, incrementador, true);
                };
        this.restaurarTiempo = function () {
            temporizador.Timer = $.timer()
        };
        $(init);

    }



    $(function () {
        cambiarTitulo();
        cargarTablero();
    });

// Common functions
    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    function formatTime(time) {
        var min = parseInt(time / 6000),
                sec = parseInt(time / 100) - (min * 60);
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
    }

    function formatoTiempo(time) {
        var min = parseInt(time / 60),
                sec = time - (min * 60);
        console.log((min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2));
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
    }
}());