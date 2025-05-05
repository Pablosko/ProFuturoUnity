var AICC_PROTOCOL = "cmi.suspend_data";      //ADL SCORM MOODLE
var launch_data = new String("");            // Estructura del Curso
var cookie_api = null;   // Api local que contiene de forma temporal los datos de seguimiento del alumno
var external_api = null; // Api correspondiente a la plataforma de e-learning instalada.
var arrayCurso = null;   // Array que contendra toda la estructura del Curso.

/*************************************************************************************/
/* Clase CURSO_API: contiene funciones y utilidades para desarrollar Cursos              */
/*************************************************************************************/
 
// Función encargada de guardar la estructura del Curso en un array 
function iniciarEstructuraCurso(launchData)
{ 
    arrayCurso = launchData.split("$");   
}

function _cerrar()
{
    if (CURSO != null)
           {
             _calcularPaginasTotales();            
             _ActualizarDatos(((paginasVisitadas/paginasTotales)*100), paginasVisitadas, paginasTotales);     
             _Commit("");     
             window.close(); 
           } 
           

}

//Función generar cadena de preguntas aleatorias para el test
function obtenerEvaluacion(bancoPreguntas, numPreguntas) 
{
      var numbers = [];
      for (var i = bancoPreguntas; i > 0; i--)
      {
                numbers.push(i);
      }
      numbers.sort(
         function(){
            return (Math.round(Math.random())-0.5);
         }
      );
      return numbers.slice(0,numPreguntas);
}



// Constructor de la clase CURSO_API 
function CURSO_API(cookieApi, externalApi, launchData)
{   
    cookie_api = cookieApi;
    external_api = externalApi;
    launch_data = launchData;    
}

// función encargada de inicializar la clase CURSO.
function _init()
{    
    iniciarEstructuraCurso(launch_data);
    _iniciarCadenaDeNavegacion();
        
}

// función encargada de generar la cadena de navegación para cada usuario.
function _crearCadenaDeNavegacion()
{
   var i = 0;
   var j = 0;
   var k = 0;
   var temp = new String("");
   var aux = new String("");
   var tempEval = new String("");
   
   var profundidadCurso = 0;
   var nodos = 0;
   var numeroCapitulos = 0;
   var numeroTemas = 0;
   var numeroPaginas = 0;
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   
   temp = "n$";
   
   if (profundidadCurso == "3")
   {
      numeroTemas = arrayCurso[1].split(",")   
      for ( i = 0; i < numeroTemas.length;i++)
      {
           temp += "n,";
      }
      temp = temp.substr(0,temp.length-1) + "$";
   }
   
   if (profundidadCurso == "4")
   {
      numeroCapitulos = arrayCurso[1].split(",")   
      for ( i = 0; i < numeroCapitulos.length;i++)
      {
           temp += "n,";
      }
      temp = temp.substr(0,temp.length-1) + "$";
      
      
      numeroTemas = arrayCurso[2].split(",")   
      for ( i = 0; i < numeroTemas.length;i++)
      {
           temp += "n,";
      }
      temp = temp.substr(0,temp.length-1) + "$";
   }
   
   for ( i = profundidadCurso-1; i < arrayCurso.length; i++)
   {
       /* Apartados*/
       nodos = arrayCurso[i].split("|");       
       temp += "n|";       
       
       /* paginas */ 
       numeroPaginas = nodos[1].split(",");       
       for ( j = 0; j < numeroPaginas.length;j++)
       {
           temp += "n,";
       }
       temp = temp.substr(0,temp.length-1) + "$";         
   } 
   temp = temp.substr(0,temp.length-1) + "#";            
   cookie_api.LMSSetValue(AICC_PROTOCOL,temp);
               
      

}

// función encargada de generar la cadena de navegación para cada usuario.
function _crearCadenaEvaluacion()
{
  var i,j = 0;
  var listaPreguntas = "";
  var temp = "";
  for (i=0; i < evaluacion.length; i++)
  {
     temp = temp + evaluacion[i][2] + "|0;";
     listaPreguntas = obtenerEvaluacion(evaluacion[i][0], evaluacion[i][1]);
     for (j=0; j < listaPreguntas.length; j++)
     {
         temp = temp + listaPreguntas[j] + "|0,"  
     }
     temp = temp.substr(0,temp.length-1) + "$";
  }  
  temp = temp.substr(0,temp.length-1);
  return temp;  
}


//función encargada de generar o recuperar la cadena de navegación para cada usuario. 
function _iniciarCadenaDeNavegacion()
{
     var temp = new String("");
     temp = cookie_api.LMSGetValue(AICC_PROTOCOL);   
     //alert(temp); 
     if (temp == "")
     { 
         cookie_api.LMSSetValue("cmi.core.lesson_status","incomplete");   
       _crearCadenaDeNavegacion();
     }   
}

//Funcion encargada de inicializar página, apartado,tema,capitulo...
function _iniciarPagina(idPagina)
{
  //alert("iniciar " + idPagina); 
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   var paginaBuscada = new String(""); // Pagina que se esta buscando
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasCadena = null;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitPagina = idPagina.split("_");
   paginaBuscada = splitPagina[splitPagina.length-1];
   
   for (i = 0 ; i < splitPagina.length - 1; i++ )
   {
        patron += splitPagina[i] + "_"; 
   }  
   patron = "a" +  patron.substr(0,patron.length-1) + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   j = 0;
   encontrado = false;
   while (( j < numeroPaginas.length)&&(!encontrado))
   {
          if (numeroPaginas[j] == paginaBuscada) encontrado = true
          else j++; 
   }    
      
   if (encontrado)
   {  
          paginaActual = j;
          tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
          infoAdicional =(tempCadena.split("#"))[1];
    splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
      paginasCadena = (nodoCadena[1]).split(",");
      if (paginasCadena[paginaActual]== "n") 
      {
         tempCadena = "";    // generar la cadena de navegación
         for ( i = 0 ; i < splitCadena.length; i++)
         {
            if ( nodoActual == i )
            {
               tempCadena += nodoCadena[0] + "|";            
               for (j = 0; j < paginasCadena.length;j++)
               {
                   if ( paginaActual == j )
                   {
                      tempCadena += "i,";   
                   }  
                   else
                   {  
                      tempCadena += paginasCadena[j] + ",";
                   }    
               }               
               tempCadena = tempCadena.substr(0,tempCadena.length-1) + "$";
            }
            else
            {
               tempCadena += splitCadena[i] + "$"; 
            }     
         } 
         tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
         cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);  
         if (profundidadCurso == 3)
         {
              _iniciarApartado(splitPagina[0] + "_" + splitPagina[1]);
              _iniciarTema(splitPagina[0]);
              _iniciarCurso();  
         }
         if (profundidadCurso == 4)
         {
              _iniciarApartado(splitPagina[0] + "_" + splitPagina[1] + "_" + splitPagina[2]);
              _iniciarTema(splitPagina[0] + "_" + splitPagina[1]);                
              _iniciarCapitulo(splitPagina[0]);
              _iniciarCurso();
         }
        
      }     
     }
     else
     {
       return false;
     }
   }
   else
   {
    return false;
   }    
}

//Funcion encargada de inicializar Apartados.
function _iniciarApartado(idApartado)
{   
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {
    nodoActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  infoAdicional =(tempCadena.split("#"))[1] + "#" + (tempCadena.split("#"))[2];
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
  if ( nodoCadena[0] == "n")   // Iniciar apartado
  {
       tempCadena = "";    // generar la cadena de navegación
       for ( i = 0 ; i < splitCadena.length; i++)
       {
          if ( nodoActual == i )
          {
             tempCadena += "i" + "|" + nodoCadena[1] + "$";        
      }
      else
      {
          tempCadena += splitCadena[i] + "$"; 
      }     
       } 
       tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
       cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);    
        } 
   }
   else
   {
    return false;
   }
    
}

//Funcion encargada de inicializar Temas.
function _iniciarTema(idTema)
{ 
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idTema + "-";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }    
   if (encontrado)
   {
    temaActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  infoAdicional =(tempCadena.split("#"))[1];
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de temas.
  if ( nodoCadena[temaActual] == "n")   // Iniciar temas
  {
       tempCadena = "";    // generar la cadena de navegación
       for ( i = 0 ; i < splitCadena.length; i++)
       {
          if ( nodoActual == i )
          {
             for ( j = 0; j < nodoCadena.length;j++)
             {
                 if ( temaActual == j )
                 {
                     tempCadena += "i,";
                 }
                 else
                 {
                     tempCadena += nodoCadena[j] + ",";                      
                 }      
             }  
             tempCadena = tempCadena.substr(0,tempCadena.length-1) + "$";        
      }
      else
      {
          tempCadena += splitCadena[i] + "$"; 
      }     
       } 
       tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
       cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);    
        } 
   }
   else
   {
    return false;
   }        
}

//Funcion encargada de inicializar Capitulo.
function _iniciarCapitulo(idCapitulo)
{     
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
   patron = "c" +  idCapitulo + "-";          // se busca cadena ej: 0- 0_1-   
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   while ((i < nodo.length)&&(!encontrado))
   {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
   }      
   if (encontrado)
   {
    capituloActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  infoAdicional =(tempCadena.split("#"))[1];
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de capitulos.
  if ( nodoCadena[capituloActual] == "n")   // Iniciar Capitulo
  {
       tempCadena = "";    // generar la cadena de navegación
       for ( i = 0 ; i < splitCadena.length; i++)
       {
          if ( nodoActual == i )
          {
             for ( j = 0; j < nodoCadena.length;j++)
             {
                 if ( capituloActual == j )
                 {
                     tempCadena += "i,";
                 }
                 else
                 {
                     tempCadena += nodoCadena[j] + ",";                      
                 }      
             }  
             tempCadena = tempCadena.substr(0,tempCadena.length-1) + "$";        
      }
      else
      {
          tempCadena += splitCadena[i] + "$"; 
      }     
       } 
       tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
       cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);    
        } 
   }
   else
   {
    return false;
   }    
}
  
//Funcion encargada de inicializar Capitulo.
function _iniciarCurso ()
{     
   var i = 0 ;
   var j = 0 ;    
      
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var nodo = null;
     
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
   infoAdicional =(tempCadena.split("#"))[1];
   splitCadena = (tempCadena.split("#"))[0].split("$");   
   if ( splitCadena[0] == "n")   // Iniciar Curso
   {
      tempCadena = "";    // generar la cadena de navegación
      for ( i = 0 ; i < splitCadena.length; i++)
      {
     if (i == 0)
     {              
        tempCadena += "i$";        
     }
     else
     {
        tempCadena += splitCadena[i] + "$"; 
           }      
      } 
      tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
      cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);     
          
   }
   else
   {
    return false;
   }    
}

// Función que finaliza una página, (completed,passed y failed segun si nota es un string vacio o no,
// el parametro recalcular si desea volver a calcular el apartado, tema, curso.
function _finalizarPagina(idPagina, nota, recalcular, mastery_score)
{
  // alert("finalizar " + idPagina );
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   var paginaBuscada = new String(""); // Pagina que se esta buscando
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasCadena = null;
   var numeroPaginas =  null;   
   
     
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitPagina = idPagina.split("_");
   paginaBuscada = splitPagina[splitPagina.length-1];
   
   for (i = 0 ; i < splitPagina.length - 1; i++ )
   {
        patron += splitPagina[i] + "_"; 
   }  
   patron = "a" +  patron.substr(0,patron.length-1) + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   j = 0;
   encontrado = false;
   while (( j < numeroPaginas.length)&&(!encontrado))
   {
          if (numeroPaginas[j] == paginaBuscada) encontrado = true
          else j++; 
   }    
   
   
   if (encontrado)
   {  
          paginaActual = j;
          tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
          infoAdicional =(tempCadena.split("#"))[1];
    splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
      paginasCadena = (nodoCadena[1]).split(",");
      if ( "" + nota == "")    //Páginas teoricas
      {
        
        if (paginasCadena[paginaActual]== "i") 
        {
           tempCadena = "";    // generar la cadena de navegación
           for ( i = 0 ; i < splitCadena.length; i++)
           {
              if ( nodoActual == i )
              {
                 tempCadena += nodoCadena[0] + "|";            
                 for (j = 0; j < paginasCadena.length;j++)
                 {
                     if ( paginaActual == j )
                     {
                        tempCadena += "c,";   
                     }  
                     else
                     {  
                        tempCadena += paginasCadena[j] + ",";
                     }    
                 }               
                 tempCadena = tempCadena.substr(0,tempCadena.length-1) + "$";
              }
              else
              {
                 tempCadena += splitCadena[i] + "$"; 
              }     
           } 
           tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
           cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);
        }            
        if (recalcular != false) // Actualiza apartados,temas y capitulos
        {
               
              if (profundidadCurso == 3)
            {
             _finalizarApartado(splitPagina[0] + "_" + splitPagina[1]);
             _finalizarTema(splitPagina[0]);
             _finalizarCurso(); 
            }
            if (profundidadCurso == 4)
            {
                 _finalizarApartado(splitPagina[0] + "_" + splitPagina[1] + "_" + splitPagina[2]);
                 _finalizarTema(splitPagina[0] + "_" + splitPagina[1]);               
                 _finalizarCapitulo(splitPagina[0]);
                 _finalizarCurso();
            }               
         }         
          }
          else    //Páginas Prácticas
      {       
         if ((mastery_score == null) || (mastery_score =="")) mastery_score = 50;
         
         tempCadena = "";    // generar la cadena de navegación
         for ( i = 0 ; i < splitCadena.length; i++)
         {
             if ( nodoActual == i )
         {
             tempCadena += nodoCadena[0] + "|";            
             for (j = 0; j < paginasCadena.length;j++)
             {
                 if ( paginaActual == j )
                 {
                        if ( parseInt(nota) >= parseInt(mastery_score))
                        {
                             tempCadena += "p" + nota + ",";
                        }
                        else
                        {
                             tempCadena += "f" + nota + ",";  
                        }           
                 }  
                 else
                 {  
                        tempCadena += paginasCadena[j] + ",";
                 }    
             }               
             tempCadena = tempCadena.substr(0,tempCadena.length-1) + "$";
         }
         else
         {
             tempCadena += splitCadena[i] + "$"; 
             }      
         } 
         tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
         cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);
           
         if (recalcular != false) // Actualiza apartados,temas y capitulos
         {
             if (profundidadCurso == 3)
           {
                _finalizarApartado(splitPagina[0] + "_" + splitPagina[1]);
                _finalizarTema(splitPagina[0]);
                _finalizarCurso();  
           }
           if (profundidadCurso == 4)
           {
                _finalizarApartado(splitPagina[0] + "_" + splitPagina[1] + "_" + splitPagina[2]);
                _finalizarTema(splitPagina[0] + "_" + splitPagina[1]);                
                _finalizarCapitulo(splitPagina[0]);
                _finalizarCurso();
           }                
         }             
          }               
     }
     else
     {
       return false;
     }
   }
   else
   {
    return false;
   }  
  
}

