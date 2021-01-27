<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.recipes.*" %> 
<%@page language="java" import="view.RecipeView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    StringData sd = new StringData();
    String searchId = request.getParameter("recipeId");
    if (searchId == null) {
        sd.errorMsg = "Cannot search for recipe - 'recipeId' most be supplied";
    } else {
        DbConn dbc = new DbConn();
        sd.errorMsg = dbc.getErr(); 
        if (sd.errorMsg.length() == 0) { 
            System.out.println("*** Ready to call DbMods.findById");
            sd = model.recipes.DbMods.findById(dbc, searchId);   
        }
        dbc.close(); 
    }
    Gson gson = new Gson();
    out.print(gson.toJson(sd).trim());
%>