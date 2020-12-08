Object.prototype.ownCarousel = function (itemPerRow, itemWidth, loop = true, responsive) {
    this.carousel = this.querySelector(".own-carousel");
    this.itemWidthBig = this.itemWidth = itemWidth;
    this.itemPerRowBig = this.itemPerRow = itemPerRow;
    this.responsive = responsive;
    this.gapWidth = (100 - itemPerRow * itemWidth) / (itemPerRow - 1) || 0;
    this.style.setProperty('--width', `${itemWidth}%`);
    this.style.setProperty('--margin', `${this.gapWidth}%`);
    this.index = 0;
    this.carouselItem = this.carousel.children;
    this.imgWidth = this.carouselItem[0].getBoundingClientRect().width;
    this.numberOfItem = this.carouselItem.length;
    this.loop = loop;

    if (loop) {
        this.index = itemPerRow;
        this.carousel.style.transform = `translate3d(${-this.index * (this.imgWidth + this.gapWidth / this.itemWidth * this.imgWidth)}px,0,0)`;
        for (let i = 0; i < this.itemPerRow; i++) {
            this.carousel.insertAdjacentHTML("beforeend", this.carousel.children[i].outerHTML);
        }
        let add = "";
        for (let i = this.numberOfItem - this.itemPerRow; i < this.numberOfItem; i++) {
            add += this.carousel.children[i].outerHTML;
        }
        this.carousel.insertAdjacentHTML("afterbegin", add);
    }

    this.translateSlide = function (trick = false) {
        if (trick) this.carousel.style.transition = "none";
        this.carousel.style.transform = `translate3d(${-this.index * (this.imgWidth + this.gapWidth / this.itemWidth * this.imgWidth)}px,0,0)`;
    }
    
    this.moveSlide = function (step) {
        this.carousel.style.transition = "all 0.25s";
        if (this.loop) {
            this.index += step;
            this.translateSlide();
            if (this.index < 1) {
                this.index = this.numberOfItem;
                setTimeout(this.translateSlide.bind(this, true), 250);
            }
            else if (this.index >= this.numberOfItem + this.itemPerRow) {
                this.index = this.itemPerRow;
                setTimeout(this.translateSlide.bind(this, true), 250);
            }
        }
        else {
            if (this.index + step < 0 || this.index + step > this.numberOfItem - this.itemPerRow) {
                return;
            }
            else {
                this.index += step;
                this.translateSlide();
            }
        }
    }

    let moveLimit = throttle((index) => {
        this.moveSlide(index);
    }, 270);

    this.querySelector(".control__prev").addEventListener("click", function () {
        moveLimit(-1);
    });
    this.querySelector(".control__next").addEventListener("click", function () {
        moveLimit(1);
    });

    let dragHandle = (e) => {
        let currentMove = parseFloat(this.carousel.style.transform.slice(12));
        let currentIndex = -currentMove / (this.imgWidth + this.gapWidth / this.itemWidth * this.imgWidth);
        if (currentIndex < 1) {
            this.index = this.numberOfItem;
            this.carousel.style.transform = `translate3d(${-this.index * (this.imgWidth + this.gapWidth / this.itemWidth * this.imgWidth)}px,0,0)`;
        }
        else if (currentIndex >= this.numberOfItem + this.itemPerRow) {
            this.index = this.itemPerRow;
            this.carousel.style.transform = `translate3d(${-this.index * (this.imgWidth + this.gapWidth / this.itemWidth * this.imgWidth)}px,0,0)`;
        }
        else this.carousel.style.transform = `translate3d(${currentMove + e.clientX - currentPos}px,0,0)`;
        currentPos = e.clientX;
    }

    let dragEndHandle = () => {
        document.removeEventListener("mousemove", dragHandle);
        document.removeEventListener("mouseup", dragEndHandle);
        let currentMove = parseFloat(this.carousel.style.transform.slice(12));
        let currentIndex = Math.round(-currentMove / (this.imgWidth + this.gapWidth / this.itemWidth * this.imgWidth));
        this.index = currentIndex;
        this.carousel.style.transition = "all 0.25s";
        this.translateSlide();
        this.carousel.style.cursor="auto";
    }

    this.carousel.addEventListener("mousedown", function (e) {
        firstMove = parseFloat(this.style.transform.slice(12));
        this.style.transition = "none";
        this.style.cursor="grab";
        currentPos = e.clientX;
        document.addEventListener("mousemove", dragHandle);
        document.addEventListener("mouseup", dragEndHandle);
    })

}

let currentPos = firstMove = 0;

function throttle(fn, delay) {
    let id = null;
    return function (args) {
        if (id) return;
        fn.call(this, args);
        id = setTimeout(function () {
            clearTimeout(id);
            id = null;
        }, delay)
    }
}

function debounce(fn,delay){
    let id=null;
    return function (args) {
        clearTimeout(id);
        id = null;
        id = setTimeout(function () {
            fn.call(this, args);
        }, delay)
    }
}

function handleResize() {
    let windowWidth = window.innerWidth;
    let flag = false;
    let crsContainer = document.querySelectorAll(".own-carousel__container");
    Array.from(crsContainer).forEach(item => {
        for (let property in item.responsive) {
            if (property >= windowWidth) {
                item.itemPerRow = item.responsive[property][0];
                item.itemWidth = item.responsive[property][1];
                flag = true;
                break;
            }
        }
        if (!flag) {
            item.itemPerRow = item.itemPerRowBig;
            item.itemWidth = item.itemWidthBig;
        }
        item.gapWidth = (100 - item.itemPerRow * item.itemWidth) / (item.itemPerRow - 1) || 0;
        item.style.setProperty('--width', `${item.itemWidth}%`);
        item.style.setProperty('--margin', `${item.gapWidth}%`);
        item.imgWidth = item.carouselItem[0].getBoundingClientRect().width;
        item.moveSlide(0);
    });
}

window.addEventListener("resize", debounce(handleResize, 700));

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