/* The window.name of the carousels need to be specified with the pattern "A_B", where:
 - A := is the 'class style' chosen for the carousel.
 - B := is the header of the carousel. It has to be written in camelCase,
    to let the correct transformation of the text.
 o ---------------- o ---------------- o ---------------- o ----------------o */

const OFFSET = 100;

/** Init function called by the carousel documents inside the <iframe>s. */
function initCarousel() {
    let state = 0;
    /* Defining which style to apply to the carousel */
    setHeader();
    let retrieveStr = '', styleStr = '', elementsNumber = 12;
    const sliderWrapper = document.getElementById('slider-wrapper');
    if(window.name) {
        try {
            styleStr = window.name.substring(0, window.name.indexOf('_'));
            retrieveStr = window.name.substring((window.name.indexOf('_')+1));
        } catch(err) {
            console.error(err);
        }
    }
    switch(retrieveStr) {
        case 'lastGames':
            // @todo call the functions to retrieve data
            // @todo call the functions and show the data (also the cards creation)
            break;
        case 'recentClubsNews':
            // @todo call the functions to retrieve data
            // @todo call the functions and show the data (also the cards creation)
            break;
        case 'trendPlayers':
            // @todo call the functions to retrieve data
            // @todo call the functions and show the data (also the cards creation)
            break;
        default:
    }

    switch (styleStr) {
        case 'style-1':
            // @todo DEFINE the classes (and the functions if needed) that will be set to the the carousel
            break;
        case 'style-2':
            // @todo DEFINE the classes (and the functions if needed) that will be set to the the carousel
            break;
        case 'style-3':
            // @todo DEFINE the classes (and the functions if needed) that will be set to the the carousel
            break;
        default: /* Standard creation of elements */
            createDefaultCarouselElements(elementsNumber, sliderWrapper);
    }

    let carousel_prev = document.getElementById('carousel_prev');
    let carousel_next = document.getElementById('carousel_next');
    carousel_prev.addEventListener('click', slideCarouselPrev.bind(carousel_prev, carousel_next));
    carousel_next.addEventListener('click', slideCarouselNext.bind(carousel_next, carousel_prev));
    toggleButton(carousel_prev, true);
    if(state >= Math.floor(sliderWrapper.children.length / getShownElementsNumber(sliderWrapper)) - 1)
        toggleButton(carousel_next, true);

    /** **Local** function used to slide the carousel towards **left**. */
    function slideCarouselPrev(otherBtn) {
        let wrapper = document.getElementById('slider-wrapper');
        const elementsNum = getShownElementsNumber(wrapper);
        if(state > 0) {
            if(otherBtn.disabled)
                toggleButton(otherBtn, false);
            state--;
            for(let elem of wrapper.children) {
                elem.style.transform = "translateX(" + String((state * -(elementsNum * OFFSET))) + "%)"
                elem.style.transition = "transform 0.9s ease-in-out";
            }
        }
        if(state <= 0)
            toggleButton(this, true);
    }

    /** **Local** function used to slide the carousel towards **right**. */
    function slideCarouselNext(otherBtn) {
        let wrapper = document.getElementById('slider-wrapper');
        const elementsNum = getShownElementsNumber(wrapper);
        if(state < Math.floor(wrapper.children.length / elementsNum) - 1) {
            if(otherBtn.disabled)
                toggleButton(otherBtn, false);
            state++;
            for(let elem of wrapper.children) {
                elem.style.transform = "translateX(" + String((state * -(elementsNum * OFFSET))) + "%)"
                elem.style.transition = "transform 1s ease-in-out";
            }
        }
        if(state >= Math.floor(wrapper.children.length / elementsNum) - 1)
            toggleButton(this, true);
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

/** Function used to toggle a carousel button, this will set the `visibility` of the button to _'hidden'_ or _'visible'_.
 * @param button {HTMLButtonElement} The button to disable or enable.
 * @param toDisable {boolean} This parameter is _true_ if the button has to be set **disabled**,
 * otherwise the button will be *enabled**.
 * @throws TypeError if button is */
function toggleButton(button, toDisable) {
    button.disabled = Boolean(toDisable);
    if(toDisable)
        button.style.visibility = 'hidden';
    else
        button.style.visibility = 'visible';
}

/** This function **should be called by the init() of the carousel**.
 * It will take the `window.name` as the header of the carousel. */
function setHeader() {
    if(window.name){
        let stringName = window.name.substring((window.name.indexOf('_')+1));
        document.getElementById('headerPar').innerText =
            stringName.replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    }
}

/** It creates _n_ elements inside the wrapperElement. The style will be as follows:
 * ```
 * <div class="col-12 col-xs-6 col-sm-4 col-md-3 col-lg-2 px-1 py-0">
 *   <div class="mx-auto border rounded-4 text-center carousel-elements-size">
 *       a
 *   </div>
 * </div>
 * ```
 * @param n {number} How many elements to generate inside the carousel.
 * @param wrapperElement {HTMLElement} The wrapper of the carousel. */
function createDefaultCarouselElements(n, wrapperElement) {
    for(let i = 0; i < n; i++) {
        let containerDiv = document.createElement('div');
        containerDiv.classList.add('col-12', 'col-xs-6', 'col-sm-4', 'col-md-3', 'col-lg-2', 'px-1', 'py-0');
        containerDiv.innerHTML = '<div class="mx-auto border rounded-4 ' +
            'text-center carousel-elements-size">' + String((i+1)) + '</div>';
        wrapperElement.appendChild(containerDiv);
    }
}

/** **Optimized** function to retrieve the current number of elements shown in the viewport.
 * @param wrapper {HTMLElement} The _slider-wrapper_ of the carousel. */
function getShownElementsNumber(wrapper) {
    return Math.round(100 / ((wrapper.firstElementChild.offsetWidth / wrapper.offsetWidth) * 100));
}
