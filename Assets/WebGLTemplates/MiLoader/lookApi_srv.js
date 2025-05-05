var esCorrecte = 0;  		
var n = 1; 	   			  	  	  

/*******************************************************************************
**
** Function findAPI(win)
** Inputs:  win - a Window Object
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API in parent and opener windows
**
*******************************************************************************/


var findAPITries = 0;
 
function findAPI(win)
{
   // Check to see if the window (win) contains the API
   // if the window (win) does not contain the API and
   // the window (win) has a parent window and the parent window
   // is not the same as the window (win)
   while ( (win.API == null) && (win.parent != null) && (win.parent != win) )
   {
      // increment the number of findAPITries
      findAPITries++;
 
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (findAPITries > 7)
      {
         //alert("Error finding API -- too deeply nested.");
         return null;
      }
 
      // set the variable that represents the window being
      // being searched to be the parent of the current window
      // then search for the API again
      win = win.parent;
   }
   return win.API;
}

/*******************************************************************************
**
** Function getAPI()
** Inputs:  none
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API, first in the current window's 
** frame hierarchy and then, if necessary, in the current window's opener window
** hierarchy (if there is an opener window).
**
*******************************************************************************/
function getAPI()
{
   // start by looking for the API in the current window
   var theAPI = findAPI(window);
 
   // if the API is null (could not be found in the current window)
   // and the current window has an opener window
   if ( (theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined") )
   {
      // try to find the API in the current window’s opener
      theAPI = findAPI(window.opener);
   }
   // if the API has not been found
   if (theAPI == null)
   {
      // Alert the user that the API Adapter could not be found
      //alert("Unable to find an API adapter");
   }
   return theAPI;
}
 


/*******************************************************************************
**
** Function getTmpAPI()
** Inputs:  none
** Return:  If an tmpAPI object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API, first in the current window's 
** frame hierarchy and then, if necessary, in the current window's opener window
** hierarchy (if there is an opener window).
**
*******************************************************************************/
function getTmpAPI()
{
   // start by looking for the API in the current window
   var theTmpAPI = findTmpAPI(window);
 
   // if the API is null (could not be found in the current window)
   // and the current window has an opener window
   if ( (theTmpAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined") )
   {
      // try to find the API in the current window’s opener
      theTmpAPI = findTmpAPI(window.opener);
   }
   // if the API has not been found
   if (theTmpAPI == null)
   {
      // Alert the user that the API Adapter could not be found
      //alert("Unable to find an API adapter");
   }
   return theTmpAPI;
}
 
/******************************************************************************************/ 
/******************************************************************************************/ 
/******************************************************************************************/ 


var findTmpAPITries = 0;
function findTmpAPI(win)
{
   // Check to see if the window (win) contains the CURSO_API
   // if the window (win) does not contain the CURSO_API and
   // the window (win) has a parent window and the parent window
   // is not the same as the window (win)
   while ( (win.tmpAPI == null) && (win.parent != null) && (win.parent != win) )
   {
      // increment the number of findAPITries
      findTmpAPITries++;
 
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (findTmpAPITries > 10)
      {
         //alert("Error finding CURSO_API -- too deeply nested.");
         return null;
      }
 
      // set the variable that represents the window being
      // being searched to be the parent of the current window
      // then search for the API again
      win = win.parent;
   }
   return win.tmpAPI;
}


//********************************************* Buscar CURSO *******************************
var findCURSO_APITries = 0;
function findCURSO_API(win)
{
   // Check to see if the window (win) contains the CURSO_API
   // if the window (win) does not contain the CURSO_API and
   // the window (win) has a parent window and the parent window
   // is not the same as the window (win)
   while ( (win.CURSO == null) && (win.parent != null) && (win.parent != win) )
   {
      // increment the number of findAPITries
      findCURSO_APITries++;
 
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (findCURSO_APITries > 10)
      {
         //alert("Error finding CURSO_API -- too deeply nested.");
         return null;
      }
 
      // set the variable that represents the window being
      // being searched to be the parent of the current window
      // then search for the API again
      win = win.parent;
   }
   return win.CURSO;
}

/*******************************************************************************
**
** Function getAPI()
** Inputs:  none
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API, first in the current window's 
** frame hierarchy and then, if necessary, in the current window's opener window
** hierarchy (if there is an opener window).
**
*******************************************************************************/
function getCURSO_API()
{
   // start by looking for the API in the current window
   var theCURSO_API = findCURSO_API(window);
 
   // if the API is null (could not be found in the current window)
   // and the current window has an opener window
   if ( (theCURSO_API == null) && (window.opener != null) && (typeof(window.opener) != "undefined") )
   {
      // try to find the API in the current window’s opener
      theCURSO_API = findCURSO_API(window.opener);
   }
   // if the API has not been found
   if (theCURSO_API == null)
   {
      // Alert the user that the API Adapter could not be found
      //alert("Unable to find an API adapter");
   }
   return theCURSO_API;
}


/*******************************************************************************
**
** Function crearCurso()
** Inputs:  none
** Description:
** Create a course, and all the structure of this course: cookies, vendor and location
**
*******************************************************************************/

function createCourse()
{
        // Se comprueba si YA existe un LMS. En caso de que no, se crea la api i la cookie.
        var temp = new String("");	
	API = getAPI();
	if (API == null) 
	{ 
	     //alert("No se ha encontrado la API de comunicación con la plataforma");	 
	     return 0;  	     	     				
	}	
	else
	{	     	
	     makeCookie();
	     tmpAPI = new COOKIE_API();    		     
	     // Se crea el objeto CURSO que trabaja con el objeto tmpAPI                
       CURSO = new CURSO_API(tmpAPI,API,estructura_curso);
       CURSO.Initialize(""); // LMSInitialize de cookie_api external_api
       CURSO.init(); 		
       return 1;
	}			
  
}


function cargarCurso()
{
	 
	 //alert(esCorrecte + " " + n);    
   if (esCorrecte == 1)
   {
   	    
        setTimeout('fcent.location = "basenoie.htm";',1000);
        
   }
   else
   {
	      n++;	      	  
	      if (n < 10 )
	      {
	      	
	      	setTimeout('esCorrecte = createCourse();cargarCurso();',1000);	        
	      }  
	      	
	      if (n == 10)
	      {
	        alert("No se ha podido cargar la API de Servidor, versión server");	
           /**        
	        makeCookie();
	        API = new COOKIE_API(); 
	        tmpAPI = API;
	        // Se crea el objeto CURSO que trabaja con el objeto tmpAPI                
          CURSO = new CURSO_API(tmpAPI,API,estructura_curso);
          CURSO.Initialize(""); // LMSInitialize de cookie_api external_api
          CURSO.init();    
          //CURSO.initEvaluacion();       
          setTimeout('fcent.location = "basenoie.htm";',50);
          **/
	      }  
   }
}   

/*******************************************************************************
**
** Function initializeAPI()
** Description:
** initialize CURSO and aicc_api
**
*******************************************************************************/
function initAPI()
{   
   API = getAPI();
   CURSO = getCURSO_API();
   tmpAPI = getTmpAPI();
}


