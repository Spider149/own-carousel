let x = document.querySelector(".own-1");
x.ownCarousel(5, 19, true, {
    900: [3, 33],
    500: [1, 100]
});

let y = document.querySelector(".own-2");
y.ownCarousel(4, 24, true, {
    900: [3, 33],
    600: [2, 49],
    400: [1, 100]
});

handleResize();