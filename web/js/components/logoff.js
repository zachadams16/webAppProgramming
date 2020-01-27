function logoff(id) {

    // ` this is a "back tick". Use it to define multi-line strings in JavaScript.
    var content = `  
      <p>
        You Have been logged off successfully!
        </p>

    `;
    
    document.getElementById(id).innerHTML = content;
    ajax("webAPIs/logoff.jsp"); //calling jsp page to logoff the profile 

  
};  