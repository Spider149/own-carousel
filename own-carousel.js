Object.prototype.ownCarousel = function (options) {
    const { itemPerRow, itemWidth, loop = true, responsive={}, draggable = true, mousewheel = false } = options;
    this.carousel = this.querySelector(".own-carousel");
    this.carouselOuter = this.querySelector(".own-carousel__outer");
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
    this.step = this.imgWidth + this.gapWidth / this.itemWidth * this.imgWidth;
    if (loop) {
        this.index = itemPerRow;
        this.carousel.style.transform = `translate3d(${-this.index * this.step}px,0,0)`;
        for (let i = 0; i < this.itemPerRow; i++) {
            this.carousel.insertAdjacentHTML("beforeend", this.carousel.children[i].outerHTML);
        }
        let add = "";
        for (let i = this.numberOfItem - this.itemPerRow; i < this.numberOfItem; i++) {
            add += this.carousel.children[i].outerHTML;
        }
        this.carousel.insertAdjacentHTML("afterbegin", add);
    }

    this.translateSlide = () => {
        this.carousel.style.transform = `translate3d(${-this.index * this.step}px,0,0)`;
    }

    this.resetSlide = (step) => {
        if (this.index + step < 1) this.index = this.numberOfItem + 1;
        if (this.index + step >= this.numberOfItem + this.itemPerRow) this.index = this.itemPerRow - 1;
        this.carousel.style.transition = "none";
        this.translateSlide();
        setTimeout(() => {
            this.carousel.style.transition = "all 0.25s";
            this.index += step;
            this.translateSlide();
        }, 20);
    }

    this.moveSlide = (step) => {
        this.carousel.style.transition = "all 0.25s";
        if (loop) {
            if (this.index + step < 1 || this.index + step >= this.numberOfItem + this.itemPerRow) {
                this.resetSlide(step);
            }
            else {
                this.index += step;
                this.translateSlide();
            }
        }
        else {
            if (this.index + step < 0 || this.index + step > this.numberOfItem - this.itemPerRow) return;
            else {
                this.index += step;
                this.translateSlide();
            }
        }
    }

    this.querySelector(".control__prev").addEventListener("click", ()=>{
        this.moveSlide(-1);
    });
    this.querySelector(".control__next").addEventListener("click", ()=>{
        this.moveSlide(1);
    });

    if (draggable) {
        let firstPos = currentPos = 0;

        let dragStartHandle = (e) => {
            e.preventDefault();
            this.carousel.style.transition = "none";
            if (e.type === 'touchstart') {
                currentPos = e.touches[0].clientX;
                document.addEventListener("touchmove", dragHandle);
                document.addEventListener("touchend", dragEndHandle);
            }
            else {
                this.carouselOuter.style.cursor = "grab";
                currentPos = e.clientX;
                document.addEventListener("mousemove", dragHandle);
                document.addEventListener("mouseup", dragEndHandle);
            }
            firstPos = currentPos;
        }
    
        let dragHandle = (e) => {
            let currentMove = parseFloat(this.carousel.style.transform.slice(12));
            let currentIndex = -currentMove / this.step;
            let distanceMoved = (e.touches[0].clientX - currentPos) || (e.clientX - currentPos);
            if (loop) {
                if (currentIndex <= 0) {
                    this.index = this.numberOfItem;
                    this.translateSlide();
                }
                else if (currentIndex >= this.numberOfItem + this.itemPerRow) {
                    this.index = this.itemPerRow;
                    this.translateSlide();
                }
                else this.carousel.style.transform = `translate3d(${currentMove + distanceMoved}px,0,0)`;
            }
            else {
                if (currentIndex < 0 || (currentIndex > this.numberOfItem - this.itemPerRow)) this.carousel.style.transform = `translate3d(${currentMove + distanceMoved / 5}px,0,0)`;
                else this.carousel.style.transform = `translate3d(${currentMove + distanceMoved}px,0,0)`;
            }
            currentPos = e.touches[0].clientX || e.clientX;
        }
    
        this.checkIndex = (currentMove) => {
            let temp = currentMove;
            while (temp >= this.step) {
                temp -= this.step;
            }
            if ((temp > 50 && firstPos - currentPos > 0) || (this.step - temp < 50 && firstPos - currentPos < 0)) return Math.ceil(currentMove / this.step);
            return Math.floor(currentMove / this.step);
        }
    
        let dragEndHandle = (e) => {
            if (e.type === "touchend") {
                document.removeEventListener("touchmove", dragHandle);
                document.removeEventListener("touchend", dragEndHandle);
            }
            else {
                document.removeEventListener("mousemove", dragHandle);
                document.removeEventListener("mouseup", dragEndHandle);
                this.carouselOuter.style.cursor = "auto";
            }
            let currentMove = parseFloat(this.carousel.style.transform.slice(12));
            this.index = this.checkIndex(-currentMove);
            if (!loop) {
                if (this.index > this.numberOfItem - this.itemPerRow) this.index = this.numberOfItem - this.itemPerRow;
                if (this.index < 0) this.index = 0;
            }
            this.carousel.style.transition = "all 0.25s";
            this.translateSlide();
        }

        this.carouselOuter.addEventListener("mousedown", dragStartHandle);
        this.carouselOuter.addEventListener("touchstart", dragStartHandle);
    }
    if(mousewheel) {
        this.carouselOuter.addEventListener("mousewheel",(e)=>{
            if(e.deltaY>0) this.moveSlide(-1);
            else this.moveSlide(1);
        })
    }

}

function debounce(fn, delay) {
    let id = null;
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
        item.step = item.imgWidth + item.gapWidth / item.itemWidth * item.imgWidth;
        item.moveSlide(0);
    });
}

window.addEventListener("resize", debounce(handleResize, 500));