// Función que finaliza una página, (completed,passed y failed segun si nota es un string vacio o no,
// el parametro recalcular si desea volver a calcular el apartado, tema, curso.
function _finalizarApartado(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var temp = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var numActividades = 0;
   var puntuacion = 0 ;
   var mastery_score = 0;
   var encontrado = false;
   var nocompletado = false;
   var actualizarApartado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasApartado = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {
    nodoActual = i ;
    mastery_score = (((arrayCurso[nodoActual]).split("|"))[0].split("-"))[1];
    if ((mastery_score==null)||(mastery_score=="")) mastery_score = "50"; 
    
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  infoAdicional =(tempCadena.split("#"))[1];
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
  paginasApartado = nodoCadena[1].split(",");
  
  j = 0;
  numActividades = 0;
  puntuacion = 0;
  while (( j < paginasApartado.length )&&(nocompletado == false))
  {
      if (( paginasApartado[j]== "n")||( paginasApartado[j]== "i"))
      {
         nocompletado = true;
      }  
      else
      {
         if (( paginasApartado[j].substr(0,1) == "p")|| ( paginasApartado[j].substr(0,1) == "f"))
         {
             numActividades++;
             puntuacion += parseInt( paginasApartado[j].substr(1)); 
         }      
      }
      j++;        
        }             
        
  if (!nocompletado) // Apartado Completado
  {
       puntuacion = Math.floor(puntuacion/numActividades);
       
       if ( nodoCadena[0] == "i")   // Iniciar apartado
       {
             actualizarApartado = true;
             if (numActividades == 0)
             {
                  temp = "c";   
             }  
             else
             {
                  if ( puntuacion >= parseInt(mastery_score))
                  {
                     temp = "p" + puntuacion; 
                  }
                  else
                  {
                 temp = "f" + puntuacion;
                  }
             }        
       }  
        
       if ((nodoCadena[0].substr(0,1) == "p")||(nodoCadena[0].substr(0,1) == "f"))
       {
           if ( puntuacion > parseInt(nodoCadena[0].substr(1)))
           {
               actualizarApartado = true;
               if ( puntuacion >= parseInt(mastery_score))
               {
                    temp = "p" + puntuacion;  
               }
               else
               {
                temp = "f" + puntuacion;
               }              
           }      
       }  
       
       if (actualizarApartado) 
       {
            tempCadena = "";    // generar la cadena de navegación
            for ( i = 0 ; i < splitCadena.length; i++)
            {
                if ( nodoActual == i )
                {
                     tempCadena += temp + "|" + nodoCadena[1] + "$";       
            }
            else
            {
                 tempCadena += splitCadena[i] + "$"; 
            }     
            } 
            tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
            cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);     
             }
        } 
   }
   else
   {
    return false;
   }
    
  
}

// Función que finaliza una página, (completed,passed y failed segun si nota es un string vacio o no,
// el parametro recalcular si desea volver a calcular el apartado, tema, curso.
function _finalizarTema(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var temp = new String("");
   var patron = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual = 0 ;
   var numApartados = 0
   var puntuacion = 0;
   var encontrado = false;
   var nocompletado = false;   
   var actualizarTema = false;
   var nodo = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idTema + "-";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }    
   if (encontrado)
   {
    temaActual = i ;
    mastery_score = arrayCurso[nodoActual].split("-")[1];
    if ((mastery_score==null)||(mastery_score=="")) mastery_score = "50";     
    
    
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  infoAdicional =(tempCadena.split("#"))[1];
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de temas.
  
  j = nodoActual + 1;
  numApartados = 0;
  puntuacion = 0;
  patron = "a" + idTema + "_";
  while ((j < arrayCurso.length)&&(nocompletado == false))
  {
      if (arrayCurso[j].split("|")[0].search(patron) != -1 )
      {
           temp = splitCadena[j].split("|")[0];
           
           if ((temp == "i")||(temp == "n"))
           {
              nocompletado = true;                  
           }
           else
           {
               if (( temp.substr(0,1) == "p")||( temp.substr(0,1) == "f"))
               {
                 numApartados++;
                 puntuacion += parseInt(temp.substr(1));
               }      
           }        
      }
      j++;      
  } 
  
  if (!nocompletado)
  { 
       puntuacion = Math.floor(puntuacion/numApartados);
       
       if (nodoCadena[temaActual] == "i")
       {
           actualizarTema = true;
           if (numApartados == 0)
           {
              temp = "c";   
           }  
           else
           {  
              
              if (puntuacion >= parseInt(mastery_score))
              {
                 temp = "p" + puntuacion; 
              }
              else
              {
                 temp = "f" + puntuacion; 
              }
           }                  
       }  
       else
       {  
          if ((nodoCadena[temaActual].substr(0,1) == "p")||(nodoCadena[temaActual].substr(0,1) == "f"))
          {
              if (puntuacion > parseInt(nodoCadena[temaActual].substr(1)))
              {
                actualizarTema = true;
                  if (puntuacion >= parseInt(mastery_score))
                  {
                      temp = "p" + puntuacion;  
                  }
                  else
                  {
                      temp = "f" + puntuacion;  
                  }               
              }           
          }   
       }   
       
       if ( actualizarTema)
       {            
         tempCadena = "";    // generar la cadena de navegación
           for ( i = 0 ; i < splitCadena.length; i++)
           {
               if ( nodoActual == i )
               {
                   for ( j = 0; j < nodoCadena.length;j++)
                   {
                       if ( temaActual == j )
                       {
                            tempCadena += temp + ",";
                       }
                       else
                       {
                            tempCadena += nodoCadena[j] + ",";                     
                       }      
                   }  
                   tempCadena = tempCadena.substr(0,tempCadena.length-1) + "$";        
           }
           else
           {
               tempCadena += splitCadena[i] + "$"; 
           }      
           } 
           tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
           cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);
       }    
        
        } 
   }
   else
   {
    return false;
   }  
}

// Función que finaliza una página, (completed,passed y failed segun si nota es un string vacio o no,
// el parametro recalcular si desea volver a calcular el apartado, tema, curso.
function _finalizarCapitulo(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var puntuacion = 0;
   var numTemas = 0;
   var encontrado = false;
   var nocompletado = false;
   var actualizarCapitulo = false;
   var nodo = null;
   var nodoCadena = null;
   var nodoTema = null;
   var nodoEstadosTemas = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
   patron = "c" +  idCapitulo + "-";          // se busca cadena ej: 0- 0_1-   
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   while ((i < nodo.length)&&(!encontrado))
   {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
   }      
   if (encontrado)
   {
    capituloActual = i ;
    
    mastery_score = arrayCurso[nodoActual].split("-")[1];
    if ((mastery_score==null)||(mastery_score=="")) mastery_score = "50";
    
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  infoAdicional =(tempCadena.split("#"))[1];
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de capitulos.
  nodoTema = arrayCurso[2].split(",");
  nodoEstadosTemas = (splitCadena[2]).split(","); //Nodo de Titulos.
  
  j = 0;
  numTemas = 0;
  puntuacion = 0;
  patron = "t" + idCapitulo + "_";
  while ((j < nodoTema.length)&&(nocompletado == false))
  {
      if (nodoTema[j].search(patron) != -1 )
      {
           temp = nodoEstadosTemas[j];
           
           if ((temp == "i")||(temp == "n"))
           {
              nocompletado = true;                  
           }
           else
           {
               if (( temp.substr(0,1) == "p")||( temp.substr(0,1) == "f"))
               {
                 numTemas++;
                 puntuacion += parseInt(temp.substr(1));
               }      
           }        
      }
      j++;      
  } 
  
  if (!nocompletado)
  { 
       puntuacion = Math.floor(puntuacion/numTemas);
       
       if (nodoCadena[capituloActual] == "i")
       {
           actualizarCapitulo = true;
           if (numTemas == 0)
           {
              temp = "c";   
           }  
           else
           {  
              
              if (puntuacion >= parseInt(mastery_score))
              {
                 temp = "p" + puntuacion; 
              }
              else
              {
                 temp = "f" + puntuacion; 
              }
           }                  
       }  
       else
       {  
          if ((nodoCadena[capituloActual].substr(0,1) == "p")||(nodoCadena[capituloActual].substr(0,1) == "f"))
          {
              if (puntuacion > parseInt(nodoCadena[capituloActual].substr(1)))
              {
                actualizarCapitulo = true;
                  if (puntuacion >= parseInt(mastery_score))
                  {
                      temp = "p" + puntuacion;  
                  }
                  else
                  {
                      temp = "f" + puntuacion;  
                  }               
              }           
          }   
       }   
       
       if ( actualizarCapitulo)
       {  
            tempCadena = "";    // generar la cadena de navegación
            for ( i = 0 ; i < splitCadena.length; i++)
            {
                if ( nodoActual == i )
                {
                   for ( j = 0; j < nodoCadena.length;j++)
                   {
                       if ( capituloActual == j )
                       {
                           tempCadena += temp + ",";
                       }
                       else
                       {
                           tempCadena += nodoCadena[j] + ",";                      
                       }      
                   }  
                   tempCadena = tempCadena.substr(0,tempCadena.length-1) + "$";        
            }
            else
            {
               tempCadena += splitCadena[i] + "$"; 
            }     
            } 
            tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
            cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);     
             }
       }  
   }
   else
   {
    return false;
   }  
  
}

// Función que finaliza una página, (completed,passed y failed segun si nota es un string vacio o no,
// el parametro recalcular si desea volver a calcular el apartado, tema, curso.
function _finalizarCurso()
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
      
   var puntuacion = 0;
   var numElementos = 0;   
   var nocompletado = false;
   var actualizarCurso = false;
   var nodo = null;
   var nodoCadena = null;
   var nodoSiguiente = null;   // Temas o capitulos segun profundidad
   var nodoEstadosSiguiente = null;   
   
   mastery_score = arrayCurso[0].split("-")[1];
   if ((mastery_score==null)||(mastery_score=="")) mastery_score = "50";
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
   infoAdicional =(tempCadena.split("#"))[1];
   splitCadena = (tempCadena.split("#"))[0].split("$");      
   nodoEstadosSiguientes = (splitCadena[1]).split(","); //Nodo de temas o capitulos.
  
   j = 0;
   numElementos = 0;
   puntuacion = 0;
   
   while ((j < nodoEstadosSiguientes.length)&&(nocompletado == false))
   {
  temp = nodoEstadosSiguientes[j];
  if ((temp == "i")||(temp == "n"))
  {
      nocompletado = true;                  
  }
  else
  {
      if (( temp.substr(0,1) == "p")||( temp.substr(0,1) == "f"))
      {
         numElementos++;
           puntuacion += parseInt(temp.substr(1));
      }     
  }       
  j++;      
   }  
   if (!nocompletado)
   { 
       puntuacion = Math.floor(puntuacion/numElementos);
       
       if (splitCadena[0] == "i")
       {
           actualizarCurso = true;
           if (numElementos == 0)
           {
              temp = "c";   
           }  
           else
           {  
              
              if (puntuacion >= parseInt(mastery_score))
              {
                 temp = "p" + puntuacion; 
              }
              else
              {
                 temp = "f" + puntuacion; 
              }
           }                  
       }  
       else
       {  
          if ((splitCadena[0].substr(0,1) == "p")||(splitCadena[0].substr(0,1) == "f"))
          {
              if (puntuacion > parseInt(splitCadena[0].substr(1)))
              {
                actualizarCurso = true;
                  if (puntuacion >= parseInt(mastery_score))
                  {
                      temp = "p" + puntuacion;  
                  }
                  else
                  {
                      temp = "f" + puntuacion;  
                  }               
              }           
          }   
       }   
       
       if ( actualizarCurso)
       {  
            tempCadena = "";    // generar la cadena de navegación
            for ( i = 0 ; i < splitCadena.length; i++)
            {
                if ( i == 0 )
                {                   
                   tempCadena = temp + "$";        
            }
            else
            {
               tempCadena += splitCadena[i] + "$"; 
            }     
            } 
            tempCadena = tempCadena.substr(0,tempCadena.length-1) + "#" + infoAdicional;
            cookie_api.LMSSetValue(AICC_PROTOCOL,tempCadena);     
             }
   }      
}

// Función que devuelve la primera página de una apartado.
function _paginaPrimera(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var paginaActual = 0;
   var encontrado = false;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];   
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   return idApartado + "_" + numeroPaginas[0];
   }
   else
   {
    return "";
   }  
} 

//Función que devuelve el primer apartado de un tema
function _apartadoPrimero(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];    
    
   patron = "a" +  idTema + "_";          // se busca cadena ej: a0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {     
    nodoActual = i;
    return ((arrayCurso[nodoActual].split("|"))[0]).split("-")[0].substr(1);  
      
   }
   else
   {
    return "";
   }    
}

//Función que devuelve el primer tema
function _temaPrimero(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idCapitulo + "_";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      return (nodo[0].split("-"))[0].substr(1);
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
      if (encontrado)
      {
         return (nodo[0].split("-"))[0].substr(1); 
      }
      else
      {
         return "";
      }   
          
   } 
    
}

//Función que devuelve el primer capitulo
function _capituloPrimero(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
      
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
       
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   return (nodo[0].split("-"))[0].substr(1);      
}

//Función que devuelve la ultima pagina de un apartado.
function _paginaUltima(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var paginaActual = 0;
   var encontrado = false;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];   
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   return idApartado + "_" + numeroPaginas[numeroPaginas.length-1];
   }
   else
   {
    return "";
   }  
} 

//Funcion que devuelve el ultimo apartado de un tema.
function _apartadoUltimo(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];    
    
   patron = "a" +  idTema + "_";          // se busca cadena ej: a0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)
        {             
            if (( i == arrayCurso.length -1 )||(arrayCurso[i+1].search(patron) == -1))
            { 
                 encontrado = true
            }
            else
            {
              i++;
            }        
        }  
        else
        { 
           i++;
        }     
   }  
   if (encontrado)
   {     
    nodoActual = i;
    return ((arrayCurso[nodoActual].split("|"))[0]).split("-")[0].substr(1);  
      
   }
   else
   {
    return "";
   }    
}

//Funcion que devuelve el ultimo tema
function _temaUltimo(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idCapitulo + "_";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      return (nodo[nodo.length -1].split("-"))[0].substr(1);
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
      if (encontrado)
      {
         return (nodo[nodo.length -1].split("-"))[0].substr(1); 
      }
      else
      {
         return "";
      }   
          
   } 
    
}

//Funcion que devuelve el ultimo capitulo
function _capituloUltimo(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
      
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
       
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   return (nodo[nodo.length -1].split("-"))[0].substr(1);     
}

// Funcion que devuelve la pagina siguiente
function _paginaSiguiente(idPagina)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   var paginaBuscada = new String(""); // Pagina que se esta buscando
   var paginaSiguiente = new String(""); // Pagina que se esta buscando
   var profundidadCurso = 0;
   var nodoActual = 0;
   var paginaActual = 0;
   var encontrado = false;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitPagina = idPagina.split("_");
   paginaBuscada = splitPagina[splitPagina.length-1];
   
   for (i = 0 ; i < splitPagina.length - 1; i++ )
   {
        patron += splitPagina[i] + "_"; 
   }  
   paginaSiguiente = patron;
   patron = "a" +  patron.substr(0,patron.length-1) + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   j = 0;
   encontrado = false;
   while (( j < numeroPaginas.length)&&(!encontrado))
   {
          if (numeroPaginas[j] == paginaBuscada) encontrado = true
          else j++; 
   }    
      
   if (encontrado)
   {  
          paginaActual = j;
          if ((j+1) < numeroPaginas.length) // Comprovar si hay página siguiente
          {
              return paginaSiguiente + numeroPaginas[j+1];  
          }
          else
          {
               return ""; 
          }                           
     }
     else
     {
       return "";
     }
   }
   else
   {
    return "";
   }      
} 


//funcion que devuelve el apartado siguiente
function _apartadoSiguiente(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var apartadoSiguiente = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitApartado = idApartado.split("_");  
   
   for (i = 0 ; i < splitApartado.length - 1; i++ )
   {
        apartadoSiguiente += splitApartado[i] + "_";  
   }  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: a0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {     
    if (((i+1) < arrayCurso.length)&&(arrayCurso[i+1].search(apartadoSiguiente) != -1)) // si existe apartado siguiente
    {
         apartadoSiguiente = ((arrayCurso[i+1].split("|"))[0]).split("-")[0];
         apartadoSiguiente = apartadoSiguiente.substr(1); 
         return apartadoSiguiente;  
    }
        else
        {
             return "";
        } 
      
   }
   else
   {
    return "";
   }    
}

//Función que devuelve el tema siguiente
function _temaSiguiente(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idTema + "-";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }    
   if (encontrado)
   {
    temaActual = i ;
    
    if ( nodoActual == 1)
    {
       if ((i+1) < nodo.length)
       {
           return (nodo[i+1].split("-"))[0].substr(1);  
       }
       else 
       {
           return ""; 
       }    
          
    }
        else if ( nodoActual == 2)
        {
           splitTema = idTema.split("_");
           if (((i+1) < nodo.length)&& (nodo[i+1].search(splitTema[0]) != -1))
       {
           return (nodo[i+1].split("-"))[0].substr(1);  
       }
       else 
       {
           return ""; 
       }              
        }
        else 
        {
            return "";  
        }     
   }
   else
   {
    return "";
   }
    
}

