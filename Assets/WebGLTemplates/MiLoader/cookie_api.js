var seguimiento = null;
var tmInit = null; //tiempo inicial de conexión


/********************************************/
/* Guadar tiempo total de conexión          */
/********************************************/
function _sesionTiempo()
{ 
     var temp = new String("");	 
     var tmFin = new Date();
     	 
     // Diferencia de hora entre el principio de la sesión y el final de la sesión
     var tmDiff = Math.floor((tmFin.getTime()-tmInit.getTime())/1000);
     var arrAcumulat = new Array("00","00","00");     
     tmDiff = parseInt(tmDiff)+parseInt(arrAcumulat[0])*3600+parseInt(arrAcumulat[1])*60+parseInt(arrAcumulat[2]);
     var numH = Math.floor(tmDiff/3600);
     tmDiff = tmDiff - numH*3600;
     var numM = Math.floor(tmDiff/60);
     tmDiff = tmDiff - numM*60;
     if (numH<10) numH = "0"+numH;
     if (numM<10) numM = "0"+numM;
     if (tmDiff<10) tmDiff = "0"+tmDiff;
     strTime = numH+":"+numM+":"+tmDiff;	 
     return strTime;	 
}

/********************************************/
/* Guadar tiempo total de conexión          */
/********************************************/
function _guardarTiempo()
{ 
     var temp = new String("");	 
	 // Fecha de desconexión
	 var tmFin = new Date();
	 
	 // Diferencia de hora entre el principio de la sesión y el final de la sesión
	 var tmDiff = Math.floor((tmFin.getTime()-tmInit.getTime())/1000);	
	 var arrAcumulat = new Array("00","00","00");
	 var acumulat = _LMSGetValue("cmi.core.total_time");
	 if (typeof acumulat!="undefined") 
	 {
		arrAcumulat = acumulat.split(":");
		if (arrAcumulat.length<3) 
		{
			arrAcumulat[0]="00";
			arrAcumulat[1]="00";
			arrAcumulat[2]="00";
		}
	 }
	 tmDiff = parseInt(tmDiff)+parseInt(arrAcumulat[0])*3600+parseInt(arrAcumulat[1])*60+parseInt(arrAcumulat[2]);
	 var numH = Math.floor(tmDiff/3600);
	 tmDiff = tmDiff - numH*3600;
	 var numM = Math.floor(tmDiff/60);
	 tmDiff = tmDiff - numM*60;
	 if (numH<10) numH = "0"+numH;
	 if (numM<10) numM = "0"+numM;
	 if (tmDiff<10) tmDiff = "0"+tmDiff;
	 strTime = numH+":"+numM+":"+tmDiff;	 
	 seguimiento.totalTime = strTime;	 
}

/* Función encargada de crear una cookie donde se guardara o recuperará la información de seguimiento*/
function makeCookie(path)
{
	   
   //Información del alumno del curso 
   seguimiento = new Cookie(document,"track",240,path);
   if (!seguimiento.load())    
   { 
          seguimiento.student_id = 0;
	  seguimiento.student_name = "Pepito Garcia Reyes";
	  seguimiento.lesson_location = "";
	  seguimiento.suspend_data = "";
	  seguimiento.lesson_status = "not attempted";
	  seguimiento.totalTime = "00:00:00";
	  seguimiento.score = 0;
	  seguimiento.mastery_score = 0;	   
	  seguimiento.store();
   }
}

// Constructor de la clase COOKIE_API 
function COOKIE_API(path)
{		
	  makeCookie(path);	  
}

