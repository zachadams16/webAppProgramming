var users = {};

(function () {

users.list = function (targetId) {

    var contentDOM = document.getElementById(targetId);

    // clear out whatever may be currently in the content area
    contentDOM.innerHTML = "";

    // ajax parameters: 
    //   url for ajax call (Web API)
    //   name of callback function to run if ajax call successful. 
    //   id where to place error message if ajax call not successful. 
    //   
    // Remember: getting a DB error does NOT mean ajax call unsuccessful. That is a secondary error after OK ajax call.
    ajax("webAPIs/listUsersAPI.jsp", success, targetId);

    function success(hreq) {

        console.log(hreq);
        var obj = JSON.parse(hreq.responseText);
        if (!obj) {
            contentDOM.innerHTML += "Http Request (from AJAX call) did not parse to an object.";
            return;
        }
        console.log(obj);

        if (obj.dbError.length > 0) {
            contentDOM.innerHTML += "Database Error Encountered: " + obj.dbError;
            return;
        }
       
            // Want the User List UI (plus headings and search filter) all to be centered. 
            // Cannot be sure content area will be like this, so create a div inside of the 
            // content area and set the div to be aligned center (HTML table will be styled 
            // margin: auto to make it centered as well). 
            var div = Utils.make({
                htmlTag: "div",
                parent: contentDOM
            });
            div.style.textAlign = "center";

            var heading = Utils.make({
                htmlTag: "h2",
                parent: div
            });

            Utils.make({// don't need reference to this span tag...
                htmlTag: "span",
                innerHTML: "Web User List ",
                parent: heading
            });

            var img = Utils.make({
                htmlTag: "img",
                parent: heading
            });
            img.src = CRUD_icons.insert;
            img.onclick = function () { // you cant pass input params directly into an event handler

                // Originally I had this line of code here:  
                //     users.insertUI(targetId);
                // And that worked (insert UI displayed and save worked), BUT, afterwards, if you tried to re-run 
                // the user list, nothing would happen -- because this would cause no change in the 
                // browser's address bar (the window.location.hash).  
                // 
                // The solution here is to invoke the user insert UI through a routing rule (since we 
                // happen to have "user register" that can be directly invoked). 
                // For "other" insert (even though you probably won't have a Nav Bar link for inserting "other", 
                // you may need to create a routing rule and invoke that similarly (from the "other" list UI).
                window.location.hash = "#/userInsert";
            };

            Utils.make({
                htmlTag: "span",
                innerHTML: " Search Filter: ",
                parent: div
            });

            var searchBox = Utils.make({
                htmlTag: "input",
                parent: div
            });
            searchBox.type = "text";
            //searchBox.setAttribute("type", "text");  // same thing...

            var deleteErrorMsg = Utils.make({
                htmlTag: "div",
                innerHTML: "",
                parent: div
            });
            deleteErrorMsg.id = "deleteErrorMsgId";

            var tableDiv = Utils.make({
                htmlTag: "div",
                parent: div
            });

        // tweak obj.webUserList to include only the properties you want - combine, delete, etc. 
        var userList = [];
        for (var i = 0; i < obj.UserList.length; i++) {
            userList[i] = {}; // add new empty object to array
            userList[i].userCredentials = obj.UserList[i].userEmail + "<br/> PW (to test Logon): " +
                obj.UserList[i].userPassword;
            userList[i].userImage = obj.UserList[i].userImage;
            userList[i].birthday = obj.UserList[i].birthday;
            userList[i].membershipFee = obj.UserList[i].membershipFee;
            userList[i].role = obj.UserList[i].userRoleId + "&nbsp;" +
                    obj.UserList[i].userRoleType;
            userList[i].userId = obj.UserList[i].webUserId;
            
            // Remove this once you are done debugging...
            userList[i].errorMsg = obj.UserList[i].errorMsg;
            
             userList[i].update = "<img src='" + CRUD_icons.update + "' alt='update icon' onclick='users.updateUI(" +
                        userList[i].userId + ", `" + targetId + "` )' />";
                
           userList[i].delete = "<img src='" + CRUD_icons.delete + "' alt='delete icon' onclick='users.delete(" +
                    userList[i].userId + ",this)'  />";

        }

        // add click sortable HTML table to the content area

        // ********************** function tableBuilder.build ***********************************
        // params.list: an array of objects that are to be built into an HTML table.
        // params.target: reference to DOM object where HTML table is to be placed (by buildTable) -- 
        //         (this is not the id string but actual reference like you get from method getElementById()
        // params.sortIcon: name of image file to be used when building the column headings
        // params.orderPropName (string): name of property (of objects in list) by which to sort
        // params.reverse (boolean): if true sort high to low, else sort low to high.

        tableBuilder.build({
            list: userList,
            searchKeyElem: searchBox,
            style: "data",
            imgWidth: "50px",
            target: tableDiv,
            sortIcon: "icons/sortUpDown16.png",
            orderPropName: "userEmail",
            reverse: false
        });
    } // end of function success

}; // end of function users

users.findUI = function (targetId) {

    console.log("users.findUI was called");

    var contentDOM = document.getElementById(targetId);
    var content = `
        <div class='logon'>
            <br/>
            Enter Id <input type="text" id="findId"/>
            &nbsp;
            <input type="button" value="Submit" onclick="users.findById('findId','msgArea')"/>
            <br/> <br/>
            <div id="msgArea"></div> 
        </div>
    `;
    contentDOM.innerHTML = content;
};

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

// This public function of global object will be called when the user clicks the button created just above.
// This function will 
users.findById = function (idOfInput, targetId) {

    console.log("users.findBtUd was called");

    // clear out any previous values in the target area
    var targetDOM = document.getElementById(targetId);
    targetDOM.innerHTML = "";
    
    var desiredUserId = escape(document.getElementById(idOfInput).value);

    // the JS escape function cleans input so it can be used as a URL paramenter
    var myUrl = "webAPIs/getUserByIdAPI.jsp?URLid=" + desiredUserId;
    console.log("users.findById ready to invoke web API with this url: " + myUrl);

    // Remember: getting a DB error does NOT mean ajax call unsuccessful. That is a secondary error after ajax call OK.
    ajax2({
        url: myUrl,
        successFn: success,
        errorId: targetId
    });


    function success(obj) {

        // var obj = JSON.parse(hreq.responseText); // this already done by function ajax2...
        if (!obj) {
            targetDOM.innerHTML += "users.findById (success private fn): Http Request (from AJAX call) did not parse to an object.";
            return;
        }
        console.log("users.findById (success private fn): the obj passed in by ajax2 is on next line.");
        console.log(obj);

        if (obj.dbError.length > 0) {
            targetDOM.innerHTML += "Database Error Encountered: " + obj.dbError;
            return;
        } else if (obj.UserList.length === 0 ) {
            targetDOM.innerHTML = "No Web User with id "+desiredUserId+" was found in the Database.";
        } else {
            var msg = "Found Web User " + obj.UserList[0].webUserId;
            msg += "<br/> &nbsp; Birthday: " +  obj.UserList[0].birthday;
            msg += "<br/> &nbsp; MembershipFee: " +  obj.UserList[0].membershipFee;
            msg += "<br/> &nbsp; User Role: " +  obj.UserList[0].userRoleId + " " +  obj.UserList[0].userRoleType;
            msg += "<br/> <img src ='" +  obj.UserList[0].userImage + "'>";
            targetDOM.innerHTML = msg;  
        }

    } // end of function success
};  // users.findUI
function createInsertUpdateArea (isUpdate, targetId) {

        // set variables as if it will be insert...
        var webUserIdRowStyle = ' style="display:none" '; // hide row with webUserId
        var saveFn = "users.insertSave()";
        
        // change variables for update
        if (isUpdate) {
            webUserIdRowStyle = ""; // don't hide row with webUserId 
            saveFn = "users.updateSave()";
        }

        var html = `
            <div id="insertArea">
                <div id="ajaxError">&nbsp;</div>
                <table>
                    <tr ${webUserIdRowStyle}>
                        <td>Web User Id</td>
                        <td><input type="text"  id="webUserId" disabled /></td>
                        <td id="webUserIdError" class="error"></td> 
                    </tr>
                    <tr>
                        <td>Email Address</td>
                        <td><input type="text"  id="userEmail" /></td>
                        <td id="userEmailError" class="error"></td> 
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="password"  id="userPassword" /></td>
                        <td id="userPasswordError" class="error"></td>
                    </tr>
                    <tr>
                        <td>Retype Your Password</td>
                        <td><input type="password" id="userPassword2" /></td>
                        <td id="userPassword2Error" class="error"></td>
                    </tr>
                    <tr>
                        <td>Birthday</td>
                        <td><input type="text" id="birthday" /></td>
                        <td id="birthdayError" class="error"></td> 
                    </tr>
                    <tr>
                        <td>Membership Fee</td>
                        <td><input type="text" id="membershipFee" /></td>
                        <td id="membershipFeeError" class="error"></td>
                    </tr>
                    <tr>
                        <td>User Role</td>
                        <td>
                            <select id="rolePickList">
                            <!-- JS code will make ajax call to get all the roles 
                            then populate this select tag's options with those roles -->
                            </select>
                        </td>
                        <td id="userRoleIdError" class="error"></td>
                    </tr>
                    <tr>
                        <td><button onclick="${saveFn}">Save</button></td>
                        <td id="recordError" class="error"></td>
                        <td></td>
                    </tr>
                </table>
            </div>
        `;

        document.getElementById(targetId).innerHTML = html;
    }

    users.updateUI = function (webUserId, targetId) {
        createInsertUpdateArea(true, targetId); // first param is isUpdate (boolean)
        ajax2({
            url: "webAPIs/getUserWithRolesAPI.jsp?id=" + webUserId,
            successFn: proceed,
            errorId: "ajaxError"
        });
        function proceed(obj) { // obj is what got JSON.parsed from Web API's output
            dbDataToUI(obj);
        }
    };

    users.insertUI = function (targetId) {

        createInsertUpdateArea(false, targetId); // first param is isUpdate (boolean)

        ajax2({
            url: "webAPIs/getRolesAPI.jsp",
            successFn: setRolePickList,
            errorId: "userRoleIdError"
        });

        function setRolePickList(jsonObj) {

            console.log("setRolePickList was called, see next line for object holding list of roles");
            console.log(jsonObj);

            if (jsonObj.dbError.length > 0) {
                document.getElementById("userRoleIdError").innerHTML = jsonObj.dbError;
                return;
            }

            Utils.makePickList({
                id: "rolePickList", // id of select tag on the page
                list: jsonObj.roleList, // JS array that holds the objects to populate the select tag
                valueProp: "userRoleType", // field name of objects in list that holds the values of the select tag options
                keyProp: "userRoleId"      // field name of objects in list that holds the keys of the options 
            });

        } // setRolePickList

    }; // users.insertUI


    function dbDataToUI(obj) {

        var webUserObj = obj.webUser;
        var roleList = obj.roleInfo.roleList;

        document.getElementById("webUserId").value = webUserObj.webUserId;
        document.getElementById("userEmail").value = webUserObj.userEmail;
        document.getElementById("userPassword").value = webUserObj.userPassword;
        document.getElementById("userPassword2").value = webUserObj.userPassword;
        document.getElementById("birthday").value = webUserObj.birthday;
        document.getElementById("membershipFee").value = webUserObj.membershipFee;
        console.log("selected role id is " + webUserObj.userRoleId);
        Utils.makePickList({
            id: "rolePickList", // id of <select> tag in UI
            list: roleList, // JS array that holds objects to populate the select list
            valueProp: "userRoleType", // field name of objects in list that hold the values of the options
            keyProp: "userRoleId", // field name of objects in list that hold the keys of the options
            selectedKey: webUserObj.userRoleId  // key that is to be pre-selected (optional)
        });
    }

    // a private function
    function getUserDataFromUI() {

        // New code for handling role pick list.
        var ddList = document.getElementById("rolePickList");

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
            "webUserId": document.getElementById("webUserId").value,
            "userEmail": document.getElementById("userEmail").value,
            "userPassword": document.getElementById("userPassword").value,
            "userPassword2": document.getElementById("userPassword2").value,
            "birthday": document.getElementById("birthday").value,
            "membershipFee": document.getElementById("membershipFee").value,

            // Modification here for role pick list
            //"userRoleId": document.getElementById("userRoleId").value,
            "userRoleId": ddList.options[ddList.selectedIndex].value,

            "userRoleType": "",
            "errorMsg": ""
        };

        console.log(userInputObj);

        // JSON.stringify converts the javaScript object into JSON format 
        // (the reverse operation of what gson does on the server side).
        // 
        // Then, you have to encode the user's data (encodes special characters 
        // like space to %20 so the server will accept it with no security error. 
        return encodeURIComponent(JSON.stringify(userInputObj));
        //return escape(JSON.stringify(userInputObj));
    }

    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("userEmailError").innerHTML = jsonObj.userEmail;
        document.getElementById("userPasswordError").innerHTML = jsonObj.userPassword;
        document.getElementById("userPassword2Error").innerHTML = jsonObj.userPassword2;
        document.getElementById("birthdayError").innerHTML = jsonObj.birthday;
        document.getElementById("membershipFeeError").innerHTML = jsonObj.membershipFee;
        document.getElementById("userRoleIdError").innerHTML = jsonObj.userRoleId;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }

    users.insertSave = function () {

        console.log("users.insertSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getUserDataFromUI();

        ajax2({
            url: "webAPIs/insertUserAPI.jsp?jsonData=" + myData,
            successFn: processInsert,
            errorId: "recordError"
        });

        function processInsert(jsonObj) {

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }

            writeErrorObjToUI(jsonObj);
        }
    };

    users.updateSave = function () {

     console.log("users.updateSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getUserDataFromUI();

        ajax2({
            url: "webAPIs/updateUserAPI.jsp?jsonData=" + myData,
            successFn: processInsert,
            errorId: "recordError"
        });

        function processInsert(jsonObj) {

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully updated !!!";
            }

            writeErrorObjToUI(jsonObj);
        }

    };

}());  // the end of the IIFE