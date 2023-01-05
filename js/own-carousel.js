Object.prototype.ownCarousel = function (options) {
    const {
        itemPerRow = 4,
        itemWidth = 24,
        loop = true,
        responsive = {},
        draggable = true,
        mouseWheel = false,
        autoplay = 0,
        stopAutoplayWhenHover = true,
        nav = false,
        isRTL = false,
    } = options;
    //extract arguments
    this.carousel = this.querySelector(".own-carousel");
    this.carouselOuter = this.querySelector(".own-carousel__outer");
    this.itemWidthBig = this.itemWidth = itemWidth;
    this.itemPerRowBig = this.itemPerRow = itemPerRow;
    this.responsive = responsive;
    this.gapWidth = (100 - itemPerRow * itemWidth) / (itemPerRow - 1) || 0; // prevent divide 0
    this.style.setProperty("--width", `${itemWidth}%`);
    this.style.setProperty("--margin", `${this.gapWidth}%`);
    this.index = 0;
    this.carouselItem = this.carousel.children;
    this.imgWidth = this.carouselItem[0].getBoundingClientRect().width;
    this.numberOfItem = this.carouselItem.length;
    this.step =
        this.imgWidth + (this.gapWidth / this.itemWidth) * this.imgWidth; //calculate the step to translate
    this.stepToMoveAutoplay = isRTL ? -1 : 1;

    if (loop) {
        //if loop is true, clone carousel item
        this.index = itemPerRow;
        this.carousel.style.transform = `translate3d(${
            -this.index * this.step
        }px,0,0)`;
        for (let i = 0; i < this.itemPerRow; i++) {
            let cloneNode = this.carouselItem[i].cloneNode(true);
            this.carousel.insertAdjacentElement("beforeend", cloneNode);
        }
        let count = 0;
        while (count != this.itemPerRow) {
            let cloneNode =
                this.carouselItem[this.numberOfItem - 1].cloneNode(true);
            this.carousel.insertAdjacentElement("afterbegin", cloneNode);
            count++;
        }
    }

    this.translateSlide = () => {
        this.carousel.style.transform = `translate3d(${
            -this.index * this.step
        }px,0,0)`;
        //just a function used many time, to translate slide
    };

    this.resetSlide = (step) => {
        //reset slide, to make it loop
        if (this.index + step < 1) this.index = this.numberOfItem + 1;
        if (this.index + step >= this.numberOfItem + this.itemPerRow)
            this.index = this.itemPerRow - 1;
        this.carousel.style.transition = "none";
        this.translateSlide();
        //reset it silently by changing transition to none
        //then move it, i had delay 20ms because if we change inline style transition too fast, it will not work properly
        setTimeout(() => {
            this.carousel.style.transition = "all 0.25s";
            this.index += step;
            this.translateSlide();
        }, 20);
    };

    this.moveSlide = (step) => {
        this.carousel.style.transition = "all 0.25s";
        //every time we move slide, add transition
        if (loop) {
            if (
                this.index + step < 1 ||
                this.index + step >= this.numberOfItem + this.itemPerRow
            ) {
                this.resetSlide(step);
            } else {
                this.index += step;
                this.translateSlide();
            }
        } else {
            if (
                this.index + step < 0 ||
                this.index + step > this.numberOfItem - this.itemPerRow
            )
                return;
            else {
                this.index += step;
                this.translateSlide();
            }
        }
    };

    if (nav) {
        this.querySelector(".control__prev").addEventListener("click", () => {
            this.moveSlide(-1);
        });
        this.querySelector(".control__next").addEventListener("click", () => {
            this.moveSlide(1);
        });
    }

    if (draggable) {
        //if draggable is true, add draggable-support event, variables,...
        let firstPos = (currentPos = 0);

        let dragStartHandle = (e) => {
            this.carousel.style.transition = "none";
            if (e.type === "touchstart") {
                currentPos = e.touches[0].clientX;
                document.addEventListener("touchmove", dragHandle);
                document.addEventListener("touchend", dragEndHandle);
            } else {
                this.carouselOuter.style.cursor = "grab";
                currentPos = e.clientX;
                document.addEventListener("mousemove", dragHandle);
                document.addEventListener("mouseup", dragEndHandle);
            }
            firstPos = currentPos;
            //add necessary listener, style, reset first and current position
            if (autoplay) {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            }
        };

        let dragHandle = (e) => {
            let currentMove = parseFloat(
                this.carousel.style.transform.slice(12)
            ); //get the x-axis of transform3d
            let currentIndex = -currentMove / this.step;

            let x = e.type === "touchmove" ? e.touches[0].clientX : e.clientX; //get current coordinate
            let distanceMoved = x - currentPos;
            if (loop) {
                if (currentIndex <= 0) {
                    this.index = this.numberOfItem;
                    this.translateSlide();
                } else if (
                    currentIndex >=
                    this.numberOfItem + this.itemPerRow
                ) {
                    this.index = this.itemPerRow;
                    this.translateSlide();
                } else
                    this.carousel.style.transform = `translate3d(${
                        currentMove + distanceMoved
                    }px,0,0)`;
            } else {
                if (
                    currentIndex < 0 ||
                    currentIndex > this.numberOfItem - this.itemPerRow
                )
                    this.carousel.style.transform = `translate3d(${
                        currentMove + distanceMoved / 5
                    }px,0,0)`;
                //when user drag out of bound, decrease speed
                else
                    this.carousel.style.transform = `translate3d(${
                        currentMove + distanceMoved
                    }px,0,0)`;
            }
            currentPos = x;
        };

        this.checkIndex = (currentMove) => {
            let temp = currentMove;
            while (temp >= this.step) {
                temp -= this.step;
            }
            if (
                (temp > 50 && firstPos - currentPos >= 0) ||
                (this.step - temp < 50 && firstPos - currentPos <= 0)
            )
                return Math.ceil(currentMove / this.step);
            return Math.floor(currentMove / this.step);
        }; // this function is used to check current index to determine move next or previous

        let dragEndHandle = (e) => {
            if (e.type === "touchend") {
                document.removeEventListener("touchmove", dragHandle);
                document.removeEventListener("touchend", dragEndHandle);
            } else {
                document.removeEventListener("mousemove", dragHandle);
                document.removeEventListener("mouseup", dragEndHandle);
                this.carouselOuter.style.cursor = "auto";
            }
            //remove unnecessary event listener and style
            let currentMove = parseFloat(
                this.carousel.style.transform.slice(12)
            );
            this.index = this.checkIndex(-currentMove);
            if (!loop) {
                if (this.index > this.numberOfItem - this.itemPerRow)
                    this.index = this.numberOfItem - this.itemPerRow;
                if (this.index < 0) this.index = 0;
            }
            this.carousel.style.transition = "all 0.25s";
            this.translateSlide();
            if (autoplay) {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    intervalId = setInterval(
                        this.moveSlide,
                        autoplay,
                        this.stepToMoveAutoplay
                    );
                }, 2000);
            }
        };

        this.carouselOuter.addEventListener("mousedown", dragStartHandle);
        this.carouselOuter.addEventListener("touchstart", dragStartHandle);
        // i had to create carouselOuter because carousel will be hidden when slide is working
    }

    if (mouseWheel) {
        this.carouselOuter.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (e.deltaY > 0) this.moveSlide(-1);
            else this.moveSlide(1);
        });
    }

    let intervalId;
    let timeoutId;

    if (autoplay) {
        timeoutId = setTimeout(() => {
            intervalId = setInterval(
                this.moveSlide,
                autoplay,
                this.stepToMoveAutoplay
            );
        }, 3000);
        if (stopAutoplayWhenHover) {
            this.carouselOuter.addEventListener("mouseenter", () => {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
            });
            this.carouselOuter.addEventListener("mouseleave", () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    intervalId = setInterval(
                        this.moveSlide,
                        autoplay,
                        this.stepToMoveAutoplay
                    );
                }, 2000);
            });
        }
    }
};

