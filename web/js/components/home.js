function home(id) {

    // ` this is a "back tick". Use it to define multi-line strings in JavaScript.
    var content = `
      <p>Invest in us inexperienced college students and you will have great returns
            </p>  
            <div class="row">
                <div class='column column66'>

                    <strong>Our LinkedIn</strong> <br/>
                    The <a href = "https://www.linkedin.com/company/marob-capital/"> LinkedIn Page</a>  
                   shows information about this small startup investment firm.<br/> 
                    The founders have brilliant models and ideas about how to make great returns on investments.<br/>
                    They will not let you or your money down! hello!
               
                </div>

                <div class='column column33'>
                    <img src='pics/0.png' alt='cape town'>
                </div>
                <div class='stopFloat'></div>
            </div>
    `;
    document.getElementById(id).innerHTML = content;
}