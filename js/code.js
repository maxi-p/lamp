const urlBase = 'http://contact-linker.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:login,Password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("login0").getElementsByTagName("input")[0].classList.add('is-invalid');
                    document.getElementById("login0").getElementsByTagName("small")[0].innerHTML = "* " + "User/Password combination incorrect";
					document.getElementById("login1").getElementsByTagName("input")[0].classList.add('is-invalid');
                    document.getElementById("login1").getElementsByTagName("small")[0].innerHTML = "* " + "User/Password combination incorrect";
					return;
				}
                
                document.getElementById("login0").getElementsByTagName("input")[0].classList.remove('is-invalid');
                document.getElementById("login0").getElementsByTagName("small")[0].innerHTML = "";
                document.getElementById("login1").getElementsByTagName("input")[0].classList.remove('is-invalid');
                document.getElementById("login1").getElementsByTagName("small")[0].innerHTML = "";
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();
	
				window.location.href = "home-page.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function validate_register(){
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorArray = [];

    const firstName_validation = validate_first_name(firstName);
    errorArray.push(firstName_validation);

    const lastName_validation = validate_last_name(lastName);
    errorArray.push(lastName_validation);

    const username_validation = validate_username(username);
    errorArray.push(username_validation);

    const password_validation = validate_password(password);
    errorArray.push(password_validation);
    
    for(let i=0; i<errorArray.length; i++){
        if(errorArray[i] !== ""){
            document.getElementById("register"+i).getElementsByTagName("input")[0].classList.add('is-invalid');
            document.getElementById("register"+i).getElementsByTagName("small")[0].innerHTML = "* " + errorArray[i];
        }
        else{
            document.getElementById("register"+i).getElementsByTagName("input")[0].classList.remove('is-invalid');
            document.getElementById("register"+i).getElementsByTagName("small")[0].innerHTML = "";
        }
    }   
}

