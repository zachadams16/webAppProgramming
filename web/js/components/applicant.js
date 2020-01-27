var applicant = {};
var loggedOn;

(function (){
    
applicant.list = function (id) {

    var contentDOM = document.getElementById(id);
   

    // clear out whatever may be currently in the content area
    contentDOM.innerHTML = "";
    loggedOn = 0;
    getLoggedOn();
    
    // ajax parameters: 
    //   url for ajax call (Web API)
    //   name of callback function to run if ajax call successful. 
    //   id where to place error message if ajax call not successful. 
    //   
    // Remember: getting a DB error does NOT mean ajax call unsuccessful. That is a secondary error after OK ajax call.
    ajax("webAPIs/listOtherAPI.jsp", success, id);

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
                innerHTML: "Employee List ",
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
                // And that worked to show the user insert UI, BUT, afterwards, if you tried to re-run 
                // the user list, nothing happened -- because this would make no change in the 
                // location.hash -- so nothing would happen. 
                // 
                // The solution was to invoke the user insert UI through a routing rule. 
                // For "other" insert (even though you probably won't have a Nav Bar link for inserting "other", 
                // you may need to create a routing rule and invoke that similarly (from the "other" list UI).
                window.location.hash = "#/employeeInsert";
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
        
            searchBox.type = "text"
        
            var tableDiv = Utils.make({
                htmlTag: "div",
                parent: div
            });

        // tweak obj.webOtherList to include only the properties you want - combine, delete, etc. 
        console.log("logged: "+loggedOn);
        var userList = [];
       for (var i = 0; i < obj.OtherList.length; i++) {
            userList[i] = {}; // add new empty object to array
            userList[i].userCredentials = obj.OtherList[i].employeeEmail + "<br/> Name: " +obj.OtherList[i].employeeName
                    + "<br/> PW (to test Logon): " +
                obj.OtherList[i].userPassword;
            userList[i].image = obj.OtherList[i].employeeImage;
            userList[i].birthday = obj.OtherList[i].employeeBirthday;
            userList[i].membershipFee = obj.OtherList[i].membershipFee;
            userList[i].description = obj.OtherList[i].employeeDescription;
            userList[i].userId = obj.OtherList[i].webUserId;
            userList[i].yearsWorking = obj.OtherList[i].employeeExp;
            // Remove this once you are done debugging...
            userList[i].errorMsg = obj.OtherList[i].errorMsg;
            if(loggedOn === obj.OtherList[i].webUserId){
                userList[i].update = "<img src='" + CRUD_icons.update + "' alt='update icon' onclick='applicant.updateUI(" +
                        userList[i].userId + ", `" + id + "` )' />";
            }else{
                userList[i].update = "";
            }
            userList[i].delete = "<img src='" + CRUD_icons.delete + "' alt='delete icon' onclick='applicant.delete(" +
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
//
        tableBuilder.build({
            list: userList,
            searchKeyElem: searchBox,
            style: "data",
            target: tableDiv,
            sortIcon: "icons/sortUpDown16.png",
            orderPropName: "userEmail",
            reverse: false
        });
    } // end of function success

}; // end of function users


applicant.delete = function (otherId, icon) {


    if (confirm("Do you really want to delete user " + otherId + "? ")) {
        console.log("icon that was passed into JS function is printed on next line");
        console.log(icon);

        // HERE YOU HAVE TO CALL THE DELETE API and the success function should run the 
        // following (delete the row that was clicked from the User Interface).
        ajax2({
            url: "webAPIs/deleteOtherAPI.jsp" + "?deleteId=" + otherId,
            successFn: success,
            errorId: otherId
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

applicant.findUI = function (targetId) {

    console.log("users.findUI was called");

    var contentDOM = document.getElementById(targetId);
    var content = `
        <div class='logon'>
            <br/>
            Enter Id <input type="text" id="findId"/>
            &nbsp;
            <input type="button" value="Submit" onclick="applicant.findById('findId','msgArea')"/>
            <br/> <br/>
            <div id="msgArea"></div> 
        </div>
    `;
    contentDOM.innerHTML = content;
};

// This public function of global object will be called when the user clicks the button created just above.
// This function will 
applicant.findById = function (idOfInput, targetId) {

    console.log("users.findBtUd was called");

    // clear out any previous values in the target area
    var targetDOM = document.getElementById(targetId);
    targetDOM.innerHTML = "";
    
    var desiredUserId = escape(document.getElementById(idOfInput).value);

    // the JS escape function cleans input so it can be used as a URL paramenter
    var myUrl = "webAPIs/getOtherByIdAPI.jsp?URLid=" + desiredUserId;
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
            targetDOM.innerHTML += "applicant.findById (success private fn): Http Request (from AJAX call) did not parse to an object.";
            return;
        }
        console.log("other.findById (success private fn): the obj passed in by ajax2 is on next line.");
        console.log(obj);

        if (obj.dbError.length > 0) {
            targetDOM.innerHTML += "Database Error Encountered: " + obj.dbError;
            return;
        } else if (obj.OtherList.length === 0 ) {
            targetDOM.innerHTML = "No Web User with id "+desiredUserId+" was found in the Database.";
        } else {
            var msg = "Found Web User " + obj.OtherList[0].webUserId;
            msg += "<br/> &nbsp; Birthday: " +  obj.OtherList[0].birthday;
            msg += "<br/> &nbsp; Employee Email: " +  obj.OtherList[0].employeeEmail;
            msg += "<br/> &nbsp; Employee Name: " +  obj.OtherList[0].employeeName;
            msg += "<br/> &nbsp; Employee description: " +  obj.OtherList[0].employeeDescription;
            msg += "<br/> <img src ='" +  obj.OtherList[0].employeeImage + "'>";
            targetDOM.innerHTML = msg;  
        }

    } // end of function success
};  // users.findUI

applicant.insertUI = function (targetId) {
       console.log("users.inusertUI function - targetId is " + targetId);


        var html = `
    <div id="insertArea">
        <br/>
        <table>
            <tr>
                <td>Email Address</td>
                <td><input type="text"  id="employeeEmail" /></td>
                <td id="employeeEmailError" class="error"></td> 
            </tr>

            <tr>
                <td>Name</td>
                <td><input type="text" id="employeeName" /></td>
                <td id="employeeNameError" class="error"></td>
            </tr>
            <tr>
                <td>Birthday</td>
                <td><input type="text" id="employeeBirthday" /></td>
                <td id="employeeBirthdayError" class="error"></td> 
            </tr>
            <tr>
                <td>Image</td>
                <td><input type="text" id="employeeImage" /></td>
                <td id="employeeImageError" class="error"></td>
            </tr>
            <tr>
                <td>Description</td>
                <td><input type="text" id="employeeDescription" /></td>
                <td id="employeeDescriptionError" class="error"></td>
            </tr>
            <tr>
                <td>Working Experience</td>
                <td><input type="text" id="employeeExp" /></td>
                <td id="employeeExpError" class="error"></td>
            </tr>
            <tr>
                <td>User Id</td>
                <td>
                    <select id="userPickList">
                    <!-- JS code will make ajax call to get all the roles 
                    then populate this select tag's options with those roles -->
                    </select>
                </td>
                <td id="webUserIdError" class="error"></td>
            </tr>
            <tr>
                <!-- see js/insertUser.js to see the insertUser function (make sure index.html references the js file) -->
                <td><button onclick="applicant.insertSave()">Save</button></td>
                <td id="recordError" class="error"></td>
                <td></td>
            </tr>
        </table>
    </div>
    `;
            document.getElementById(targetId).innerHTML = html;
    
        ajax2({
            url: "webAPIs/getUserAPI.jsp",
            successFn: setUserPickList,
            errorId: "userIdError"
        });

        function setUserPickList(jsonObj) {

            console.log("setUserPickList was called, see next line for object holding list of roles");
            console.log(jsonObj);

            if (jsonObj.dbError.length > 0) {
                document.getElementById("userIdError").innerHTML = jsonObj.dbError;
                return;
            }

            /*  copy/pasting the first entry from the output of my get role API
             {
             "dbError": "",
             "roleList": [
             {
             "userRoleId": "1",
             "userRoleType": "Admin",
             "errorMsg": ""
             }, ...
             */

            Utils.makePickList({
                id: "userPickList",
                list: jsonObj.webUserList,
                valueProp: "webUserId",
                keyProp: "webUserId"
            });

        } // setRolePickList

    }; // users.insertUI


    // a private function
    function getEmployeeDataFromUI() {
        // New code for handling role pick list.
        var ddList = document.getElementById("userPickList");

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {


            "employeeEmail": document.getElementById("employeeEmail").value,
            "employeeName": document.getElementById("employeeName").value,
            "employeeBirthday": document.getElementById("employeeBirthday").value,
            "employeeImage": document.getElementById("employeeImage").value,
            "employeeDescription": document.getElementById("employeeDescription").value,
            "employeeExp": document.getElementById("employeeExp").value,
            // Modification here for role pick list
            //"userRoleId": document.getElementById("userRoleId").value,
            "webUserId": ddList.options[ddList.selectedIndex].value,

            "errorMsg": ""
        };

        console.log(userInputObj);

        // JSON.stringify converts the javaScript object into JSON format 
        // (the reverse operation of what gson does on the server side).
        // 
        // Then, you have to encode the user's data (encodes special characters 
        // like space to %20 so the server will accept it with no security error. 
         console.log(document.getElementById("employeeBirthday").value);
        return encodeURIComponent(JSON.stringify(userInputObj));
        //return escape(JSON.stringify(userInputObj));
    }

    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("employeeEmailError").innerHTML = jsonObj.employeeEmail;
        document.getElementById("employeeNameError").innerHTML = jsonObj.employeeName;
        document.getElementById("employeeBirthdayError").innerHTML = jsonObj.employeeBirthday;
        document.getElementById("employeeImageError").innerHTML = jsonObj.employeeImage;
        document.getElementById("employeeDescriptionError").innerHTML = jsonObj.employeeDescription;
        document.getElementById("employeeExpError").innerHTML = jsonObj.employeeExp;
        document.getElementById("webUserIdError").innerHTML = jsonObj.webUserId;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }

    applicant.insertSave = function () {

        console.log("applicant.insertSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getEmployeeDataFromUI();

        ajax2({
            url: "webAPIs/insertEmployeeAPI.jsp?jsonData=" + myData,
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
    
    function getLoggedOn(){
        
        ajax("webAPIs/getProfileAPI.jsp", success);
        
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
        
        if (obj.dbError.length > 0) {
            contentDOM.innerHTML += "Database Error Encountered: " + obj.dbError;
            return;
        } else { //printing logged on profile if there is one
            loggedOn= obj.UserList[0].webUserId;
            return;
        }
        }
    }
    
function createInsertUpdateArea (isUpdate, targetId) {

        // set variables as if it will be insert...
  
            saveFn = "applicant.updateSave()";
        

        var html = `
            <div id="insertArea">
                <div id="ajaxError">&nbsp;</div>
                <table>
                    <tr>
                        <td>Web User Id</td>
                        <td><input type="text"  id="webUserId" disabled /></td>
                        <td id="webUserIdError" class="error"></td> 
                    </tr>
                       <tr>
                <td>Email Address</td>
                <td><input type="text"  id="employeeEmail" /></td>
                <td id="employeeEmailError" class="error"></td> 
            </tr>

            <tr>
                <td>Name</td>
                <td><input type="text" id="employeeName" /></td>
                <td id="employeeNameError" class="error"></td>
            </tr>
            <tr>
                <td>Birthday</td>
                <td><input type="text" id="employeeBirthday" /></td>
                <td id="employeeBirthdayError" class="error"></td> 
            </tr>
            <tr>
                <td>Image</td>
                <td><input type="text" id="employeeImage" /></td>
                <td id="employeeImageError" class="error"></td>
            </tr>
            <tr>
                <td>Description</td>
                <td><input type="text" id="employeeDescription" /></td>
                <td id="employeeDescriptionError" class="error"></td>
            </tr>
            <tr>
                <td>Working Experience</td>
                <td><input type="text" id="employeeExp" /></td>
                <td id="employeeExpError" class="error"></td>
            </tr>
            <tr>
                <!-- see js/insertUser.js to see the insertUser function (make sure index.html references the js file) -->
                <td><button onclick="${saveFn}">Save</button></td>
                <td id="recordError" class="error"></td>
                <td></td>
            </tr>
                </table>
            </div>
        `;

        document.getElementById(targetId).innerHTML = html;
    }

    applicant.updateUI = function (webUserId, targetId) {
        createInsertUpdateArea(true, targetId); // first param is isUpdate (boolean)
        ajax2({
            url: "webAPIs/getOtherByIdAPI.jsp?id=" + webUserId,
            successFn: proceed,
            errorId: "ajaxError"
        });
        function proceed(obj) { // obj is what got JSON.parsed from Web API's output
            dbDataToUI(obj);
        }
    };

    function dbDataToUI(obj) {

        var webUserObj = obj.OtherList[0];
  
        console.log(webUserObj);
        
        document.getElementById("employeeEmail").value = webUserObj.employeeEmail;
        document.getElementById("employeeName").value = webUserObj.employeeName;
        document.getElementById("employeeImage").value = webUserObj.employeeImage;
        document.getElementById("employeeBirthday").value = webUserObj.employeeBirthday;
        document.getElementById("employeeDescription").value = webUserObj.employeeDescription;
        document.getElementById("employeeExp").value = webUserObj.employeeExp;
        document.getElementById("webUserId").value = webUserObj.webUserId;
    }


    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);
    document.getElementById("employeeEmailError").innerHTML = jsonObj.employeeEmail;
        document.getElementById("employeeNameError").innerHTML = jsonObj.employeeName;
        document.getElementById("employeeBirthdayError").innerHTML = jsonObj.employeeBirthday;
        document.getElementById("employeeImageError").innerHTML = jsonObj.employeeImage;
        document.getElementById("employeeDescriptionError").innerHTML = jsonObj.employeeDescription;
        document.getElementById("employeeExpError").innerHTML = jsonObj.employeeExp;
        document.getElementById("webUserIdError").innerHTML = jsonObj.webUserId;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }

    applicant.updateSave = function () {

     console.log("users.updateSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getEmployeeDataFromUIForUpdate();

        ajax2({
            url: "webAPIs/updateOtherAPI.jsp?jsonData=" + myData,
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
     function getEmployeeDataFromUIForUpdate() {
        // New code for handling role pick list.
        var ddList = document.getElementById("userPickList");

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {


            "employeeEmail": document.getElementById("employeeEmail").value,
            "employeeName": document.getElementById("employeeName").value,
            "employeeBirthday": document.getElementById("employeeBirthday").value,
            "employeeImage": document.getElementById("employeeImage").value,
            "employeeDescription": document.getElementById("employeeDescription").value,
            "employeeExp": document.getElementById("employeeExp").value,
            // Modification here for role pick list
            //"userRoleId": document.getElementById("userRoleId").value,
            "webUserId":  document.getElementById("webUserId").value,

            "errorMsg": ""
        };

        console.log(userInputObj);

        // JSON.stringify converts the javaScript object into JSON format 
        // (the reverse operation of what gson does on the server side).
        // 
        // Then, you have to encode the user's data (encodes special characters 
        // like space to %20 so the server will accept it with no security error. 
         console.log(document.getElementById("employeeBirthday").value);
        return encodeURIComponent(JSON.stringify(userInputObj));
        //return escape(JSON.stringify(userInputObj));
    }
}());  // the end of the IIFE
    
