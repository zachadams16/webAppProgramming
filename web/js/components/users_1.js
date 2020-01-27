var users = {};

users.list = function (targetId) {

    // clear out whatever may be currently in the content area
    var contentDOM = document.getElementById(targetId);
    contentDOM.innerHTML = "";

    // Remember: getting a successful ajax call does not mean you got data. 
    // There could have been a DB error (like DB unavailable). 
    ajax2({
        url: "webAPIs/listUsersAPI.jsp",
        successFn: success,
        errorId: targetId
    });

    function success(obj) {

        // var obj = JSON.parse(hreq.responseText); // this already done by function ajax2...
        if (!obj) {
            contentDOM.innerHTML += "Http Request (from AJAX call) did not parse to an object.";
            return;
        }
        console.log(obj);

        if (obj.dbError.length > 0) {
            contentDOM.innerHTML += "Database Error Encountered: " + obj.dbError;
            return;
        }

        var div = document.createElement("div");
        div.style.textAlign = "center";
        contentDOM.appendChild(div);
        div.innerHTML = `
            <h2>Web User List</h2>
            Search Filter:
        `;

        var searchBox = document.createElement("input");
        searchBox.setAttribute("type", "text");
        div.appendChild(searchBox);

        var tableDiv = document.createElement("div");
        contentDOM.appendChild(tableDiv);

        // tweak obj.webUserList to include only the properties you want - combine, delete, etc. 
        var userList = [];
        for (var i = 0; i < obj.webUserList.length; i++) {
            userList[i] = {}; // add new empty object to array

            userList[i].userCredentials = obj.webUserList[i].userEmail + "<br/> PW (to test Logon): " +
                    obj.webUserList[i].userPassword;
            userList[i].image = obj.webUserList[i].image;
            userList[i].birthday = obj.webUserList[i].birthday;
            userList[i].membershipFee = obj.webUserList[i].membershipFee;
            userList[i].role = obj.webUserList[i].userRoleId + "&nbsp;" +
                    obj.webUserList[i].userRoleType;
            userList[i].userId = obj.webUserList[i].webUserId;

            // Remove this once you are done debugging...
            userList[i].errorMsg = obj.webUserList[i].errorMsg;

            // *** NEW: ADD EXTRA COLUMN TO DELETE THE RECORD
            // Note: this needs the word "icon" somewhere in userList[i].delete. Otherwise, the alignTableData function 
            // of TableBuilder will try to turn the delete column (aleady an <img> tag complete with onclick function) 
            // into an <img> tag.
            userList[i].delete = "<img src='" + CRUD_icons.delete + "' alt='delete icon' onclick='users.delete(" +
                    userList[i].userId + ",this)'  />";

        }

        // add click sortable HTML table to the content area

        // ********************** function tableBuilder.build ***********************************
        // params.list: an array of objects that are to be built into an HTML table.
        // params.target: reference to DOM object where HTML table is to be placed (by buildTable) -- 
        //         (this is not the id string but actual reference like you get from method getElementById()
        // params.style: will be added as className to DOM element target,
        // params.orderPropName (string): name of property (of objects in list) for iniial sort
        // params.reverse (boolean): if true, initial sort will be high to low (else low to high). 
        // params.imgWidth: any columns that hold image files will be turned into <img> tags with this width.

        tableBuilder.build({
            list: userList,
            target: tableDiv,
            style: "data",
            orderPropName: "userEmail",
            searchKeyElem: searchBox,
            reverse: false,
            imgWidth: "50px"
        });
    } // end of function success
}; // end of function users.list


// ***** NEW from HW 4 display data *****
// invoke a web API passing in userId to say which record you want to delete. 
// but also remove the row (of the clicked upon icon) from the HTML table -- if Web API sucessful... 
users.delete = function (userId, icon) {


    if (confirm("Do you really want to delete user " + userId + "? ")) {
        console.log("icon that was passed into JS function is printed on next line");
        console.log(icon);

        // HERE YOU HAVE TO CALL THE DELETE API and the success function should run the 
        // following (delete the row that was clicked from the User Interface).
        ajax2({
            url: "webAPIs/deleteUserAPI.jsp" + "?deleteId=" + userId,
            successFn: success,
            errorId: userId
    });
        // icon's parent is cell whose parent is row 
   
    }
    
     function success(obj) {

        // var obj = JSON.parse(hreq.responseText); // this already done by function ajax2...
        if (!obj) {
            return;
        }else{
               // icon's parent is cell whose parent is row 
        var dataRow = icon.parentNode.parentNode;
        var rowIndex = dataRow.rowIndex - 1; // adjust for oolumn header row?
        var dataTable = dataRow.parentNode;
        dataTable.deleteRow(rowIndex);
        }
        console.log(obj);

}
};

// ***** END OF NEW from HW 4 display data *****

// for future implementation...
users.find = function (targetId) {

};