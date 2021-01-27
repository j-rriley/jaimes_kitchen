package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.recipeType.*;

// classes in my project
import dbUtils.*;

public class TypeView {

    public static StringDataList getAllRoles(DbConn dbc) {

        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT * "+
                    "FROM recipe_type";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in TypeView.allRolesAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}