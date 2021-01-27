function webUserList() {

    var contentDOM = document.createElement("div");
    contentDOM.classList.add("clickSort");
    ajax("webAPIs/listUsersAPI.jsp", success, contentDOM);
    function success(obj) {

        console.log("listUsersAPI.jsp AJAX successfully returned the following data");
        console.log(obj);
        // Remember: getting a successful ajax call does not mean you got data. 
        // There could have been a DB error (like DB unavailable). 
        if (obj.dbError.length > 0) {
            contentDOM.innerHTML += "Database Error Encountered: " + obj.dbError;
            return;
        }

        var heading = Utils.make({
            htmlTag: "h2",
            parent: contentDOM
        });
        Utils.make({// don't need reference to this span tag...
            htmlTag: "span",
            innerHTML: "Web User List ",
            parent: heading
        });
        var img = Utils.make({
            htmlTag: "img",
            parent: heading
        });
        img.src = CRUD_icons.insert;
        img.onclick = function () {
            // By changing the URL, you invoke the user insert. 
            window.location.hash = "#/userInsert";
        };
        /* Web API property names: "webUserId", "userEmail", "userPassword", "userPassword2", 
         * "image", "birthday", "membershipFee", "userRoleId", "userRoleType", "errorMsg"   */

        // create userList (new array of objects) to have only the desired properties of obj.webUserList. 
        // Add the properties in the order you want them to appear in the HTML table.  
        var userList = [];
        for (var i = 0; i < obj.webUserList.length; i++) {
            userList[i] = {}; // add new empty object to array

            userList[i].userCredentials = obj.webUserList[i].userEmail + "<br/> PW (to test Logon): " +
                    obj.webUserList[i].userPassword;
            userList[i].image = "<img style='width:5rem' src='" + obj.webUserList[i].image + "'>";
            userList[i].birthday = obj.webUserList[i].birthday;
            userList[i].membershipFee = obj.webUserList[i].membershipFee;
            userList[i].role = obj.webUserList[i].userRoleId + "&nbsp;" +
                    obj.webUserList[i].userRoleType;
            userList[i].userId = obj.webUserList[i].webUserId;
            
            // Remove this once you are done debugging...
            userList[i].errorMsg = obj.webUserList[i].errorMsg;


            userList[i].update = `<img src="` + CRUD_icons.update + 
                    `" onclick= "window.location.hash = '#/userUpdate/`+userList[i].userId+`'">`;
            
            
            userList[i].delete = `<img src="` + CRUD_icons.delete + 
                    `" onclick= "window.location.hash = '#/userDelete/`+userList[i].userId+`'">`;

        }

        var webUserTable = MakeClickSort( {
            list : userList,
            sortOrderPropName : "webUserId", 
            sortIcon : "pics/sortUpDown16.png",
            heading : "Live User List"
        }); 
        contentDOM.appendChild(webUserTable);
        
    } // end of function success

    return contentDOM;
} // webUserList