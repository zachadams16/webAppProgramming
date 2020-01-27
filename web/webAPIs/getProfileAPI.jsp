<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    StringData loggedOnWebUser = (StringData) session.getAttribute("webUser"); 
    StringDataList list = new StringDataList();
    
    DbConn dbc = new DbConn();
    list.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
    
    if (loggedOnWebUser == null) { // if got good DB connection,
           System.out.println("null");
    }else{
        list.add(loggedOnWebUser);
        Gson gson = new Gson();
        out.print(gson.toJson(list).trim());
    }

      dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.


%>