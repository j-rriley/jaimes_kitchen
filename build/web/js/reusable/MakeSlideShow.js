function MakeSlideShow(picList, colorOfSwitch) {


    if(colorOfSwitch === null) {
        var str = "green"; 
        colorOfSwitch = str; 
    }
    // get reference to the DOM object inside which the SlideShow image 
    // and buttons will be created.
    var slideShow = document.createElement("div");

    // add a div that will hold the image 
    var div = document.createElement("div");
    slideShow.appendChild(div);

    // add image into the div & set the image's src attribute to show picture
    var myImage = document.createElement("img");
    div.append(myImage);
    
    //add caption into the div & show under image
    var myCaption = document.createElement("caption");
    div.append(myCaption);

    // add back button under the image (and empty paragraph)
    var backButton = document.createElement("button");
    backButton.innerHTML = " &lt; ";
    slideShow.appendChild(backButton);

    var switchText = document.createElement("text");
    switchText.innerHTML = "SWITCH".fontcolor(colorOfSwitch);
    slideShow.appendChild(switchText); 
    
    // add forward button under the image (and empty paragraph)
    var fwdButton = document.createElement("button");
    fwdButton.innerHTML = " &gt; ";
    slideShow.appendChild(fwdButton);

    // private variable that keeps track of which image is showing
    var picNum = 0;
    setPic();

    function setPic() {
        myImage.src = picList[picNum].imageLink;
        myCaption.innerHTML = picList[picNum].caption;

    }

    // Advance to next image in the picture list
    function nextPic() {

        if (picNum < picList.length-1) {
            picNum++;
        }
        setPic();
    }

    // Go to the previous image in the picture list
    function prevPic() {

        if (picNum > 0) {
            picNum--;
        }
        setPic();
    }

    // add next and previous funcionality to next and previous buttons
    backButton.onclick = prevPic;
    fwdButton.onclick = nextPic;

    slideShow.setPicNum = function (newNum) {
        if ((newNum >= 0) && (newNum < picList.length)) {
            picNum = newNum;
            // change the src attribute of the image element to the desired new image)				
            setPic();
        }
    };
    
    slideShow.setSwitchColor = function(newColor) {
        switchText.innerHTML = "SWITCH".fontcolor(newColor); 
    };
   

    return slideShow;
}