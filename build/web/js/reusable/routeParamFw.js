// Sally's JS naming convention: every JS file shall be named the same as the 
// single function or object that is defined within the JS file. This helps you 
// organize and find your code.

"use strict";
function routeParamFw(params) {

    var fw = {}; // creating and adorning this object to be passed back to the HTML page.

    // Providing a parameter object instead of a parameter list is good software design. 
    // It makes the call to the function be more self documenting and order of parameters 
    // does not matter. 

    // Here's how you can either accept a preference or set a default value in one line of code. 
    // For example, if the params object has a contentId property, you use that, otherwise,
    // you set it to "view".
    var contentId = params.contentId || "view";
    var startLink = params.startLink || "#/home";
    console.log("startLink is " + startLink);

    if (!params.routeArray || params.routeArray[0]) {
        alert("parameter object must specify array 'routeArray' with at least one element");
        return;
    }

    // Declare a (private) array to store the routes.
    var routes = params.routeArray;
    function inject(what) {
        document.getElementById(contentId).innerHTML = "";
        document.getElementById(contentId).appendChild(what);
    }

    // return an object that has the URL's funcName and param as properties. 
    // the param is whatever is after the last / (if there is more than one / in the original path. 
    // extract the parameter value from the path. 
    // the parameter is defined as being whatever is after the last '/' in the path...
    function parsePath(path) {

        // start out assuming that this is a parameterless path (URL)
        var obj = {
            param: "",
            funcName: path
        };

        // search for last '/' in the path (URL)
        var n = path.lastIndexOf("/");

        // n = -1 means no '/' 
        // #/home would be a "normal" (parameterless) URL. For this, n would be 1 
        // (indicating the last/only '/' in the URL).
        if (n > 1) {
            obj.param = path.substring(n + 1);
            console.log('routParamFw extracted parameter [' + obj.param + '] from path [' + path + ']');
            obj.funcName = path.substring(0, n);
        }
        console.log("*** parsePath: path is [" + path + "] param is [" + obj.param + "] and funcName is [" + obj.funcName + "]");
        return obj;
    } // parsePath

    // private function that will be called whenever a link is clicked (or href changed)
    function router() {

        var path = location.hash;

        var ele;
        var pathObj = parsePath(path);
        if (!routes[pathObj.funcName]) {  // the funcName of the URL was never registered in the routing table

            ele = document.createElement("div");
            ele.innerHTML = "<p>Error: unknown link '" + pathObj.funcName
                    + "' was never added to the routing table.</p>";

        } else if (pathObj.param.length > 0) { // if this URL has a parameter after the last /

            // Invoke the function that's stored in the routing table, passing in the parameter. 
            ele = routes[pathObj.funcName](pathObj.param);

        } else {  //    This is a "regular" URL with no parameters, so dont pass any parameters into 
            // the single use component.
            var ele = routes[pathObj.funcName](); // returns DOM element from the function stored in the routes associative array
        }

        inject(ele);
    } // router


    fw.printRoutes = function () {
        console.log("routes will be printed on the next line ");
        // if you console.log an object (by itself), you'll be able to see all of it's 
        // contents (don't precede with character string and concatenate).
        console.log(routes);
    };

    // Whenever a link is clicked (or window.location.hash changes), 
    // invoke function router (defined below).
    window.addEventListener('hashchange', router);
    // without this line of code,  sometimes you'll get an empty content, e.g., 
    // when you refresh the page but the link didn't change.
    location.hash = "xxx";
    // without this line of code, initial rendering will have no content.
    // HTML coder must define a component (function) for "#/" to specify
    // which initial component function should run at page load time.
    location.hash = startLink;
    console.log("initial location.hash is " + location.hash);
    return fw;
}