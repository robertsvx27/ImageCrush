var puntos = 0,
        movimientos = 0,
        tiempoJuego = 5, // segundos
        tiempoRestante,
        tiempo,
        indColor = 0,
        indEstado = 0,
        figValidas = 0;
colores = ['white', 'yellow'];
dimension = 7;
var arrayImagenes = ['image/1.png', 'image/2.png', 'image/3.png', 'image/4.png'];
var puntuacion = [0, 0, 0, 100, 150, 200, 250];
var cantidadImagenes = arrayImagenes.length;
var matriz = [];
var divMovimiento = null;
var divArrastre = null;

$(function () {

    function juego(f, c, obj, src)
    {
        return {
            f: f,
            c: c,
            fuente: src,
            enCombo: false,
            o: obj
        };
    }

    var cambiarTitulo = function () {
        setInterval(function () {
            if (indColor === colores.length)
                indColor = 0;
            $('.main-titulo').css('color', colores[indColor]);
            indColor++;
        }, 1000);
    };

    $(".btn-reinicio").click(iniciar);

    function iniciar() {
        $('.btn-reinicio').text('Reiniciar');
        if (indEstado === 0) {
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
        actualizarMovimientos();
        actualizarPuntos();
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
        if (tiempoRestante === 0) {
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
        for (var f = 0; f < dimension; f++) {
            matriz[f] = [];
            for (var c = 0; c < dimension; c++) {
                var imagenPonemos = Math.floor((Math.random() * cantidadImagenes));
                matriz[f][c] = new juego(f, c, null, arrayImagenes[imagenPonemos]);

                var celda = $('#img_' + f + '_' + c).html("<img src='" + matriz[f][c].fuente + "' alt='" + f + "," + c + "'/>");
                celda.draggable(
                        {
                            containment: '.panel-tablero',
                            cursor: 'move',
                            zIndex: 100,
                            opacity: 0.85,
                            snap: '.panel-tablero',
                            stack: '.panel-tablero',
                            revert: true,
                            start: handleDragStart,
                            stop: handleDragStop
                        });
                celda.droppable(
                        {
                            drop: handleDropEvent
                        });
                matriz[f][c].o = celda;
            }
        }
    }

    function handleDragStop(event, ui) {

        console.log('DIV Final: "' + divArrastre);
        console.log("DIV Inicial: " + divMovimiento);

        var src = divMovimiento.split("_");

        var sf = src[1];
        var sc = src[2];

        var dst = divArrastre.split("_");

        var df = dst[1];
        var dc = dst[2];

        // verificando que el cambio de divs sea el de al lado.
        var ddx = Math.abs(parseInt(sf) - parseInt(df));
        var ddy = Math.abs(parseInt(sc) - parseInt(dc));

        if (ddx > 1 || ddy > 1)
        {
            console.log("Distancia invalida > 1");
            return;
        }

        if (sf !== df && sc !== dc) {
            console.log("Movimiento invalido...");
            return;
        }

        console.log("swap " + sf + "," + sc + " to " + df + "," + dc);

        var tmp = matriz[sf][sc].fuente;
        matriz[sf][sc].fuente = matriz[df][dc].fuente;
        matriz[sf][sc].o.html("<img src='" + matriz[sf][sc].fuente + "' alt='" + sf + "," + sc + "'/>");
        matriz[df][dc].fuente = tmp;
        matriz[df][dc].o.html("<img src='" + tmp + "' alt='" + df + "," + dc + "'/>");

        movimientos += 1;
        divMovimiento = null;
        divArrastre = null;
        actualizarMovimientos();
        seleccionaryEliminar();
    }

    function handleDragStart(event, ui) {
        divMovimiento = event.target.id;
        console.log("Div Inicio Start :" + divMovimiento);
    }

    function handleDropEvent(event, ui) {
        //var draggable = ui.draggable; // a donde llega el div a mover
        divArrastre = event.target.id;
        console.log('DIV Final Drop: "' + divArrastre + '"!');
        console.log("DIV Inicio Drop: " + divMovimiento);

    }

    function seleccionaryEliminar() {

        // Combo Horizontal

        for (var f = 0; f < dimension; f++) {
            var prevCelda = null;
            var figLongitud = 0;
            var figInicio = null;
            var figFin = null;

            for (var c = 0; c < dimension; c++) {

                // Primer celda para el combo
                if (prevCelda === null)
                {
                    //console.log("FirstCell: " + r + "," + c);
                    prevCelda = matriz[f][c].fuente;
                    figInicio = c;
                    figLongitud = 1;
                    figFin = null;
                    continue;
                } else {
                    var curCelda = matriz[f][c].fuente;
                    if (!(prevCelda === curCelda)) {
                        prevCelda = matriz[f][c].fuente;
                        figInicio = c;
                        figFin = null;
                        figLongitud = 1;
                        continue;
                    } else if(c<dimension) 
                    {
                        figLongitud += 1;
                        prevCelda = matriz[f][c].fuente;                        
                        figFin = null;                       
                        continue;
                    }
                    else{
                         figLongitud += 1;
                        if (figLongitud >= 3)
                        {
                            figValidas += 1;
                            figFin = c;
                            console.log("Combo Horizontal de " + figInicio + " a " + figFin + "!");
                            for (var ci = figInicio; ci <= figFin; ci++)
                            {
                                matriz[f][ci].enCombo = true;
                                matriz[f][ci].fuente = null;
                            }
                            puntos += puntuacion[figLongitud];
                            prevCelda = null;
                            figInicio = null;
                            figFin = null;
                            figLongitud = 1;
                            continue;
                        }

                    }
                }
            }
        }

        // Combo Vertical
        for (var c = 0; c < dimension; c++)
        {


            var prevCelda = null;
            var figLongitud = 0;
            var figInicio = null;
            var figFin = null;

            for (var f = 0; f < dimension; f++)
            {

                // bypass locked and jewels that partecipate to combo. 
                //The next cell will become first cell of combo.   
                if (matriz[f][c].enCombo)
                {
                    figInicio = null;
                    figFin = null;
                    prevCelda = null;
                    figLongitud = 1;
                    continue;
                }

                // first cell of combo!
                if (prevCelda === null)
                {
                    //console.log("FirstCell: " + r + "," + c);
                    prevCelda = matriz[f][c].fuente;
                    figInicio = f;
                    figLongitud = 1;
                    figFin = null;
                    continue;
                } else
                {
                    //second or more cell of combo.
                    var curCell = matriz[f][c].fuente;
                    // if current cell is not equals to prev cell then current cell become new first cell!
                    if (!(prevCelda === curCell))
                    {
                        //console.log("New FirstCell: " + r + "," + c);
                        prevCelda = matriz[f][c].fuente;
                        figInicio = f;
                        figFin = null;
                        figLongitud = 1;
                        continue;
                    } else if (f < dimension){
                        figLongitud += 1;
                    }else
                    {
                        // if current cell is equal to prevcell than combo lenght is increased
                        // Due to combo, current combo will be destroyed at the end of this procedure.
                        // Then, the next cell will become new first cell
                        figLongitud += 1;
                        if (figLongitud >= 3)
                        {
                            figValidas += 1;
                            figFin = f;
                            console.log("Combo vertical de " + figInicio + " a " + figFin + "!");
                            for (var ci = figInicio; ci <= figFin; ci++)
                            {
                                matriz[ci][c].enCombo = true;
                                matriz[ci][c].fuente = null;
                            }
                            puntos += puntuacion[figLongitud];
                            prevCelda = null;
                            figInicio = null;
                            figFin = null;
                            figLongitud = 1;

                            continue;
                        }
                    }
                }

            }
        }

        var esCombo = false;
        for (var f = 0; f < dimension; f++) {
            for (var c = 0; c < dimension; c++)
                if (matriz[f][c].enCombo)
                {
                    console.log("There are a combo");
                    esCombo = true;
                }
        }

        if (esCombo)
            eliminarImagenes();
        else
            console.log("NO COMBO");
    }

    function eliminarImagenes()
    {
        for (var f = 0; f < dimension; f++)
            for (var c = 0; c < dimension; c++)
                if (matriz[f][c].enCombo)  // this is an empty cell
                {
                    matriz[f][c].o.animate({
                        opacity: 0
                    }, 500);
                    actualizarPuntos();
                }

        $(":animated").promise().done(function () {

            // _executeDestroyMemory();

        });
    }


    var temporizador = function () {
        var $timer,
                tiempo = 1000;
        incrementador = 70,
                actualizarTiempo = function () {
                    $timer.html(formatTime(tiempo));
                    if (tiempo === 0) {
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
            temporizador.Timer = $.timer();
        };
        $(init);

    };



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

    function formatoTiempo(time) {
        var min = parseInt(time / 60),
                sec = time - (min * 60);
        console.log((min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2));
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
    }
}());