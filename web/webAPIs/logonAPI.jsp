<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>


<%
    StringData sd = new StringData();
    String emailId = request.getParameter("email");
    String passwordId = request.getParameter("password"); 
    if (emailId == null || passwordId == null) {
        sd.errorMsg = "Cannot search for user - 'email' and 'password' must be supplied";
    } else {
        DbConn dbc = new DbConn();
        sd.errorMsg = dbc.getErr(); 
        if (sd.errorMsg.length() == 0) { 
            System.out.println("*** Ready to call DbMods.findByLogIn()");
            sd = DbMods.findByLogIn(dbc, emailId, passwordId);  
        }
        dbc.close(); 
    }
    
    Gson gson = new Gson();
    out.print(gson.toJson(sd).trim());
    session.setAttribute("loggedOnUser", sd);
%>