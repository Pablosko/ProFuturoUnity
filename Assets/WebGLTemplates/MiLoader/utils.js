/******************************************************************************/
/* retorna_opcio(opcions,num): Recupera texto entre los <número> y </número>  */
/******************************************************************************/
function retorna_opcio(opcions,num) 
{
	var aux="<"+num+">";
	var aux2="</"+num+">";
	var pos1=opcions.indexOf(aux);
	var pos2=opcions.indexOf(aux2);
	if ((pos1==-1)||(pos2==-1))
	{ 
	    return "";
	}	
	else 
	{	
	    return opcions.substring((pos1+aux.length),pos2); 
	}    
}
/********************************************************************************/
/* parsejar(opcions): Recupera todos los textos entre los <número> y </número>  */
/********************************************************************************/
function parsejar(opcions) 
{
	
	var ops=new Array(),aux="";
	var i=1;
	var fin=false;
	while (!fin) 
	{
	    aux=retorna_opcio(opcions,i);
	    if (aux!="") 
	    {
	        ops[i-1]=aux;
	    }
	    else
	    {	 
	    	fin=true; 
	    }	
	    i++; 
	}
	return ops; 
}

/********************************************************************************/
/* canvia: Llama a la función canvia3                                           */
/********************************************************************************/
function canvia(id_img,nom_img) {
	setTimeout('canvia3("'+id_img+'","'+nom_img+'")',100);
}

/********************************************************************************/
/* canvia3: Cambia las imagenes de ok y ko según el resultado de la actividad   */
/********************************************************************************/
function canvia3(id_img,nom_img) {
	var aux=eval('document.'+id_img);
	aux.src="";
	aux.src=nom_img;
}

/****************************************************************************************/
/* makeFlash ( fichero, nombre, ancho, alto ): Escribe en el documento HTML el código  */
/* necesario para incluir un flash                                                      */
/****************************************************************************************/	
function makeFlash ( fichero, nombre, ancho, alto ) 
{
	
	document.write(prepareFlash ( fichero, nombre, ancho, alto ));
}

/******************************************************************************************/
/* prepareFlash ( fitchero, nombre, ancho, alto ): Creao el código necesario para incluir */ 
/* un flash                                                                               */
/******************************************************************************************/
function prepareFlash ( fichero, nombre, ancho, alto ) 
{
	
      if ((window.ActiveXObject) && 
            (navigator.userAgent.indexOf("MSIE")!= -1) && (navigator.userAgent.indexOf("Windows") != -1))
      {
            d = '<OBJECT id="'+nombre+'" name="'+nombre+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0"';
            d += ' WIDTH="100%" HEIGHT="100%">';
            d += '<PARAM NAME=movie VALUE="'+fichero+'">';
            d += '<param name="allowScriptAccess" value="always">';
            d += '<PARAM NAME=quality VALUE=best>';
            d += '<param name=menu value=false>';
            d += '<PARAM NAME=wmode VALUE=transparent>';
            d += '</OBJECT>';
      }
      else
      {
            d = '<OBJECT id="'+nombre+'"  data="'+fichero+'" type="application/x-shockwave-flash"';
            d += ' WIDTH="100%" HEIGHT="100%">';
            d += '<PARAM NAME=movie VALUE="'+fichero+'">';
            d += '<PARAM name="allowScriptAccess" value="always"/>';
            d += '<PARAM NAME=quality VALUE=best>';
            d += '<param name=menu value=false>';
            d += '<PARAM NAME=wmode VALUE="transparent">';
            d += '</OBJECT>';
      
      }
      return d;
}

/******************************************************************************************/
/* finalizarEjercicio(respuesta,tipo,resultado,correcta,score): Guarda el seguimiento de  */ 
/* cada actividad del curso.                                                              */
/* respuesta: respuesta del alumno                                                        */
/* tipo: tipo de actividad SCORM                                                          */
/* resultado: c correcta - w incorrecta                                                   */
/* score: puntacion de la actividad (0 - incorrecta 100 - correcta)                       */
/******************************************************************************************/
function finalizarEjercicio(respuesta,tipo,resultado,correcta,score,pagina) 
{		
	
    var temp = "";	
    respuesta=respuesta.replace(/,\s*$/, "");
    temp = temp + API.LMSGetValue("cmi.interactions._count");
    API.LMSSetValue("cmi.interactions." + temp + ".id",pagina);
    API.LMSSetValue("cmi.interactions." + temp + ".type",tipo);
    API.LMSSetValue("cmi.interactions." + temp + ".student_response",respuesta);
    API.LMSSetValue("cmi.interactions." + temp + ".correct_responses." + 0 + ".pattern" ,correcta);
    if (resultado == "c") resultado = "correct";
    if (resultado == "w") resultado = "wrong";
    API.LMSSetValue("cmi.interactions." + temp + ".result",resultado);

    //CURSO.finalizarPagina(pagina,score);	        
}	