function _LMSGetValue(parameter)
{
    par = new String (parameter);	
    switch ( parameter)
    {
         case "cmi.core.student_id":
	 {
	     return seguimiento.student_id; 
	     break;
	 }
		 
	 case "cmi.core.student_name":
	 {
	     return seguimiento.student_name; 
	     break;
	 }
		 
	 case "cmi.core.lesson_location":
	 {
	     return seguimiento.lesson_location; 
	     break;
	
	 }
	 
	 case "cmi.suspend_data":
	 {
	     return seguimiento.suspend_data; 
	     break;
	
	 }
	 case "cmi.core.total_time":
	 {
	     return seguimiento.totalTime; 
	     break;	 		 			 		 	
	 }
	 
	 case "cmi.launch_data":
	 {
	     return launch_data;
	     break;
	
	 }  			 
	 case "cmi.core.lesson_status":
	 {
	     return seguimiento.lesson_status; 
	     break;
	 }		 		 
	 case "cmi.core.score.raw":
	 {
	     return seguimiento.score; 
	     break;
	 }  
	 case "cmi.student_data.mastery_score":
	 {
	     return seguimiento.mastery_score; 
	     break;
	 }  
		 
	 default: 
	 {
	     //alert("Parametro desconocido");
	 }
    }   	
}

function _LMSSetValue (parameter,value)
{
    par = new String (parameter); 
 
    // Parametro a actualizar;
	
    switch ( parameter)
    {
	case "cmi.core.student_id":
	{
	     seguimiento.student_id = value; 			 
	     seguimiento.store();
	     return true;
	     break;
	}
		 
	case "cmi.core.student_name":
	{
	     seguimiento.student_name = value; 			 
	     seguimiento.store();
	     return true;
	     break;
	}
		 
	case "cmi.core.lesson_location":
	{
	     seguimiento.lesson_location = value; 			 			 
	     seguimiento.store();			 
	     return true;
	     break;
	
        }
        
        case "cmi.suspend_data":
	{
	     seguimiento.suspend_data = value; 			 			 
	     seguimiento.store();			 
	     return true;
	     break;
	
        }
          
	case "cmi.core.lesson_status":
	{
	     seguimiento.lesson_status = value; 			 
	     seguimiento.store();
	     return true;
	     break;
	}
	 		 
	case "cmi.core.score.raw":
	{
	     seguimiento.score = value; 			 
	     seguimiento.store();
	     return true;
	     break;
	} 
	
	case "cmi.core.session_time":
	{
	     _guardarTiempo();
	     return true;
	     break;		         	
	} 
		 
	case "cmi.student_data.mastery_score":
	{
	     seguimiento.mastery_score = value; 
	     seguimiento.store();
	     return true;
	     break;
	}
	
	default: 
	{				
	     //alert("Parámetro Desconocido");
	}	
    }     
}

function _LMSCommit(parameter)
{   		      
   return "true";
}

function _LMSInitialize(parameter)
{
         tmInit = new Date();    
	 if (_LMSGetValue("cmi.core.lesson_status") == "not attempted")
	 {
	 		seguimiento.lesson_status = "incomplete"; 			 			
	 		seguimiento.store();				
			return "true";
	 }//end if 	 
}

function _LMSFinish (parameter)
{
  //CERRAR LA COMUNICACIÓN Y ASEGURARSE QUE SE GRABARON TODOS LOS DATOS 
  return "true";
}

function _LMSGetErrorString (errornumber)
{
   return "Succeful";
}

function _LMSGetLastError (parameter)
{
   return 0; 
}

new COOKIE_API();
COOKIE_API.prototype.LMSGetValue = _LMSGetValue;
COOKIE_API.prototype.LMSSetValue = _LMSSetValue;
COOKIE_API.prototype.LMSCommit = _LMSCommit;
COOKIE_API.prototype.LMSInitialize = _LMSInitialize;
COOKIE_API.prototype.LMSFinish = _LMSFinish;
COOKIE_API.prototype.LMSGetErrorString = _LMSGetErrorString;
COOKIE_API.prototype.LMSGetLastError = _LMSGetLastError;
COOKIE_API.prototype.guardarTiempo = _guardarTiempo;
COOKIE_API.prototype.sesionTiempo = _sesionTiempo;