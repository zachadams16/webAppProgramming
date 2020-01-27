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
    session.invalidate();
    System.out.println("logoff successfull");
    
%>