//Funcion que devuelve el siguiente capitulo
function _capituloSiguiente(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
      
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
   patron = "c" +  idCapitulo + "-";          // se busca cadena ej: c0-    
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   while ((i < nodo.length)&&(!encontrado))
   {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
   }      
   if (encontrado)
   {
    capituloActual = i ;
    if((i+1) < nodo.length)
    {
       return nodo[i+1].substr(1);  
    }
        else
        {
           return ""; 
        } 
   }
   else
   {
    return "";
   }
      
}

//Funcion que devuelve la pagina anterior
function _paginaAnterior(idPagina)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   var paginaBuscada = new String(""); // Pagina que se esta buscando
   var paginaAnterior = new String(""); // Pagina que se esta buscando
   var profundidadCurso = 0;
   var nodoActual = 0;
   var paginaActual = 0;
   var encontrado = false;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitPagina = idPagina.split("_");
   paginaBuscada = splitPagina[splitPagina.length-1];
   
   for (i = 0 ; i < splitPagina.length - 1; i++ )
   {
        patron += splitPagina[i] + "_"; 
   }  
   paginaAnterior = patron;
   patron = "a" +  patron.substr(0,patron.length-1) + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   j = 0;
   encontrado = false;
   while (( j < numeroPaginas.length)&&(!encontrado))
   {
          if (numeroPaginas[j] == paginaBuscada) encontrado = true
          else j++; 
   }    
      
   if (encontrado)
   {  
          paginaActual = j;
          if ((j-1) > -1) // Comprobar si hay página anterior
          {
              return paginaAnterior + numeroPaginas[j-1]; 
          }
          else
          {
               return ""; 
          }                           
     }
     else
     {
       return "";
     }
   }
   else
   {
    return "";
   }  
}

//Función que devuelve el apartado anterior
function _apartadoAnterior(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var apartadoAnterior = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitApartado = idApartado.split("_");  
   
   for (i = 0 ; i < splitApartado.length - 1; i++ )
   {
        apartadoAnterior += splitApartado[i] + "_"; 
   }  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: a0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {     
    if (((i-1) > -1)&&(arrayCurso[i-1].search(apartadoAnterior) != -1)) // si existe apartado siguiente
    {
         apartadoAnterior = ((arrayCurso[i-1].split("|"))[0]).split("-")[0];
         apartadoAnterior = apartadoAnterior.substr(1); 
         return apartadoAnterior; 
    }
        else
        {
             return "";
        }       
   }
   else
   {
    return "";
   }    
}

//Funcion que devuelve el tema anterior
function _temaAnterior(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idTema + "-";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }    
   if (encontrado)
   {
    temaActual = i ;
    
    if ( nodoActual == 1)
    {
       if ((i-1) > -1)
       {
           return (nodo[i-1].split("-"))[0].substr(1);  
       }
       else 
       {
           return ""; 
       }    
          
    }
        else if ( nodoActual == 2)
        {
           splitTema = idTema.split("_");
           if (((i-1) > -1)&& (nodo[i-1].search(splitTema[0]) != -1))
       {
           return (nodo[i-1].split("-"))[0].substr(1);  
       }
       else 
       {
           return ""; 
       }              
        }
        else 
        {
            return "";  
        }     
   }
   else
   {
    return "";
   }    
}


//Funcion que devuelve el siguiente capitulo
function _capituloAnterior(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
      
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
   patron = "c" +  idCapitulo + "-";          // se busca cadena ej: c0-    
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   while ((i < nodo.length)&&(!encontrado))
   {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
   }      
   if (encontrado)
   {
    capituloActual = i ;
    if((i-1) > -1)
    {
       return nodo[i-1].substr(1);  
    }
        else
        {
           return ""; 
        } 
   }
   else
   {
    return "";
   }
      
}

//Funcion que devuelve la posicion de la pagina en su apartado
function _paginaOrden(idPagina)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   var paginaBuscada = new String(""); // Pagina que se esta buscando   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var paginaActual = 0;
   var encontrado = false;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitPagina = idPagina.split("_");
   paginaBuscada = splitPagina[splitPagina.length-1];
   
   for (i = 0 ; i < splitPagina.length - 1; i++ )
   {
        patron += splitPagina[i] + "_"; 
   }   
   patron = "a" +  patron.substr(0,patron.length-1) + "-";          // se busca cadena ej: 0_1-50|1,2 
      
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   j = 0;
   encontrado = false;
   while (( j < numeroPaginas.length)&&(!encontrado))
   {
          if (numeroPaginas[j] == paginaBuscada) encontrado = true
          else j++; 
   }    
      
   if (encontrado)
   {  
          return j + 1;                           
     }
     else
     {
       return -1;
     }
   }
   else
   {
    return -1;
   }  
}

//Función que devuelve la posición del apartado dentro de un tema
function _apartadoOrden(idApartado)
{
   var i = 0 ;
   var j = 0 ;  
   var numApartados = 0;  
   var patron = new String(""); // patron de busqueda  
   var patronTema = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitApartado = idApartado.split("_");  
   
   for (i = 0 ; i < splitApartado.length - 1; i++ )
   {
        patronTema += splitApartado[i] + "_"; 
   }  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: a0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patronTema) != -1)
        {
           numApartados++;  
           if (arrayCurso[i].search(patron) != -1)  encontrado = true
           else i++;
        }
        else
        {
           i++;
        } 
   }  
   if (encontrado)
   {     
    return numApartados;      
   }
   else
   {
    return -1;
   }    
}

//Funcion que devuelve el tema anterior
function _temaOrden(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idTema + "-";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }    
   if (encontrado)
   {
    temaActual = i ;    
    return temaActual + 1     
   }
   else
   {
    return -1;
   }    
}

//Función que devuelve el capitulo anterior
function _capituloOrden(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
      
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
   patron = "c" +  idCapitulo + "-";          // se busca cadena ej: c0-    
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   while ((i < nodo.length)&&(!encontrado))
   {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
   }      
   if (encontrado)
   {
    capituloActual = i ;
    return capituloActual + 1;  
   }
   else
   {
    return -1;
   }      
}

// Función que devuelve el total de páginas de un apartado.
function _paginaTotales(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var paginaActual = 0;
   var encontrado = false;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];   
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   return numeroPaginas.length;
   }
   else
   {
    return -1;
   }  
} 

//Función que devuelve el número de apartados de un tema
function _apartadoTotales(idTema)
{
   var i = 0 ;
   var j = 0 ;
   var numApartados = 0;    
   var patron = new String(""); // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];    
    
   patron = "a" +  idTema + "_";          // se busca cadena ej: a0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)
        {  
             if (( i == arrayCurso.length -1)||(arrayCurso[i+1].search(patron) == -1))
             { 
                 encontrado = true;
                 numApartados++;
             }    
        }    
        else i++; 
   }  
   if (encontrado)
   {     
    return numApartados;        
   }
   else
   {
    return -1;
   }    
}

//Función que devuelve el numero total de temas
function _temaTotales(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idCapitulo + "_";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      return nodo.length;
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
      if (encontrado)
      {
         return nodo.length; 
      }
      else
      {
         return -1;
      }         
   }      
}

//Función que devuelve el número total de capitulos
function _capituloTotales(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
      
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
       
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   return nodo.length;      
}

//Funcion que devuelve la primera pagina de un apartado que esta no empezado o incompleto
function _paginaNoCompletada(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String("");              // patron de busqueda
   var tempCadena = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasCadena = null;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];   
   patron = "a" +  idApartado + "-";          // se busca cadena ej: a0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   encontrado = false;
   nodo = (arrayCurso[nodoActual].split("|"))[1].split(",");
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   splitCadena = (tempCadena.split("#"))[0].split("$");   
   nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
   paginasCadena = (nodoCadena[1]).split(",");
   
   j = 0; 
   while (( j < paginasCadena.length)&&(!encontrado))
   {
      if ((paginasCadena[j] == "n")||(paginasCadena[j] == "i"))  encontrado = true
            else j++; 
         }          
     
     if (encontrado)
     {
         return idApartado + "_" + nodo[j];   
     }
     else
     {
         return ""; 
     }     
   }
   else
   {
    return "";
   }  
} 

function _apartadoNoCompletado(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String("");              // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var tempCadena = new String("");
   var splitCadena = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];   
   patron = "a" +  idTema + "_";          // se busca cadena ej: a0_1-50|1,2 
   
   //Cadena de Navegación
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   splitCadena = (tempCadena.split("#"))[0].split("$");   
   nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)
        {  
              nodoCadena = (splitCadena[i]).split("|"); //Apartado donde se encuentra las paginas.
              if ((nodoCadena[0] == "n")||(nodoCadena[0] == "i"))
              { 
                    encontrado = true
              }
              else
              {
                   if ((i + 1 < arrayCurso.length) && (arrayCurso[i +1].search(patron) == -1))
                   {
                    i = arrayCurso.length;
                   }
                   else
                   {
                    i++;
                   }       
              }         
        }      
        else i++; 
   }      
   if  ( encontrado)
   {            
  return ((arrayCurso[i].split("|"))[0]).split("-")[0].substr(1);      
   }
   else
   {
    return "";
   }    
}

function _temaNoCompletado(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   var tempCadena = new String("");
   var splitCadena = null;
   var nodoCadena = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idCapitulo + "_";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      
      //Cadena de Navegación
      tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);  
      splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split(","); //Temas.;
            
      i = 0;
      while ((i < nodoCadena.length)&&(!encontrado))
      {
           if ((nodoCadena[i] == "n")||(nodoCadena[i] == "i"))
           {
            encontrado = true;
           }  
           else
           {
            i++;
           }    
      }           
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      
      //Cadena de Navegación
      tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);  
      splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split(","); //Temas.;
      
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)
          {
             if ((nodoCadena[i] == "n")||(nodoCadena[i] == "i"))
             {
            encontrado = true;
             }  
             else
             {
            i++;
             }  
          }  
          else i++; 
      }               
   }   
   if (encontrado)
   {
         return (nodo[i].split("-"))[0].substr(1); 
   }
   else
   {
         return "";
   }  
}

function _capituloNoCompletado()
{
   var i = 0 ;
   var j = 0 ;    
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   var tempCadena = new String("");
   var splitCadena = null;
   var nodoCadena = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
   
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
      
   //Cadena de Navegación
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   splitCadena = (tempCadena.split("#"))[0].split("$");   
   nodoCadena = (splitCadena[nodoActual]).split(","); //Temas.;
      
   i = 0;
   while ((i < nodoCadena.length)&&(!encontrado))
   {
      if ((nodoCadena[i] == "n")||(nodoCadena[i] == "i"))
      {
          encontrado = true;
      } 
      else
      {
          i++;
      }   
   }       
   if (encontrado)
   {
         return (nodo[0].split("-"))[0].substr(1); 
   }
   else
   {
         return "";
   }  
}

//Funcion que devuelve la primera pagina de un apartado que esta no empezado o incompleto
function _paginaCompletada(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String("");              // patron de busqueda
   var tempCadena = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasCadena = null;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];   
   patron = "a" +  idApartado + "-";          // se busca cadena ej: a0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if (encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   encontrado = false;
   nodo = (arrayCurso[nodoActual].split("|"))[1].split(",");
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   splitCadena = (tempCadena.split("#"))[0].split("$");   
   nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
   paginasCadena = (nodoCadena[1]).split(",");
   
   j = 0; 
   while (( j < paginasCadena.length)&&(!encontrado))
   {
      if ((paginasCadena[j].substr(0,1) == "c")||(paginasCadena[j].substr(0,1) == "p")||(paginasCadena[j].substr(0,1) == "f"))
      { 
          if ((j + 1 == paginasCadena.length) || (( paginasCadena[j+1]=="n")||( paginasCadena[j+1]=="i")))
          {  
              encontrado = true;
          }
          else j++;    
      }   
            else j++; 
         }          
     
     if (encontrado)
     {
         return idApartado + "_" + nodo[j];   
     }
     else
     {
         return ""; 
     }     
   }
   else
   {
    return "";
   }  
} 

function _apartadoCompletado(idTema)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String("");              // patron de busqueda   
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var tempCadena = new String("");
   var splitCadena = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];   
   patron = "a" +  idTema + "_";          // se busca cadena ej: a0_1-50|1,2 
   
   //Cadena de Navegación
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   splitCadena = (tempCadena.split("#"))[0].split("$");   
   nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)
        {  
              nodoCadena = (splitCadena[i]).split("|"); //Apartado donde se encuentra las paginas.
              if ((nodoCadena[0].substr(0,1) == "c")||(nodoCadena[0].substr(0,1) == "p")||(nodoCadena[0].substr(0,1) == "f"))
              { 
                    if ((i + 1 == arrayCurso.length)
                    ||(((splitCadena[i+1].split("|")[0]=="n")||(splitCadena[i+1].split("|")[0]=="i"))&& (arrayCurso[i+1].search(patron) != -1))
                    ||(arrayCurso[i+1].search(patron) == -1))
            {
                       encontrado = true
                    }
                    else
                    {
                      i++;
                    }   
                     
              }
              else
              {
                   if ((i + 1 < arrayCurso.length) && (arrayCurso[i+1].search(patron) == -1))
                   {
                    i = arrayCurso.length;
                   }
                   else
                   {
                    i++;
                   }       
              }         
        }      
        else i++; 
   }      
   if  ( encontrado)
   {            
  return ((arrayCurso[i].split("|"))[0]).split("-")[0].substr(1);      
   }
   else
   {
    return "";
   }    
}

function _temaCompletado(idCapitulo)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   var tempCadena = new String("");
   var splitCadena = null;
   var nodoCadena = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idCapitulo + "_";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      
      //Cadena de Navegación
      tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);  
      splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split(","); //Temas.;
      
      i = 0;
      while ((i < nodoCadena.length)&&(!encontrado))
      {
           if ((nodoCadena[i].substr(0,1) == "c")||(nodoCadena[i].substr(0,1) == "p")||(nodoCadena[i].substr(0,1) == "f"))
           {
            if (((i + 1) == nodoCadena.length)            
            ||((nodoCadena[i+1] == "n")||(nodoCadena[i+1] == "i")))
            {              
                encontrado = true;
            }
                else i++;    
           }  
           else i++;           
      }           
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      
      //Cadena de Navegación
      tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);  
      splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split(","); //Temas.;
      
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)
          {
            if ((nodoCadena[i].substr(0,1) == "c")||(nodoCadena[i].substr(0,1) == "p")||(nodoCadena[i].substr(0,1) == "f"))
            {
            if (((i + 1) == nodoCadena.length)            
            ||(((nodoCadena[i+1] == "n")||(nodoCadena[i+1] == "i"))&&(nodo[i+1].search(patron)!= -1))
            ||(nodo[i+1].search(patron)== -1))
            {              
                encontrado = true;
            }
                else i++;    
            } 
            else i++;   
          }  
          else i++; 
      }               
   }   
   if (encontrado)
   {
         return (nodo[0].split("-"))[0].substr(1); 
   }
   else
   {
         return "";
   }  
}

function _capituloCompletado()
{
   var i = 0 ;
   var j = 0 ;    
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   var tempCadena = new String("");
   var splitCadena = null;
   var nodoCadena = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
   
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
      
   //Cadena de Navegación
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   splitCadena = (tempCadena.split("#"))[0].split("$");   
   nodoCadena = (splitCadena[nodoActual]).split(","); //Temas.;
      
   i = 0;
   while ((i < nodoCadena.length)&&(!encontrado))
   {
      if ((nodoCadena[i].substr(0,1) == "c")||(nodoCadena[i].substr(0,1) == "p")||(nodoCadena[i].substr(0,1) == "f"))
      {
         if (((i + 1) == nodoCadena.length)           
         ||((nodoCadena[i+1] == "n")||(nodoCadena[i+1] == "i")))
         {               
             encontrado = true;
         }
         else i++;    
      } 
      else i++;   
   }       
   if (encontrado)
   {
         return (nodo[0].split("-"))[0].substr(1); 
   }
   else
   {
         return "";
   }  
}

