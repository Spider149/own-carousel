document.querySelector(".own-1").ownCarousel({
    itemPerRow:5, 
    itemWidth:19,
    responsive: {
        1000: [4, 24],
        800: [3, 33],
        600: [2, 49],
        400: [1, 100]
    },
    mouseWheel: true,
});

document.querySelector(".own-2").ownCarousel({
    itemPerRow:4, 
    itemWidth:24,
    responsive: {
        900: [3, 33],
        700: [2, 49],
        500: [1, 100]
    },
    loop: false,
});

handleResize();