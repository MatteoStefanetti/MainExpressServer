/* The window.name of the carousels needs to be specified with the pattern "A_B", where:
 - A := is the 'class style' chosen for the carousel.
 - B := is the header of the carousel. It has to be written in camelCase,
    to let the correct transformation of the text.
 o ---------------- o ---------------- o ---------------- o ----------------o */

const OFFSET = 100;
let elementList;
const DEFAULT_ELEMENTS_NUMBER = 24;

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        const anchorTarget = event.target.closest('a')
        if (anchorTarget && anchorTarget.href) {
            event.preventDefault()
            window.parent.location.href = anchorTarget.href
        }
    });
});

/** Init function called by the carousel documents inside the <iframe>s. */
async function initCarousel() {
    showChargingSpinner(window.parent, true)
    let state = 0;
    /* Defining which style to apply to the carousel */
    setHeader();
    let retrieveStr = '', styleStr = '';
    const sliderWrapper = document.getElementById('slider-wrapper');
    if (window.name) {
        try {
            styleStr = window.name.substring(0, window.name.indexOf('_'));
            retrieveStr = window.name.substring((window.name.indexOf('_') + 1));
        } catch (err) {
            console.error(err);
        }
    }
    createDefaultCarouselElements(sliderWrapper);
    await retrieveCarouselData(retrieveStr)
        .then(async data => {
            if (elementList)
                console.error('not null: ', elementList)
            elementList = data.data;
            if (!elementList[0])
                console.error('Error: response of', retrieveStr, 'is:', elementList)
            else
                await modifyCarouselElements(sliderWrapper, styleStr)
        })
        .catch(err => console.error(err))

    let carousel_prev = document.getElementById('carousel_prev');
    let carousel_next = document.getElementById('carousel_next');
    carousel_prev.addEventListener('click', slideCarouselPrev.bind(carousel_prev, carousel_next));
    carousel_next.addEventListener('click', slideCarouselNext.bind(carousel_next, carousel_prev));

    toggleButton(carousel_prev, true);
    if ((state + 1) * getShownElementsNumber(sliderWrapper) >= sliderWrapper.children.length)
        toggleButton(carousel_next, true);

    showChargingSpinner(window.parent, false)

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
        if ((state + 1) * elementsNum < wrapper.children.length) {
            if (otherBtn.disabled)
                toggleButton(otherBtn, false);
            state++;
            for (let elem of wrapper.children) {
                elem.style.transform = "translateX(" + String((state * -(elementsNum * OFFSET))) + "%)"
            }
        }
        if ((state + 1) * elementsNum >= wrapper.children.length)
            toggleButton(this, true);
    }
}

/** Function that returns the _Axios GET_ {@link Promise}.
 * @param retrieveStr {string} The name of the axios GET route to send. It returns _null_ if retrieveStr
 * has not a valid value. */
async function retrieveCarouselData(retrieveStr) {
    switch (retrieveStr) {
        case 'lastGames':
            return makeAxiosGet('/home/get_last_games')
        case 'recentClubsNews':
            return makeAxiosGet('/home/get_recent_clubs_news')
        case 'trendPlayers':
            return makeAxiosGet('/home/get_trend_players')
        case 'national':
            return makeAxiosGet('/get_flags')
        case 'international':
            return makeAxiosGet('/competitions/get_competitions/null')
        case 'england':
            return makeAxiosGet('/competitions/get_competitions/GB1')
        default:
            return null;
    }
}

/** Function to set the height of the iframe based on its content.
 * @param externalCall {boolean} If true, the function will perform action on the parent of the iframes.
 * Otherwise, it will resize the height of just THIS iframe through its parent. */
function setIframesHeight(externalCall) {
    let iframes
    if (externalCall) {
        iframes = document.getElementsByTagName('iframe');
        for (let iframe of iframes) {
            if (iframe.src !== './chat.html') {
                iframe.addEventListener('load', () => {
                    setTimeout(adjustIframeHeight.bind(null, externalCall), 100) // 100 ms before setting the height
                })
                if (document.readyState === 'complete')
                    adjustIframeHeight(iframe);
            }
        }
    } else {
        const contentDocument = window.contentDocument || window.parent.document.getElementsByName(window.name)[0].contentWindow.document
        window.parent.document.getElementsByName(window.name)[0].style.height = contentDocument.body.scrollHeight + 'px'
    }
}

/** Function called by an iterator which gives a carousel iframe instance to resize
 * @param iframe the iframe to adjust in height. */
function adjustIframeHeight(iframe) {
    try {
        const contentDocument = iframe.contentDocument || iframe.contentWindow.document;
        const contentHeight = contentDocument.body.scrollHeight;
        iframe.style.height = contentHeight + 'px';
    } catch (error) {
        console.error('Unable to adjust height for iframe:', iframe.src, error);
    }
}