//Funcion encargada de buscar el estado de la página
function _paginaEstado(idPagina)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   var paginaBuscada = new String(""); // Pagina que se esta buscando
   var tempCadena = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasCadena = null;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitPagina = idPagina.split("_");
   paginaBuscada = splitPagina[splitPagina.length-1];
   
   for (i = 0 ; i < splitPagina.length - 1; i++ )
   {
        patron += splitPagina[i] + "_"; 
   }  
   patron = "a" +  patron.substr(0,patron.length-1) + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   j = 0;
   encontrado = false;
   while (( j < numeroPaginas.length)&&(!encontrado))
   {
          if (numeroPaginas[j] == paginaBuscada) encontrado = true
          else j++; 
   }    
      
   if (encontrado)
   {  
          paginaActual = j;
          tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);         
    splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
      paginasCadena = (nodoCadena[1]).split(",");
      return paginasCadena[paginaActual].substr(0,1).toUpperCase();     
     }
     else
     {
       return "";
     }
   }
   else
   {
    return "";
   }    
}

//Funcion encargada de buscar el estado del apartado.
function _apartadoEstado(idApartado)
{   
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {
    nodoActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas. 
  return nodoCadena[0].substr(0,1).toUpperCase(); 
   }
   else
   {
    return "";
   }
    
}

//Funcion encargada de buscar el estado del Tema.
function _temaEstado(idTema)
{ 
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   var tempCadena = new String("");  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idTema + "-";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }    
   if (encontrado)
   {
    temaActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL); 
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de temas.
  return nodoCadena[temaActual].substr(0,1).toUpperCase();  
   }
   else
   {
    return "";
   }        
}

//Funcion encargada de buscar el estado del Capitulo.
function _capituloEstado(idCapitulo)
{     
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
   patron = "c" +  idCapitulo + "-";          // se busca cadena ej: 0- 0_1-   
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   while ((i < nodo.length)&&(!encontrado))
   {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
   }      
   if (encontrado)
   {
    capituloActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de capitulos.
  return nodoCadena[CapituloActual].substr(0,1).toUpperCase();  
   }
   else
   {
    return "";
   }    
}

//Funcion encargada de buscar el estado del curso.
function _cursoEstado()
{     
   var i = 0 ;
   var j = 0 ;    
      
   var tempCadena = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;   
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
           
   nodoActual = 0;
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
   splitCadena = (tempCadena.split("#"))[0].split("$");  
   return splitCadena[nodoActual].substr(0,1).toUpperCase();  
        
}

function _estado(idElemento)
{
    var profundidadCurso = 0;
    
    profundidadCurso = ((arrayCurso[0]).split("-"))[0];
    
    if ((idElemento == "")||(idElemento == null))
    {
      return _cursoEstado();
    } 
    else
    {
      splitElemento = idElemento.split("_");
      switch(splitElemento.length)
      {
         case 1: 
         {
          if (profundidadCurso == 3) return _temaEstado(idElemento)
              else return _capituloEstado(idElemento);
              break;
         }
         case 2: 
         {
          if (profundidadCurso == 3) return _apartadoEstado(idElemento)
              else return _temaEstado(idElemento);
              break;
         }
         case 3: 
         {
          if (profundidadCurso == 3) return _paginaEstado(idElemento)
              else return _apartadoEstado(idElemento);
              break;
         }    
         case 4: 
         {
          if (profundidadCurso == 3) return ""
              else return _paginaEstado(idElemento);
              break;
         }
         default:
         {
                return "";      
         }  
      }
    } 
}

//Funcion encargada de buscar la puntuacion de la página
function _paginaPuntuacion(idPagina)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   var paginaBuscada = new String(""); // Pagina que se esta buscando
   var tempCadena = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasCadena = null;
   var numeroPaginas =  null;
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   splitPagina = idPagina.split("_");
   paginaBuscada = splitPagina[splitPagina.length-1];
   
   for (i = 0 ; i < splitPagina.length - 1; i++ )
   {
        patron += splitPagina[i] + "_"; 
   }  
   patron = "a" +  patron.substr(0,patron.length-1) + "-";          // se busca cadena ej: 0_1-50|1,2 
   
   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }   
   
   if  ( encontrado)
   {            
   nodoActual = i                                            // Apartado donde se encuentra la página.   
   nodo = arrayCurso[nodoActual].split("|");                 // Seleccionamos las paginas
   numeroPaginas = nodo[1].split(",");
     
   j = 0;
   encontrado = false;
   while (( j < numeroPaginas.length)&&(!encontrado))
   {
          if (numeroPaginas[j] == paginaBuscada) encontrado = true
          else j++; 
   }    
      
   if (encontrado)
   {  
          paginaActual = j;
          tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);         
    splitCadena = (tempCadena.split("#"))[0].split("$");    
      nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.
      paginasCadena = (nodoCadena[1]).split(",");
      if ((paginasCadena[paginaActual].substr(0,1) == "p")||(paginasCadena[paginaActual].substr(0,1) == "f"))
      {
          return parseInt(paginasCadena[paginaActual].substr(1)); 
          }
          else
                {
                    return -1;  
                }       
     }
     else
     {
       return -1;
     }
   }
   else
   {
    return -1;
   }    
}

//Funcion encargada de buscar la puntuacion del apartado.
function _apartadoPuntuacion(idApartado)
{   
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {
    nodoActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split("|"); //Apartado donde se encuentra las paginas. 
  if ((nodoCadena[0].substr(0,1) == "p")||(nodoCadena[0].substr(0,1) == "f"))
  {
      return parseInt(nodoCadena[0].substr(1)); 
  }
  else
        {
            return -1;  
        } 
   }
   else
   {
    return -1;
   }
    
}

//Funcion encargada de buscar la puntuacion del Tema.
function _temaPuntuacion(idTema)
{ 
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda   
   var tempCadena = new String("");  
   var profundidadCurso = 0;
   var nodoActual = 0;
   var temaActual =0 ;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "t" +  idTema + "-";          // se busca cadena ej: 0- 0_1-   
   
   if ( profundidadCurso == 3)
   {
      nodoActual = 1;
      nodo = arrayCurso[1].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }
   if ( profundidadCurso == 4)
   {
      nodoActual = 2;
      nodo = arrayCurso[2].split(",");
      while ((i < nodo.length)&&(!encontrado))
      {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
      }
          
   }    
   if (encontrado)
   {
    temaActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL); 
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de temas. 
  if ((nodoCadena[temaActual].substr(0,1) == "p")||(nodoCadena[temaActual].substr(0,1) == "f"))
  {
      return parseInt(nodoCadena[temaActual].substr(1));  
  }
        else
        {
            return -1;  
        }     
   }
   else
   {
    return -1;
   }        
}

//Funcion encargada de buscar la puntuacion del Capitulo.
function _capituloPuntuacion(idCapitulo)
{     
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda
   
   var tempCadena = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var capituloActual =0 ;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];      
   patron = "c" +  idCapitulo + "-";          // se busca cadena ej: 0- 0_1-   
      
   nodoActual = 1;
   nodo = arrayCurso[1].split(",");
   while ((i < nodo.length)&&(!encontrado))
   {
          if (nodo[i].search(patron) != -1)  encontrado = true
          else i++; 
   }      
   if (encontrado)
   {
    capituloActual = i ;
    tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
  splitCadena = (tempCadena.split("#"))[0].split("$");    
  nodoCadena = (splitCadena[nodoActual]).split(","); //Nodo de capitulos.
  if ((nodoCadena[CapituloActual].substr(0,1) == "p")||(nodoCadena[CapituloActual].substr(0,1) == "f"))
  {
      return parseInt(nodoCadena[CapituloActual].substr(1));  
  }
  else
        {
            return -1;  
        } 
   }
   else
   {
    return -1;
   }    
}

//Funcion encargada de buscar la puntuacion del curso.
function _cursoPuntuacion()
{     
   var i = 0 ;
   var j = 0 ;    
      
   var tempCadena = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;   
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
           
   nodoActual = 0;
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);
   splitCadena = (tempCadena.split("#"))[0].split("$");  
   if ((splitCadena[nodoActual].substr(0,1) == "p")||(splitCadena[nodoActual].substr(0,1) == "f"))
   {
      return parseInt(splitCadena[nodoActual].substr(1)); 
   }
   else
   {
            return -1;  
   }    
}

function _puntuacion(idElemento)
{
    var profundidadCurso = 0;
    
    profundidadCurso = ((arrayCurso[0]).split("-"))[0];
    
    if ((idElemento == "")||(idElemento == null))
    {
      return _cursoPuntuacion();
    } 
    else
    {
      splitElemento = idElemento.split("_");
      switch(splitElemento.length)
      {
         case 1: 
         {
          if (profundidadCurso == 3) return _temaPuntuacion(idElemento)
              else return _capituloPuntuacion(idElemento);
              break;
         }
         case 2: 
         {
          if (profundidadCurso == 3) return _apartadoPuntuacion(idElemento)
              else return _temaPuntuacion(idElemento);
              break;
         }
         case 3: 
         {
          if (profundidadCurso == 3) return _paginaPuntuacion(idElemento)
              else return _apartadoPuntuacion(idElemento);
              break;
         }    
         case 4: 
         {
          if (profundidadCurso == 3) return ""
              else return _paginaPuntuacion(idElemento);
              break;
         }
         default:
         {
                return "";      
         }  
      }
    } 
}

//Funcion encargada de buscar la puntuacion actual, no la guardada, del apartado.
function _puntuacionActual(idApartado)
{   
   var i = 0 ;
   var j = 0 ;    
   var k = 0 ; 
   var patron = new String(""); // patron de busqueda
   
   var estadoPagina = new String("");
   var infoAdicional = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var numPaginas = 0;
   var tempPuntuacion = 0;
   var tempPuntPagina = 0;
   var encontrado = false;
   var nodo = null;
   var nodoCadena = null;
   var paginasCadena = null;
   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];  
    
   patron = "a" +  idApartado + "-";          // se busca cadena ej: 0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {
    nodoActual = i ;
        
  nodoCadena = (arrayCurso[nodoActual]).split("|"); //Apartado donde se encuentra las paginas.  
  paginasCadena = nodoCadena[1].split(",");
  
  j = 0; 
  encontrado = false;
  while ((j < paginasCadena.length)&&(!encontrado))
  {
      estadoPagina = _paginaEstado(idApartado + "_" + paginasCadena[j]);
      tempPuntPagina  = _paginaPuntuacion(idApartado + "_" + paginasCadena[j]);
        
      if ((estadoPagina == "N")||(estadoPagina == "I"))
      { 
          encontrado = true;
      }   
      else
      { 
        if (tempPuntPagina != -1)
        {
            tempPuntuacion += tempPuntPagina;
            k++; //Actividades
        }    
        j++;
      }     
  }
  if (encontrado ) return -1
  else return Math.floor(tempPuntuacion/k);   
   }
   else
   {
    return -1;
   }    
}


//Funcion q recupera la informacion adicional de la cadena de navegacion.
function _recuperarInfoAdicional()
{
   var tempCadena = new String("");
   var infoAdicional = new String("");   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   infoAdicional =(tempCadena.split("#"))[1];     

   return infoAdicional;
}




//Funcion q recupera la informacion adicional de la cadena de navegacion.
/**
function _recuperarInfoAdicionalTest()
{
   var tempCadena = new String("");
   var infoAdicional = new String("");   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   infoAdicional =(tempCadena.split("#"))[2];     
   return infoAdicional;
}
**/
//Funcion q guarda la informacion adicional de la cadena de navegacion.
/**
function _guardarInfoAdicional(aux)
{
   var temp = new String("");
   var temp2 = new String("");
   var tempCadena = new String("");
   var infoAdicional = new String("");
   
   temp2 = cookie_api.LMSGetValue(AICC_PROTOCOL);
   tempCadena = temp2.split("#");
   infoAdicional = aux;   
   temp = tempCadena[0] + "#" + infoAdicional + "#" + tempCadena[2] + "#";   
   cookie_api.LMSSetValue(AICC_PROTOCOL,temp);  

}
**/
function _guardarInfoAdicional(aux)
{
   var temp = new String("");
   var temp2 = new String("");
   var tempCadena = new String("");
   var infoAdicional = new String("");
   
   temp2 = cookie_api.LMSGetValue(AICC_PROTOCOL);
   tempCadena = temp2.split("#");
   infoAdicional = aux;   
 
   temp = tempCadena[0] + "#" + infoAdicional; 
   cookie_api.LMSSetValue(AICC_PROTOCOL,temp);  

}


//Funcion q guarda la informacion adicional de la cadena de navegacion.
/**
function _guardarInfoAdicionalTest(aux)
{
   var temp = new String("");
   var temp2 = new String("");
   var tempCadena = new String("");   
   
   temp2 = cookie_api.LMSGetValue(AICC_PROTOCOL);
   tempCadena = temp2.split("#");
   
   temp = tempCadena[0] + "#" + tempCadena[1] + "#" + aux + "#";   
   cookie_api.LMSSetValue(AICC_PROTOCOL,temp);  
}
**/


//Funcion que recupera la respuesta de un usuario a una pregunta de la evaluación.
function _recuperarRespuestaPregunta(idEvaluacion,numOrdenPregunta)
{
   var tempCadena = new String("");
   var cadenaEvaluaciones = new String("");   
   var listaEvaluacion = new String("");
   var tempEvaluacion = new String("");
   var codigoEvaluacion = new String("");
   var cadenaPreguntas = new String("");
   var listaPreguntas = new String("");
   var repuesta = new String("");
   
   var i=0;
   var encontrado = false;
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   cadenaEvaluaciones =(tempCadena.split("#"))[2];
   listaEvaluacion = cadenaEvaluaciones.split("$");
   
   while ((i < listaEvaluacion.length)&&(!encontrado))
   {
      tempEvaluacion = (listaEvaluacion[i].split(";"))[0];
      codigoEvaluacion = tempEvaluacion.split("|")[0];
      if ( codigoEvaluacion == idEvaluacion)
      {
         cadenaPreguntas = (listaEvaluacion[i].split(";"))[1];
         listaPreguntas = cadenaPreguntas.split(",");
         respuesta = ((listaPreguntas[numOrdenPregunta - 1]).split("|"))[1];
         encontrado = true;
      } 
      i++;
   }  
   return respuesta;   
}



//Funcion que devuelve primera pregunta sin responder.
function _primeraRespuestaNoCompletadaEvaluacion(idEvaluacion)
{
  var tempCadena = new String("");
   var cadenaEvaluaciones = new String("");   
   var listaEvaluacion = new String("");
   var tempEvaluacion = new String("");
   var codigoEvaluacion = new String("");
   var codigoPregunta = new String("");
   var cadenaPreguntas = new String("");
   var listaPreguntas = new String("");
   var respuesta = new String("");
   var numRespuesta = 0;
   
   var i=0;
   var j=0;
   var encontrado = false;
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   cadenaEvaluaciones =(tempCadena.split("#"))[2];
   listaEvaluacion = cadenaEvaluaciones.split("$");
   
   while ((i < listaEvaluacion.length)&&(!encontrado))
   {
      tempEvaluacion = (listaEvaluacion[i].split(";"))[0];
      codigoEvaluacion = tempEvaluacion.split("|")[0];
      if ( codigoEvaluacion == idEvaluacion)
      {
         
         cadenaPreguntas = (listaEvaluacion[i].split(";"))[1];
         listaPreguntas = cadenaPreguntas.split(",");
         while ((j < listaPreguntas.length)&&(!encontrado))
         {
              respuesta = ((listaPreguntas[j]).split("|"))[1];
              if (respuesta == "0")
              {
                  encontrado = true;
                  numRespuesta = j + 1;
              }
              j++;    
         }
      } 
      i++;
   }     
   return numRespuesta;  
} 

//Funcion que recupera el codigo real de una pregunta de la evaluación.