function doRegister() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorArray = [];

    const firstName_validation = validate_first_name(firstName);
    errorArray.push(firstName_validation);

    const lastName_validation = validate_last_name(lastName);
    errorArray.push(lastName_validation);

    const username_validation = validate_username(username);
    errorArray.push(username_validation);

    const password_validation = validate_password(password);
    errorArray.push(password_validation);
    
    let errorHTML = "";
    for(let i=0; i<errorArray.length; i++){
        if(errorArray[i] !== ""){
            document.getElementById("register"+i).getElementsByTagName("input")[0].classList.add('is-invalid');
            document.getElementById("register"+i).getElementsByTagName("small")[0].innerHTML = "* " + errorArray[i];
            errorHTML += i;
        }
        else{
            document.getElementById("register"+i).getElementsByTagName("input")[0].classList.remove('is-invalid');
            document.getElementById("register"+i).getElementsByTagName("small")[0].innerHTML = "";
        }
    }

    if(errorHTML !== ""){
        return;
    }

    //var hash = md5(password);

    document.getElementById("registerResult").innerHTML = "";

    let tmp = {
        FirstName: firstName,
        LastName: lastName,
        Login: username,
        Password: password
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            //ajax operation complete! code == 4
			if(this.readyState != 4){
				return;
			}
            if (this.status == 200) {
                
                let jsonObject = JSON.parse(xhr.responseText);
                errorCheck = jsonObject.firstName;

                if(errorCheck === ""){
                    document.getElementById("register2").getElementsByTagName("input")[0].classList.add('is-invalid');
                    document.getElementById("register2").getElementsByTagName("small")[0].innerHTML = "* " + jsonObject.error;
                }
                else{   
                    document.getElementById("register2").getElementsByTagName("input")[0].classList.remove('is-invalid');
                    document.getElementById("register2").getElementsByTagName("small")[0].innerHTML = "";
                    document.getElementById("firstName").value = "";
                    document.getElementById("lastName").value = "";
                    document.getElementById("username").value = "";
                    document.getElementById("password").value = "";
                    document.getElementById("registerForm").style.display = "none";
                    document.getElementById("loginForm").style.display = "block";
                    document.getElementById("errorContainer").style.display="block";
                    document.getElementById("updateErrorMessage").innerHTML = "User added";
                }
            }

            else{
                document.getElementById("registerResult").innerHTML = "Response from server failed. Try refreshing.";
                return;
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	console.log(data);
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "astName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		console.log("ASD");
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function validate_add_contact(){
    let contactTextFirst = document.getElementById("contactTextFirst").value;
	let contactTextLast = document.getElementById("contactTextLast").value;
	let contactTextNumber = document.getElementById("contactTextNumber").value;
	let contactTextEmail = document.getElementById("contactTextEmail").value;
	
    let errorArray = [];

    //validate the first name
    const firstName_validation = validate_first_name(contactTextFirst);
    errorArray.push(firstName_validation);

    //validate the last name
    const lastName_validation = validate_last_name(contactTextLast);
    errorArray.push(lastName_validation);

    //validate phone number
    const phone_validation = validate_phone(contactTextNumber);
    errorArray.push(phone_validation);

    //validate email
    const email_validation = validate_email(contactTextEmail);
    errorArray.push(email_validation);
    
    let errorHTML = "";
    for(let i=0; i<errorArray.length; i++){
        if(errorArray[i] !== ""){
            document.getElementById("addContact"+i).getElementsByTagName("input")[0].classList.add('is-invalid');
            document.getElementById("addContact"+i).getElementsByTagName("small")[0].innerHTML = "* " + errorArray[i];
            errorHTML += i;
        }
        else{
            document.getElementById("addContact"+i).getElementsByTagName("input")[0].classList.remove('is-invalid');
            document.getElementById("addContact"+i).getElementsByTagName("small")[0].innerHTML = "";
        }
    }
    if(errorHTML !== ""){
        return;
    }
}

function addContact()
{

	let contactTextFirst = document.getElementById("contactTextFirst").value;
	let contactTextLast = document.getElementById("contactTextLast").value;
	let contactTextNumber = document.getElementById("contactTextNumber").value;
	let contactTextEmail = document.getElementById("contactTextEmail").value;
	
    let errorArray = [];

    //validate the first name
    const firstName_validation = validate_first_name(contactTextFirst);
    errorArray.push(firstName_validation);

    //validate the last name
    const lastName_validation = validate_last_name(contactTextLast);
    errorArray.push(lastName_validation);

    //validate phone number
    const phone_validation = validate_phone(contactTextNumber);
    errorArray.push(phone_validation);

    //validate email
    const email_validation = validate_email(contactTextEmail);
    errorArray.push(email_validation);
    
    let errorHTML = "";
    for(let i=0; i<errorArray.length; i++){
        if(errorArray[i] !== ""){
            document.getElementById("addContact"+i).getElementsByTagName("input")[0].classList.add('is-invalid');
            document.getElementById("addContact"+i).getElementsByTagName("small")[0].innerHTML = "* " + errorArray[i];
            errorHTML += i;
        }
        else{
            document.getElementById("addContact"+i).getElementsByTagName("input")[0].classList.remove('is-invalid');
            document.getElementById("addContact"+i).getElementsByTagName("small")[0].innerHTML = "";
        }
    }
    if(errorHTML !== ""){
        return;
    }
    
    document.getElementById("contactAddResult").innerHTML = "";
	let tmp = {
		FirstName:contactTextFirst,
		LastName:contactTextLast,
		Phone:contactTextNumber,
		Email:contactTextEmail,
		UserId:userId
	};
    console.log(tmp);
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{   
                let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.error == ""){

                    document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                    document.getElementById("contactTextFirst").value = "";
                    document.getElementById("contactTextLast").value = "";
                    document.getElementById("contactTextNumber").value = "";
                    document.getElementById("contactTextEmail").value = "";
                    document.getElementById("addContactToggle").style.display = "none";
                    loadContacts();
                }
                else{
                    document.getElementById("contactAddResult").innerHTML = jsonObject.error;
                }
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function saveContact(id){
    
    var newFirstName = document.getElementById("namef_text" + id).value;
    var newLastName = document.getElementById("namel_text" + id).value;
    var newEmail = document.getElementById("email_text" + id).value;
    var newPhone = document.getElementById("phone_text" + id).value

    document.getElementById("first_Name" + id).innerHTML = newFirstName;
    document.getElementById("last_Name" + id).innerHTML = newLastName;
    document.getElementById("email" + id).innerHTML = newEmail;
    document.getElementById("phone" + id).innerHTML = newPhone;

    // Bryans implementation
    document.getElementById("row" + id).contentEditable = false;


    document.getElementById("edit_button" + id).style.display = "inline-block";
    document.getElementById("save_button" + id).style.display = "none";

    let tmp = {
        NewFirstName: newFirstName,
        NewLastName: newLastName,
        NewEmail: newEmail,
        NewPhone: newPhone,
        ID: id
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function loadContacts() {
    let tmp = {
        search: "",
        UserId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = ""
                for (let i = 0; i < jsonObject.results.length; i++) {
                    let j = jsonObject.results[i].ID;
                    text += "<tr  class='table-active' id='row" + j + "' contenteditable='false'>"
                    text += "<td id='first_Name" + j + "'>" + jsonObject.results[i].FirstName + "</td>";
                    text += "<td id='last_Name" + j + "'>" + jsonObject.results[i].LastName + "</td>";
                    text += "<td id='email" + j + "'>" + jsonObject.results[i].Email + "</td>";
                    text += "<td id='phone" + j + "'>" + jsonObject.results[i].Phone + "</td>";
                    text += "<td class='d-flex justify-content-center align-items-center'>" +
                        "<button type='button' id='edit_button" + j + "' class='btn btn-outline-dark' onclick='editContact(" + j + ")' data-mdb-ripple-init data-mdb-ripple-color='dark'>" + "Edit</button>" +
                        "<button type='button' id='save_button" + j + "' class='btn btn-outline-dark' onclick='saveContact(" + j + ")' style='display: none' >Save</button>" +
                        "<button type='button' onclick='deleteContact(" + j + ")' class='btn btn-outline-danger'>Delete</button>" + "</td>";
                    text += "<tr/>"
                }
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function editContact(id){
	document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    //Bryans implementation
    document.getElementById("row" + id).contentEditable = true;

    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    //Widths
    var firstNameW = firstNameI.offsetWidth;
    var lastNameW = lastNameI.offsetWidth;
    var emailW = email.offsetWidth;
    var phoneW = phone.offsetWidth;

    firstNameI.innerHTML =  "<input type='text' style='width:"+firstNameW+"px;text-align:center;background-color:WhiteSmoke;opacity: 0.5;' id='namef_text" + id + "' value='" + firstNameI.innerText + "'>";
    lastNameI.innerHTML =   "<input type='text' style='width:"+lastNameW+"px;text-align:center;background-color:WhiteSmoke;opacity: 0.5;' id='namel_text" + id + "' value='" + lastNameI.innerText + "'>";
    email.innerHTML =       "<input type='text' style='width:"+emailW+"px;text-align:center;background-color:WhiteSmoke;opacity: 0.5;' id='email_text" + id + "' value='" + email.innerText + "'>";
    phone.innerHTML =       "<input type='text' style='width:"+phoneW+"px;text-align:center;background-color:WhiteSmoke;opacity: 0.5;' id='phone_text" + id + "' value='" + phone.innerText + "'>"
}

function deleteContact(id) {
    var namef_val;
    var namel_val;
    if(document.getElementById("edit_button" + id).style.display != "none"){
        namef_val = document.getElementById("first_Name" + id).innerText;
        namel_val = document.getElementById("last_Name" + id).innerText;
    }
    else{
        namef_val = document.getElementById("namef_text" + id).value;
        namel_val = document.getElementById("namel_text" + id).value;
    }
    
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    const modal = document.querySelector("[data-modal]");
    const cancelButton = document.querySelector(".cancel-btn");
    const yesButton = document.querySelector(".yes-btn");
    document.getElementById('confirmUserName').innerHTML = nameOne + ' ' + nameTwo;
    modal.showModal();
    cancelButton.addEventListener("click", () => {
        modal.close();
    });

    yesButton.addEventListener("click", () => {
        deleteUtil();
        modal.close();
    });
    // let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
    function deleteUtil(){
        document.getElementById("row" + id + "").outerHTML = "";
        let tmp = {
            FirstName: nameOne,
            LastName: nameTwo,
            UserId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };

}

function createContact(){
    validate_add_contact();
    document.getElementById("addContactToggle").style.display = "block";
}

function cancelAddContact(){
    document.getElementById("contactTextFirst").value = "";
	document.getElementById("contactTextLast").value = "";
	document.getElementById("contactTextNumber").value = "";
	document.getElementById("contactTextEmail").value = "";
    document.getElementById("addContactToggle").style.display = "none";
}

function searchContacts() {
    const content = document.getElementById("search-bar");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("tbody");
    const tr = table.getElementsByTagName("tr");// Table Row

    for (let i = 0; i < tr.length; i++) {
        const td_fn = tr[i].getElementsByTagName("td")[0];// Table Data: First Name
        const td_ln = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name

        if (td_fn && td_ln) {
            const txtValue_fn = td_fn.textContent || td_fn.innerText;
            const txtValue_ln = td_ln.textContent || td_ln.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (txtValue_fn.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (txtValue_ln.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }
}

function validate_first_name(firstName){
    if (firstName == "") {
        return "Entered Name is blank!";
    }
    else if(firstName.length < 2){
        return "Your name is shorted than 2!";
    }
    else{
        return "";
    }
}

function validate_last_name(lastName){
    if (lastName == "") {
        return "Entered Last Name is blank!";
    }
    else if(lastName.length < 2){
        return "Your Last Name is shorted than 2!";
    }
    else{
        return "";
    }
}

function validate_username(username){
    if (username == "") {
        return "Entered user-name is blank!";
    }
    else if(username.length < 2){
        return "Your user-name is shorted than 2!";
    }
    else{
        return "";
    }
}

function validate_password(password){
    if (password == "") {
        return "Entered password is blank!";
    }
    else if(password.length < 6){
        return "Your password must be longer than 5!";
    }
    else{
        var regex = /\d/;
        if (regex.test(password) == false) {
            return "Entered password doesnt have a digit!"; 
        }

        var regex = /[a-z]/;
        if (regex.test(password) == false) {
            return "Entered password doesnt have characters!"; 
        }
        return "";
    }
}

function validate_phone(phone){
    if (phone == "") {
        return "Entered phone is blank!";
    }
    else{
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            return "Phone form: 000-000-0000";
        }
        console.log(phone)
        return "";
    }
}

function validate_email(email){
    if (email == "") {
        return "Entered email is blank!";
    }
    else{
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;

        if (regex.test(email) == false) {
            return "Email form: _@_._ Ex: a@b.c";
        }
        return "";
    }
}

function get_class(str){
    if(str === ""){
        return "";
    }
    else{
        return " updateErrorMessage";
    }
}



