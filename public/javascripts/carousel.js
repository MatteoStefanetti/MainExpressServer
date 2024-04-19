
const OFFSET = 100

/** Init function called by the carousel documents inside the <iframe>s. */
function initCarousel() {
    let state = 0;
    /* Defining which style to apply to the carousel */
    switch(window.name) {
        default:
    }

    let carousel_prev = document.getElementById('carousel_prev');
    let carousel_next = document.getElementById('carousel_next');
    carousel_prev.addEventListener('click', slideCarouselPrev.bind(carousel_prev, carousel_next));
    carousel_next.addEventListener('click', slideCarouselNext.bind(carousel_next, carousel_prev));
    carousel_prev.disabled = true;

    function slideCarouselPrev(otherBtn) {
        let wrapper = document.getElementById('slider-wrapper');
        const elementWidth = wrapper.firstElementChild.offsetWidth;
        const elementsNum = Math.round(100 / ((elementWidth / wrapper.offsetWidth) * 100));
        if(state > 0) {
            if(otherBtn.disabled)
                otherBtn.disabled = false;
            state--;
            for(let elem of wrapper.children) {
                elem.style.transform = "translateX(" + String((state * -(elementsNum * OFFSET))) + "%)"
                elem.style.transition = "transform 0.9s ease-in-out";
            }
            if(state <= 0)
                this.disabled = true;
        }
    }

    function slideCarouselNext(otherBtn) {
        let wrapper = document.getElementById('slider-wrapper');
        const elementWidth = wrapper.firstElementChild.offsetWidth;
        const elementsNum = Math.round(100 / ((elementWidth / wrapper.offsetWidth) * 100));
        if(state < Math.floor(wrapper.children.length / elementsNum) - 1) {
            if(otherBtn.disabled)
                otherBtn.disabled = false;
            state++;
            for(let elem of wrapper.children) {
                elem.style.transform = "translateX(" + String((state * -(elementsNum * OFFSET))) + "%)"
                elem.style.transition = "transform 1s ease-in-out";
            }
            if(state >= Math.floor(wrapper.children.length / elementsNum) - 1)
                this.disabled = true;
        }
    }
}

/** Function called by the `init()` of the **pages that are using the _iframe_ tags**.
 * This means that, for example, the initHome will call this function. */
function setCarouselPageHeight() {
    setIframesHeight();
    window.addEventListener('resize', setIframesHeight);
}

/** Function to set the height of the iframe based on its content. */
function setIframesHeight() {
    // We define the document with the min height, then set the height of every iframe:
    let iframes = document.getElementsByTagName('iframe');
    for(let elem of iframes)
        if(elem.id !== 'chatPage'){
            const elemDocument = elem.contentDocument || elem.contentWindow.document;
            elem.style.height = (elemDocument.body.scrollHeight + 1) + 'px';
        }
}
