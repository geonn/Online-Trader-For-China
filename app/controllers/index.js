var args = arguments[0] || {};

var ses = Ti.App.Properties.getString('session');
var target = Ti.App.Properties.getString('target');
var extra = Ti.App.Properties.getString('extra');
var payload = Ti.App.Payload;

if(ses == null){
	//console.log('ses null');
	$.index.open();
}else{
	//console.log("other");
	var url = Ti.API.CHECKSESSION +ses;
	//console.log(url);
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	         var res = JSON.parse(this.responseText);
	          
	         if(res.status == "success"){
	         	
	         	var rl = Ti.App.Properties.getString('roles');
	
				if(rl == 'dealer' || rl == 'staff'){
					//$.index.close();
					var summary = Alloy.createController(rl + '_summary').getView();
				   	
					setWindowRelationship(summary);
				}else{
					//$.index.close();
					var home = Alloy.createController(rl + '_home').getView();
				   	
				   	setWindowRelationship(home);
				}	
				
				if(payload != ''){
					//alert('work'+JSON.stringify(payload));
					//getNotificationNumber(payload);	
					
					//Ti.App.Payload = '';
				}else{
					
				}
	         }else{
	         	$.index.open();
	         }
	         
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	console.log(e);
	         $.index.open();
	     },
	     timeout : 100000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
	
}

//Ti.App.Properties.removeProperty('session');
Ti.App.Properties.setString('module', 'index');
function doLogin(e) {
	$.activityIndicator.show(); 
	$.loadingBar.opacity = "1";
	$.loadingBar.height = "100";
	var username = $.username.value;
	var password = $.password.value;
	
	if(username == "" || password == ""){
		$.activityIndicator.hide(); 
		$.loadingBar.opacity = "0";
		$.loadingBar.height = "0";
		createAlert('Authentication warning','Please fill in username and password');
		return;
	}
	var dt = Ti.App.Properties.getString('deviceToken');
	var url = Ti.API.LOGIN +"&username="+username+"&password="+password+"&deviceToken="+dt;
 	console.log(url);
	var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) { 
         var res = JSON.parse(this.responseText);
         if(res.status == "success"){
         	 if(res.data.roles == "admin"){
	         	createAlert('权限拒绝','您的户口没权限使用这软件');   
	         	$.activityIndicator.hide(); 
				$.loadingBar.opacity = "0";
				$.loadingBar.height = "0";
	        	return false;      	 	
	        }  
         	Ti.App.Properties.setString('roles',res.data.roles);
			Ti.App.Properties.setString('session',res.data.session);
			
			if(Alloy.Globals.osname == "android"){
				subscribeDeviceToken(dt,res.data.roles);
			}
			
			if(res.data.roles == 'dealer' || res.data.roles == 'staff'){ 
				var summary = Alloy.createController(res.data.roles + '_summary').getView(); 
				setWindowRelationship(summary);
			 }else{   
				var home = Alloy.createController(res.data.roles + '_home').getView(); 
			 	setWindowRelationship(home);
			 }
			if(payload != null){
				getNotificationNumber(payload);	 
			} 
         	 $.activityIndicator.hide(); 
			 $.loadingBar.opacity = "0";
			 $.loadingBar.height = "0";
			
         }else{
         	createAlert('驗證警告',res.data);
         	$.activityIndicator.hide(); 
			$.loadingBar.opacity = "0";
			$.loadingBar.height = "0";
         }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
     	$.activityIndicator.hide(); 
		$.loadingBar.opacity = "0";
		$.loadingBar.height = "0";
        createAlert('网络警告','無法與服務器聯繫。請確保你的設備連接到互聯網。');
     },
     timeout : 60000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
   
}


$.passwordhint.addEventListener('click', function (e) {
    $.passwordhint.visible = false;
    $.password.focus();
});
        
$.password.addEventListener('blur', function (e){
	if($.password.value <= 0){
		$.passwordhint.visible = true;
	}
});

$.password.addEventListener('focus', function (e){
	$.passwordhint.visible = false;
    $.password.focus();
});

$.usernamehint.addEventListener('click', function (e) {
    $.usernamehint.visible = false;
    $.username.focus();
});
        
$.username.addEventListener('blur', function (e){
	if($.username.value <= 0){
		$.usernamehint.visible = true;
	}
});

$.username.addEventListener('focus', function (e){
	$.usernamehint.visible = false;
    $.username.focus();
});

