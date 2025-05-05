var lstEstados = new String("");
var lstEstadosTemas = new String("");
var lstEstadosApartados = new Array(3);
var lstScores = new String("");
var ventanaDoc = null;
/*********************************************************************************/
/* cadenaEstados(): Crea un cadena serapada por comas con el estado de los temas */
/* y una cadena separada por comas con estado los apartados que componen el tema */
/* lstEstadosTemas y  lstEstadosApartados                                        */        
/*       0 - Elemento inactivo                                                   */
/*       1 - Elemento No Empezado                                                */       
/*       2 - Elemento Incompleto                                                 */
/*       3 - Elemento completado                                                 */
/*       3 - Elemento Aprobado                                                   */
/*       4 - Elemento Suspendido                                                 */
/*********************************************************************************/
function cadenaEstados()
{ 
   var tmpSuspendData = new String("");
   var cadPuntuacion = new String("");	
   var cadEstados = new String("");
   var cadEstadosTemas = new String("");
   var cadEstadosApartados = new Array(3);
   var tmpEstadosTema = new String("");
   var tmpPuntuacionTema = new String("");
   var tmpEstadosApartado = new String("");
   var tmpPuntuacionApartado = new String("");
   var tmpllocation = new String("");
   var temp = new String("");
   var estado = new String("");
   var puntuacion = new String("");
   var profundidad = 3; 
   var i = 0;  
      
   var tema = new String("");
   var apartado = new String("");
   var temaActual = new String("");
   var apartadoActual = new String("");
   var temaActivo = true;
   var apartadoActivo = true;
   
   temaActual = CURSO.temaNoCompletado();
   /*temaActual = "1";*/
      
   apartadoActual = CURSO.apartadoNoCompletado(temaActual);
   tmpSuspendData = API.LMSGetValue("cmi.suspend_data");
   splitSuspendData = tmpSuspendData.split("$");
   tmpllocation = API.LMSGetValue("cmi.core.lesson_location");
   splitllocation = tmpllocation.split(",");
   
   /*
       0 - Elemento inactivo
       1 - Elemento No Empezado       
       2 - Elemento Incompleto
       3 - Elemento completado
       3 - Elemento Aprobado
       4 - Elemento Suspendido   
   */
               
    if  (profundidad == 3)
    {
    	 tema = CURSO.temaPrimero();
    	 i = 0; 
       	 while ( tema != "")
       	 {
       	     if  (temaActivo)
       	     {        	     
       	        estado = CURSO.estado(tema);       	        
       	        switch(estado)
       	        {
       	           case "F": 
       	           {
       	           	tmpEstadosTema += "3,";       	           	
       	           	break;
       	           }       	           
       	           case "P": 
       	           {
       	           	tmpEstadosTema += "4,";
       	           	break;
       	           }       	            
       	           case "C": 
       	           {
       	           	tmpEstadosTema += "4,";
       	           	break;
       	           }
       	           case "I": 
       	           {
       	           	tmpEstadosTema += "2,";
       	           	break;
       	           }
       	           case "N": 
       	           {
       	           	tmpEstadosTema += "1,";       	           	
       	           	break;
       	           }
       	           default:
       	           {
       	                tmpEstadosTema += "0,";       	                
       	           }		
       	        }	 
       	        
       	        //Comentar siguientes lineas para Navegacion libre, o descomentar para navegación secueencial     	        
       	        if ( tema == temaActual)
       	        {
       	     	   temaActivo = false;
       	        }
       	        		
             }	
       	     else
       	     {
       	     	 tmpEstadosTema += "0,"        	     	 
       	     }
       	     
       	     /* Mirar los apartados del tema que se estan procesando */
       	     tmpEstadosApartado = "";
       	     apartado = CURSO.apartadoPrimero(tema);
       	     apartadoActivo = true;  
       	     apartadoActual = CURSO.apartadoNoCompletado(tema);   
       	         	          	     
       	     while ( apartado != "")
       	     {
       	        if  (apartadoActivo)
       	        {        	     
       	            estado = CURSO.estado(apartado);
       	            switch(estado)
       	            {
       	                case "F": 
       	                {
       	           	   tmpEstadosApartado += "3,";
       	           	   break;
       	                }       	           
       	                case "P": 
       	                {
       	           	   tmpEstadosApartado += "4,";
       	           	   break;
       	                }       	            
       	                case "C": 
       	                {
       	           	   tmpEstadosApartado += "4,";
       	           	   break;
       	                }
       	                case "I":
       	                {
       	                   tmpEstadosApartado += "2,";	
       	                   break;
       	                }
       	                case "N":
       	                {
       	                   tmpEstadosApartado += "1,";	
       	                   break;
       	                }
       	                default:
       	                {
       	                   tmpEstadosApartado += "0,";	       	                   
       	                }
       	           }       	        	 
       	        
       	           /* Navegacion secuencial o libre */
       	           if ( apartado == apartadoActual)
       	           {
       	               apartadoActivo = false;
       	           }		
               }	
       	       else
       	       {       	     	 
       	     	   tmpEstadosApartado += "0," ;       	     	   
       	       }
       	             	              	            	        	     
       	       apartado = CURSO.apartadoSiguiente(apartado);
       	       		 	
       	     }  
       	     cadEstadosApartados[i] = tmpEstadosApartado.substr(0,tmpEstadosApartado.length-1);        	         	     
       	     tema = CURSO.temaSiguiente(tema);		 	
       	     i++;
       	 }
       	 cadEstadosTemas = tmpEstadosTema.substr(0,tmpEstadosTema.length-1);       	 
    }    
    lstEstadosTemas = cadEstadosTemas;    
}	 

