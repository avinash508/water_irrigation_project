////////////////////////////////////////////////////////////////////////////////////////////////////
// REVISION HISTORY
// 22-08-13 - Initial Release v01
// 29-09-13 - release v02
// 14-10-13 - Release v03
// 27-10-13 - Release v05
//
////////////////////////////////////////////////////////////////////////////////////////////////////


//*************************
// SERVICE
//*************************
var service_run  = "NO";
var service_ret  = 0;
var service_json = 0;
var service_running = 0;
var state_log_api = 0;
var elapsed_time = 0;
var start_time = 0;
var reqid;
var API_WATCH_DOG = 60000;	
var date;
var api_blocked_flag = 0;

//*****************************************************************************************************************
// Function: NEAR_API_JAVA_SCRIPT
//*****************************************************************************************************************		
function NearAPIjs( service, device, channel, value, request_id )
{
	
	if( api_blocked_flag == 0 )
	{
		api_blocked_flag = 1;
		service_ret = "WAIT";
	
	
		if( service_json == "DOWN" )
		{
			service_run = "NO";
			return ( "DOWN" );		
		}
	
		//**************************************************
		// 	INICIALIZATION
		//**************************************************
		if ( service_run == "NO" ) 
		{	
			service_run  = "YES";
			service_running = service;
			date = new Date();
			start_time = date.getTime();		
			if( request_id == "RONLY" ) {
				reqid = 0;
			}
			else {
				reqid = ( start_time % 1e8 );
			}
			service_json = "START";
		}
		else 
		{
			if( service != service_running ) {
				service_run = "NO";
				return ( "ERROR" );
			}
			date = new Date();
			elapsed_time = date.getTime() - start_time;
			if ( elapsed_time > API_WATCH_DOG ) {
				service_run = "NO";
				return ( "ERROR" );
			}
		}
		
		state_log_api = "| " + service + " = " + service_json + " | reqid: " + reqid + " | TTL: " + elapsed_time + " |";
		
		switch( service )
		{
			//**************************************************
			// DIG_OUTPUT
			//**************************************************			
			case "DIG_OUTPUT":
				switch ( service_json )
				{
					case "START":
						Near_REST( "DIG_OUTPUT", "POST", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":				
						Near_REST( "DIG_OUTPUT", "POST", device, channel, value, reqid );	
						service_ret = "WAIT";	
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;
				}
				break;				

				
				
			//**************************************************
			// WAIT_DIGITAL_INPUT
			//**************************************************	
			case "WAIT_DIG_INPUT":
				switch ( service_json )
				{
					case "START":
						Near_REST( "DIG_INPUT", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;	

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "DIG_INPUT", "GET", device, channel, value, reqid );			
						service_ret = "WAIT";
						break;
						
					default: 
						if( parseInt( service_json ) == value ) {
							service_run  = "NO";
							service_ret  =  parseInt( service_json );											// Returns an INT (number)
						}
						else {
							Near_REST( "DIG_INPUT", "GET", device, channel, value, reqid );			
							service_ret = "WAIT";
						}
						break;					
				}			
				break;
			
			
			
			//**************************************************
			// DIGITAL_INPUT
			//**************************************************
			case "DIG_INPUT":
				switch ( service_json )
				{
					case "START":
						Near_REST( "DIG_INPUT", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "DIG_INPUT", "GET", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;
						
					default: 
						service_run  = "NO";
						service_ret  =  parseInt( service_json );											// Returns an INT (number)
						break;					
				}			
				break;	
			
			
			
			//**************************************************
			// ADC_INPUT
			//**************************************************				
			case "ADC_INPUT":
				switch ( service_json )
				{
					case "START":
						Near_REST( "ADC_INPUT", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;
						
					case "NULL":
						Near_REST( "ADC_INPUT", "GET", device, channel, value, reqid );				
						service_ret = "WAIT";	
						break;
						
					default: 
						service_run  = "NO";
						service_ret  =  parseInt( service_json );											// Returns an INT (number)
						break;
				}		
				break;

				
				
			//**************************************************
			// ADC_INPUT_CONFIG
			//**************************************************			
			case "ADC_INPUT_CONFIG":
				switch ( service_json )
				{
					case "START":
						Near_REST( "ADC_INPUT", "POST", device, channel, value, reqid );	
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "ADC_INPUT", "POST", device, channel, value, reqid );					
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;	
				
				
				
			//**************************************************
			// RMS_INPUT
			//**************************************************			
			case "RMS_INPUT":
				switch ( service_json )
				{
					case "START":
						Near_REST( "RMS_INPUT", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "RMS_INPUT", "GET", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;
						
					default: 
						service_run  = "NO";
						service_ret  =  parseInt( service_json );											// Returns an INT (number)
						break;					
				}			
				break;

				
				
			//**************************************************
			// RMS_INPUT_CONFIG
			//**************************************************			
			case "RMS_INPUT_CONFIG":
				switch ( service_json )
				{
					case "START":
						Near_REST( "RMS_INPUT", "POST", device, channel, value, reqid );	
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "RMS_INPUT", "POST", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;			

				
				
			//**************************************************
			// PWM OUTPUT
			//**************************************************			
			case "PWM_OUTPUT":
				switch ( service_json )
				{
					case "START":
						Near_REST( "PWM_OUTPUT", "POST", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "PWM_OUTPUT", "POST", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;
				
				
				
			//**************************************************
			// PULSE_OUTPUT
			//**************************************************				
			case "PULSE_OUTPUT":
			
				switch ( service_json )
				{
					case "START":
						Near_REST( "PULSE_OUTPUT", "POST", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;
						
					case "NULL":
						Near_REST( "PULSE_OUTPUT", "POST", device, channel, value, reqid );				
						service_ret = "WAIT";	
						break;
						
					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;				
				}
				break;				
			
			
			
			//**************************************************
			// GET_PULSE_OUTPUT
			//**************************************************				
			case "GET_PULSE_OUTPUT":
		
				switch ( service_json )
				{
					case "START":
						Near_REST( "PULSE_OUTPUT", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;
						
					case "NULL":
						Near_REST( "PULSE_OUTPUT", "GET", device, channel, value, reqid );								
						service_ret = "WAIT";	
						break;
						
					default: 
						service_run  = "NO";
						service_ret  =  parseInt( service_json );											// Returns an INT (number)
						break;
				}
				break;		

			
			
			//**************************************************
			// TRIGGER_INPUT
			//**************************************************					
			case "TRIGGER_INPUT":
				switch ( service_json )
				{
					case "START":
						Near_REST( "TRIGGER_INPUT", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "TRIGGER_INPUT", "GET", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;
						
					default: 
						service_run  = "NO";
						service_ret  =  parseInt( service_json );											// Returns an INT (number)
						break;					
				}			
				break;	

					
					
			//**************************************************
			// TRIGGER_INPUT_CONFIG
			//**************************************************					
			case "TRIGGER_INPUT_CONFIG":
				switch ( service_json )
				{
					case "START":
						Near_REST( "TRIGGER_INPUT", "POST", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "TRIGGER_INPUT", "POST", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;				
				
				
					
			//**************************************************
			// DIG_COUNTER
			//**************************************************					
			case "DIG_COUNTER":
				switch ( service_json )
				{
					case "START":
						Near_REST( "DIG_COUNTER", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "DIG_COUNTER", "GET", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;
						
					default: 
						service_run  = "NO";
						service_ret  =  parseInt( service_json );											// Returns an INT (number)
						break;					
				}			
				break;
			
			

			//**************************************************
			// DIG_COUNTER_CONFIG
			//**************************************************					
			case "DIG_COUNTER_CONFIG":
				switch ( service_json )
				{
					case "START":
						Near_REST( "DIG_COUNTER", "POST", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "DIG_COUNTER", "POST", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;
			
			

			//**************************************************
			// DIG_ACCUMUL
			//**************************************************			
			case "DIG_ACCUMUL":
				switch ( service_json )
				{
					case "START":
						Near_REST( "DIG_ACCUMUL", "GET", device, channel, value, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "DIG_ACCUMUL", "GET", device, channel, value, reqid );				
						service_ret = "WAIT";
						break;
						
					default: 
						service_run  = "NO";
						service_ret  =  parseInt( service_json );											// Returns an INT (number)
						break;					
				}			
				break;

				
				
			//**************************************************
			// DIG_ACCUMUL_RESET
			//**************************************************			
			case "DIG_ACCUMUL":
				switch ( service_json )
				{
					case "START":
						Near_REST( "DIG_ACCUMUL", "POST", device, channel, 0, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "NULL":
						Near_REST( "DIG_ACCUMUL", "POST", device, channel, 0, reqid );				
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;

				
				
			//**************************************************
			// RESET_MANUAL
			//**************************************************			
			case "RESET_MANUAL":
				switch ( service_json )
				{
					case "START":
						Near_REST( "RESET_MANUAL", "POST", device, 0, 0, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;

				
				
			//**************************************************
			// FLUSH_DEVICE
			//**************************************************			
			case "FLUSH_DEVICE":
				switch ( service_json )
				{
					case "START":
						Near_REST( "FLUSH_DEVICE", "POST", device, 0, 0, reqid );
						service_ret = "WAIT";
						break;

					case "WAITING":
						service_ret = "WAIT";
						break;

					case "DONE": 
						service_run  = "NO";
						service_ret  = "DONE";
						break;					
				}			
				break;


			//**************************************************
			// RESET_PORT
			//**************************************************				
			case "RESET_PORT":
				break;

				

			//**************************************************
			// MY_DRIVER_0
			//**************************************************				
			case "MY_DRIVER_0":			
				break;
				
			
			
			default:
				service_run = "NO";
				service_ret = "ERROR";
				break;	
				
		}	
		api_blocked_flag = 0;
		return ( service_ret );
	}
	else {
		return ( "WAIT" );
	}
}



//*****************************************************************************************************************
// Function: NearREST
//*****************************************************************************************************************		
function Near_REST( serv, method, device, chan, value, reqid )
{
	$.getJSON( "http://nearbus.net/v1/api_vmcu_jsb/" + device + "?user=" + user + "&pass=" + pass + "&method=" + method + "&service=" + serv + "&channel=" + chan.toString() + "&value=" + value.toString() + "&reqid=" + reqid.toString() + "&jsoncallback=?", function(aux_data2) { service_json = aux_data2; }	)	
	service_json = "WAITING";
}

//*****************************************************************************************************************
// Function: RESET_NEAR_API
//*****************************************************************************************************************		
function ResetNearAPIjs( )
{
	api_blocked_flag = 0;
	service_running  = "VOID";	
	service_ret 	 = "WAIT";
	service_json 	 = "WAITING";
	service_run 	 = "NO";
}

//*****************************************************************************************************************
// Function: TEST API
//*****************************************************************************************************************		
function NearTestAPIjs ( service, method, device, channel, value )
{
	var d = new Date();
	var reqid = d.getTime();
	$.getJSON( "http://nearbus.net/v1/api_vmcu_jsb/" + device + "?user=" + user + "&pass=" + pass + "&method=" + method + "&service=" + service + "&channel=" + channel.toString() + "&value=" + value.toString() + "&reqid=" + reqid.toString() + "&jsoncallback=?", function(aux_data2) {  }	)
}
