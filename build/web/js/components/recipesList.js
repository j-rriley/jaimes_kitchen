function recipesList() {

    var contentDOM = document.createElement("div");
    contentDOM.classList.add("clickSort");
    ajax("webAPIs/listRecipesAPI.jsp", success, contentDOM);
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
            innerHTML: "Recipe List",
            parent: heading
        });
        var img = Utils.make({
            htmlTag: "img",
            parent: heading
        });
        img.src = CRUD_icons.insert;
        img.onclick = function () {
            // By changing the URL, you invoke the user insert. 
            window.location.hash = "#/recipesInsert";
        };
        
        
        
        

        // create userList (new array of objects) to have only the desired properties of obj.recipesList. 
        // Add the properties in the order you want them to appear in the HTML table.  
        var recipesList = [];
        for (var i = 0; i < obj.recipeList.length; i++) {
            recipesList[i] = {}; // add new empty object to array

            recipesList[i].image = "<img style='width:5rem' src='" + obj.recipeList[i].image + "'>";
            recipesList[i].userEmail = obj.recipeList[i].userEmail;
            recipesList[i].recipeId = obj.recipeList[i].recipeId;
            recipesList[i].recipeName = obj.recipeList[i].recipeName;
            recipesList[i].ingredients = obj.recipeList[i].ingredients;
            recipesList[i].cost = obj.recipeList[i].cost;
            recipesList[i].typeOfRecipe = obj.recipeList[i].typeOfRecipe;

            // Remove this once you are done debugging...
            recipesList[i].errorMsg = obj.recipeList[i].errorMsg;


            recipesList[i].update = `<img src="` + CRUD_icons.update + 
                    `" onclick= "window.location.hash = '#/recipesUpdate/`+recipesList[i].recipeId+`'">`;
            
            recipesList[i].delete = `<img src="` + CRUD_icons.delete + 
                    `" onclick= "window.location.hash = '#/recipesDelete/`+recipesList[i].recipeId+`'">`;

        }

        var webUserTable = MakeClickSort( {
            list : recipesList,
            sortOrderPropName : "recipeId", 
            sortIcon : "pics/sortUpDown16.png",
            heading : "Recipe List"
        }); 
        contentDOM.appendChild(webUserTable);
        
    } // end of function success

    return contentDOM;
} // webUserList