/******************************************************************************/
/* actualizarFlash():carga el flash de la home y actualiza estados del curso  */
/******************************************************************************/
function actualizarFlash()    
{     
  
   var temp = new String("");
   cadenaEstados();
   
   //document.getElementById("homeDiv").innerHTML = "<img src='../img/home.jpg'>";
   
   //alert(lstEstadosTemas);
   
   /************************comentado el 29S**********/
   /**
   document.getElementById('home').SetVariable('xx', '3,3,3,3,3,3,3,3,3,3,3');      
   document.getElementById("home").Rewind();
   document.getElementById("home").Play();   **/     
}


/******************************************************************************/
/* presentacion():carga el flash de intro                                     */
/******************************************************************************/
/**
function presentacion()
{

   var i = 0;	
   var objetoFlash = new String("");
   var frameBloque = 0;
   var temp = new String(""); 
   
   

   document.getElementById("presentacionDiv").innerHTML = prepareFlash ("../img/intro.swf", "presentacion", 792, 512);      
   document.getElementById("presentacionDiv").style.visibility = "visible";    
     
	
   temp =  CURSO.recuperarInfoAdicional();   
   if (temp == "1")
   {    
       document.getElementById("btnCPresentacion").style.visibility = "visible";       
   }  
   else
   {
       //Si es obligatorio ver la intro la primera vez se ha de ocultar botón de cerrar intro
       document.getElementById("btnCPresentacion").style.visibility = "hidden";
       //document.getElementById("btnCPresentacion").style.visibility = "visible";   
       temp = CURSO.guardarInfoAdicional("1");    	 
   }	
	   
   document.getElementById("btnPresentacion").style.visibility="hidden";     
   document.getElementById("iframehome").style.visibility = "hidden";     
   document.getElementById("contenido").style.visibility = "hidden";   
   document.getElementById("homeDiv").style.visibility = "hidden";        
   document.getElementById("presentacionDiv").style.visibility = "visible";
   

   
   }
**/
/******************************************************************************/
/* presentacion():Cierra la intro del curso                                   */
/******************************************************************************/
function cerrarPresentacion()
{
    
   document.getElementById("presentacionDiv").innerHTML ="";      
   document.getElementById("presentacionDiv").style.visibility = "hidden";  
   document.getElementById("btnPresentacion").style.visibility="visible";
   document.getElementById("btnCPresentacion").style.visibility = "hidden"; 
      
   volverHome();    
}

