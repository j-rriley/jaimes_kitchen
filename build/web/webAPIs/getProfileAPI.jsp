<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    if(session.getAttribute("loggedOnUser") != null) {
        StringData loggedOnWebUser = (StringData) session.getAttribute("loggedOnUser"); 
        Gson gson = new Gson();
        out.print(gson.toJson(loggedOnWebUser).trim());
    } else {
       StringData noUser = new StringData(); 
       noUser.errorMsg = "No user logged on."; 
       Gson gson = new Gson(); 
       out.print(gson.toJson(noUser).trim());
    }
%>
