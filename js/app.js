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
var cantidadImagenes = arrayImagenes.length;
var matriz = [];
var divMovimiento = null;

$(function () {

    function juego(f, c, obj, src)
    {
        return {
            f: f,
            c: c,
            fuente: src,
            enCombo: false,
            o: obj
        }
    }

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
        for (var f = 0; f < dimension; f++) {
            matriz[f] = [];
            for (var c = 0; c < dimension; c++) {
                var imagenPonemos = Math.floor((Math.random() * cantidadImagenes));
                matriz[f][c] = new juego(f, c, null, arrayImagenes[imagenPonemos]);

                var celda = $('#img' + f + c).html("<img src='" + matriz[f][c].fuente + "' alt=''/>");
                celda.draggable(
                        {
                            containment: '.panel-tablero',
                            cursor: 'move',
                            zIndex: 100,
                            opacity: 0.85,
                            snap: '.panel-tablero',
                            stack: '.panel-tablero',
                            //revert: true,
                            start: handleDragStart,
                            drag: handleDragStop,
                            stop: function (event, ui) {
                                
                            }
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
        console.log("Moving jewel: " + event.target.id);
        console.log("Posicion: " + event.target);
        //var offsetXPos = parseInt(ui.offset.left);
        //var offsetYPos = parseInt(ui.offset.top);
        //console.log("Drag drag!\nOffset: (" + offsetXPos + ", " + offsetYPos + ")\n");        
        //event.originalEvent.dataTransfer.setData("text/plain", event.target.id);
    }
    
    function handleDragStart(event, ui) {       
        console.log("Moving jewel: " + event.target.id);
        console.log("Moving jewel: " + event.target.css);
        console.log("Posicion: " + event.target);
        var offsetXPos = parseInt(ui.offset.left);
        var offsetYPos = parseInt(ui.offset.top);
        console.log("Drag drag!\nOffset: (" + offsetXPos + ", " + offsetYPos + ")\n");                
        divMovimiento = event.target;
    }

    function handleDropEvent(event, ui) {
        var draggable = ui.draggable; // a donde llega el div a mover
        console.log('Posicion movida "' + draggable.attr('id') + '" was dropped onto me!'+
                event.target.id);          
        console.log("Div Arrastre: " + divMovimiento.id);
        $("#img22").swap({ 
            target: draggable.attr('id'), // Mandatory. The ID of the element we want to swap with  
            opacity: "0.5", // Optional. If set will give the swapping elements a translucent effect while in motion  
            speed: 1000, // Optional. The time taken in milliseconds for the animation to occur  
            callback: function() { // Optional. Callback function once the swap is complete                   
            }  
        }); 
//        $("#"+ draggable.attr('id')).swap({ 
//            target: divMovimiento.id, // Mandatory. The ID of the element we want to swap with  
//            opacity: "0.5", // Optional. If set will give the swapping elements a translucent effect while in motion  
//            speed: 100, // Optional. The time taken in milliseconds for the animation to occur  
//            callback: function() { // Optional. Callback function once the swap is complete                   
//            }  
//        }); 
        //event.preventDefault();
        //console.log("drag over " + event.target);
    }

    function seleccionaryEliminar() {
        for (var f = 0; f < dimension; f++) {
            var prevCelda = null;
            var figLongitud = 0;
            var figInicio = null;
            var figFin = null;

            for (var c = 0; c < dimension; c++) {
                // first cell of combo!
                if (prevCelda == null)
                {
                    //console.log("FirstCell: " + r + "," + c);
                    prevCelda = matriz[f][c].src;
                    figInicio = c;
                    figLongitud = 1;
                    figFin = null;
                    continue;
                } else {
                    var curCelda = matriz[f][c].fuente;
                    if (!(prevCelda == curCelda)) {
                        prevCelda = matriz[f][c].fuente;
                        figInicio = c;
                        figFin = null;
                        figLongitud = 1;
                        continue;
                    } else {
                        figLongitud += 1;
                        if (figLongitud == 3)
                        {
                            figValidas += 1;
                            figFin = c;
                            console.log("Combo from " + figInicio + " to " + figFin + "!");
                            for (var ci = figInicio; ci <= figFin; ci++)
                            {

                                matriz[f][ci].esCombo = true;
                                matriz[f][ci].fuente = null;
                                //grid[r][ci].o.attr("src","");

                            }
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

    function formatoTiempo(time) {
        var min = parseInt(time / 60),
                sec = time - (min * 60);
        console.log((min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2));
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
    }
}());