/******************************************************************************/
/* volverHome(): Volver a la home del curso desde el contenido                */
/******************************************************************************/
function volverHome()
{     
   
   parent.sup.paginaActual = "";   
   parent.sup.bloqueActual = "";
   parent.sup.repetirTodas = false;
   parent.sup.repetirIncorrectas = false;
   
   actualizarFlash();
   window.contenido.cont.contenido_inf.location="blank.htm";
   window.contenido.cont.contenido_mig.location="blank.htm";   
   window.contenido2.cont.contenido_inf.location="blank.htm";
   window.contenido2.cont.contenido_mig.location="blank.htm";   
   
   document.getElementById("iframehome").style.visibility="hidden";
   document.getElementById("contenido").style.visibility = "hidden";      
   document.getElementById("iframehome2").style.visibility="hidden";
   document.getElementById("contenido2").style.visibility = "hidden";      
   document.getElementById("btnMenu").style.visibility="hidden";
   
     
   document.getElementById("btnPresentacion").style.visibility="visible";          
   document.getElementById("presentacionDiv").style.visibility = "hidden";   
   document.getElementById("homeDiv").style.visibility = "visible";
   
   
   CURSO.ActualizarDatos(CURSO.temaPuntuacion('10'));     
   //
   CURSO.Commit("");	 
         
}

/******************************************************************************/
/* cargarTema(bloqueActual): cargar el contenido del tema seleccionado        */
/******************************************************************************/
function cargarTema(bloqueActual)
{     
           
   parent.sup.paginaActual = "";   
   parent.sup.bloqueActual = bloqueActual;
   parent.sup.repetirTodas = false;
   parent.sup.repetirIncorrectas = false;
   document.getElementById("btnPresentacion").style.visibility="visible";          
   document.getElementById("presentacionDiv").style.visibility = "hidden";   
   document.getElementById("homeDiv").style.visibility = "visible";
   
   
  
   
   var apartadoActual = new String("");
   apartadoActual = CURSO.apartadoNoCompletado(bloqueActual);
   if (apartadoActual == "")
   {
   	apartadoActual = CURSO.apartadoPrimero(bloqueActual);
   }	  
 
   
     if (bloqueActual != 0) 
	   {     
		  window.contenido2.cont.location  = "contenidoIndice.htm";    
		  document.getElementById("iframehome2").style.visibility="visible";
		  document.getElementById("contenido2").style.visibility = "visible";         
		  document.getElementById("iframehome").style.visibility="hidden";
		  document.getElementById("contenido").style.visibility = "hidden";  
		  window.contenido.cont.contenido_mig.location="blank.htm"; 
		  document.getElementById("btnMenu").style.visibility="visible"; 
		  document.getElementById("btnPresentacion").style.visibility="hidden";
		  
		   
	   	} 
	   	else
	   	{
	   		 cargarApartado(apartadoActual);
	    }		
   
   
	}

/**********************************************************************************/
/* cargarApartado(subBloqueActual): cargar el contenido del apartado seleccionado */
/**********************************************************************************/
function cargarApartado(subBloqueActual)
{     
   parent.sup.paginaActual = "";
   parent.sup.subBloqueActual = subBloqueActual;   
   parent.sup.bloqueActual = (subBloqueActual.split("_"))[0];
   parent.sup.repetirTodas = false;
   parent.sup.repetirIncorrectas =false;   
   
   document.getElementById("iframehome2").style.visibility = "hidden";
   document.getElementById("contenido2").style.visibility = "hidden";         
   document.getElementById("iframehome").style.visibility = "visible";
   document.getElementById("contenido").style.visibility = "visible";         
   
   window.contenido2.cont.contenido_mig.location="blank.htm";
   window.contenido.cont.contenido_mig.location="blank.htm";
   window.contenido.cont.contenido_inf.location="nav_inferior.htm";        
   document.getElementById("btnMenu").style.visibility="visible"; 
   document.getElementById("btnPresentacion").style.visibility="hidden";    
}

