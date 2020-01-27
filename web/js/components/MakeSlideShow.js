function MakeSlideShow(params) {

// Expecting a parameter object with these properties:
//        ssID: "slideId", // id in which to render slideshow,
//        objList: obj.webUserList, // array of objects with image and caption
//        picPropName: "image" 

    if (!params || !params.ssID || !document.getElementById(params.ssID) ||
            !params.objList || !params.objList[0] || !params.picPropName )
    {
        alert("MakeSlideShow requires a parameter object with these properties:\n" +
                "   ssID:            id in which to render slideshow,\n" +
                "   objList:         array of objects that each have pic file name and caption, \n" +
                "   picPropName:     name of property (in objects) that holds image file name, \n)");
        return;
    }
    // get reference to the DOM object inside which the SlideShow image 
    // and buttons will be created.
    var slideShow = document.getElementById(params.ssID);
    var objList = params.objList;
    var picPropName = params.picPropName;
    var captionName = params.captions;

    // add a div that will hold the image
    var div = document.createElement("div");
    slideShow.appendChild(div);

    // add image into the div & set the image's src attribute to the 1st picture in the list
    var myImage = document.createElement("img");
    div.append(myImage);
    
    var myCaption = document.createElement("div");
    div.appendChild(myCaption);

    // add back button under the image (and space between buttons)
    var backButton = document.createElement("button");
    backButton.innerHTML = " &lt; "; // HTML code for the less than sign.
    slideShow.appendChild(backButton);

    // add forward button after back button and space
    var fwdButton = document.createElement("button");
    fwdButton.innerHTML = " &gt; "; // HTML code for the greater than sign.
    slideShow.appendChild(fwdButton);

    // Private variable that keeps track of which image is showing
    var picNum = 0;
    updatePic();

    // Private method to advance to next image in the picture list
    function nextPic() {
        picNum++;
        if (picNum >= objList.length) {
            picNum = 0;
        }
        // change the src attribute of the image element to the desired new image)				
        updatePic();
    }

    // Private method to go back to the previous image in the picture list
    function prevPic() {
        picNum--;
        if (picNum < 0) {
            picNum = objList.length - 1;
        }
        // change the src attribute of the image element to the desired new image)				
        updatePic();
    }

    // Whenever anyone clicks the back button, make the prevPic method run
    // Whenever anyone clicks the fwd button, make the nextPic method run
    backButton.onclick = prevPic;
    fwdButton.onclick = nextPic;

    // Example of a public method that the HTML coder can invoke when/if they want to 
    slideShow.setNewCap = function (newName) {
        captionName = newName;
        updatePic();

    };
    
    
    


    function updatePic() {
        var obj = objList[picNum];
        console.log(obj[captionName]);
        myImage.src = obj[picPropName];
        myCaption.innerHTML="";
        myCaption.innerHTML=captionName + ": " + obj[captionName];
    }

    return slideShow;
}