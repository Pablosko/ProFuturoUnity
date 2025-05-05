function whenOnLoad()
{
   var temp = new String("");      
   var tmpPagina = new String("");       
   var primeraPagina = new String("");      
   var estadoEvaluacion = new String("");
   var numPagina = 0;      
   
       
      
   if (window.parent.parent.parent.parent.parent.fcent.sup.paginaActual=="") tmpPagina = "";
   else tmpPagina = window.parent.parent.parent.parent.parent.fcent.sup.paginaActual;
      
   if (tmpPagina == "")
   {
      
      tmpPagina = CURSO.paginaNoCompletada(window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual);
      
      if (tmpPagina == "") 
      {  
      	  
	           tmpPagina = CURSO.paginaPrimera(window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual);	   	        		   	       		
      }	
   } 
   
   //setTimeout('window.parent.parent.parent.parent.parent.fcent.inf.cambiarFondo(window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual);',50); 
   //window.parent.parent.parent.parent.parent.fcent.inf.actualizarBotonesNumeros();   
   window.parent.parent.parent.parent.parent.fcent.sup.paginaActual = tmpPagina;   
        
   calcularContador(tmpPagina);   	   
   parent.contenido_mig.document.location = window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual + "/" + window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual + "/" + tmpPagina + ".htm";   
}

function avanzar()
{  
 
   parent.contenido_mig.focus(); 	
      
   var tmpPagina = new String("");      
   var auxApartado = new String("");      
   tmpPagina = CURSO.paginaSiguiente(window.parent.parent.parent.parent.parent.fcent.sup.paginaActual);   
   if (tmpPagina == "")
   {
       tmpPagina = CURSO.paginaPrimera(CURSO.apartadoSiguiente(window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual));	
   }
   
           	    
   splitPagina = tmpPagina.split("_");
   window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual =	splitPagina[0];
   window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual = splitPagina[0] + "_" + splitPagina[1];
   window.parent.parent.parent.parent.parent.fcent.sup.paginaActual =	tmpPagina;      
   
   calcularContador(tmpPagina);  
   //window.parent.parent.parent.parent.parent.fcent.inf.actualizarBotonesNumeros();    
   parent.contenido_mig.document.location = window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual + "/" + window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual + "/" + tmpPagina + ".htm";      
   
   
}

function retroceder()
{     
   document.getElementById("Avanzar_Menu").style.visibility = "hidden";    
   
   parent.contenido_mig.focus();
   var tmpPagina = new String("");      
   tmpPagina = CURSO.paginaAnterior(window.parent.parent.parent.parent.parent.fcent.sup.paginaActual);    
   if (tmpPagina == "")
   {
       tmpPagina = CURSO.paginaUltima(CURSO.apartadoAnterior(window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual));	
   }
   
   splitPagina = tmpPagina.split("_");
   
   window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual =	splitPagina[0];
   window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual = splitPagina[0] + "_" + splitPagina[1];
   window.parent.parent.parent.parent.parent.fcent.sup.paginaActual =	tmpPagina;   
   
   
   calcularContador(tmpPagina);   
   //window.parent.parent.parent.parent.parent.fcent.inf.actualizarBotonesNumeros();   
   parent.contenido_mig.document.location = window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual + "/" + window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual + "/" + tmpPagina + ".htm";   	
}	

/*Calcular el marcador de páginas */
function calcularContador(pagActual)
{
   var numPag = new String("");
   var total  = new String("");
   var sigPag = new String("");
   var antPag = new String("");
   var sigApar = new String("");
   var antApar = new String("");
   var isActivo = 0;
   var isActivo2 = 0;
   
   
   
      numPag = window.parent.parent.parent.parent.parent.fcent.inf.calcularPaginasApartadosAnteriores(window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual) + CURSO.paginaOrden(pagActual);    
      total  = window.parent.parent.parent.parent.parent.fcent.inf.calcularPaginas(window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual);     
      sigPag = CURSO.paginaSiguiente(pagActual);
      if (sigPag == "" )
      {
          sigApar = CURSO.apartadoSiguiente(window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual);
          if ( sigApar != "")
          {       
             sigPag = CURSO.paginaPrimera(sigApar);	
          }   
      }	
  
       
      antPag = CURSO.paginaAnterior(pagActual);
      if (antPag == "" )
      {
           antApar = CURSO.apartadoAnterior(window.parent.parent.parent.parent.parent.fcent.sup.subBloqueActual);
           if ( antApar != "")
           {       
               antPag = CURSO.paginaUltima(antApar);	
           }   
      }    
      
      if (sigPag != "") isActivo = 1;  
      if (antPag != "") isActivo2 = 1;        
    
   pintarContador(numPag,total,isActivo,isActivo2);   
}

/*Pintar el marcador de las páginas*/
function pintarContador(numPag,total,isActivo,isActivo2)
{       
    document.getElementById("contador").innerHTML = numPag + "&nbsp;&nbsp;&nbsp;&nbsp;" + total;            
    
    
        
    if (isActivo == 0)
    { 
    	document.getElementById("Avanzar").style.visibility = "hidden";
    	document.getElementById("Avanzar_Menu").style.visibility = "hidden";
    	
    }    	
    else 
    {           
      document.getElementById("Avanzar").style.visibility = "hidden";        	   	
      document.getElementById("Avanzar_Menu").style.visibility = "hidden";
    	
    }   
    
    if (isActivo2 == 0)
    { 
        document.getElementById("Retroceder").style.visibility = "hidden";        
    }
    else 
    {
         document.getElementById("Retroceder").style.visibility = "visible";        
    }
    
           
}	

function volver()
{
	  window.parent.parent.parent.parent.parent.fcent.inf.volverHome();
}

function cargarIndice()
{
	  window.parent.parent.parent.parent.parent.fcent.inf.cargarTema(window.parent.parent.parent.parent.parent.fcent.sup.bloqueActual);
}