function debounce(fn, delay) {
    let id = null;
    return function (args) {
        clearTimeout(id);
        id = null;
        id = setTimeout(function () {
            fn.call(this, args);
        }, delay);
    };
}

function responsive() {
    let windowWidth = window.innerWidth;
    let flag = false;
    let crsContainer = document.querySelectorAll(".own-carousel__container");
    let containerArray = Array.from(crsContainer);
    containerArray.forEach((item) => {
        for (let property in item.responsive) {
            if (property >= windowWidth) {
                item.itemPerRow = item.responsive[property][0];
                item.itemWidth = item.responsive[property][1];
                flag = true;
                break;
            }
        }
        if (!flag) {
            //all property are smaller the window width, happen when we increase window width, reset these property to highest value
            item.itemPerRow = item.itemPerRowBig;
            item.itemWidth = item.itemWidthBig;
        }
        item.gapWidth =
            (100 - item.itemPerRow * item.itemWidth) / (item.itemPerRow - 1) ||
            0;
        item.style.setProperty("--width", `${item.itemWidth}%`);
        item.style.setProperty("--margin", `${item.gapWidth}%`);
    });
    //divide into 2 phase to avoid wrong calculating for imgWidth
    containerArray.forEach((item) => {
        item.imgWidth = item.carouselItem[0].getBoundingClientRect().width;
        item.step =
            item.imgWidth + (item.gapWidth / item.itemWidth) * item.imgWidth;
        //change important property for responsive
        item.moveSlide(0);
        //fit carousel in correct position
    });
}

window.addEventListener("resize", debounce(responsive, 500));
//reduce the number of execution for performance
