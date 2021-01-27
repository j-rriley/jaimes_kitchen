package model.recipes;

import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * character data that the user might type in when they want to 
 * add a new Customer or edit an existing customer.  This String
 * data is "pre-validated" data, meaning they might have typed 
 * in a character string where a number was expected.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData { 

    public String recipeId = "";
    public String recipeName = "";
    public String ingredients = "";
    public String image = "";
    public String cost = "";
    public String userEmail = "";
    public String webUserId = ""; 
    public String recipeTypeId = "";
    public String typeOfRecipe = "";
    
    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            // plainInteger returns integer converted to string with no commas.
            this.recipeId = FormatUtils.plainInteger(results.getObject("recipe_id"));
            this.recipeName = FormatUtils.formatString(results.getObject("recipe_name"));
            this.ingredients = FormatUtils.formatString(results.getObject("ingredients"));
            this.image = FormatUtils.formatString(results.getObject("images"));
            this.cost = FormatUtils.formatDollar(results.getObject("cost"));
            this.userEmail = FormatUtils.formatString(results.getObject("user_email"));
            this.recipeTypeId = FormatUtils.plainInteger(results.getObject("recipe_type_id"));
            this.typeOfRecipe = FormatUtils.formatString(results.getObject("type_of_recipe"));
            this.webUserId = FormatUtils.plainInteger(results.getObject("web_user_id")); 
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.recipes.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.recipeId + this.recipeName + this.image + this.ingredients
                + this.cost + this.userEmail + this.webUserId+ this.recipeTypeId + this.typeOfRecipe; 
        return s.length();
    }

    public String toString() {
        return "Recipe Id" + this.recipeId
                + ", Recipe Name: " + this.recipeName
                + ", Image: " + this.image
                + ", Ingredients: " + this.ingredients
                + ", Cost: " + this.cost
                + ", User Email: " + this.userEmail
                + ", Recipe Type Id: " + this.recipeTypeId
                + ", Recipe Type: " +this.typeOfRecipe 
                + ", Web User Id: " +this.webUserId; 
    }
}
