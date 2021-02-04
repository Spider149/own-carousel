document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("code").forEach((block) => {
        hljs.highlightBlock(block);
    });

    // responsive
    let menuButton=document.querySelector(".menu__button");
    let menu=document.querySelector(".header__nav");
    let body=document.getElementsByTagName("body")[0];

    menuButton.addEventListener("click",function(){
        menuButton.classList.toggle("open");
        menu.classList.toggle("open");
        body.classList.toggle("no-scroll");
    })

    window.addEventListener("click",function(event){
        if(!event.target.classList.contains("header__nav") && menu.classList.contains("open") 
        && !event.target.classList.contains("menu__button") && !event.target.parentNode.classList.contains("menu__button")) {
          menu.classList.toggle("open");
          menuButton.classList.toggle("open");
          body.classList.toggle("no-scroll");
        }
    })

    // ----- //
    document.querySelector(".own-1").ownCarousel({
        itemPerRow: 3,
        itemWidth: 32,
        responsive: {
            800: [2, 48],
            500: [1, 100],
        },
        autoplay: 1500,
    });

    document.querySelector(".own-2").ownCarousel({
        itemPerRow: 5,
        itemWidth: 19,
        responsive: {
            1000: [4, 24],
            800: [3, 32],
            600: [2, 49],
            400: [1, 100],
        },
        nav: true,
    });
    responsive();
});