function _recuperarCodigoPregunta(idEvaluacion,numOrdenPregunta)
{
   var tempCadena = new String("");
   var cadenaEvaluaciones = new String("");   
   var listaEvaluacion = new String("");
   var tempEvaluacion = new String("");
   var codigoEvaluacion = new String("");
   var codigoPregunta = new String("");
   var cadenaPreguntas = new String("");
   var listaPreguntas = new String("");
   var repuesta = new String("");
   
   var i=0;
   var encontrado = false;
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   cadenaEvaluaciones =(tempCadena.split("#"))[2];
   listaEvaluacion = cadenaEvaluaciones.split("$");
   
   while ((i < listaEvaluacion.length)&&(!encontrado))
   {
      tempEvaluacion = (listaEvaluacion[i].split(";"))[0];
      codigoEvaluacion = tempEvaluacion.split("|")[0];
      if ( codigoEvaluacion == idEvaluacion)
      {
         cadenaPreguntas = (listaEvaluacion[i].split(";"))[1];
         listaPreguntas = cadenaPreguntas.split(",");
         codigoPregunta = ((listaPreguntas[numOrdenPregunta - 1]).split("|"))[0];
         encontrado = true;
      } 
      i++;
   }     
   return codigoPregunta;  
}

//Funcion que guarda la informacion adicional de la cadena de navegacion.


function _guardarRespuestaPregunta(idEvaluacion,numOrdenPregunta,numRespuesta)
{
  
   var tempCadena = new String("");
   var cadenaEvaluaciones = new String("");   
   var listaEvaluacion = new String("");
   var tempEvaluacion = new String("");
   var codigoEvaluacion = new String("");
   var cadenaPreguntas = new String("");
   var listaPreguntas = new String("");
   var codigoPregunta = new String("");
   var repuestaPregunta = new String("");
   var temp = new String("");
   
   var i=0;
   var encontrado = false;
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   cadenaEvaluaciones =(tempCadena.split("#"))[2];
   listaEvaluacion = cadenaEvaluaciones.split("$");
   
   while (i < listaEvaluacion.length)
   {
      tempEvaluacion = (listaEvaluacion[i].split(";"))[0];
      codigoEvaluacion = tempEvaluacion.split("|")[0];
      if ( codigoEvaluacion == idEvaluacion)
      {
         temp = temp + tempEvaluacion.split("|")[0] + "|" + tempEvaluacion.split("|")[1] + ";";
         cadenaPreguntas = (listaEvaluacion[i].split(";"))[1];         
         listaPreguntas = cadenaPreguntas.split(",");
         for (j=0; j < listaPreguntas.length; j++)
         {
              codigoPregunta = listaPreguntas[j].split("|")[0];
              respuestaPregunta = listaPreguntas[j].split("|")[1];
              if (j == (numOrdenPregunta - 1))
              {
                temp = temp + codigoPregunta + "|" +  numRespuesta + ",";
              } 
              else
              {
                temp = temp + codigoPregunta + "|" +  respuestaPregunta + ",";
              }   
             
         }  
         temp = temp.substr(0,temp.length-1);
         temp = temp + "$";
         
      } 
      else
      {
          temp = temp + listaEvaluacion[i] + "$";
      }   
      i++;
   }  
   temp = temp.substr(0,temp.length-1);   
   temp = (tempCadena.split("#"))[0] + "#" + (tempCadena.split("#"))[1] + "#" + temp;   
   //alert("Guardar " + temp);
   cookie_api.LMSSetValue(AICC_PROTOCOL,temp);  
} 


//Funcion que recupera estado de una evaluación.
function _recuperarEstadoEvaluacion(idEvaluacion)
{
   var tempCadena = new String("");
   var cadenaEvaluaciones = new String("");   
   var listaEvaluacion = new String("");
   var tempEvaluacion = new String("");
   var codigoEvaluacion = new String("");
   var estado = new String("");
   
   var i=0;
   var encontrado = false;
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   cadenaEvaluaciones =(tempCadena.split("#"))[2];
   listaEvaluacion = cadenaEvaluaciones.split("$");
   
   while ((i < listaEvaluacion.length)&&(!encontrado))
   {
      tempEvaluacion = (listaEvaluacion[i].split(";"))[0];
      codigoEvaluacion = tempEvaluacion.split("|")[0];
      
      if ( codigoEvaluacion == idEvaluacion)
      {
         estado = tempEvaluacion.split("|")[1];
         encontrado = true;
      } 
      i++;
   }  
   return estado;   
}

//Funcion que guarda el estado de una Evaluación.
function _guardarEstadoEvaluacion(idEvaluacion,nuevoEstado)
{
  var tempCadena = new String("");
   var cadenaEvaluaciones = new String("");   
   var listaEvaluacion = new String("");
   var tempEvaluacion = new String("");
   var codigoEvaluacion = new String("");
   var cadenaPreguntas = new String("");
   var listaPreguntas = new String("");
   var codigoPregunta = new String("");
   var repuestaPregunta = new String("");
   var temp = new String("");
   
   var i=0;
   var encontrado = false;
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   cadenaEvaluaciones =(tempCadena.split("#"))[2];
   listaEvaluacion = cadenaEvaluaciones.split("$");
   
   while (i < listaEvaluacion.length)
   {
      tempEvaluacion = (listaEvaluacion[i].split(";"))[0];
      codigoEvaluacion = tempEvaluacion.split("|")[0];
      if ( codigoEvaluacion == idEvaluacion)
      {
         temp = temp + tempEvaluacion.split("|")[0] + "|" + nuevoEstado + ";" + (listaEvaluacion[i].split(";"))[1] + "$";                  
      } 
      else
      {
          temp = temp + listaEvaluacion[i] + "$";
      }   
      i++;
   }  
   temp = temp.substr(0,temp.length-1);   
   temp = (tempCadena.split("#"))[0] + "#" + (tempCadena.split("#"))[1] + "#" + temp;   
   //alert("GuardarEstado " + temp);
   cookie_api.LMSSetValue(AICC_PROTOCOL,temp);  
  
} 

//Funcion reiniciar una Evaluacion.
function _resetEvaluacion(idEvaluacion)
{
   var tempCadena = new String("");
   var cadenaEvaluaciones = new String("");   
   var listaEvaluacion = new String("");
   var tempEvaluacion = new String("");
   var codigoEvaluacion = new String("");
   var cadenaPreguntas = new String("");
   var listaPreguntas = new String("");
   var codigoPregunta = new String("");
   var repuestaPregunta = new String("");
   var temp = new String("");
   
   var i=0;
   var encontrado = false;
   
   tempCadena = cookie_api.LMSGetValue(AICC_PROTOCOL);   
   cadenaEvaluaciones =(tempCadena.split("#"))[2];
   listaEvaluacion = cadenaEvaluaciones.split("$");
   
   while (i < listaEvaluacion.length)
   {
      tempEvaluacion = (listaEvaluacion[i].split(";"))[0];
      codigoEvaluacion = tempEvaluacion.split("|")[0];
      if ( codigoEvaluacion == idEvaluacion)
      {
          temp = temp + evaluacion[i][2] + "|0;";
          listaPreguntas = obtenerEvaluacion(evaluacion[i][0], evaluacion[i][1]);
          for (j=0; j < listaPreguntas.length; j++)
          {
                  temp = temp + listaPreguntas[j] + "|0,"   
          }
          temp = temp.substr(0,temp.length-1) + "$";         
      } 
      else
      {
          temp = temp + listaEvaluacion[i] + "$";
      }   
      i++;
   }  
   temp = temp.substr(0,temp.length-1);   
   temp = (tempCadena.split("#"))[0] + "#" + (tempCadena.split("#"))[1] + "#" + temp;  
   //alert("Resetear " + temp); 
   cookie_api.LMSSetValue(AICC_PROTOCOL,temp);   
} 

//Es un apartado Practico?
function _apartadoPractico(idApartado)
{
   var i = 0 ;
   var j = 0 ;    
   var patron = new String(""); // patron de busqueda  
   var puntuacion = new String("");
   var profundidadCurso = 0;
   var nodoActual = 0;
   var encontrado = false;   
   
   profundidadCurso = ((arrayCurso[0]).split("-"))[0];
   patron = "a" +  idApartado + "-";          // se busca cadena ej: a0_1-50|1,2   
   i = profundidadCurso -1;                                  // Paginas del curso
   while ((i < arrayCurso.length)&&(!encontrado))
   {
        if (arrayCurso[i].search(patron) != -1)  encontrado = true
        else i++; 
   }  
   if (encontrado)
   {     
    puntuacion  = ((arrayCurso[i].split("|"))[0]).split("-")[1];
    if ( "" + puntuacion == "" ) return false
        else return true;       
   }
   else
   {
    return false;
   }    
}

/******************************************************************************/
/* Llamada al LMSInitialize() desde api externo                               */
/******************************************************************************/
function _Initialize()
{
        cookie_api.LMSInitialize(""); 
  external_api.LMSInitialize(""); 
  
  
  //alert( cookie_api.LMSGetValue("cmi.suspend_data"));
  if (cookie_api != external_api)
  {
        cookie_api.LMSSetValue(AICC_Protocol,external_api.LMSGetValue(AICC_PROTOCOL));
        cookie_api.LMSSetValue("cmi.suspend_data",external_api.LMSGetValue("cmi.suspend_data"));
        cookie_api.LMSSetValue("cmi.core.lesson_status",external_api.LMSGetValue("cmi.core.lesson_status"));        
        cookie_api.LMSSetValue("cmi.core.score.raw",external_api.LMSGetValue("cmi.core.score.raw"));
        cookie_api.LMSSetValue("cmi.core.student_id",external_api.LMSGetValue("cmi.core.student_id"));
        cookie_api.LMSSetValue("cmi.core.student_name",external_api.LMSGetValue("cmi.core.student_name"));
        cookie_api.LMSSetValue("cmi.core.total_time",external_api.LMSGetValue("cmi.core.total_time"));
   }    
}

/******************************************************************************/
/* Llamada al LMSCommit() del api externo                                     */
/******************************************************************************/
function _Commit()
{
  setTimeout(function(){
     if (cookie_api != external_api)
     { 
        external_api.LMSSetValue(AICC_PROTOCOL,cookie_api.LMSGetValue(AICC_PROTOCOL));   
        external_api.LMSSetValue("cmi.core.lesson_status",cookie_api.LMSGetValue("cmi.core.lesson_status"));   
        external_api.LMSSetValue("cmi.core.lesson_location",cookie_api.LMSGetValue("cmi.core.lesson_location"));
        external_api.LMSSetValue("cmi.core.score.raw",cookie_api.LMSGetValue("cmi.core.score.raw"));
        external_api.LMSSetValue("cmi.core.student_id",cookie_api.LMSGetValue("cmi.core.student_id"));
        external_api.LMSSetValue("cmi.core.student_name",cookie_api.LMSGetValue("cmi.core.student_name"));      
        
     }    
     cookie_api.LMSCommit("");
     external_api.LMSCommit("");    
    }, 1000);         
     
          
     
}

/******************************************************************************/
/* Llamada al LMSFinish() desde el api externo                                       */
/******************************************************************************/
function _Finish()
{
    if (cookie_api != external_api)
    { 
      external_api.LMSSetValue(AICC_PROTOCOL,cookie_api.LMSGetValue(AICC_PROTOCOL));
      external_api.LMSSetValue("cmi.core.lesson_status",cookie_api.LMSGetValue("cmi.core.lesson_status"));
      external_api.LMSSetValue("cmi.core.lesson_location",cookie_api.LMSGetValue("cmi.core.lesson_location"));
      //external_api.LMSSetValue("cmi.core.score.max","100");
      //external_api.LMSSetValue("cmi.core.score.min","0"); 
      external_api.LMSSetValue("cmi.core.score.raw",cookie_api.LMSGetValue("cmi.core.score.raw"));        
      external_api.LMSSetValue("cmi.core.session_time",cookie_api.sesionTiempo());      
      //alert(cookie_api.sesionTiempo());
      //external_api.LMSSetValue("cmi.core.student_name",cookie_api.LMSGetValue("cmi.core.student_name"));                  
      external_api.LMSCommit("");   
    }
    else
    {   
      //alert(cookie_api.sesionTiempo());
      cookie_api.LMSSetValue("cmi.core.session_time",cookie_api.sesionTiempo());            
    }   
    cookie_api.LMSFinish("");
    external_api.LMSFinish("");    
}

/******************************************************************************/
/* Llamada al ActualizarDatos() desde api externo                               */
/******************************************************************************/
function _ActualizarDatos(puntAuxiliar, pagVisitadas, pagTotales)
{
    var estado = new String("");    
    var puntuacion = new String("");         
   
    estado = _estado();
  //  puntuacion = puntAuxiliar;   
   

   puntuacion = puntAuxiliar;        
   puntuacion = Math.floor(puntuacion);

  puntuacion = cookie_api.LMSGetValue("cmi.suspend_data").match(/[fp](\d+)/)[1]; 

    
    switch(estado)
    { 
       case "N":
       {        
          cookie_api.LMSSetValue("cmi.core.lesson_status","not attempted"); 
          // cookie_api.LMSSetValue("cmi.core.score.raw","0");
          cookie_api.LMSSetValue("cmi.core.score.raw",puntuacion);

          break;       
       }
       case "I":
       {
          cookie_api.LMSSetValue("cmi.core.lesson_status","incomplete");  
          // cookie_api.LMSSetValue("cmi.core.score.raw","0");
          cookie_api.LMSSetValue("cmi.core.score.raw",puntuacion);
          break;              
       }
       case "C":
       {

          cookie_api.LMSSetValue("cmi.core.lesson_status","completed"); 
          // cookie_api.LMSSetValue("cmi.core.score.raw","100");
          cookie_api.LMSSetValue("cmi.core.score.raw",puntuacion);
          break;              
       }
       case "P":
       {        
          cookie_api.LMSSetValue("cmi.core.lesson_status","passed");  
          // cookie_api.LMSSetValue("cmi.core.score.raw","100");
          cookie_api.LMSSetValue("cmi.core.score.raw",puntuacion);
          break;              
       }
       case "F":
       {

          cookie_api.LMSSetValue("cmi.core.lesson_status","failed"); 
          // cookie_api.LMSSetValue("cmi.core.score.raw","0");
              cookie_api.LMSSetValue("cmi.core.score.raw",puntuacion);

         //external_api.LMSSetValue("cmi.core.lesson_status","failed");  
          //external_api.LMSSetValue("cmi.core.score.raw",puntuacion);
          break;              
       }
       default:
       {
         cookie_api.LMSSetValue("cmi.core.lesson_status","incomplete");          
         // cookie_api.LMSSetValue("cmi.core.score.raw","0");
             cookie_api.LMSSetValue("cmi.core.score.raw",puntuacion);
       }
    }       
    

    
    
     //alert(cookie_api.LMSGetValue("cmi.core.lesson_status") + " " + cookie_api.LMSGetValue("cmi.core.score.raw"));           
     //temp = _recuperarInfoAdicional();
    //temp = temp.substr(0,1) + ";VarPaginas_totales="+ pagTotales +";VarPaginas_visitadas="+ pagVisitadas +";"
    //_guardarInfoAdicional(temp);   
    
}     

function _recuperarAvatar()
{   

  console.log("recupero el avatar");
   var temp =  _recuperarInfoAdicionalTest();   
   var avatar = temp.split("$")[2];
   return avatar;
} 


function _getLastPage(){
  return CURSO.paginaNoCompletada(CURSO.apartadoNoCompletado(CURSO.temaNoCompletado()));

}


function _recuperarVariable(num){
   var temp =  _recuperarInfoAdicional();   
   var value = temp.split("$")[num];
  // alert("recupero="+value);
   return value;
}


function _replaceMyComma(num){
   var value = num.replace(/,\s*$/, "");;
   return value;
}

function _getApi()
{    

    if (cookie_api){
      return 2;
    }else{
      return 0;
    }
}

function _guardarVariables(t1,t2,t3,t4,t5,t6,t7,t8,t9)
{    

   var temp = "";   
   temp =  t1 + "$" + t2 + "$" + t3 + "$" + t4 + "$" + t5 + "$" + t6 + "$" + t7 + "$" + t8 + "$" + t9;
   _guardarInfoAdicional(temp);
   _Commit(""); 
   return "";
   //throw new Error('This is not an error. This is just to abort javascript');
}

