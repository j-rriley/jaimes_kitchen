function makeBooklet(params) {

    //Parameter object conversion
    var jsonList = params.jsonList; 
    var headingProperty = params.headingProperty; 
    var frontInfo = params.frontInfo; 
    var backInfo = params.backInfo; 
    
    //Container for all of the elements
    var container = document.createElement("div");
    container.setAttribute("id", "container"); 

    //Elements for navigation bar
    var navBar = document.createElement("div");
    navBar.classList.add("navBar");
    navBar.id = "navbar";

    //Elements for progress container
    var progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");
    var progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressContainer.appendChild(progressBar); 
    progressBar.setAttribute("id", "myBar" +jsonList);

    //Elements and functions for flip box
    var flipBoxesContainer = document.createElement("div");
    flipBoxesContainer.setAttribute("id", "flipBoxesContainer");



    var headers = []; //Array to hold headers to avoid repeats
    //Adding headers based off headingProperty
    function createHeaders() {
        for (var i = 0; i < jsonList.length; i++) {
            if (!headers.includes(jsonList[i][headingProperty])) {
                headers.push(jsonList[i][headingProperty]);
            }
        }
        headers.push("All");
        headers.forEach(function (e) {
            var headingItem = document.createElement("div");
            headingItem.classList.add("headerItem");
            headingItem.setAttribute('id', e);
            console.log("setting up " + e);
            headingItem.addEventListener("click", function () {
                console.log("Something was clicked! It was " + e);
                executeFlipBoxes(e);
            });
            headingItem.innerHTML = prettyColumnHeading(e);
            navBar.appendChild(headingItem);
        })
    } //End of headers created

    //Scroll indicator code
    flipBoxesContainer.onscroll = function () {
        scrollIndication();
    };

    function scrollIndication(scrolled) {
        var winScroll = flipBoxesContainer.scrollTop;
        console.log("winScroll: " +winScroll); 
        var height = flipBoxesContainer.scrollHeight - flipBoxesContainer.clientHeight;
        console.log("height: " +height); 
        var scrolled = (winScroll / height) * 100;
        document.getElementById("myBar" +jsonList).style.width = scrolled + "%";
        console.log("Scroll is changing! New height of scroll: " + flipBoxesContainer.scrollHeight); 
        if(scrolled !== null) {
            scrolled = 0; 
        }
        
    }
  
  
    function resetScroll() {
        scrollIndication(0); 
    }

    //In order to sort by header
    function clearFlipBoxes() {
        console.log("Flip boxes being cleared");
        flipBoxesContainer.innerHTML = "";
    }


    //Only showing based off header clicked, if any
    function createFlipBoxes(heading) {
        var list;
        console.log("Time to create flip boxes");

        //Sorting by header if click occurred
        if (heading !== null && heading !== "All") {
            console.log("heading isnt null! time to compare " + headingProperty);
            list = [];
            for (var obj in jsonList) {
                console.log("comparing " + jsonList[obj][headingProperty] + " to " + heading);

                if (jsonList[obj][headingProperty] === heading) {
                    list.push(jsonList[obj]);
                }
            }
        } else { //Using full list if not clicked or if clicked on all
            console.log("heading is null or all");
            list = jsonList;
        }

        for (var i = 0; i < list.length; i++) {
            var flipBox = document.createElement("div");
            flipBox.classList.add("flip-box");

            var flipBoxInner = document.createElement("div");
            flipBoxInner.classList.add("flip-box-inner");

            var flipBoxFront = document.createElement("div");
            flipBoxFront.classList.add("flip-box-front");

            var flipBoxBack = document.createElement("div");
            flipBoxBack.classList.add("flip-box-back");

            console.log("length of back info: " + backInfo.length);

            for (var j = 0; j < frontInfo.length; j++) {
                var data = document.createElement("h2");
                var variable = frontInfo[j];
                data.innerHTML = prettyColumnHeading(frontInfo[j]) + ": " + list[i][variable];
                flipBoxFront.appendChild(data);
            }

            for (var k = 0; k < backInfo.length; k++) {
                var data = document.createElement("h2");
                data.innerHTML = prettyColumnHeading(backInfo[k]) + ": " + list[i][backInfo[k]];
                flipBoxBack.appendChild(data);
            }

            flipBoxInner.appendChild(flipBoxFront);
            flipBoxInner.appendChild(flipBoxBack);
            flipBox.appendChild(flipBoxInner);
            flipBoxesContainer.appendChild(flipBox);
        }
    }


    function executeFlipBoxes(heading) {
        resetScroll();
        clearFlipBoxes();
        createFlipBoxes(heading);
    }


    //Making sure images show as images
    function checkForImage(obj) {
        if (obj["image"] !== null) {
            var image = obj["image"];
            obj["image"] = "<img src='" + image + "' style='width:5rem'>";
        }
    }
    ;
    function fixImages() {
        for (var obj in jsonList) {
            checkForImage(jsonList[obj]);
        }
    }

    //Fixing the look of column headings
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
    
    container.setBarColor = function(color) {
         progressBar.style.background = color; 
    };

    fixImages();
    console.log("Setting up headers... element chosen was " + headingProperty);
    createHeaders();
    createFlipBoxes(null);
    container.appendChild(navBar);
    container.appendChild(flipBoxesContainer);
    container.appendChild(progressContainer); 


    console.log("Widget created!")
    return container;
}