/** Function used to toggle a carousel button, this will set the `visibility` of the button to _'hidden'_ or _'visible'_.
 * @param button {HTMLButtonElement} The button to disable or enable.
 * @param toDisable {boolean} This parameter is _true_ if the button has to be set **disabled**,
 * otherwise the button will be *enabled**.*/
function toggleButton(button, toDisable) {
    button.disabled = Boolean(toDisable);
    if (toDisable)
        button.style.visibility = 'hidden';
    else
        button.style.visibility = 'visible';
}

/** This function **should be called by the init() of the carousel**.
 * It will take the `window.name` as the header of the carousel. */
function setHeader() {
    if (window.name) {
        let stringName = window.name.substring((window.name.indexOf('_') + 1));
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
    for (let i = 0; i < DEFAULT_ELEMENTS_NUMBER; i++) {
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
async function modifyCarouselElements(carouselWrapper, styleString) {
    if (!elementList || !carouselWrapper || !styleString) {
        console.error('Elements: ', elementList, '\nWrapper: ', carouselWrapper, '\nStyle: ', styleString)
        throw new TypeError('Called creation of elements with invalid argument(s).');
    }
    let children = carouselWrapper.children;
    if (children.length !== elementList.length) {
        if (children.length > elementList.length) {
            if (elementList.length > 12)
                elementList.splice(12)
            while (children.length !== elementList.length) {
                carouselWrapper.removeChild(carouselWrapper.lastChild)
            }
        } else
            elementList = Array(elementList).splice(DEFAULT_ELEMENTS_NUMBER)
    }

    carouselWrapper.classList.add('py-1')
    for (let i = 0; i < children.length; i++) {
        let internalDiv = children[i].firstElementChild;
        internalDiv.style.userSelect = 'none'   // To prevent from selecting the divs
        internalDiv.firstElementChild.classList.add('d-block')
        let cardImg = document.createElement('img')
        switch (styleString) {
            case 'games-carousel-card':
                internalDiv.parentElement.classList.remove('col-lg-2')
                internalDiv.classList.remove('mx-auto')
                internalDiv.classList.add('border-darkgreen', 'border-2', 'p-0', 'games-carousel-card')
                internalDiv.firstElementChild.href =
                    getUrlForSinglePage({type: 'game', id: String(elementList[i].gameId)})
                internalDiv.firstElementChild.classList.add('pt-1')
                internalDiv.firstElementChild.innerHTML =
                    '<p class="fs-6 fw-bold text-uppercase text-center">' +
                    new Date(elementList[i].gameDate).toLocaleDateString() + '</p>' +
                    '<hr class="opacity-100 mx-1"><div class="d-flex flex-column">' +
                    '   <div>' +
                    '      <div class="row w-100">' +
                    '           <span class="text-uppercase fs-5 fw-bold text-center z-1 mb-neg-1">' +
                    elementList[i].competitionId + '</span>' +
                    '      </div><div class="d-flex justify-content-between px-2 w-100">' +
                    '          <img src="https://tmssl.akamaized.net/images/wappen/head/' + elementList[i].clubId1 +
                    '.png" alt=" " data-bs-toggle="tooltip" title="' + elementList[i].clubName1 + '" ' +
                    'class="img-fluid game-img-size zn-1">' +
                    '          <img src="https://tmssl.akamaized.net/images/wappen/head/' + elementList[i].clubId2 +
                    '.png" alt=" " data-bs-toggle="tooltip" title="' + elementList[i].clubName2 + '" ' +
                    'class="img-fluid game-img-size zn-1">' +
                    '      </div><div class="row w-100"><span class="text-uppercase text-darkgreen ' +
                    'fs-5 fw-bold text-center z-1 mt-neg-1">VS</span></div>' +
                    '   </div><div class="d-flex justify-content-between mx-3 mx-sm-4">' +
                    '       <p class="fw-bold fs-3 text-center">' + elementList[i].goal1 + '</p>' +
                    '       <p class="fw-bold fs-3 text-center">-</p>' +
                    '       <p class="fw-bold fs-3 text-center">' + elementList[i].goal2 + '</p></div></div>'

                break;
            case 'simple-image-carousel-card':
                internalDiv.classList.remove('justify-content-center')
                internalDiv.classList.add('border-darkgreen', 'border-2', 'align-items-center',
                    'simple-image-carousel-card')
                cardImg.classList.add('img-fluid', 'p-2')
                internalDiv.firstElementChild.appendChild(cardImg)
                if (elementList[0].clubName) {
                    internalDiv.firstElementChild.href =
                        getUrlForSinglePage({type: 'club', id: String(elementList[i].clubId)})
                    internalDiv.firstElementChild.title = String(elementList[i].clubName)
                    cardImg.src = "https://tmssl.akamaized.net/images/wappen/head/" +
                        String(elementList[i].clubId) + ".png";
                } else {
                    await makeAxiosGet('/retrieve_last_season/' + String(elementList[i].competition_id))
                        .then(lastSeason => {
                            internalDiv.firstElementChild.href =
                                getUrlForSinglePage({
                                    type: 'competition',
                                    id: String(elementList[i].competition_id),
                                    season: String(lastSeason.data)
                                })
                        })
                        .catch(err => console.error(err));

                    internalDiv.firstElementChild.title = retrieveCompetitionName(elementList[i].competition_name)
                    cardImg.src = "https://tmssl.akamaized.net/images/logo/header/" +
                        String(elementList[i].competition_id).toLowerCase() + ".png";
                }
                break;
            case 'player-carousel-card':
                internalDiv.classList.remove('mx-auto', 'rounded-4', 'text-center');
                internalDiv.classList.add('bg-lightgreen', 'd-flex', 'justify-content-center', 'border-3', 'border-darkgreen', 'rounded-3',
                    'player-carousel-card', 'h-100')
                internalDiv.firstElementChild.classList.add('w-100')
                internalDiv.firstElementChild.href =
                    getUrlForSinglePage({type: 'player', id: String(elementList[i].playerId)})
                internalDiv.firstElementChild.title = String(elementList[i].playerName)
                cardImg.classList.add('img-fluid', 'p-1', 'pb-0', 'rounded-3', 'w-100')
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
                elementList.sort((st, nd) => {
                    return String(st.country_name).localeCompare(String(nd.country_name))
                });
                internalDiv.classList.remove('justify-content-center')
                internalDiv.classList.add('border-darkgreen', 'border-2', 'align-items-center',
                    'national-carousel-card')
                internalDiv.firstElementChild.remove()
                let btnElem = document.createElement('button')
                btnElem.classList.add('bg-transparent', 'border-0', 'rounded-4', 'w-100', 'h-100')
                internalDiv.appendChild(btnElem)
                internalDiv.firstElementChild.title = String(elementList[i].country_name)
                cardImg.classList.add('img-fluid', 'p-2', 'mb-1', 'rounded-4')
                cardImg.src = elementList[i].flag_url
                internalDiv.firstElementChild.appendChild(cardImg)
                let countryText = document.createElement('span')
                countryText.innerText = String(elementList[i].country_name)
                internalDiv.firstElementChild.appendChild(countryText)
                btnElem.id = String(elementList[i].domestic_league_code)
                btnElem.addEventListener('click',
                    loadNationalCompetition.bind(internalDiv, elementList[i].domestic_league_code))
                break;
            default:
                console.error('Style "' + styleString + '" not found for the carousel.');
                return;
        }
    }
    setTimeout(setIframesHeight.bind(null, false), 200)
}

/** Function used to show and load the data for the national competitions
 * @param domestic_league_code {string} */
async function loadNationalCompetition(domestic_league_code) {
    if (!domestic_league_code) {
        console.error('Called \'loadNationalCompetition\' with null \'domestic_league_code\'!')
        return;
    }
    const parentWin = window.parent
    const collapseBtn = parentWin.document.getElementById('btn-collapser')
    if (this.classList.contains('current-nation')) {    // it collapses the div

        // This triggers the button of the parent element to show or hide the content of the nationalSection
        collapseBtn.click()

        this.classList.remove('current-nation')
        for (let iframe of parentWin.document.getElementsByTagName('iframe'))
            if (iframe.classList.contains('collapse-toggler'))
                setTimeout(adjustIframeHeight.bind(null, iframe), 400)
    } else {
        let nationalSection = parentWin.document.getElementById('nationalSection')
        if (document.getElementsByClassName('current-nation').length !== 0) {

            // The div is shown, must recreate the content and modify the selected nation
            nationalSection.name = domestic_league_code

            for (let elem of document.getElementsByClassName('current-nation'))
                elem.classList.remove('current-nation')
            this.classList.add('current-nation')

            parentWin.document.getElementById('gamesAccordion').replaceChildren()
        } else {
            // it shows the div & creates the content
            collapseBtn.click()
            this.classList.add('current-nation')

            if (nationalSection.name === domestic_league_code)
                return;     // It returns, to avoid reloading data

            nationalSection.name = domestic_league_code
            parentWin.document.getElementById('gamesAccordion').replaceChildren()
        }
        collapseBtn.classList.add('send-get');      // this should trigger the method to send the get
        showChargingSpinner(parentWin, true)
    }
}
