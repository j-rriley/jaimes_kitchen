<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    StringData sd = new StringData(); 
    System.out.print("Attempt to log out user...");
    if(session.getAttribute("loggedOnUser") != null) {
        session.invalidate(); 
        System.out.print("Logging out user...");
        sd.errorMsg = "No user is logged in."; 
    } else {
        System.out.print("User never logged in.");
    }
    Gson gson = new Gson();
    out.print(gson.toJson(sd).trim());
%>
