var recipesMods = {};

(function () {  // This is an IIFE, an immediately executing function.
// It is an anonymous function that runs once (and only once) at page load time.
// It is a way to create private functions that can be shared. 

//alert("I am an IIFE!"); // runs only at page load time...

    // create an object from the values typed into the page, URL encode it and return it.
    function getDataFromUI(validateObjList) {     // a private function within the IIFE 

        /* Web API property names: "recipeId", "userEmail", "Ingredients", "cost", 
         * "typeOfRecipe", "image", "birthday", "recipeName", "errorMsg"   */

        var selTag = validateObjList["recipeTypeId"].inputBox; // New code: Type Pick List. 
        var selTag2 = validateObjList["webUserId"].inputBox; 
        var recipeObj = {
            

            "recipeId": validateObjList["recipeId"].inputBox.value,
            "ingredients": validateObjList["ingredients"].inputBox.value,
            "cost": validateObjList["cost"].inputBox.value,
            "image": validateObjList["image"].inputBox.value,
            "recipeName": validateObjList["recipeName"].inputBox.value,


            // Modification here for type pick list
            "webUserId": selTag2.options[selTag2.selectedIndex].value,
            "recipeTypeId": selTag.options[selTag.selectedIndex].value,
            "typeOfRecipe": "",
            "errorMsg": ""       
        };
       
        console.log("getDataFromUI - recipeInputObj on next line");
        console.log(recipeObj);

        // JSON.stringify converts the javaScript object into JSON format 
        // (the reverse operation of what gson does on the server side).
        // Then, you have to encode the user's data (encodes special characters 
        // like space to %20 so the server will accept it with no security error). 
        return encodeURIComponent(JSON.stringify(recipeObj));
    }

    // write the jsonObj (full of error message) to the Validation UI. 
    function writeErrorObjToUI(jsonObj, validateObjList) {

        /* Web API property names: "recipeId", "userEmail", "Ingredients", "cost", 
         * "typeOfRecipe", "image", "birthday", "errorMsg"   */

        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);
        validateObjList["recipeId"].errorTd.innerHTML = jsonObj.recipeId;
        validateObjList["recipeName"].errorTd.innerHTML = jsonObj.recipeName;
        validateObjList["ingredients"].errorTd.innerHTML = jsonObj.ingredients;
        validateObjList["image"].errorTd.innerHTML = jsonObj.image;
        validateObjList["cost"].errorTd.innerHTML = jsonObj.cost;
        validateObjList["recordError"].innerHTML = jsonObj.errorMsg;

    } // writeErrorObjToUI


    // ***** makeInputRow *****
    // This function creates then adds a tr (table row) into validationTable (a HTML table tag, input param). 
    // Into this tr, this function (makeInputRow):
    //   *  adds a 1st td filling that innerHTML with promptText. 
    //   *  adds a 2nd td, placing a textbox inside, and stores a reference to the textbox. 
    //   *  adds a 3rd td (classed "error") to hold validation error message (and stores a reference to it).
    //   
    // Finally, it creates an object that references the two things we need to access programatically: 
    // the input textbox (where user's input will be found) and the error td (where we will write any 
    // possible error messages). This object is stored into validationObjList using associative array 
    // notation (using fieldName as the key.)
    function makeInputRow(fieldName, promptText, validationTable, validationObjList) {

        var obj = {}; // this will hold references to the input box and the error td for the 
        // given field name.

        var row = Utils.make({// Inject a row into the table 
            htmlTag: "tr",
            parent: validationTable
        });
        Utils.make({// first td of row will hold promptText
            htmlTag: "td",
            innerHTML: promptText, // use fieldName as prompt for now, later promptText,
            parent: row
        });
        var inputTd = Utils.make({// second td of row will hold user input
            htmlTag: "td",
            parent: row
        });
        // store reference to this input box. we need to access it programatically 
        // (to find user's input).
        obj.inputBox = Utils.make({// place textbox in second td
            htmlTag: "input",
            parent: inputTd
        });
        // store reference to the 3rd td that is for holding error messages, 
        // so we can access it programmatically.
        obj.errorTd = Utils.make({
            htmlTag: "td",
            parent: row,
            class: "error"
        });
        // obj has a reference to the inputBox and the errorTd (the two things 
        // we need to access programatically to do validation). Store this 
        // object into an associative array (using fieldName as key). 
        validationObjList[fieldName] = obj;
    } // makeInputRow

    // build the validation area (three column HTML table, 1st column is promtp, 
    // second column is input data, third column is possible field level error message. 
    function createValidationArea(validateTable, validateObjList) {

        // call makeInputRow for each field. This will add a new row into the validateTable 
        // (a HTML table DOM element) and it will add two references per field in the 
        // associative array validateObjList (one will be inputBox and the other will be errorTd).


        makeInputRow("recipeId", "Recipe Id", validateTable, validateObjList);
        validateObjList["recipeId"].inputBox.setAttribute("disabled", true);
        
        makeInputRow("recipeName", "Recipe Name", validateTable, validateObjList);
        makeInputRow("recipeTypeId", "Type Of Recipe", validateTable, validateObjList);
        makeInputRow("ingredients", "Ingredients", validateTable, validateObjList);
        makeInputRow("cost", "Cost", validateTable, validateObjList);
        
        makeInputRow("image", "Image URL", validateTable, validateObjList);
        
        makeInputRow("webUserId", "User Email", validateTable, validateObjList);

        
        
        

        // Add non-standard last row to validatTable. The first cell will hold a Save button. 
        // The 2nd cell will hold the record error. The 3rd cell will be just a filler.
        var row = Utils.make({
            htmlTag: "tr",
            parent: validateTable
        });
        var saveCell = Utils.make({
            htmlTag: "td",
            parent: row
        });
        var saveButton = Utils.make({
            htmlTag: "button",
            innerHTML: "Save",
            parent: saveCell
        });
        var recordError = Utils.make({
            htmlTag: "td",
            parent: row,
            class: "error"
        });
        Utils.make({// third empty cell (filler) -- dont need a reference to this.
            htmlTag: "td",
            parent: row
        });

        // add recordError and saveButton into validateOjbList so these are available to insert/update code. 

        validateObjList["recordError"] = recordError; // key is "recordError", value recordError is a td
        // that can hold the record level validation message (like "Please try again"). 

        validateObjList["saveButton"] = saveButton; // key is "saveButton", value is the Save Button (DOM element).

    } // createValidationArea


    // This will be invoked when URL changes to the user insert URL (check routing table in index.html) 
    // to know exactly what link invokes this function. 
    recipesMods.insert = function () {

        function insertSave() {

            // create a user object from the values that the user has typed into the page.
            var myData = getDataFromUI(validateObjList);

            ajax("webAPIs/insertRecipeAPI.jsp?jsonData=" + myData, processInsert, insertDiv);
            function processInsert(obj) {

                console.log("recipeMods.insert/insertSave/processInsert error msg obj (see next line)");
                console.log(obj);

                // the server prints out a JSON string of an object that holds field level error 
                // messages. The error message object (conveniently) has its fiels named exactly 
                // the same as the input data was named. 

                if (obj.errorMsg.length === 0) { // success
                    obj.errorMsg = "Record successfully inserted.";
                }

                writeErrorObjToUI(obj, validateObjList);
            }
        } //insertSave


        // ************** Entry point for function recipes.insert *********************

        var insertDiv = document.createElement("div");
        insertDiv.classList.add("insertArea");

        var validateObjList = [];

        Utils.make({// don't need a reference to this created DOM element, 
            // so not capturing the return value.
            htmlTag: "h2",
            innerHTML: "New Recipe",
            parent: insertDiv
        });

        var validateTable = Utils.make({
            htmlTag: "table",
            parent: insertDiv
        });

        createValidationArea(validateTable, validateObjList);

        validateObjList["saveButton"].onclick = function () {

            // like an "in progress" message while waiting for AJAX call.
            validateObjList["recordError"].innerHTML = " &nbsp; &nbsp; ...";
            insertSave();
        };

        
        ajax("webAPIs/getTypeAPI.jsp", processTypes, insertDiv);
        function processTypes(obj) {

            if (obj.dbError.length > 0) {
                validateObjList["recipeTypeId"].errorTd.innerHTML += "Programmer Error: Cannot Create Type Pick List";
            } else {
                var selectDOM = Utils.makePickList({
                    list: obj.typeList,
                    keyProp: "recipeTypeId",
                    valueProp: "typeOfRecipe"
                });

                var typeInputTd = validateObjList["recipeTypeId"].inputBox.parentElement;
                typeInputTd.innerHTML = "";
                typeInputTd.appendChild(selectDOM);
                validateObjList["recipeTypeId"].inputBox = selectDOM;
            }
        }
        
        ajax("webAPIs/getUserSelectAPI.jsp", processUserSelect, insertDiv);
        function processUserSelect(obj) {

            if (obj.dbError.length > 0) {
                validateObjList["webUserId"].errorTd.innerHTML += "Programmer Error: Cannot Create Type Pick List";
            } else {
                var selectDOM = Utils.makePickList({
                    list: obj.userSelectList,
                    keyProp: "webUserId",
                    valueProp: "userEmail"
                });

                var typeInputTd = validateObjList["webUserId"].inputBox.parentElement;
                typeInputTd.innerHTML = "";
                typeInputTd.appendChild(selectDOM);
                validateObjList["webUserId"].inputBox = selectDOM;
            }
        }
        
        return insertDiv;

    }; // end of webUsers.insert


    recipesMods.update = function (recipeId) {

        function updateSave() {

            var myData = getDataFromUI(validateObjList);
            ajax("webAPIs/updateRecipeAPI.jsp?jsonData=" + myData, processInsert, updateDiv);
            function processInsert(jsonObj) {

                // the server prints out a JSON string of an object that holds field level error 
                // messages. The error message object (conveniently) has its fiels named exactly 
                // the same as the input data was named. 

                if (jsonObj.errorMsg.length === 0) { // success
                    jsonObj.errorMsg = "Record successfully updated. ";
                }

                writeErrorObjToUI(jsonObj, validateObjList);
            }
        } //updateSave


        // ************** Entry point for function webUsers.update *********************

        console.log("recipes.update called with recipeId " + recipeId);

        var updateDiv = document.createElement("div");
        updateDiv.classList.add("updateArea");

        var validateObjList = [];

        Utils.make({// don't need a reference to this created DOM element, 
            // so not capturing the return value.
            htmlTag: "h2",
            innerHTML: "Update Recipes",
            parent: updateDiv
        });

        var validateTable = Utils.make({
            htmlTag: "table",
            parent: updateDiv
        });

        createValidationArea(validateTable, validateObjList);

        validateObjList["saveButton"].onclick = function () {

            // like an "in progress" message while waiting for AJAX call.
            validateObjList["recordError"].innerHTML = " &nbsp; &nbsp; ...";
            updateSave();
        };

        ajax("webAPIs/getRecipeByIdAPI.jsp?recipeId=" + recipeId, gotRecordById, updateDiv);

        function gotRecordById(recipeObj) { // obj is what got JSON.parsed from Web API's output

            console.log("gotRecordById, recipeObj is next");
            console.log(recipeObj);

            /* Web API property names: "webUserId", "userEmail", "userPassword", "userPassword2", 
             * "image", "birthday", "membershipFee", "userRoleId", "userRoleType", "errorMsg"   */

            validateObjList["recipeId"].inputBox.value = recipeObj.recipeId;
            validateObjList["recipeName"].inputBox.value = recipeObj.recipeName;
            validateObjList["cost"].inputBox.value = recipeObj.cost;
            validateObjList["image"].inputBox.value = recipeObj.image;
            validateObjList["ingredients"].inputBox.value = recipeObj.ingredients;


             // replace role id inputBox with select tag populated from the roles in the database.
            // NOTE: since roles do not change that much, it would be OK to not be so careful 
            // to get the latest roles from the db to populate the role pick list. I am showing this 
            // to you so that you WOULD KNOW how to get the latest pick list from the DB.
            ajax("webAPIs/getTypeAPI.jsp", processRoles, updateDiv);
            function processRoles(obj) {

                if (obj.dbError.length > 0) {
                    validateObjList["recipeTypeId"].errorTd.innerHTML += "Programmer Error: Cannot Create Role Pick List";
                } else {

                    console.log("recipeTypeId is " + recipeObj.recipeTypeId);
                    var selectDOM = Utils.makePickList({
                        list: obj.typeList,
                        keyProp: "recipeTypeId",
                        valueProp: "typeOfRecipe",
                        selectedKey: recipeObj.recipeTypeId

                    });
                    
                    console.log(obj.typeList);

                    var typeInputTd = validateObjList["recipeTypeId"].inputBox.parentElement;
                    typeInputTd.innerHTML = "";
                    typeInputTd.appendChild(selectDOM);
                    validateObjList["recipeTypeId"].inputBox = selectDOM;
                }
            } // processRoles
            
            ajax("webAPIs/getUserSelectAPI.jsp", processUserSelect, updateDiv);
            function processUserSelect(obj) {

                if (obj.dbError.length > 0) {
                    validateObjList["userEmail"].errorTd.innerHTML += "Programmer Error: Cannot Create User Select List";
                } else {

                    console.log("webUserId is " + recipeObj.webUserId);
                    var selectDOM = Utils.makePickList({
                        list: obj.userSelectList,
                        keyProp: "webUserId",
                        valueProp: "userEmail",
                        selectedKey: recipeObj.webUserId

                    });
                    
                    console.log(obj.typeList);

                    var webUserInputTd = validateObjList["webUserId"].inputBox.parentElement;
                    webUserInputTd.innerHTML = "";
                    webUserInputTd.appendChild(selectDOM);
                    validateObjList["webUserId"].inputBox = selectDOM;
                }
            } // processUserSelect
        } // gotRecordById

        return updateDiv;

    }; // end of webUsers.update

    recipesMods.delete = function (idToDelete) {

        var myData = document.createElement("div");
        // parameter properties needed for ajax call: url, successFn, and errorId
        ajax("webAPIs/deleteRecipeAPI.jsp?deleteId=" + idToDelete, processDelete, myData);

        function processDelete(obj) { // function is local to callDeleteAPI
            console.log("successful ajax call");

            // var obj = JSON.parse(httpReq.responseText);  // already done by ajax2...

            // Empty string means sucessful delete. The HTML coder gets to decide how to 
            // deliver the good news.
            if (obj.errorMsg.length === 0) {
                var msg = "Record " + idToDelete + " successfully deleted. ";
                console.log(msg);
                myData.innerHTML = msg; 
            } else {
                console.log("Delete Web API got this error: " + obj.errorMsg);
                myData.innerHTML = "Web API successfully called, but " +
                                    "got this error from the Web API: <br/><br/>" + obj.errorMsg;                
            }
        }
        
        return myData; 
    };

}());  // end of the IIFE