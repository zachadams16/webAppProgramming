<%-- 
    Document   : logonAPI.jsp
    Created on : Oct 10, 2019, 9:30:27 AM
    Author     : tug39317
--%>
<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    StringDataList list = new StringDataList();
    StringData list1 = new StringData();
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    
    if (email == null || password == null) {
        list.dbError = "Cannot search for user - email and password most be supplied";
    } else {

        DbConn dbc = new DbConn();
        list.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (list.dbError.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call allUsersAPI");
            list1 = DbMods.logonFind(email,password, dbc);
        }
        if(list1==null){
            System.out.println("it is null");
        }else{
            list.add(list1);
            session.setAttribute ("webUser", list1);
        }
        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
%>