function _getApi()
{    
  
    return 2;
}

/******************************************************************************************/
/* finalizarEjercicio(respuesta,tipo,resultado,correcta,score): Guarda el seguimiento de  */ 
/* cada actividad del curso.                                                              */
/* respuesta: respuesta del alumno                                                        */
/* tipo: tipo de actividad SCORM                                                          */
/* resultado: c correcta - w incorrecta                                                   */
/* score: puntacion de la actividad (0 - incorrecta 100 - correcta)                       */
/******************************************************************************************/
function _finalizarEjercicio(respuesta,tipo,resultado,correcta,score,pagina) 
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



//02-08-2011 Copiar toda la función calcularPaginasTotales()
/*********************************************************************************/
/* calcularPaginasTotales(): Calcula las páginas totales y visitadas del curso   */        
/*********************************************************************************/
function _calcularPaginasTotales()
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
function _setPages()
{
      
 
            
           if (CURSO != null)
           {
             _calcularPaginasTotales();            
             _ActualizarDatos(((paginasVisitadas/paginasTotales)*100), paginasVisitadas, paginasTotales);     
             _Commit("");     
             //top.opener.cerrar(); 
           } 
           
     
     
}



var daap_productivo=""
var daap_excesivo="";

var tmct_productivo="";
var tmct_excesivo="";


var mtcs_productivo="";
var mtcs_excesivo="";


var adng_productivo="";
var adng_excesivo="";



function _prepareChart(){

    //recuperarVariables
   
    var pag1=CURSO.recuperarVariable(0);
    var pag2=CURSO.recuperarVariable(1);
    var pag3=CURSO.recuperarVariable(2);
  
/**
    var pag1="4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1";
    var pag2="3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,4,3,2,1,4,3,2,1";
    var pag3="3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4";
**/

    //creo arrays para el cálculo
    var array1 = pag1.split(',').map(Number);
    var array2 = pag2.split(',').map(Number);
    var array3 = pag3.split(',').map(Number);


    var daap_res_productivo1=array1[0]+array2[0]+array3[0];
    var daap_res_productivo2=array1[4]+array2[4]+array3[4];
    var daap_res_productivo3=array1[8]+array2[8]+array3[8];
    daap_productivo=daap_res_productivo1+daap_res_productivo2+daap_res_productivo3;

    var daap_res_excesivo1=array1[12]+array2[12]+array3[12];
    var daap_res_excesivo2=array1[16]+array2[16]+array3[16];
    var daap_res_excesivo3=array1[20]+array2[20]+array3[20];
    daap_excesivo=daap_res_excesivo1+daap_res_excesivo2+daap_res_excesivo3;


    var tmct_res_productivo1=array1[1]+array2[1]+array3[1];
    var tmct_res_productivo2=array1[5]+array2[5]+array3[5];
    var tmct_res_productivo3=array1[9]+array2[9]+array3[9];
    tmct_productivo=tmct_res_productivo1+tmct_res_productivo2+tmct_res_productivo3;

    var tmct_res_excesivo1=array1[13]+array2[13]+array3[13];
    var tmct_res_excesivo2=array1[17]+array2[17]+array3[17];
    var tmct_res_excesivo3=array1[21]+array2[21]+array3[21];
    tmct_excesivo=tmct_res_excesivo1+tmct_res_excesivo2+tmct_res_excesivo3;

    var mtcs_res_productivo1=array1[2]+array2[2]+array3[2];
    var mtcs_res_productivo2=array1[6]+array2[6]+array3[6];
    var mtcs_res_productivo3=array1[10]+array2[10]+array3[10];
    mtcs_productivo=mtcs_res_productivo1+mtcs_res_productivo2+mtcs_res_productivo3;

    var mtcs_res_excesivo1=array1[14]+array2[14]+array3[14];
    var mtcs_res_excesivo2=array1[18]+array2[18]+array3[18];
    var mtcs_res_excesivo3=array1[22]+array2[22]+array3[22];
    mtcs_excesivo=mtcs_res_excesivo1+mtcs_res_excesivo2+mtcs_res_excesivo3;


    var adng_res_productivo1=array1[3]+array2[3]+array3[3];
    var adng_res_productivo2=array1[7]+array2[7]+array3[7];
    var adng_res_productivo3=array1[11]+array2[11]+array3[11];
    adng_productivo=adng_res_productivo1+adng_res_productivo2+adng_res_productivo3;

    var adng_res_excesivo1=array1[15]+array2[15]+array3[15];
    var adng_res_excesivo2=array1[19]+array2[19]+array3[19];
    var adng_res_excesivo3=array1[23]+array2[23]+array3[23];
    adng_excesivo=adng_res_excesivo1+adng_res_excesivo2+adng_res_excesivo3;



}





function _paintChart(){
    _prepareChart();

var ctx = document.getElementById("myChart").getContext('2d');



var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["DA/AP", "TM/CT", "MT/CS", "AD/NG"],
        datasets: [

        {
            label: 'USO PRODUCTIVO',
            data: [daap_productivo, tmct_productivo, mtcs_productivo, adng_productivo],
            backgroundColor: [
                'rgb(0, 74, 151)',
                'rgb(0, 74, 151)',
                'rgb(0, 74, 151)',
                'rgb(0, 74, 151)'
            ],
            borderColor: [
                'rgb(0, 74, 151)',
                'rgb(0, 74, 151)',
                'rgb(0, 74, 151)',
                'rgb(0, 74, 151)'
            ],
            borderWidth: 1
        },
        {
            label: 'USO EXCESIVO',
            data: [daap_excesivo, tmct_excesivo, mtcs_excesivo, adng_excesivo],
            backgroundColor: [
                    'rgb(235, 0, 41)',
             'rgb(235, 0, 41)',
                'rgb(235, 0, 41)',
                     'rgb(235, 0, 41)'
            ],
            borderColor: [
          'rgb(235, 0, 41)',
              'rgb(235, 0, 41)',
                 'rgb(235, 0, 41)',
                     'rgb(235, 0, 41)'
            ],
            borderWidth: 1
        }





        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});


}


