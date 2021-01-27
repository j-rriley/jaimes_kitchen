var account = {}; 

(function () {
    var logOnContainer = document.createElement("div");
    var profileContainer = document.createElement("div");
    
account.logon = function () {
    resetInterface();
    
    //Email container creation
    var emailContainer = document.createElement("div");
    emailContainer.innerHTML = "Email: "; 
    var emailInputContainer = document.createElement("input");
    
    emailContainer.appendChild(emailInputContainer); 
    logOnContainer.appendChild(emailContainer); 
    
    //Password container creation
    var passwordContainer = document.createElement("div");
    passwordContainer.innerHTML = "Password: "; 
    var passwordInputContainer = document.createElement("input");
    passwordInputContainer.setAttribute("type", "password"); 
    
    passwordContainer.appendChild(passwordInputContainer);
    logOnContainer.appendChild(passwordContainer); 
    
    //Logon button creation
    var logOnButton = document.createElement("button"); 
    logOnButton.innerHTML = "Log In"; 
    
    logOnContainer.appendChild(logOnButton); 
    logOnContainer.appendChild(profileContainer); 
    
    //When button is clicked
    logOnButton.onclick = function () {
        var url = "webAPIs/logonAPI.jsp?email="+emailInputContainer.value+"&password="+passwordInputContainer.value; 
        ajax(url, buildProfile, profileContainer); 
    };
   return logOnContainer;  
}; 


account.getProfile = function () {
    resetInterface();
    ajax("webAPIs/getProfileAPI.jsp", buildProfile, profileContainer); 
    logOnContainer.appendChild(profileContainer); 
    return logOnContainer; 
};

function buildProfile (userObj) {
    var msg = ""; 
    if(userObj.errorMsg.length > 0) {
        msg += "<strong> Error: " + userObj.errorMsg + "</strong>";
    } else {
        msg += "<strong>Welcome Web User " + userObj.webUserId + "</strong>";
        msg += "<br/> Birthday: " + userObj.birthday;
        msg += "<br/> MembershipFee: " + userObj.membershipFee;
        msg += "<br/> User Role: " + userObj.userRoleId + " " + userObj.userRoleType;
        msg += "<p> <img src ='" + userObj.image + "'> </p>";
    }
    profileContainer.innerHTML = msg; 
}; 

account.logoff = function () {
    resetInterface(); 
    
    ajax("webAPIs/logoffAPI.jsp", logOffFunction, profileContainer); 
    
    function logOffFunction() {
        profileContainer.innerHTML = "No users logged in. Have a nice day.";
    }
    logOnContainer.appendChild(profileContainer); 
    return logOnContainer; 
};

//Emptying the page before new call
function resetInterface() {
    logOnContainer.innerHTML = ""; 
    profileContainer.innerHTML = ""; 
}
}()); 

