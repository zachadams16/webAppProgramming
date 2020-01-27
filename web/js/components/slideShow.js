
function slideShow(id) {
    
     
   var content =  `
   <style> 
          
            body {
                background-color:#707790;
            }

            .picContainer{
                float: left; 
                box-sizing: border-box; 
                width: 500px;
                padding-bottom: 50px;
             }
                .picContainer img {
                width: 85%;
             }
               
            </style>
            
        <p class="picContainer" id="slide1Id">
        </p>

        <p class="picContainer" id="slide2Id">
        </p>

        <p class="picContainer" id="slide3Id">
        </p>
    `;
    
    document.getElementById(id).innerHTML = content;
    document.getElementById(id).innerHTML = content; 
    ajax2({url:"webAPIs/listOtherAPI.jsp", successFn:success, errorId:"slide1Id"});
    ajax2({url:"webAPIs/listUsersAPI.jsp", successFn:success, errorId:"slide2Id"});
    
    
 function success(obj) {
                console.log(obj.UserList);
                
                console.log(obj.OtherList);
                
                if(obj.OtherList){
                    var ss = MakeSlideShow({
                        ssID: "slide1Id", // id in which to render slideshow,
                        objList: obj.OtherList, // array of objects with image and caption
                        picPropName: "employeeImage",
                        captions: "employeeName"
                    });
                    ss.setNewCap("employeeBirthday"); //changes caption on the page
               }else{
              
               var ss1 = MakeSlideShow({
                    ssID: "slide2Id", // id in which to render slideshow,
                    objList: obj.UserList, // array of objects with image and caption
                    picPropName: "userImage", 
                    captions:"userEmail"
                });
            }
               
}
        
        
} // end of function users