var form = document.getElementById("myForm");

function passwordValidation() {
	console.log("I'm in passwordvalidation");
	var passValid = true;
	document.querySelector('.content .invalidPassword').innerHTML = '';

	if(form.password.value.length < 6) {
		document.querySelector('.content .invalidPassword').innerHTML = 'Password cannot be less than 6 characters.';
		passValid = false;
	}

	/*document.querySelector('.content .invalidCPassword').innerHTML = '';
	if(form.cpassword.value.length < 6) {
		document.querySelector('.content .invalidCPassword').innerHTML = 'Password cannot be less than 6 characters.';
		passValid = false;
	}*/	

	document.querySelector('.content .invalidPasswordMatch').innerHTML = '';
	if (form.password.value != form.cpassword.value)
	{
		document.querySelector('.content .invalidPasswordMatch').innerHTML = 'Passwords do not match.';
		passValid = false;
	}
	return passValid;
}


function usernameValidation() {	
	console.log("I'm in email validation");
	var usernameIsValid = true;
	
	document.querySelector('.content .invalidUsername').innerHTML = '';
	
	if(form.username.value.length == 0) {
		document.querySelector('.content .invalidUsername').innerHTML = 'Username cannot be blank.';
		usernameIsValid = false;
	}

	document.querySelector('.content .invalidUsername2').innerHTML = '';
	
	var usernameExp = "^[a-zA-Z0-9_-]*$"; ///^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
	if(form.username.value.match(usernameExp));
	else {
		document.querySelector('.content .invalidUsername2').innerHTML = 'Username is invalid. Please Try Again. Use only Alphanumeric Characters, _ , and -.';
		usernameIsValid = false;
	}
	return usernameIsValid;
}


function emailValidation() {
	console.log("I'm in email validation");
	document.querySelector('.content .invalidEmail').innerHTML = '';

	var emailIsValid = true;
	if(form.email.value.length == 0) {
		document.querySelector('.content .invalidEmail').innerHTML = 'Email cannot be blank.';
		emailIsValid = false;
	}
	else{
		document.querySelector('.content .invalidEmail2').innerHTML = '';
		
		var emailExp = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if(form.email.value.match(emailExp)) {
		} else {

			document.querySelector('.content .invalidEmail2').innerHTML = 'Email is invalid. Please Try Again.';
			emailIsValid = false;
		}
	}
	return emailIsValid;
}


function nameValidation() {
	console.log("I'm in name validation");
	var nameIsValid = true;

	document.querySelector('.content .invalidFirstname').innerHTML = '';

	if(form.firstname.value.length == 0) {
		document.querySelector('.content .invalidFirstname').innerHTML = 'First Name cannot be blank.';
		nameIsValid = false;
	}

	document.querySelector('.content .invalidLastname').innerHTML = '';

	if(form.lastname.value.length == 0) {
		document.querySelector('.content .invalidLastname').innerHTML = 'Last Name cannot be blank.';
		nameIsValid = false;
	}
	return nameIsValid;
}


form.addEventListener('submit', function(evt){
	//document.querySelector('.content .value').innerHTML = '';

	var isValid = usernameValidation();
	isValid = emailValidation() && isValid;
	isValid = nameValidation() && isValid;
	isValid =  passwordValidation() && isValid;
	//document.querySelector('.content .value').innerHTML = 'Errors: ' +document.querySelector('.content .value').innerHTML +'<br /><br />'

	if (!isValid)
	{
		console.log("I'm in preventDefault");
		evt.preventDefault();
	}	
})
