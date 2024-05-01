/* The window.name of the carousels needs to be specified with the pattern "A_B", where:
 - A := is the 'class style' chosen for the carousel.
 - B := is the header of the carousel. It has to be written in camelCase,
    to let the correct transformation of the text.
 o ---------------- o ---------------- o ---------------- o ----------------o */

const OFFSET = 100;
let elementList;
const DEFAULT_ELEMENTS_NUMBER = 24;

/** Init function called by the carousel documents inside the <iframe>s. */
async function initCarousel() {
    let state = 0;
    /* Defining which style to apply to the carousel */
    setHeader();
    let retrieveStr = '', styleStr = '', elementsNumber = 12;
    const sliderWrapper = document.getElementById('slider-wrapper');
    if (window.name) {
        try {
            styleStr = window.name.substring(0, window.name.indexOf('_'));
            retrieveStr = window.name.substring((window.name.indexOf('_') + 1));
        } catch (err) {
            console.error(err);
        }
    }
    switch (retrieveStr) {
        case 'lastGames':
            createDefaultCarouselElements(sliderWrapper);
            await makeAxiosGet('/games/get_last_games')
                .then(data => {
                    if(elementList)
                        console.error('not null: ', elementList)
                    elementList = Array(data.data)[0];
                    // @todo call the functions and show the data (also the cards creation)
                    modifyCarouselElements(sliderWrapper, styleStr);
                })
                .catch(err => console.error(err))
            break;
        case 'recentClubsNews':
            createDefaultCarouselElements(sliderWrapper);
            await makeAxiosGet('/clubs/get_recent_clubs_news')
                .then(data => {
                    if(elementList)
                        console.error('not null: ', elementList)
                    elementList = Array(data.data)[0];
                    // @todo call the functions and show the data (also the cards creation)
                    modifyCarouselElements(sliderWrapper, styleStr);
                })
                .catch(err => console.error(err))
            break;
        case 'trendPlayers':
            createDefaultCarouselElements(sliderWrapper);
            await makeAxiosGet('/players/get_trend_players')
                .then(data => {
                    if (elementList)
                        console.error('not null: ', elementList)
                    elementList = Array(data.data)[0];
                    // @todo call the functions and show the data (also the cards creation)
                    modifyCarouselElements(sliderWrapper, styleStr);
                })
                .catch(err => console.error(err))
            break;
        default:
            createDefaultCarouselElements(sliderWrapper);
    }

    let carousel_prev = document.getElementById('carousel_prev');
    let carousel_next = document.getElementById('carousel_next');
    carousel_prev.addEventListener('click', slideCarouselPrev.bind(carousel_prev, carousel_next));
    carousel_next.addEventListener('click', slideCarouselNext.bind(carousel_next, carousel_prev));
    toggleButton(carousel_prev, true);
    if (state >= Math.floor(sliderWrapper.children.length / getShownElementsNumber(sliderWrapper)) - 1)
        toggleButton(carousel_next, true);

    /** **Local** function used to slide the carousel towards **left**. */
    function slideCarouselPrev(otherBtn) {
        let wrapper = document.getElementById('slider-wrapper');
        const elementsNum = getShownElementsNumber(wrapper);
        if (state > 0) {
            if (otherBtn.disabled)
                toggleButton(otherBtn, false);
            state--;
            for (let elem of wrapper.children) {
                elem.style.transform = "translateX(" + String((state * -(elementsNum * OFFSET))) + "%)"
            }
        }
        if (state <= 0)
            toggleButton(this, true);
    }

    /** **Local** function used to slide the carousel towards **right**. */
    function slideCarouselNext(otherBtn) {
        let wrapper = document.getElementById('slider-wrapper');
        const elementsNum = getShownElementsNumber(wrapper);
        if (state < Math.floor(wrapper.children.length / elementsNum) - 1) {
            if (otherBtn.disabled)
                toggleButton(otherBtn, false);
            state++;
            for (let elem of wrapper.children) {
                elem.style.transform = "translateX(" + String((state * -(elementsNum * OFFSET))) + "%)"
            }
        }
        if (state >= Math.floor(wrapper.children.length / elementsNum) - 1)
            toggleButton(this, true);
    }
}

/** Function called by the `init()` of the **pages that are using the _iframe_ tags**.
 * This means that, for example, the initHome will call this function. */
function setCarouselPageHeight() {
    setIframesHeight(null);
    window.addEventListener('resize', setIframesHeight.bind(null, null));
}

