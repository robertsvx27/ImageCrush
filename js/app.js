;
(function () {
    var indColor = 0;
    var indEstado = 0;
    var colores = new Array();
    var estados = new Array();
    colores = ['white', 'yellow'];
    estados = ['Reiniciar', 'Iniciar'];

    var cambiarTitulo = function () {
        setInterval(function () {
            if (indColor == colores.length)
                indColor = 0;
            $('.main-titulo').css('color', colores[indColor]);
            indColor++;

        }, 1000);
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
                    if (tiempo < 0){
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

        };
        $(init);

    }

    $(".btn-reinicio").click(function () {
        $(this).text(estados[indEstado]);
        if (indEstado == 1) {
            indEstado = 0;
        } else {
            temporizador();
            indEstado = 1;
        }
    })

    $(function () {
        cambiarTitulo();
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
                sec = parseInt(time / 100) - (min * 60),
                hundredths = pad(time - (sec * 100) - (min * 6000), 2);
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
    }
}());