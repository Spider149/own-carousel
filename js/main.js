document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("code").forEach((block) => {
        hljs.highlightBlock(block);
    });

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
