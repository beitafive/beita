/**
 * edit: rxy 
 * desciption: this is util file
 */

export const  formatDate = function(date)
	{
    
		if(date == null || date == ''){
			return '';
		}else{
			var d = new Date(date);
			var year = d.getFullYear();
			var month = d.getMonth()+1;
			var day = d.getDate();
			if (month < 10) month = '0' + month;
		  	if (day < 10) day = '0' + day;

		 	return [year, month, day].join('-');
			
		}
	}

export const validateMobile = function (mobile) 
   { 
   		let that = this;
       if(mobile.length==0){ 
          return false; 
       }     
       if(mobile.length!=11){ 
           return false; 
       } 
       //现在只支持13,15,18号段的手机号码
       var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
       if(!myreg.test(mobile)){ 
           return false; 
       } 
       return mobile;
   }
export const validateEmail = function (email) 
   { 
       if(email.length==0){ 
          return false; 
       } 
        
       var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
       if(!myreg.test(email)){ 
           return false; 
       } 
       return email;
   }
