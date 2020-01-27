var profile = {};
profile.list = function (id) {

    var contentDOM = document.getElementById(id);

    // clear out whatever may be currently in the content area
    contentDOM.innerHTML = "You are not logged on";

    // ajax parameters: 
    //   url for ajax call (Web API)
    //   name of callback function to run if ajax call successful. 
    //   id where to place error message if ajax call not successful. 
    //   
    // Remember: getting a DB error does NOT mean ajax call unsuccessful. That is a secondary error after OK ajax call.
    ajax("webAPIs/getProfileAPI.jsp", success, id);

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
            var msg = "User &nbsp;" + obj.UserList[0].userEmail+ "&nbsp; Profile: <br/> &nbsp; Web User ID " + obj.UserList[0].webUserId;
            msg += "<br/> &nbsp; Birthday: " +  obj.UserList[0].birthday;
            msg += "<br/> &nbsp; MembershipFee: " +  obj.UserList[0].membershipFee;
            msg += "<br/> &nbsp; User Role: " +  obj.UserList[0].userRoleId + " " +  obj.UserList[0].userRoleType;
            msg += "<br/> <img src ='" +  obj.UserList[0].userImage + "'>";
            contentDOM.innerHTML = msg;  
        }
        }
    };

