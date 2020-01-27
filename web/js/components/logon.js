var logon = {};


logon.UI = function (id) {
 var content = ` 
           <div class='logon'>
            <br/>
            Email Address <input type="text" id="logonEmailAddress"/>
            &nbsp;
            Password <input type="password" id="logonPassword"/>
            &nbsp;
            <input type="button" value="Submit" onclick="logon.findUser('logonEmailAddress','logonPassword','msgArea')"/>
            <br/> <br/>
            <div id="msgArea"></div>
           </div>
        `; // closing back tick
 document.getElementById(id).innerHTML = content;
};
// This public function of global object will be called when the user clicks the button created just above.
// This function will 
logon.findUser = function (emailId, pwId, targetId) {

    console.log("users.findById was called");

    // clear out any previous values in the target area
    var targetDOM = document.getElementById(targetId);
    targetDOM.innerHTML = "";
    
    var desiredEmail = escape(document.getElementById(emailId).value);
    var desiredPw = escape(document.getElementById(pwId).value);
    // the JS escape function cleans input so it can be used as a URL paramenter
    var myUrl = "webAPIs/logonAPI.jsp?email=" + desiredEmail + "&password=" + desiredPw;
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
            targetDOM.innerHTML += "logon.findById (success private fn): Http Request (from AJAX call) did not parse to an object.";
            return;
        }
        console.log("users.logon (success private fn): the obj passed in by ajax2 is on next line.");
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