function _makePdf() {
            var meses = new Array ("ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE");
            var f=new Date();
            var doc = new jsPDF("portrait", "mm", "a4");
            var imgData1='data:image/jpeg;base64,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Q9P2lGagKMlEXIcyH+X98/XC5vnp7XYvHfo+D1LPRC5X3/16b1r/AEipPqdUqlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJRF6Wbtdg7avmpxTcsnKDtuoHEU126pVkTgHwkUIA15exsjDG/a1wIPgOxemOcxwe3zgajwhZHIeSRmYmNlm4h0ZFi1epgA68oOESKimPgPMmJuUQHiAhWNZonQzOhd5zXEfAVkCKQTRNlbuc0H4VEahqIlESiJRFQfPVue0LeaXAgnzOINwCbkShxGOfmIkYTacTdF4CWnjygcw8ONV/T9z3dybdx8mQbPCPtivwBUTN2/eW4nHnMO3wH92nxq0MpjEMU5DCUxRAxTFESmKYo6gYohoICAhwGrxIBFDuVqbto3rpudpveay3kbGcRZNnptJ7kq1Yk+McvEVVEz8+QLBbNmD2Xd84FIq8vOBOwnTAlqQgynTDQSCUvLjm7ol+iteXmLt4y3Fyv7+36u5lJIaOyN/HFt+8r0roryw1czVmjLXIzvByETe5n6+9iABce2RvDJs+/p0K9SSkl5NwZZUwgQBEEUddSIp68CgHABMIB6w+kftBVjRxtibwjf09qu6SR0jqnd0KWYMOWKZB/3oR/zyhzf9WvTPMCm8oa38p/C+YKMJqKIqEVSOZNQhgMQ5BEpimDwEBCvpAIodykQSDUb1UW1hbLN13AAY78ypgeLKmA6puf1iCU2gCVI4B4ekwDrroFU+64g4N/xdNiqFrwuaXf4yu1TVUoppBEADUeABxER8ACiL5eYQ/ryXjy/jCfK8eX5Xjp6K9cLuor5UdYXIhyH+X98/XC5vnp7XYnHfo+D1LPRC5YX/16b1r/AEipPqdUqlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoivJwROe0bRWilD8y8C+URKUR1EGL4TO2wiIjr+P65QD0FIAB8Vl5+Du7wTDzZG/GNh+Kiu3CTd5amI+cx3xHaPjqq21Q1WUoiURKIvBKxreYjJCKdh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f9zeft095jf+4TLF45WukhFkWLy55LqsIRq4UIqvH2zAM02lvWtFqrEA5msa1atxOHNya8azVp7S+ntJ2X5u05aQ2lpsJDG7XEbAXvNXyOps4nuc6nSsS5zUWc1Ld+3Z26lurnoLzsaDvDGijWDsY1o7FQqq+qKlESiJREoiURKIlESiJREoiv8AMZ/kFa//AOVp/wD1ilY+yn6Ql/fK+cd9Ri/eqeqkFOpREoiURKIlEWOq7WvkrquRppoDedlkiePFMj9cEzBqJh0MTQQ1ER0Gsj2b+O0if1xt+QKwLpvBcyN6nu+UqXqmVAXQh923yCpefbTiLcOqdQuJc3ZXx8kQxnBioJyS0DlUUkwXAEiEFXJhj6I6p8xxEfwgnAOdXvM44WXM99yBQ3ljbzdG3h44Oj1FNu3Z1UW9fu+3xu+XjLcn6reTRdOyvDN/pujZ46rPlWvizelEXIcyH+X98/XC5vnp7XYvHfo+D1LPRC5X3/16b1r/AEipPqdUqlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEV+mKTGPj62RMImEGa5QEfvSP3ZCB9gpSgH2qsDLbMjL++HyBXvjDWwjr1fOVUKqcp9KIlESiJREoisKyo28rkG5kuXl5nqTnTQofxxk1d83q8PW6+vwjrx41f8AiXceOiP4NPgJHzKx8m3hv5B21+EAqn1VFSK3SfdUr6B9izeDjQymg2xf+LL6SSMYgcwX1bt2QDhRIvICh+mOO0gUHmMBeYnAom1NpF72lh3eWw2UA/G288X8U+N4/ljTx+Lbv3Zr3jxuVx3+Tnhk/jGPaf5IV8S2yq1EWz6URchzIf5f3z9cLm+entdi8d+j4PUs9ELlff8A16b1r/SKk+p1SqURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURX8YtT6WP7YLrzasDqa6afjnThYQ9PyefT7VY/yprkJT+F8wV8Y0UsYx+D85U/VT1PJREoiURKIlEVkubkARyA/UAA/hTGMXH1eXUStCNtRH7sdG/j9r0VfGCdXHNHU5w+Ovzqzsy2l849bQfip8ypHVYVKW0b7rDeYsd0e5XHvV0LdGAoy8xR5T/hBsPIlvQZVeYEDJh0QyOIaCqQR5+BTgAiTVT3sLLvNKYvI0/FZB0dfWwvd1/5nqO7eOnZH3arvg1JkbD/KWIk/i5Wt6v8AO9fiPRvDVoktyUoi5DmQ/wAv75+uFzfPT2uxeO/R8HqWeiFyvv8A69N61/pFSfU6pVKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIr/ALGhTFsO1gMAlEYpE2ghp6pzHOUfsGKYBD4hrHuTIOQlp9+r5x31KL96FPFSKnUoiURKIlESiKzvP6XTvNioAG0Xt1kcRH5POSQlEhKUdA8CEKIhxHUavLTxrZOHVIfkarSzopeNPXGPlcqG1XlRlnp92+utS3u5jbcQQxwLfeG8s2osBSmMU6bONjb4AqggqmBCArZpR1EFA5gAOXUQMXX/AN5e0FzyvlmO+3vbeT4XOi/0nZ8xzb7v90YOYkcQ/wAfaTs+ACT/AEfb866FVc51valEXIcyH+X98/XC5vnp7XYvHfo+D1LPRC5X3/16b1r/AEipPqdUqlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEWQqwkxSsm0yiICI29EqcPgWZIrFDj6QA+g/HWOr81vpj/nHfKVfliKWcQ/zbfkU2VKKaSiJREoiURKIrTNwyek/Arc34yHVT5dPDpPVTc2uvHm63hpw0q7tOH+byD8P5la+eH07D+B86t8q4lQVla7H9yEtXuobRJRQ6JCurrvq2wFdFwuQT3liLIVoJEKRsIKFWUUnAKmcfwaaglMp6gGrEnPa2N3ynzEQrUQxP2UH4u4hk6ejydvSRsG2iybybuBbcy8VIabZZGba/wCMglZ0fvtnQDtOxdLmuYS6GpRFyHMhCA39fAh4Dd9yiH2Bmno12Lx36Pg9Sz0QuV999em9a/0ipPqdUqlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEWRq2EfLW1bzflAnQg4lHlAdQL0mDcnKA6jqAcumtY2ujxXUjuuR3ylX/bDht429TG/IFHKgKOlESiJREoiURWsbiSFCQtdQA9czOTIYdR4lTXaGIGmugaCoP7tXXpsnu5R0Vb8hVs58fSRnpofmVuFXKrfV9HbFnhtvuJbJZAFHafmNzuG4HmZiUFhC6r4h7XFM/MqkHlFQmOVfiIigJ9CmHQo2FzSt/aeW+dj2GmKuX7f83E5/wAPk7O2m7er05cz+z69w8m0VyMDdn4cjWfB5W3squpXXKRdJkoi5DeQQAt/XuUPALvuUA+wE09CuxmO/R8HqWeiFyvvvr03rX+kVKFTilUoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJRE8aIsl7VEGzZu3DlAEEEUQAoaF0STKT1Q4aF9XhWMHO4nF3WarIjRwtDeoL718XpKIlESiJREoitf3Fp6LWktzfjEptPl08OkeKNza68ebreGnDSrp02dkw7W/8AzK28+NsR7Hf/ACq2mrnVuq43Z3NEtvdxtZuJR4rHEgdxuEJo8giCwrMSReTLYfGeJA3Io4FVqCHOXplMfUvqgI6VbWs4DdaPy1sGhxkxl02hpQ8UDxTbs21pt2Kv6Um9n1TjbgktDMhbur1cMzDXZt2U6F1hq5GLp2lEXIcyH+X98/XC5vnp7XYvHfo+D1LPRC5X3/16b1r/AEipPqdUqlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIorBNvOTcO0DiLqVj2wBxD8e7RS8QAw/degBGoNw7gge/qYT8AUWBvHMxvW4D41khrGqyClESiJREoiURKIrZNxv8A/h3/APsP/wDQ6ujTf+O/gf8AzK3NQf4n+F/8qtkq6FbiqZhaVTgsx4mnFUjrpQ2S7ElVUEzFKosnHXTFOzpJmN6pTqFREAEeACNUvNwm4wt5ADQvtZW16qxuHzqo4iUQZa1mIqGXEbqeB7SuuPXHtdSUoi5DmQ/y/vn64XN89Pa7F479HwepZ6IXK+/+vTetf6RUn1OqVSiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEU645a+cvq1UtNeSZZutOP+kT+d14CA8PL6/8AXqRyT+CwlP4BHw7PnU5j28d7EPwwfg2/MsgNY9V9JREoiURKIlESiK17cWoYXFpJaBykRmlAHjzcyp4wpgEddNABENOHw1dOmx5Mx7W//Mraz58qIdjvmVtVXOreU4Y8/L+xvrhbPz0yqSyP6Pn9S/0Spqw+vQ+tZ6QXXjrjouqCURchzIf5f3z9cLm+entdi8d+j4PUs9ELlff/AF6b1r/SKk+p1SqURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiq1hJp5nIEcrpqDFnJux+AOZmozAR+wZ2H26pGcfw45w++c0fHX5lVMO3ivmn70E/FT51e5VjK8koiURKIlESiJRFavuJUKMjbCXHmIyklB+DlUXalLoPw6pDrV16cB7uV3RxN+Q/bVs58/SRjsPyhW41cqt9fopjEMU5DCUxRAxTFESmKYo6gYohoICAhwGhAIodybto3rr8dacV/FsmTQOH8acnXHT08GxQDX7dcZKvO4ALrV3eNZ50kkn71ob6SdGc/1ax++08qppr4dP8Zryacdfla/FSj+sJ3mN/wAnL/dD4d2/4lyNch/l/fP1wub56e12Ox36Pg9Sz0QuT9/9em9a/wBIqT6nVKpREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiK4Xbyy6k7PyGmvlY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HJcrrz1xz70BAQeTUo6AQ8BBd8uqGmnDTQ3Csk2rO7to2fesaPgAWP7h3HcPf1vcfhJUEqOoKyb9mu3j3P3M9p0amVY5m153NcIggqgicCWjje9LsUMY7kBTFEicKJlCB+EUTASk9cS1iXnrdC05TZqU02wRs2gn8ZPFH0dPl7DuB2nZVZZ5F2pu+bGGiFaieR+wgfi4JZOno8jaN5GwbaLo5Vy1XUdKIuUNkP8AL++frhc3z09rsvjv0fB6lnohcab/AOvTetf6RUn1OqVSiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIq3YFi/OXkvIGLqSIinKxD6D6rl4ZNkmX4A5myq37lULUEvBZCMb3vHwDb8tFWcJHx3ZkO5jT8J2fJVXkVZiu1KIlESiJREoiUReKSdgwjn74eAM2Tp2PDXg3QUWHh6eBK9xM7yRsf3zgPhNF4kdwRuf1An4Asa4iJhExhExjCIiIiIiIiOoiIjxERGsmrHi/lEWbL3fuzzXT3HLNkSHURPZGMMq3URwkKAKNxc2+SyxUL1gFT1y3eKY9IQPocdfU5wHAPvLX3sfKyeI7RcXdvHTbto/vej1VduzZ10Wffdqsva+aUEu429pcSV2bKs7rp9bTZt8VVvr+SnkfxMsi4KHgV01KX7QnTA5x/drnBxwHewjwFdHOCYbnA+EJzXN/W4n73Xmcaa+PU05tdNOGnw+jSlLbrf8Sfzj8H41ypsh/l/fP1wub56e12Qx36Pg9Sz0QuOF/9em9a/wBIqT6nVKpREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEV2+32K8vb0xLnLynk5MjVMRDiZvGoalOA/ei4eKF+yWrQ1FLxXDIRua2vjcftAK6cFFwwPlO9zqeIfukqv9W8q6lESiJREoiURKIpHyW9BhYd0riOnUilWXo8ZI6ccAcdA4i60+H4ONT2MZ3mQib+HX+52/MpLIv4LGV34NPh2fOrAayErGSiLZc92QtA73c7uIv0E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3JuSLHx80O2KUzgjq87ni7cbmQKYihTLFVkgEgCUwCbTgNUzNZFmHw13lpKcFrbSzGu6kTHPNezyVUMTYOymVtsYyvHc3EcQpvrI8MFPhXWVh4VNw3jymakYQcY2bM4SFSDlQQYtESINCCT0JJoJlKUPuih6C6a8iJpy1zjXineSXO6STtPjr9lV0+ihDmtqOGFoAa3ooNgU7AAAGgcADgAB4AFSKnEoi5DmQ/y/vn64XN89Pa7F479HwepZ6IXK+/8Ar03rX+kVJ9TqlUoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIvdGMF5WRYRjUNXEg8bMkAHXTquViIkE2ngUpj6iPoCocsjYYnSv81rST4tq9xxulkbG3znED4VkeYMkI5izj2peRsxat2bcnD1UWyREUi8NA4EIFY1ke6WR0j/OcST4TtWQGMbGwRt81oAHiXqryvaURKIlESiJREoikbJct7Gsa4nYG5VVWB49DQdDdaTMVgUxP3yRXAn+wWp7GQ9/fxs6A6p/g7fmopLIy9zZSO6S2g8ez51YFWQlYyURZg+xBh0uYe5vgEjxmR7B4yLeGXpwiiRVSIlsy2JELaciU48odK/JOI48dBHUOOlYZ5/Zr8zcrciWO4Z7ru7dvb3jxxj+KbIsrclMSMtzFsQ8Vhtu8nd/9Nh4D/GFi6SFczV0ESiJRFyHMh/l/fP1wub56e12Lx36Pg9Sz0QuV9/9em9a/wBIqT6nVKpREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURVrwVAe1LuPKql1bW+0O4ARDUovnoKNWhDB4BokKygD6DJh9qh5647qz7oedIaeIbT8w8arGFg7y670+bGK+M7B858SvLqy1dyURKIlESiJREoiURW67hZgEouDgkzhzvXi0k4KA+sCLJLoIAf94qq7MIfGl8VXHp2GsslwdzWho8e0/BT41QM9LSJkA3k1Pi2fP8StTq7VbCURbdPurOFjOLq3WbinrMCkibfsrC1syApiJlzXBIuL5vlmmrwBMGoWzbxzl48/WKPDlDm0797LOcNpiNNxu2vkluXjq4GiKI+PjmHiPWtpvdow/Fc5PPvGxscduw/viZJB4uCL4VuVVpWttEoiURchzIf5f3z9cLm+entdi8d+j4PUs9ELlff/AF6b1r/SKk+p1SqURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEV7GE7f9jWYg9VT5Xc8ueSOIgIHBoAdBgQddAEhkSCqX4lqsfOXHfXpYPMjHD495+PZ4leGHg7m0Dz5zzXxdH2/GqvVR1VkoiURKIlESiJREoisdzLNe2L6kUyH5m8OmjDo8eHO2AyrzgAiAGK+XUL8IgUNavrCwdzYNJ855Lj493xAKzMvN3t64DzWAN+Df8ZKpXVWVMSiLo49gbBJsI9tLEUg+aGZ3Bm+au3OU4kdEUzGRup+lA2a4KobQ66T7HNqQzkphAoB1xKXmAAObmr7wufGd5n3kcbuK3sGR2rdvTGOOQdlJpJG+LxDf3kdhfzPy8tXvFJ7x77h38M8MZ7axMjPj8azRVhFZdX5MYpAExzFKUPExhAoB9kR0AKAE7BvStN68vtBh/q5n/8AiUf+7r33cn3rvgK88bOsfCuRRkP8v75+uFzfPT2uxGO/R8HqWeiFyxv/AK9N61/pFSfU6pVKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEUZt2GWuCcioVvzdSReoNhOUNRSRMYBcLiGg+q3blMceA8CjUC5mbbwPndua0n7Q8Z2KNbwmeZsLd7jT7Z8QWRds3RZtm7RuQE27VBJugmX5KaKCZUkiB8RCFAKxu5znuL3bXE1PhKv5rQxoa3zQKBfavi9JREoiURKIlESiKGTUojCxElLuPxMaxcvDl10E/l0jKFSL+/VMUCl+ERCosETp5mwt85zgPhUKaQQxOldua0n4FjjdOVnjlw7cHFRw6XWcrqCIiJ1l1DKqnERERETHMI1kljWsaGN2NAoPAFYDnF7i93nE1PjXwr0vKqBijG9xZjyjjnEloo+YunJ19Wpj+3URIY5TTV3zrGAjRUKT1uiR2/IJx4aEAREQAKp2XydthcVc5i8NLS1t5Jn/vY2F7vHQbFPYvH3GWyVvi7UVubmZkTP30jg0fGV1osd2NAYwx/Y2NLUbeTtbHlnWzY1tNNEw8rAWlCsoCGbaJETSDoR0emXQpSl4cAAOFchclf3GVyNxlLs8V3czPleet8ji9x8ZJXUGwsoMbYw461FLaCJkbB1NY0NaPEAFEZycJFkBJICqPFC6kIPyEicQBRQAEBHUQ4B6f82FBAZTU7GBRJ5xEKDa8qm7p46eqCo6XUWNqIhzG9UuviBCBoRMPiAACqk1jWCjQAFTXPc81cary16Xlco7If5f3z9cLm+entdb8d+j4PUs9ELmVf/XpvWv9IqT6nVKpREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiuJ2/wBu+Yk5S5l09Uo5H2axMIcBeOygd0oQdPloNAAo8fBf9y29Q3PDEy1bvceI+AbvhPyKv4K34pHXJ3NFB4Tv+AfKrratNXOlESiJREoiURKIlEVC89T/ALPthrBpH0XnnYdUAHiDCOMk4V10HUOd0ZEA9AgBgqvYC37y6M582MfGdnyVVFzc/d2whHnPPxDb8tFZ7V5K00oizye7r7cjZr7hMBkOUjSvLS232bcGUX6rggmZGu6QR+htgsTCUQOWRQlZ5aYa+BeaGMIjwApsAe8jqX8x8uZMdE7hvMnOyAU392D3kp8BawRu9YPCM2chMB+eNdsv5G1tcfC6Y13cZHdxDwhzi8erXQtOcqZDKHHQpCmOYfgKUBER+0AVznAJNBvW9xNBVUYeOlHrpd0p8pZQx9NdeUvgQgD8BCAAB8QVWWNDGho3BUZ7i9xceleavS8pRFyjsh/l/fP1wub56e11vx36Pg9Sz0QuZV/9em9a/wBIqT6nVKpREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJRF/QAREAABERHQADiIiPgAB6RGiLIHYFuBa1pxMSYoFdggDqRHTiMg7/AAzkoj910BMCRR4alTCseZC59ru3zDzK0HgGwfDv8avqxt/ZrVsX3VKnwnf8G7xKcqklOJREoiURKIlESiJRFYzl+4vpBer8qSgHZwwBDtRKPqiLUxxeKBp6phM+UUADceYhS/FV94a29nsW189/lHx7vip41ZeVuO/vHU8xnkjxb/jqqX1VVTUoi37vdsNsQ4f2STWc5qOM0uvc9erifaqrIlRdfm2x2vKWjZaCpTB5gE3M6pOyCJjaFVav0TkDlMBz89/eb1T+eddMwMDq2mKgDDQ1HfTBskp6tjO6YepzCDt2DeD3e9OfmrRz81M2l1kpi4bNvdREsjHXtd3jh1hwI6zsMSICMe/Ao6GFm6Ao66esKBwDj9ka1yi/GN/fD5VneT8W7wFUaqsqjpREoi5R2Q/y/vn64XN89Pa63479HwepZ6IXMq/+vTetf6RUn1OqVSiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiKPWr+U9u/wAX/wBfIr+OfxX+PIfxj/vP33xVL3f1WTf+Ldu37ju7VHtfrMe7z27928b1kYrG6v8ASiJREoiURKIlESiL8n+Qf5XyTfI+X4D8j998Hx0G9fDuWNFx/GF/x345X+Mfxj5Zvx//AH77799rWTm+aN27o3eJY7d5x37+nf418a9L4lEXVO7fH6hmzf8AJ39V/B/5Hf6w/wAm1u/62/v/AOu//aOeuTfMX9oGa/GfpW6/Gef+Of53zdlF0u0L/YnE/i/0bb/i/N/FN3fP21VdJz8aH+vHyv8A95/ivH+o/vKt+Dd9x/BVZn3/AHfj3KXqmFLpREoi/9k=';
            var width = doc.internal.pageSize.width;    
            var height = doc.internal.pageSize.height;
            doc.setFontType("bold");
            doc.setTextColor(255,0,0);
            doc.setFontSize(18);
            doc.addImage(imgData1, 'jpeg', 0, 0, width, height);
            doc.text(width-35, 20, meses[f.getMonth()] +" "+ f.getDate() + ", " + f.getFullYear(),"center");

            doc.addPage();

            var imgData2='data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAZAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgDGgJTAwERAAIRAQMRAf/EAM0AAQACAQQDAQAAAAAAAAAAAAAKCwYFBwgJAQMEAgEBAAEEAwEBAAAAAAAAAAAAAAkEBQcIAgMGCgEQAQAABQEIAQEEBQcFEQAAAAABAgMEBQYRltYHVwgJGRIhMVEiE0FhcTIUUiNjFTY3CvCBkUJkwdHhYnKiM0MkNDVFFkYXODkRAQABAgMECAEJAQwIBwAAAAACAQMEBQcRk1QGITES0tMWFwgTQVFhIjIzFDQJFXGBkaGx0UJSYnIkNfDh8SNjNjcYwaJDU4NERf/aAAwDAQACEQMRAD8A4t+vTzQdGO7Xe/McXJNvUbRLjsn3cfDR8eRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS7569PNB0Y7td78xxceo2iXHZPu4+GeRNXeEzTeS76ycRkpBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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';
            doc.addImage(imgData2, 'jpeg', 0, 0, width, height);
            var canvas=document.getElementById("myChart");

            var imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'png', 30, height/2-35, 150, 100);

            doc.setFontSize(18);
            doc.setTextColor(255,0,0);
            doc.setFontType("bold");
            doc.text(15, 20, API.LMSGetValue("cmi.core.student_name"));

            doc.setFontSize(12);
            doc.setTextColor(0,0,0);
            doc.setFontType("normal");
            doc.text(15, 30, 'El presente reporte pretende retroalimentar respecto de cuatro estilos básicos de actuación');
            doc.text(15, 35, 'en los que alguien puede encontrarse al ejercer liderazgo, siendo estos:');
            doc.setFontType("bold");
            doc.text(152, 35, 'Dar y Apoyar, Tomar y');
            doc.text(15, 40, 'Controlar, Mantener y Conservar, Adaptar y Negociar,');
            doc.setFontType("normal");
            doc.text(125, 40, 'y que a su vez pueden tener un uso o');
            doc.text(15, 45, 'comportamiento productivo o excesivo en cada estilo, cada uno de ellos necesario para una\nadecuada interacción con colaboradores, superiores y/o pares.\n\nTodo líder tiene algo de estos cuatro estilos, pero es común que exista preponderancia en\nalguno de ellos o eventualmente en más de uno, no hay nadie que tenga un estilo\ntotalmente puro respecto de los mismos, sin embargo lo importante es cuidar que se esté\nhaciendo un uso más productivo que excesivo ya que de no ser así es conveniente trabajar\nen ese aspecto para mejorar el desempeño.\n\nEn tu caso, el siguiente gráfico muestra cómo están tus estilos y donde tienes\npreponderancia, es recomendable que con los documentos de explicación/apoyo realices un\nanálisis de él para que puedas sacar el máximo provecho de esta información y de cómo\nexplotar tu perfil.');



          //  doc.text(15, 30, 'El presente reporte pretende retroalimentar respecto de cuatro estilos básicos de actuación\nen los que alguien puede encontrarse al ejercer liderazgo, siendo estos: Dar y Apoyar, Tomar y\nControlar, Mantener y Conservar, Adaptar y Negociar, y que a su vez pueden tener un uso o\ncomportamiento productivo o excesivo en cada estilo, cada uno de ellos necesario para una\nadecuada interacción con colaboradores, superiores y/o pares.\n\nTodo líder tiene algo de estos cuatro estilos, pero es común que exista preponderancia en\nalguno de ellos o eventualmente en más de uno, no hay nadie que tenga un estilo\ntotalmente puro respecto de los mismos, sin embargo lo importante es cuidar que se esté\nhaciendo un uso más productivo que excesivo ya que de no ser así es conveniente trabajar\nen ese aspecto para mejorar el desempeño.\n\nEn tu caso, el siguiente gráfico muestra cómo están tus estilos y donde tienes\npreponderancia, es recomendable que con los documentos de explicación/apoyo realices un\nanálisis de él para que puedas sacar el máximo provecho de esta información y de cómo\nexplotar tu perfil.');

            text=_doText();
            if (text[8]=='1'){

                   doc.setFontType("normal");
                   doc.text(15, 230,text[0]);

                  if (text[1]=="DAR Y APOYAR"){

                    doc.setFontType("bold");
                    doc.text(94, 230,text[1],'center');

                    doc.setFontType("normal");
                    doc.text(112, 230,text[2]);

                  }
                  else if(text[1]=="TOMAR Y CONTROLAR"){
                    doc.setFontType("bold");
                    doc.text(102, 230,text[1],'center');

                    doc.setFontType("normal");
                    doc.text(128, 230,text[2]);

                  }
                  else if(text[1]=="MANTENER Y CONSERVAR"){

                    doc.setFontType("bold");
                    doc.text(106, 230,text[1],'center');

                    doc.setFontType("normal");
                    doc.text(136, 230,text[2]);

                  }
                  else if(text[1]=="ADAPTAR Y NEGOCIAR"){
                    doc.setFontType("bold");
                    doc.text(103, 230,text[1],'center');

                    doc.setFontType("normal");
                    doc.text(130, 230,text[2]);
              }
           

              doc.setFontType("normal");
              doc.text(15, 235,text[3]);

              doc.setFontType("normal");
              doc.text(15, 240,text[4]);


              if (text[5]=="DAR Y APOYAR"){

                doc.setFontType("bold");
                doc.text(109, 240,text[5],'center');

                doc.setFontType("normal");
                doc.text(127, 240,text[6]);

              }
              else if(text[5]=="TOMAR Y CONTROLAR"){
                doc.setFontType("bold");
                doc.text(117, 240,text[5],'center');

                doc.setFontType("normal");
                doc.text(143, 240,text[6]);
              }
              else if(text[5]=="MANTENER Y CONSERVAR"){
             
                doc.setFontType("bold");
                doc.text(121, 240,text[5],'center');

                doc.setFontType("normal");
                doc.text(152, 240,text[6]);
    

              }
              else if(text[5]=="ADAPTAR Y NEGOCIAR"){

                doc.setFontType("bold");
                doc.text(117, 240,text[5],'center');

                doc.setFontType("normal");
                doc.text(144, 240,text[6]);
              }
           
              doc.setFontType("normal");
              doc.text(15, 245,text[7]);


            }else{
            


              doc.setFontType("normal");
              doc.text(15, 230,text[0]);

              if (text[1]=="DAR Y APOYAR"){

                doc.setFontType("bold");
                doc.text(94, 230,text[1],'center');

                doc.setFontType("normal");
                doc.text(112, 230,text[2]);

              }
              else if(text[1]=="TOMAR Y CONTROLAR"){
                doc.setFontType("bold");
                doc.text(102, 230,text[1],'center');

                doc.setFontType("normal");
                doc.text(128, 230,text[2]);

              }
              else if(text[1]=="MANTENER Y CONSERVAR"){

                doc.setFontType("bold");
                doc.text(106, 230,text[1],'center');

                doc.setFontType("normal");
                doc.text(136, 230,text[2]);

              }
              else if(text[1]=="ADAPTAR Y NEGOCIAR"){
                doc.setFontType("bold");
                doc.text(103, 230,text[1],'center');

                doc.setFontType("normal");
                doc.text(130, 230,text[2]);
              }
           

              doc.setFontType("normal");
              doc.text(15, 235,text[3]);



              if (text[4]=="DAR Y APOYAR"){

                doc.setFontType("bold");
                doc.text(142, 235,text[4],'center');

                doc.setFontType("normal");
                doc.text(160, 235,text[5]);

              }
              else if(text[4]=="TOMAR Y CONTROLAR"){
                doc.setFontType("bold");
                doc.text(149, 235,text[4],'center');

                doc.setFontType("normal");
                doc.text(175, 235,text[5]);
              }
              else if(text[4]=="MANTENER Y CONSERVAR"){
             
                doc.setFontType("bold");
                doc.text(153, 235,text[4],'center');

                doc.setFontType("normal");
                doc.text(183, 235,text[5]);
    

              }
              else if(text[4]=="ADAPTAR Y NEGOCIAR"){

                doc.setFontType("bold");
                doc.text(150, 235,text[4],'center');

                doc.setFontType("normal");
                doc.text(177, 235,text[5]);
              }


              doc.setFontType("normal");
              doc.text(15, 240,text[6]);
           
              doc.setFontType("normal");
              doc.text(15, 245,text[7]);



            }


          //  doc.text(15, 230, text);



            doc.setFontSize(10);
            doc.setTextColor(0,74,151);
            doc.setFontType("italic");

            doc.text(27, height-30, 'El diagnóstico aquí descrito, debe ser tomado como una retroalimentación positiva y constructiva, producto de la\n   observación constante de las propias competencias prácticas del participante. Su objetivo es proporcionarle al\n          participante una visión externa de aquello que le podría ayudar a mejorar estas competencias en el futuro.');
            doc.text(width-31, height-10, 'CONFIDENCIAL PERSONAL',"center");

            doc.save("resultados.pdf");


}


