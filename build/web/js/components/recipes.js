function recipes() {
    var clickSortContainer = document.createElement("div");
    clickSortContainer.classList.add("clickSort");
    ajax("json/recipes.json", processRecipes, clickSortContainer);
    
    function processRecipes(list) {
        var recipeList = [];
        for(var i = 0; i < list.length; i++) {
            recipeList[i] = {};
            recipeList[i].recipeName = list[i].recipeName; 
            recipeList[i].image = "<img src='" + list[i].image + "' style='width:8rem'>"; 
            recipeList[i].typeOfRecipe = list[i].typeOfRecipe;
            recipeList[i].ingredients = list[i].ingredients; 
            recipeList[i].cost = "$" +list[i].cost;
            recipeList[i].userEmail = list[i].userEmail; 
            recipeList[i].role = list[i].userRoleType; 
        }
        
        var myClickSort = MakeClickSort( {
            list : recipeList,
            sortOrderPropName :  "recipeName", 
            sortIcon : "pics/sortUpDown16.png",
            heading : "Recipe List"
        }); 
        clickSortContainer.appendChild(myClickSort); 
    }
    
    return clickSortContainer; 
}