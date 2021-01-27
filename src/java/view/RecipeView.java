package view;

// classes imported from java.sql.*
import model.recipes.StringData;
import model.recipes.StringDataList;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

// classes in my project
import dbUtils.*;

public class RecipeView {

    public static StringDataList getAllUsers(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT *" +
                    "FROM recipes, web_user, recipe_type " +
                    "WHERE recipes.web_user_id = web_user.web_user_id AND recipes.recipe_type_id = recipe_type.recipe_type_id " +
                    "ORDER BY recipe_id ";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in RecipeView.allUsersAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}