function users() {
    var clickSortContainer = document.createElement("div");
    clickSortContainer.classList.add("clickSort");
    ajax("json/users.json", processUsers, clickSortContainer);
    
    function processUsers(list) {
        var userList = [];
        for(var i = 0; i < list.length; i++) {
            userList[i] = {};
            userList[i].image = "<img src='" + list[i].image + "' style='width:5rem'>";
            userList[i].userEmail = list[i].userEmail; 
            userList[i].birthday = list[i].birthday; 
            userList[i].membershipFee = list[i].membershipFee; 
            userList[i].role = list[i].userRoleId + " " + list[i].userRoleType; 
        }
        
        var myClickSort = MakeClickSort( {
            list : userList,
            sortOrderPropName : "image", 
            sortIcon : "pics/sortUpDown16.png",
            heading : "User List"
        }); 
        clickSortContainer.appendChild(myClickSort); 
    }
    
    return clickSortContainer; 
}