function _doText(){



        var prodFinal="";
        var excFinal="";
        var textoFinal="";
        var txt1;
        var txt2;
        var txt3;
        var txt4;
        var txt5;
        var txt6;
        var txt7;
        var txt8;
        var txt9;
        var txt10;
        var arrTxt=new Array();



        var arrProd=new Array();
        var maxProd="";
        var indexProd="";
        arrProd[0]= daap_productivo;
        arrProd[1]=tmct_productivo;
        arrProd[2]=mtcs_productivo;
        arrProd[3]=adng_productivo;
        maxProd=Math.max.apply(Math,arrProd);
        indexProd = arrProd.indexOf(parseInt(maxProd));



        var arrExc=new Array();
        var maxExc="";
        var indexExc="";
        arrExc[0]=daap_excesivo;
        arrExc[1]=tmct_excesivo;
        arrExc[2]=daap_excesivo;
        arrExc[3]=adng_excesivo;
        maxExc=Math.max.apply(Math,arrExc);
        indexExc = arrExc.indexOf(parseInt(maxExc));


        if (maxProd>=maxExc){
          
            if (indexProd==indexExc){
               arrExc[indexExc]=0;
             maxExc= Math.max.apply(Math,arrExc);
             indexExc = arrExc.indexOf(parseInt(maxExc));
            }

            switch(indexProd) {

                case 0:
                    prodFinal="DAR Y APOYAR";
                    break;
                case 1:
                    prodFinal="TOMAR Y CONTROLAR";
                    break;
                case 2:
                    prodFinal="MANTENER Y CONSERVAR";
                    break;
                case 3:
                    prodFinal="ADAPTAR Y NEGOCIAR";
                    break;
                default:
                      break;
             }

            switch(indexExc) {
                case 0:
                    excFinal="DAR Y APOYAR";
                    break;
                case 1:
                    excFinal="TOMAR Y CONTROLAR";
                    break;
                case 2:
                    excFinal="MANTENER Y CONSERVAR";
                    break;
                case 3:
                    excFinal="ADAPTAR Y NEGOCIAR";
                    break;
                default:
                      break;
             }

           //  textoFinal="Tu estilo preponderante se da en "+prodFinal+" y lo usas de manera productiva, lo\nque te favorece en la interrelación con otros; en el estilo "+excFinal+" haces un\nuso excesivo, por lo que debes trabajarlo modificándolo hacia lo productivo para lograr un\nmejor desempeño en el ejercicio de tu liderazgo. !!! FELICIDADES ¡¡¡";
             txt1="Tu estilo preponderante se da en";
             txt2=prodFinal;
             txt3="y lo usas de manera productiva,";
             txt4="lo que te favorece en la interrelación con otros; en el estilo";
             txt5=excFinal;
             txt6="haces un";
             txt7="uso excesivo, por lo que debes trabajarlo modificándolo hacia lo productivo para lograr un";
             txt8="mejor desempeño en el ejercicio de tu liderazgo. !!! FELICIDADES ¡¡¡";
             txt9="0";



        }
        else if (maxExc>maxProd){

        
         if (indexExc==indexProd){
           arrProd[indexProd]=0;
           maxProd= Math.max.apply(Math,arrProd);
           indexProd = arrProd.indexOf(parseInt(maxProd));
         }
  
             switch(indexProd) {
                case 0:
                    prodFinal="DAR Y APOYAR";
                    break;
                case 1:
                    prodFinal="TOMAR Y CONTROLAR";
                    break;
                case 2:
                    prodFinal="MANTENER Y CONSERVAR";
                    break;
                case 3:
                    prodFinal="ADAPTAR Y NEGOCIAR";
                    break;
                default:
                      break;
             }

            switch(indexExc) {
                case 0:
                    excFinal="DAR Y APOYAR";
                    break;
                case 1:
                    excFinal="TOMAR Y CONTROLAR";
                    break;
                case 2:
                    excFinal="MANTENER Y CONSERVAR";
                    break;
                case 3:
                    excFinal="ADAPTAR Y NEGOCIAR";
                    break;
                default:
                      break;
             }


             //textoFinal="Tu estilo preponderante se da en "+excFinal+" y lo usas de manera excesiva, lo\nque te limita en la interrelación con otros, por lo que es recomendable trabajarlo para\norientarlo hacia lo productivo; en el estilo "+prodFinal+" haces un uso productivo, por lo\nque debes aprovecharlo para lograr un mejor desempeño en el ejercicio de tu liderazgo.";
             txt1="Tu estilo preponderante se da en";
             txt2=excFinal;
             txt3="y lo usas de manera excesiva, ";
             txt4="lo que te limita en la interrelación con otros, por lo que es recomendable trabajarlo para";
             txt5="orientarlo hacia lo productivo; en el estilo";
             txt6=prodFinal;
             txt7="haces un uso productivo,";
             txt8="por lo que debes aprovecharlo para lograr un mejor desempeño en el ejercicio de tu liderazgo.";
             txt9="1";
        }

        arrTxt[0]=txt1;
        arrTxt[1]=txt2;
        arrTxt[2]=txt3;
        arrTxt[3]=txt4;
        arrTxt[4]=txt5;
        arrTxt[5]=txt6;
        arrTxt[6]=txt7;
        arrTxt[7]=txt8;
        arrTxt[8]=txt9;


        return arrTxt;
 
 
 
 


}








new CURSO_API();
CURSO_API.prototype.init = _init;

CURSO_API.prototype.makePdf = _makePdf;
CURSO_API.prototype.paintChart = _paintChart;
CURSO_API.prototype.prepareChart = _prepareChart;

CURSO_API.prototype.doText = _doText;


CURSO_API.prototype.recuperarAvatar = _recuperarAvatar;
CURSO_API.prototype.replaceMyComma = _replaceMyComma;
CURSO_API.prototype.guardarVariables = _guardarVariables;

CURSO_API.prototype.recuperarVariable = _recuperarVariable;
CURSO_API.prototype.getApi = _getApi;
CURSO_API.prototype.calcularPaginasTotales = _calcularPaginasTotales;
CURSO_API.prototype.setPages = _setPages;
CURSO_API.prototype.finalizarEjercicio = _finalizarEjercicio;

CURSO_API.prototype.cerrar = _cerrar;

CURSO_API.prototype.crearCadenaDeNavegacion = _crearCadenaDeNavegacion;
CURSO_API.prototype.iniciarCadenaDeNavegacion = _iniciarCadenaDeNavegacion;
CURSO_API.prototype.iniciarPagina = _iniciarPagina;
CURSO_API.prototype.iniciarApartado = _iniciarApartado;
CURSO_API.prototype.iniciarTema = _iniciarTema;
CURSO_API.prototype.iniciarCapitulo = _iniciarCapitulo;
CURSO_API.prototype.iniciarCurso = _iniciarCurso;
CURSO_API.prototype.finalizarPagina = _finalizarPagina;
CURSO_API.prototype.finalizarApartado = _finalizarApartado;
CURSO_API.prototype.finalizarTema = _finalizarTema;
CURSO_API.prototype.finalizarCapitulo = _finalizarCapitulo;
CURSO_API.prototype.finalizarCurso = _finalizarCurso;
CURSO_API.prototype.paginaPrimera = _paginaPrimera;
CURSO_API.prototype.apartadoPrimero = _apartadoPrimero;
CURSO_API.prototype.temaPrimero = _temaPrimero;
CURSO_API.prototype.capituloPrimero = _capituloPrimero;
CURSO_API.prototype.paginaUltima = _paginaUltima;
CURSO_API.prototype.apartadoUltimo = _apartadoUltimo;
CURSO_API.prototype.temaUltimo = _temaUltimo;
CURSO_API.prototype.capituloUltimo = _capituloUltimo;
CURSO_API.prototype.paginaSiguiente = _paginaSiguiente;
CURSO_API.prototype.apartadoSiguiente = _apartadoSiguiente;
CURSO_API.prototype.temaSiguiente = _temaSiguiente;
CURSO_API.prototype.capituloSiguiente = _capituloSiguiente;
CURSO_API.prototype.paginaAnterior = _paginaAnterior;
CURSO_API.prototype.apartadoAnterior = _apartadoAnterior;
CURSO_API.prototype.temaAnterior = _temaAnterior;
CURSO_API.prototype.capituloAnterior = _capituloAnterior;
CURSO_API.prototype.paginaOrden = _paginaOrden;
CURSO_API.prototype.apartadoOrden = _apartadoOrden;
CURSO_API.prototype.temaOrden = _temaOrden;
CURSO_API.prototype.capituloOrden = _capituloOrden;
CURSO_API.prototype.paginaTotales = _paginaTotales;
CURSO_API.prototype.apartadoTotales = _apartadoTotales;
CURSO_API.prototype.temaTotales = _temaTotales;
CURSO_API.prototype.capituloTotales = _capituloTotales;
CURSO_API.prototype.paginaNoCompletada = _paginaNoCompletada;
CURSO_API.prototype.apartadoNoCompletado = _apartadoNoCompletado;
CURSO_API.prototype.temaNoCompletado = _temaNoCompletado;
CURSO_API.prototype.capituloNoCompletado = _capituloNoCompletado;
CURSO_API.prototype.paginaCompletada = _paginaCompletada;
CURSO_API.prototype.apartadoCompletado = _apartadoCompletado;
CURSO_API.prototype.temaCompletado = _temaCompletado;
CURSO_API.prototype.capituloCompletado = _capituloCompletado;
CURSO_API.prototype.paginaEstado = _paginaEstado;
CURSO_API.prototype.apartadoEstado = _apartadoEstado;
CURSO_API.prototype.temaEstado = _temaEstado;
CURSO_API.prototype.capituloEstado = _capituloEstado;
CURSO_API.prototype.cursoEstado = _cursoEstado;
CURSO_API.prototype.estado = _estado;
CURSO_API.prototype.paginaPuntuacion = _paginaPuntuacion;
CURSO_API.prototype.apartadoPuntuacion = _apartadoPuntuacion;
CURSO_API.prototype.temaPuntuacion = _temaPuntuacion;
CURSO_API.prototype.capituloPuntuacion = _capituloPuntuacion;
CURSO_API.prototype.cursoPuntuacion = _cursoPuntuacion;
CURSO_API.prototype.puntuacion = _puntuacion;
CURSO_API.prototype.puntuacionActual = _puntuacionActual;
CURSO_API.prototype.apartadoPractico = _apartadoPractico;
CURSO_API.prototype.guardarInfoAdicional = _guardarInfoAdicional;
//CURSO_API.prototype.guardarInfoAdicionalTest = _guardarInfoAdicionalTest;
CURSO_API.prototype.recuperarInfoAdicional = _recuperarInfoAdicional;
//CURSO_API.prototype.recuperarInfoAdicionalTest = _recuperarInfoAdicionalTest;
CURSO_API.prototype.guardarRespuestaPregunta = _guardarRespuestaPregunta;
CURSO_API.prototype.recuperarRespuestaPregunta = _recuperarRespuestaPregunta;
CURSO_API.prototype.recuperarCodigoPregunta = _recuperarCodigoPregunta;
CURSO_API.prototype.guardarEstadoEvaluacion = _guardarEstadoEvaluacion;
CURSO_API.prototype.recuperarEstadoEvaluacion = _recuperarEstadoEvaluacion;
CURSO_API.prototype.resetEvaluacion = _resetEvaluacion;
CURSO_API.prototype.primeraRespuestaNoCompletadaEvaluacion = _primeraRespuestaNoCompletadaEvaluacion;
CURSO_API.prototype.Commit = _Commit;
CURSO_API.prototype.Finish = _Finish;
CURSO_API.prototype.Initialize = _Initialize;
CURSO_API.prototype.ActualizarDatos = _ActualizarDatos;