/**********************************************************************************/
/* cargarActividades(subBloqueActual): repetir las actividades */
/**********************************************************************************/
function cargarActividades()
{     
   parent.sup.paginaActual = CURSO.paginaPrimera(CURSO.apartadoPrimero(parent.sup.bloqueActual));
   parent.sup.subBloqueActual = CURSO.apartadoPrimero(parent.sup.bloqueActual);
      
   document.getElementById("iframehome2").style.visibility = "hidden";
   document.getElementById("contenido2").style.visibility = "hidden";         
   document.getElementById("iframehome").style.visibility = "visible";
   document.getElementById("contenido").style.visibility = "visible";         
   
   window.contenido.cont.contenido_mig.location="../../../htm/blank.htm";
   window.contenido.cont.contenido_inf.location="../../../htm/nav_inferior.htm";        
   document.getElementById("btnMenu").style.visibility="visible"; 
   document.getElementById("btnPresentacion").style.visibility="hidden";    
   


}

/***********************************************************************/
/******************************************************************************/
/* cargarAyuda(): Llamada a CargarAyuda de cabecera.js                        */
/******************************************************************************/
function cargarAyuda()
{
   parent.sup.cargarAyuda();	
}

/******************************************************************************/
/* cerrar(): Llamada a cerrar de cabecera.js                                  */
/******************************************************************************/
function cerrar()
{
   parent.sup.cerrar();	
}


/******************************************************************************/
/* whenOnLoad(): Función que se ejecutará al lanzar el curso                  */
/******************************************************************************/
function whenOnLoad()
{  
 // window.contenido.cont.contenido_mig.location="blank.htm";
//  window.contenido.cont.contenido_inf.location="blank.htm";
   var temp = new String("");   
   temp =  CURSO.recuperarInfoAdicional();      
   if (temp != "1")
   {      
     // presentacion(); 
	  //Descomentar en el caso de no necesitar presentaci?n.                
      //cerrarPresentacion();
   }
   actualizarFlash();     
}



/******************************************************************************/
/* cargarDocumento(): cargar el documento del curso                                */
/******************************************************************************/
function cargarDocumento(nombre)
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
   
   if (ventanaDoc != null) 
    {
	ventanaDoc.close();
    }   
   ventanaDoc = window.open('../doc/' + nombre ,'flotAyuda','toolbar=1,menubar=1,menubar=1,resizable=1,left='+posX+',top='+posY+',width=800,height=400');	 
	 
}


/******************************************************************************/
/* cargarDocumento2(): cargar el documento del curso                                */
/******************************************************************************/
function cargarDocumento2(nombre)
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
   
   if (ventanaDoc != null) 
    {
	ventanaDoc.close();
    }   
   ventanaDoc = window.open('../../../doc/' + nombre ,'flotAyuda','toolbar=1,menubar=1,menubar=1,resizable=1,left='+posX+',top='+posY+',width=800,height=400');	 
	 
}



function calcularPaginasApartadosAnteriores(apartado)
{
    var numPaginas = 0;    
    var apartadoActual = new String("");
    
    apartadoActual = CURSO.apartadoPrimero(parent.parent.fcent.sup.bloqueActual);     
    while ((apartadoActual != "" )&&(apartadoActual != apartado))   	
    {
        numPaginas += CURSO.paginaTotales(apartadoActual);
        apartadoActual = CURSO.apartadoSiguiente(apartadoActual);        
    }	
   // alert(numPaginas);
    return numPaginas;
    
}

function calcularPaginas(bloqueActual)
{
    var numPaginas = 0;
    var apartadoPractico = false;
    var apartadoActual = new String("");
    
    apartadoActual = CURSO.apartadoPrimero(bloqueActual);    
    
    while (apartadoActual != "" )   	
    {
        numPaginas += CURSO.paginaTotales(apartadoActual);
        apartadoActual = CURSO.apartadoSiguiente(apartadoActual);        
    }	
    return numPaginas;
}