function slideShow() {
    
    
    var content = `
      
      <h2>My Slide Show Page</h2>
        <div class='slideShowContainer'>
            <div class="slideShow" id="firstSlideId">
            </div>
            <div class="slideShow" id="secondSlideId">
            </div>
        </div>

    `;
    console.log("preparing to create lists");

    function addUsers(userList) {
        for (var i = 0; i < userList.length; i++) {
            userList[i].caption = userList[i].userEmail;
            userList[i].imageLink = userList[i].image;
        }
        
        console.log("userList made");
        var str = ( "blue" );
        var slideShow1 = MakeSlideShow(userList, str);
        ele.appendChild(slideShow1);
        
    }
        ajax("json/users.json", addUsers, document.getElementById("slideShowContainer"));




    function addCars(carList) {
        for (var i = 0; i < carList.length; i++) {
            carList[i].caption = carList[i].make;
            carList[i].imageLink = carList[i].image;
        }
        console.log("carList made");

        var slideShow2 = MakeSlideShow(carList);
        ele.appendChild(slideShow2);
    }
        ajax("json/cars.json", addCars, document.getElementById("slideShowContainer"));


    
    var ele = document.createElement("div");
    ele.innerHTML = content;
    return ele;
};