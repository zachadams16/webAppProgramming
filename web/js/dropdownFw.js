// Sally's JS naming convention: every JS file shall be named for the single funtion 
// or object that is defined within the file (helps to organize and find code).
// 
// 
// Initialize the drop down framework by telling it the name of the CSS class that 
// you used for the drop down content (the sub menus under the drop down headers). 
// Also tell it how far off screen to the right you want the drop down content elements 
// to be placed ("-500px" was used for demo, "-1000" would make it slower to come on screen 
// (farther to travel from right) when you click on a drop down content element. 
// 
// Note: you have to use the "visibility" (hidden/visible) rather than "display" (none/block) 
// if you want to use transitions/animation on the open/close of the dropdown content elements. 

function dropDownFw (params) {

    // This is the classname of the drop down header menus (check style sheet and nav bar).
    var dropHeaderStyle = params.dropHeaderStyle || "dropHeader";

    // This is the classname of the drop down content menus (check style sheet and nav bar).
    var dropContentStyle = params.dropContentStyle || "dropContent";

    // A larger negative number (like -1000) for hiddenRight will make the drop down content 
    // elements slower to come in from the right (because it will be farther off screen 
    // when it begins to travel in from the right). 
    var hiddenRight = params.hiddenRight || "-500px";

    var fw = {};

    // public function that references the drop down header that was clicked. First find the 
    // related drop down content (get first child classed dropContentStyle of the parent of the 
    // clicked DOM object). Then toggle this dropContent element (make it visible if hidden, or 
    // hidden if visible). 
    fw.toggle = function (clickedHeader) {  // public function

        // get the DOM element that is classed dropContentStyle which is a sibling 
        // of the dropHeader that was clicked. This is what we want to open or close.
        var parent = clickedHeader.parentElement;
        var dContent = parent.getElementsByClassName(dropContentStyle)[0];

        var dropContentList = document.getElementsByClassName(dropContentStyle);
        console.log(dropContentList);

        // when one dropdown is clicked, make sure to close any other ones
        // that the user may have left open.
        for (var i = 0; i < dropContentList.length; i++) {
            if (dropContentList[i] !== dContent) {
                hide(dropContentList[i]);
            }
        }

        // Tip: JS doesnt understand the initial CSS values (the values 
        // set by style sheet instead of by JS), unless you use the getComputedStyle
        // function that is. But you can avoid this by having the 
        // if condition test for the way CSS does NOT have it initially set. 
        // (In other words, do not reverse the order of the if/else block.)                      
        if (dContent.style.visibility === "visible") {
            hide(dContent);
        } else {
            show(dContent);
        }
    }; // end function 

    // private function, makes element invisible (display:none cannot be used with transition/amimation).
    // By setting the right attribute to large negative number, the element will be placed far off screen
    // to the right and this will be where it starts when it is next made visible (for the "zoom in from 
    // right" animation). 
    function hide(ele) {
        ele.style.right = hiddenRight;
        ele.style.visibility = "hidden";
    }

    // private function, makes element visible.
    function show(ele) {
        ele.style.visibility = "visible";
        ele.style.right = "0px";
    }

    function hideAllDropContents() {
        var dropContentList = document.getElementsByClassName(dropContentStyle);
        for (var i = 0; i < dropContentList.length; i++) {
            hide(dropContentList[i]);
        }
    }

    // Close all dropdown content menus whenever the user clicks anything but a drop down header
    window.onclick = function (event) {
        if (!event.target.matches('.'+dropHeaderStyle)) {
            hideAllDropContents();
            console.log("hiding all drop contents");
        } else {
            console.log("not hiding all drop contents");
        }
    };

    return fw;
}