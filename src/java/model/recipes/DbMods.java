      /*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model.recipes;

import dbUtils.DbConn;
import dbUtils.FormatUtils;
import dbUtils.PrepStatement;
import dbUtils.ValidationUtils;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 *
 * @author jaime
 */
public class DbMods {

    /*
    Returns a "StringData" object that is full of field level validation
    error messages (or it is full of all empty strings if inputData
    totally passed validation.  
     */
    
    public static StringData findById(DbConn dbc, String id) {
 
        // The find API needs to represent three cases: found web_user, not found, db error. 

        StringData sd = new StringData();
        try {
            String sql = "SELECT * "
                    + "FROM recipes, web_user, recipe_type "
                    + "WHERE recipe_id = ?"
                    + "AND web_user.web_user_id = recipes.web_user_id "
                    + "AND recipe_type.recipe_type_id = recipes.recipe_type_id";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set

                // plainInteger returns integer converted to string with no commas.
                sd.recipeId = FormatUtils.plainInteger(results.getObject("recipe_id"));
                sd.recipeName = FormatUtils.formatString(results.getObject("recipe_name"));
                sd.webUserId = FormatUtils.plainInteger(results.getObject("recipes.web_user_id"));
                sd.userEmail = FormatUtils.formatString(results.getObject("user_email"));
                sd.image = FormatUtils.formatString(results.getObject("image"));
                sd.cost = FormatUtils.formatDollar(results.getObject("cost"));
                sd.ingredients = FormatUtils.formatString(results.getObject("ingredients"));
                sd.recipeTypeId = FormatUtils.plainInteger(results.getObject("recipes.recipe_type_id"));
                sd.typeOfRecipe = FormatUtils.formatString(results.getObject("recipe_type.type_of_recipe"));
                
            } else {
                sd.errorMsg = "Recipe Not Found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in DbMods.findById(): " + e.getMessage();
        }
        return sd;

    } // findById
    private static model.recipes.StringData validate(model.recipes.StringData inputData) {

        model.recipes.StringData errorMsgs = new model.recipes.StringData();

        /* Useful to copy field names from StringData as a reference
    public String recipeId = "";
    public String recipeName = "";
    public String ingredients = "";
    public String image = "";
    public String cost = "";
    public String typeOfRecipe = "";
    public String webUserId = "";   
    public String userEmail = "";
    public String birthday = "";
             // getting it from joined user_role table.
         */
        // Validation
        errorMsgs.recipeName = ValidationUtils.stringValidationMsg(inputData.recipeName, 45, false);
        errorMsgs.ingredients = ValidationUtils.stringValidationMsg(inputData.ingredients, 500, false);
        //errorMsgs.image = ValidationUtils.stringValidationMsg(inputData.image, 200, true);
        errorMsgs.cost = ValidationUtils.decimalValidationMsg(inputData.cost, false);

        return errorMsgs;
    } // validate 

    public static model.recipes.StringData insert (model.recipes.StringData inputData, DbConn dbc) {

        model.recipes.StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /*
                  String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "+
                    "web_user.user_role_id, user_role_type "+
                    "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id " + 
                    "ORDER BY web_user_id ";
             */
            // Start preparing SQL statement
            String sql = "INSERT INTO recipes (recipe_name, recipe_type_id, ingredients, cost, images, web_user_id) "
                    + "values (?,?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.recipeName); // string type is simple
            pStatement.setString(2, inputData.recipeTypeId);
            pStatement.setString(3, inputData.ingredients);            
            pStatement.setBigDecimal(4, ValidationUtils.decimalConversion(inputData.cost));
            pStatement.setString(5, inputData.image);        
            pStatement.setString(6, inputData.webUserId); 

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Recipe Type Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That recipe name is already taken.";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert
    
    public static model.recipes.StringData update(model.recipes.StringData inputData, DbConn dbc) {

        model.recipes.StringData errorMsgs = new model.recipes.StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /*
                String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "+
                    "web_user.user_role_id, user_role_type "+
                    "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id " + 
                    "ORDER BY web_user_id ";
             */
            String sql = "UPDATE recipes SET ingredients=?, images=?, cost=?, recipe_name=?, "
                    + " recipe_type_id=?, web_user_id=? WHERE recipe_id= ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.ingredients);
            pStatement.setString(2, inputData.image);
            pStatement.setBigDecimal(3, ValidationUtils.decimalConversion(inputData.cost));
            pStatement.setString(4, inputData.recipeName);
            pStatement.setInt(5, ValidationUtils.integerConversion(inputData.recipeTypeId));
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.webUserId));
            pStatement.setInt(7, ValidationUtils.integerConversion(inputData.recipeId));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were updated (expected to update one record).";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Recipe Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That recipe name is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update

    // method delete returns "" (empty string) if the delete worked fine. Otherwise, 
    // it returns an error message.
    public static String delete(String recipeId, DbConn dbc) {

        if (recipeId == null) {
            return "Error in model.recipes.DbMods.delete: cannot delete recipe record because 'recipeId' is null";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM recipes WHERE recipe_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, recipeId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Record not deleted - there was no record with recipe_id " + recipeId;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.recipes.DbMods.delete(): " + e.getMessage();
        }

        return result;
    }
}