/** Function to set the height of the iframe based on its content. */
function setIframesHeight(window) {
    // We define the document with the min height, then set the height of every iframe:
    let iframes = (window) ?
        window.document.getElementsByTagName('iframe') :
        document.getElementsByTagName('iframe');
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

/** **Optimized** function to retrieve the current number of elements shown in the viewport.
 * @param wrapper {HTMLElement} The _slider-wrapper_ of the carousel. */
function getShownElementsNumber(wrapper) {
    return Math.round(100 / ((wrapper.firstElementChild.offsetWidth / wrapper.offsetWidth) * 100));
}

/** It creates _DEFAULT_ELEMENTS_NUMBER_ elements inside the wrapperElement. The style will be as follows:
 * ```
 * <div class="col-12 col-xs-6 col-sm-4 col-md-3 col-lg-2 px-1 py-0">
 *   <div class="mx-auto border rounded-4 text-center carousel-elements-size">
 *      <a href=""></a>
 *   </div>
 * </div>
 * ```
 * @param wrapperElement {HTMLElement} The wrapper of the carousel. */
function createDefaultCarouselElements(wrapperElement) {
    for(let i = 0; i < DEFAULT_ELEMENTS_NUMBER; i++) {
        let containerDiv = document.createElement('div');
        containerDiv.classList.add('d-flex', 'justify-content-center', 'col-12', 'col-xs-6', 'col-sm-4', 'col-md-3', 'col-lg-2', 'px-1', 'py-0');
        containerDiv.innerHTML = '<div class="mx-auto border rounded-4 ' +
            'text-center carousel-elements-size"><a href="" data-bs-toggle="tooltip"></a></div>';
        wrapperElement.appendChild(containerDiv);
    }
}

/** The values of the data to show are in the variable **elementList**.
 * If it is _null_ or _undefined_, it will throw a {@link TypeError}.
 * @param carouselWrapper {HTMLElement} The container _(wrapper)_ inside which the elements will be put.
 * @param styleString {string} the style string used to define which style is going to be set for the carousel.
 * @throws TypeError if any argument is _null_ or _undefined_.*/
function modifyCarouselElements(carouselWrapper, styleString) {
    if (!elementList || !carouselWrapper || !styleString) {
        console.error('Elements: ', elementList, '\nWrapper: ', carouselWrapper, '\nStyle: ', styleString)
        throw new TypeError('Called creation of elements with invalid argument(s).');
    }
    console.log('elems before: ', elementList.length)       // @todo remove it DEBUG PRINT
    let children = carouselWrapper.children;
    if (children.length !== elementList.length) {
        if (children.length > elementList.length) {
            // @todo if (elementList < 12) -> problem seeing elements of the carousel
            if (elementList.length > 12)
                elementList.splice(12)
            while (children.length !== elementList.length) {
                carouselWrapper.removeChild(carouselWrapper.lastChild)
            }
        } else
            elementList.splice(DEFAULT_ELEMENTS_NUMBER)
    }
    carouselWrapper.classList.add('pb-1')
    for (let i = 0; i < children.length; i++) {
        let internalDiv = children[i].firstElementChild;
        let cardImg = document.createElement('img')
        switch (styleString) {
            case 'games-carousel-card':
                // @todo DEFINE the classes (and the functions if needed) that will be set to the the carousel
                break;
            case 'simple-image-carousel-card':
                internalDiv.classList.remove('justify-content-center')
                internalDiv.classList.add('border-darkgreen', 'border-2', 'align-items-center',
                    'simple-image-carousel-card')
                cardImg.classList.add('img-fluid', 'p-2')
                internalDiv.firstElementChild.href = '#';    // @todo remove it after href is set.
                internalDiv.firstElementChild.appendChild(cardImg)
                if (elementList[0].clubName) {
                    // @todo internalDiv.firstElementChild.href = '...'
                    internalDiv.firstElementChild.title = String(elementList[i].clubName)
                    cardImg.src = "https://tmssl.akamaized.net/images/wappen/head/" +
                        String(elementList[i].clubId) + ".png";
                } else {
                    // @todo internalDiv.firstElementChild.href = '...'
                    internalDiv.firstElementChild.title = String(elementList[i].competitionName)
                    // @todo ...
                }
                break;
            case 'player-carousel-card':
                internalDiv.classList.remove('mx-auto', 'rounded-4', 'text-center');
                internalDiv.classList.add('bg-lightgreen', 'border-3', 'border-darkgreen', 'rounded-3',
                    'player-carousel-card', 'h-100')
                // @todo internalDiv.firstElementChild.href = '...'
                internalDiv.firstElementChild.href = '#'
                internalDiv.firstElementChild.title = String(elementList[i].playerName)
                cardImg.classList.add('img-fluid', 'p-1', 'pb-0', 'rounded-3')
                cardImg.src = String(elementList[i].imageUrl)
                cardImg.alt = ' '
                let textContainer = document.createElement('div')
                textContainer.classList.add('mx-auto', 'text-white', 'text-center', 'px-1', 'fs-7', 'my-1',
                    'player-text-div')
                textContainer.innerText = setReducedName(elementList[i].playerLastName, elementList[i].playerName);
                internalDiv.firstElementChild.appendChild(cardImg)
                internalDiv.firstElementChild.appendChild(textContainer)
                break;
            case 'national-carousel-card':
                // @todo DEFINE the classes (and the functions if needed) that will be set to the the carousel
                break;
            default:
                console.error('Style "' + styleString + '" not found for the carousel.');
                return;
        }
        setIframesHeight(window.parent)
    }
}

/** Returns the _fullName_, but if it is too long (more than 15 characters) it will **shorten** all the first names.
 * @param lastName {string} The string to try to maintain at the end.
 * @param fullName {string} The full name that will be truncated if necessary. */
function setReducedName(lastName, fullName) {
    if(!fullName || fullName.length === lastName.length)
        return lastName;
    if(fullName.length < 14)
        return fullName;
    let fullNArray = fullName.trim().split(' ')
    const lastNStart = lastName.trim().split(' ')[0]
    for(let i = 0; i < fullNArray.length; i++) {
        if (fullNArray[i] !== lastNStart)
            fullNArray[i] = String(fullNArray[i].trim().charAt(0) + '.')
        else
            i = fullNArray.length;
    }
    return fullNArray.join(' ');
}
