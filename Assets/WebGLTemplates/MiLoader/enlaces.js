/********************************************************************************/
/* cargarIframe(capa,pag): Cargar ventana flotante                              */
/********************************************************************************/
function cargarIframe(capa,pag)
{   
  var e1 = eval("window." + capa + ".cont");  
  e1.location = pag + ".htm";  
  
  document.getElementById(capa).style.visibility = "visible";  
}

/********************************************************************************/
/* cerrarIFrame(capa): Cerrar ventana flotante                                  */
/********************************************************************************/
function cerrarIFrame(capa)
{   
   window.parent.parent.parent.parent.parent.parent.parent.fcent.inf.window.contenido.cont.contenido_mig.document.getElementById(capa).style.visibility = "hidden";	   
  
}	

/********************************************************************************/
/* abrirVentana(url): Abrir ventana flotante externa                            */
/********************************************************************************/
function abrirVentana(url)
{
  var F1=null;
  F1 = window.open( url,'','width=750,height=500,left=0,top=0,scrollbars=auto,toolbar=1,menubar=1,screenX=0,screenY=0,status=yes,resizable=yes');		
  
}