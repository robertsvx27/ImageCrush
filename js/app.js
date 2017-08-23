;(function () {
    var indColor = 0;
    var indEstado = 0;
    var colores = new Array();
    var estados = new Array();
    colores = ['white','yellow'];
    estados = ['Reiniciar','Iniciar'];
    
    var cambiarTitulo = function(){        
        setInterval(function(){
            if(indColor == colores.length)
                indColor = 0;
            $('.main-titulo').css('color',colores[indColor]);
            indColor++;
            
        },1000);
    }
    
    $(".btn-reinicio").click(function(){        
        $(this).text(estados[indEstado]);
        if (indEstado == 1){
            
         indEstado =0;   
        }else{
         indEstado =1;   
         
        }
    })
          
    $(function(){       
        cambiarTitulo();        
    });
}());