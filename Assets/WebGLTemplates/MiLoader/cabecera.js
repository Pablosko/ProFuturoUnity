//Variables globales al curso
var bloqueActual = new String("1");
var subBloqueActual = new String("1_1");
var tituloSubBloqueActual = new String("");
var tituloBloqueActual = new String("");
var paginaActual = new String("");
var urlActual = new String("");
var paginasTotales = 0;
var repetirTodas = false;
var repetirIncorrectas = false;
var aviso = false;
var finRol = false;
var estadoInicial = false;
var posX,posY;
var finestraGlos = null;
var finestraAyuda = null;
var pla = "";
var paginasTotales = 0;
var paginasVisitadas = 0;


/******************************************************************************/
/* cargarAyuda(): cargar el documento de ayuda                                */
/******************************************************************************/
function cargarAyuda()
{
	 
   posX = parseInt(((screen.width - 8) - 800)/2);
   posY = parseInt(((screen.height - 40) - 400)/2);
    
   if(posX < 0) 
   {
      posX=0;
   }
    
   if(posY < 0) 
   {
      posY=0;
   }	
   
   if (finestraAyuda != null) 
    {
	finestraAyuda.close();
    }   
   finestraAyuda = window.open('../doc/ajuda.pdf' ,'flotAyuda','toolbar=1,menubar=1,menubar=1,resizable=1,left='+posX+',top='+posY+',width=800,height=400');	 
	 
}

/***************************************************************************************/
/* finalizar(): Finaliza el curso, guarda seguimiento en plataforma, y se desconecta   */
/***************************************************************************************/
function finalizar()
{  
	 calcularPaginasTotales();
	 //alert(((paginasVisitadas/paginasTotales)*100) + " " + paginasVisitadas+ " " + paginasTotales);
	 CURSO.ActualizarDatos(((paginasVisitadas/paginasTotales)*100), paginasVisitadas, paginasTotales);     
   CURSO.Commit("");	   
   CURSO.Finish("");
   window.parent.parent.UserClosed = true;
}	

/***************************************************************************************/
/* cerrar(): Llama a finalizar y cierra la ventana del curso                           */
/***************************************************************************************/
function cerrar()
{ 
    finalizar();    
    //top.opener.cerrar();   
    setTimeout('top.close()', 1000);    
}


/***************************************************************************************/
/* WhenOnLoad():Funcion que se ejecuta al cargar la cabecera                           */
/***************************************************************************************/	
function whenOnLoad()
{
        
}	

//02-08-2011 Copiar toda la función calcularPaginasTotales()
/*********************************************************************************/
/* calcularPaginasTotales(): Calcula las páginas totales y visitadas del curso   */        
/*********************************************************************************/
function calcularPaginasTotales()
{ 
   
   var cadEstados = new String("");
   var temp = new String("");
   var estado = new String("");
   var i = 0;  
      
   var tema = new String("");
   var temaUltimo = new String(""); 
   var apartado = new String("");
   var pagina = new String("");
   
   var numTotales = 0; 
   var numVisitadas = 0;
        
   
   tema = CURSO.temaPrimero();   	 
   temaUltimo = CURSO.temaUltimo();
   while ( tema != "")
   {
       	apartado = CURSO.apartadoPrimero(tema);
       	while ( apartado != "")
       	{      	             	              	            	        	     
       	     pagina = CURSO.paginaPrimera(apartado);
       	     while ( pagina != "")
       	     {    
       	     	     numTotales++;
       	     	     estado = CURSO.estado(pagina);
       	     	     if ((estado == "C")||(estado == "P")||(estado == "F")) 
       	     	     {
       	     	     	  numVisitadas++;  	             	              	            	        	     
       	     	     }	
       	           pagina = CURSO.paginaSiguiente(pagina);       	       		 	
       	     }
       	     
       	     apartado = CURSO.apartadoSiguiente(apartado);       	       		 	
       	}         	
       	tema = CURSO.temaSiguiente(tema);		 	       	
   }    
   paginasTotales = numTotales;  
   paginasVisitadas = numVisitadas;
}

/**
**/
function setPages()
{
      

           if (CURSO != null)
           {
             calcularPaginasTotales();            
             CURSO.ActualizarDatos(((paginasVisitadas/paginasTotales)*100), paginasVisitadas, paginasTotales);     
             CURSO.Commit("");     
             //top.opener.cerrar(); 
           } 
           
     
     
}
