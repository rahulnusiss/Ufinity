
var validation = function() {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  this.validateSuspend = function(data) {
  	// regular expression for email  	
  	var student = data['student'];
  	return re.test(student);
  };

  this.validateRegister = function(data) {
  	var teacher = data['teacher']
  	if (re.test(teacher)){
  		var students = data['students']
  		students.forEach(function(value){
  			if(false === (re.test(value))){
  				return false
  			}
  		})
  	}else{
  		return false
  	}
  	return true
  };

  this.validateNotify = function(data) {
    var teacher = data['teacher']
    if(re.test(teacher)){
    	var notification = data['notification']
    	if (notification && notification.length > 0){
    		return true
    	}    	
    }
    return false;
  };
};

exports.validation = validation;