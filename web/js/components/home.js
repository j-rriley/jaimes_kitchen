function home() {

    var content = ` 
        <h2> Welcome to Jaime's Kitchen. Below you will find relevant website information. </h2>
    
            <p>
               This website is intended for chefs of all ages and experience levels! I look to add recipes for all
               times of the day, whether it be breakfast, lunch, dinner, a snack, or dessert. There will also be
               recipes that are allergen-friendly for the top 8 allergens, and you can filter out these allergies.
               When a user signs up, they can indicate their background and also whether they have allergies. This will
               be a great website for anyone looking for cooking inspiration. Hopefully, this content will be similar to 
               websites like <a href="https://www.tasty.co" id="aid">Tasty</a>.
            </p>
    
        <p id="pid"> <img src="pics/kitchen_img.jpg" id="imgid"> </p>
    `;
    
    var ele = document.createElement("div");
    ele.innerHTML = content;
    return ele;    
}