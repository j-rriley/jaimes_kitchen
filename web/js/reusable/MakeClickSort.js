function MakeClickSort(params) {
    
    var list = params.list; 
    var sortOrderPropName = params.sortOrderPropName;
    var sortIcon = params.sortIcon;
    var heading = params.heading; 
    
    console.log("here is our list:" +list);
    function jsSort(list, byProperty) {

        // To use the built-in sort method (that is available to any JS array),
        // you pass it a function that compares two of the elements of the array
        // and returns 1, 0 or -1 depending on how the two elements compare with each other.

        list.sort(// takes in one parameter -- a function that compares two elements in the list...

                function (q, z) {  // in line anonymous fn to compare list elements: 
                    // return positive (if first bigger), 0 if equal, negative otherwise.

                    // Remember q and z are arbitrary elements of list and our job is to say whether q is bigger or z... 
                    // We are supposed to decide based on the value of "byProperty" (which is a string 
                    // hoding the name of the property by which we want to sort). 
                    // 
                    // To get the actual values to compare, use JS associative array notation: z[byProperty}, z[byProperty].
                    // 
                    // Next, we add function "convert" into the mix. It checks the value (which may be 
                    // a number or date stored in a String). It just converts the value to its actual data type, 
                    // like numer or date, so it can compare accurately for the sort. 
                    var qVal = convert(q[byProperty]);
                    var zVal = convert(z[byProperty]);

                    var c = 0;
                    if (qVal > zVal) {
                        c = 1;
                    } else if (qVal < zVal) {
                        c = -1;
                    }
                    console.log("comparing " + qVal + " to " + zVal + " is " + c);
                    return c;
                } // end of the anonymous comparision function
        );

        // check the string to see what type it is, then return that string converted to the right type 
        // so as to get the sort order correct. 
        function convert(s) {

            if (!s || s.length === 0) {
                //console.log("s is null or empty string");
                return -1;
            }

            // a string that holds a date returns true for isNaN(strDate) (it's not a number)  
            // And it returns false for isNaN(Date.parse(strDate))
            var parsedDate = Date.parse(s);
            if (isNaN(s) && !isNaN(parsedDate)) {
                //console.log(s + " is a Date ");
                return parsedDate;
            } else {
                var tmp = s;
                console.log("tmp is " + tmp);
                tmp = tmp.replace("$", ""); // remove dollar signs
                tmp = tmp.replace(",", ""); // remove commas
                if (isNaN(tmp)) { // if not a number, return what was passed in 
                    //console.log(s + " is a string - convert to uppercase for sorting purposes");
                    return s.toUpperCase();
                } else {
                    //console.log(tmp + " is a number");
                    return Number(tmp);
                }
            }
        } // convert 

    } // jsSort


    // Add data as th or td (based on eleType) to row of HTML table.
    function addToRow(eleType, row, data, alignment, icon) {
        var ele = document.createElement(eleType);
        if(eleType === "th") {
           ele.innerHTML = icon + data;
        }
        else {
           ele.innerHTML = data;
        }
        ele.style.textAlign = alignment;
        row.appendChild(ele);
        return ele;  // future code may need a reference to this dom object
    }

    // Return alignment ("left", "right", "center") based on data type in 
    // val (e.g., if val contains "123" (which can be converted to numeric), return "right". 
    function alignment(val) {

        // check if date
        var parsedDate = Date.parse(val);
        if (isNaN(val) && (!isNaN(parsedDate))) {
            return "center";
        }

        // check if numeric (remove $ and , and then check if numeric)
        var possibleNum = val.replace("$", "");
        possibleNum = possibleNum.replace(",", "");
        if (isNaN(possibleNum)) {
            return "left";
        }
        return "right"; // it's a number

    } // alignment
    
    function prettyColumnHeading(propName) {

        if (propName.length === 0) {
            return "";
        }

        // studentId --> Student Id
        // capitalize first letter
        var newHdg = propName.charAt(0).toUpperCase();
        // iterate through all characters, inserting space before any capital letters.
        for (var i = 1; i < propName.length; i++) {
            if (propName.charAt(i) < "a") {
                newHdg += " ";
            }
            newHdg += propName.charAt(i);
        }

        return newHdg;
    } // prettyColumnHeading

    function addTableHead (table, list) {

        // Create a thead element, place it in table, then 
        // fill up the thead with td elements that are column headers 
        // (populated by the field names from the first object in list). 
        
        var tableHead = document.createElement("thead");
        table.appendChild(tableHead);

        
        var tableHeadRow = document.createElement("tr");
        tableHead.appendChild(tableHeadRow);

        // create one column header per property - column header will show the property name. 
        var obj = list[0];
        for (var prop in obj) {
            console.log("setting the sort onclick for column " + prop);
            var iconProp = "<img src='"+ sortIcon +"'/>";
            var colHead = addToRow("th", tableHeadRow, prettyColumnHeading(prop), alignment(obj[prop]), iconProp);

            // place the property name right into the DOM element that is the "th"
            // Because later when the "th" is clicked "prop" will be the last property
            // (cause this for loop would have already completed). 
            colHead.sortPropName = prop;
            colHead.reverse = false; 
            colHead.onclick = function () {
                // "this" means the DOM lement clicked upon. Take the sortPropName (that
                // we stored in the "th" when the "th" was originally made) and use that
                // for sort order. 
                if(this.reverse === false) {
                    alert("Toggle forwards for " + this.sortPropName); 
                    console.log("ready to sort by " + this.sortPropName);
                    addTableBody(table, list, this.sortPropName, "forward");
                }
                else {     
                    alert("Toggle backwards for " + this.sortPropName); 
                    console.log("ready to sort by " + this.sortPropName);
                    addTableBody(table, list, this.sortPropName, "backwards");
                }
                this.reverse = !this.reverse; 
            };
        }
    }


    // sort 'list' by 'sortOrderPropName', remove the tbody from 'table' (if there is one), 
    // then build a new tbody (from the sorted list) and insert that tbody into the table.  
    function addTableBody (table, list, sortOrderPropName, direction) {

        // remove old tbody element if there is one (else you'll get sorted rows added to end of what's there).
        var oldBody = table.getElementsByTagName("tbody");
        if (oldBody[0]) {
            console.log("ready to remove oldBody");
            table.removeChild(oldBody[0]);
        }

        jsSort(list, sortOrderPropName);

        // Add one row (to HTML table) per element in the array.
        // Each array element has a list of properties that will become 
        // td elements (Table Data, a cell) in the HTML table. 
        var tableBody = document.createElement("tbody");
        table.appendChild(tableBody);
        
        if(direction === "forward") {
            
        }
        else {
            list = list.reverse(); 
        }
        for (var i in list) {
            var tableRow = document.createElement("tr");
            tableBody.appendChild(tableRow);

            // create one table data <td> content matching the property name
            var obj = list[i];
            for (var prop in obj) {
                addToRow("td", tableRow, obj[prop], alignment(obj[prop]));
            }
        }

    } // addTableBody

// return true if any property of obj contains searchKey. Else return false.
    function isToShow(obj, searchKey) {
        if (!searchKey || searchKey.length === 0) {
            return true; // show the object if searchKey is empty
        }
        var searchKeyUpper = searchKey.toUpperCase();
        for (var prop in obj) {
            var propVal = obj[prop]; // associative array, using property name as if index. 
            console.log("checking if " + searchKeyUpper + " is in " + propVal);
            var propValUpper = propVal.toUpperCase();
            if (propValUpper.includes(searchKeyUpper)) {

                // do not say it's a hit if it's an image tag 
                // that can have a really long URL in its src attribute.
                if (!propValUpper.includes("<IMG")) {
                    console.log("yes it is inside");
                    return true;
                }
            }
        }
        console.log("no it is not inside");
        return false;
    } // isToShow 

    function RefreshTableBody(filterValue, table, objList) {

        // Add one row (to HTML table) per element in the array.
        // Each array element has a list of properties that will become 
        // td elements (Table Data, a cell) in the HTML table. 
        var tableBody = document.createElement("tbody");

        for (var i in list) {
            if (isToShow(objList[i], filterValue)) {
                console.log("adding row " + i + " to the HTML table");

                var tableRow = document.createElement("tr");
                tableBody.appendChild(tableRow);

                // create one table data <td> content matching the property name
                var obj = objList[i];
                for (var prop in obj) {
                    addToRow("td", tableRow, obj[prop], alignment(obj[prop]));
                }

            } else {
                console.log("not adding row " + i + " to the HTML table");
            }
        } // for loop 

        // remove old tbody element if there is one (else you'll get sorted rows added to end of what's there).
        var oldBody = table.getElementsByTagName("tbody");
        if (oldBody[0]) {
            console.log("ready to remove oldBody");
            table.removeChild(oldBody[0]);
        }
        table.appendChild(tableBody);

    } // RefreshTableBody

    // Entry Point of MakeClickSort
    console.log("function MakeClickSort called with initial sort: " + sortOrderPropName);

    var div = document.createElement("div");
    var newTable = document.createElement("table");
    var tableTitle = document.createElement("h2");
    
    
    var div2 = document.createElement("div");
    div2.innerHTML = "Filter by: ";

    // Create a filter text box for user input and append it.
    var searchInput = document.createElement("input");
    div2.appendChild(searchInput);
    
    
    tableTitle.innerHTML = heading; 
    div.appendChild(tableTitle); 
    div.appendChild(div2);
    addTableHead (newTable, list);
    addTableBody (newTable, list, sortOrderPropName, "forward");
    div.appendChild(newTable); 


    // Initially searchInput.value should be "" and when passing that to 
    // function isToShow should always return meaning all rows will initially show. 
    RefreshTableBody(searchInput.value, newTable, list);

    searchInput.onkeyup = function () {
        console.log("search filter changed to " + searchInput.value);
        RefreshTableBody(searchInput.value, newTable, list);
    };
    // this can be injected into the content area by other code
    
    console.log("we built a table");
    return div;
}