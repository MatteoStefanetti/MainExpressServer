
/** Called by the index.html page. */
function initHome() {
    commonInitOfPage();
    setCarouselPageHeight();
}

function initPlayers(){
    commonInitOfPage();
    document.getElementById('submitPlayerForm').onclick = searchPlayer;
}

/* -------- End of init()s -------- */

/** @param url {string} the url of the axios GET route. */
async function makeAxiosGet(url) {
    return axios.get(url, {headers: {'Content-Type': 'application/json'}, method: 'get'});
}

/** Function called by the **main** *"init"* functions to set common attributes and features. */
function commonInitOfPage() {
    // @todo: check if can still be useful
}

/** Function used to trigger the spinner while loading / fetching the page content.
 * @param window {Window} The window reference in which the spinner is contained.
 * @param toDisplay {boolean} If _true_, it shows the spinner. Otherwise, it will hide its content. */
function showChargingSpinner(window, toDisplay) {
    const elem = (!window) ? document.getElementById('spinner').classList :
        window.document.getElementById('spinner').classList;
    if (toDisplay)
        elem.remove('d-none')
    else
        elem.add('d-none')
}

/** This is an EXPRESS GET function:
 * @returns {Promise} a promise from the Axios GET.
 * The promise will return a {@link Map} to take trace of flags and nations.
 * @throws TypeError if the Axios GET fails. */
async function getAllFlags() {
    return axios.get('/get_flags')
        .then(data => {
            const dataR = Array(data.data)[0];
            let flagList = new Map();
            for(let i in dataR){
                flagList.set(dataR[i].domestic_league_code, {
                    'countryName': String(dataR[i].country_name),
                    'flagURL': String(dataR[i].flag_url)
                });
            }
            return flagList;
        })
        .catch(err => {
            console.log(err);
            throw new TypeError('Error occurred during \'flags\' GET');
        })
}

/** This function creates an HTML element with the following structure:
 * ```
 * <div class="accordion-item rounded-1 mb-1">
 *     <h2 class="accordion-header">
 *         <button class="accordion-button custom-accordion collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion_1" aria-expanded="false" aria-controls="accordion_1">
 *             <img src="" class="img me-2 custom-rounded-0_5" style="height: 1.2rem"/>
 *             <span>Accordion Item</span>
 *         </button>
 *     </h2>
 *     <div id="accordion_1" class="accordion-collapse collapse" data-bs-parent="#clubAccordion">
 *         <div class="accordion-body">
 *             # content inside
 *         </div>
 *     </div>
 * </div>
 * ```
 * @param visualize {string} is the type of accordion defined by one of the following values:
 *  - 'competition_nation'
 *  - 'club_nation'
 *  - 'player_valuation'
 * @param fatherId {string} is the accordion *id* to which bind the accordion-item to
 * @param params {object} is the structure containing the values to use in the accordion.
 * All the parameters passed as argument shall use the **snake_case** to define the names of the variables
 * *(e.g. `{parameter_1: 'par1'}` to be referred to as params.parameter_1)* */
function createAccordion(visualize, fatherId, params){
    let wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('accordion-item', 'rounded-1', 'mb-1');
    let header = document.createElement('h2');
    header.classList.add('accordion-header');
    wrapperDiv.appendChild(header);
    let accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion-button', 'custom-accordion', 'collapsed');
    accordionButton.type = "button";
    accordionButton.setAttribute('data-bs-toggle', 'collapse');
    accordionButton.setAttribute('aria-expanded', 'false');
    header.appendChild(accordionButton);
    let spanTitle = document.createElement('span');
    let collapseDiv = document.createElement('div');
    collapseDiv.classList.add('accordion-collapse', 'collapse');
    collapseDiv.setAttribute('data-bs-parent', '#' + String(fatherId));
    wrapperDiv.appendChild(collapseDiv);
    let accBody = document.createElement('div');
    accBody.classList.add('accordion-body');
    collapseDiv.appendChild(accBody);
    document.getElementById(fatherId).appendChild(wrapperDiv);
    switch (visualize) {
        case 'competition_nation':
            break;
        case 'club_nation':
            accordionButton.setAttribute('aria-controls', '#' + String(params.local_competition_code));
            accordionButton.setAttribute('data-bs-target', '#' + String(params.local_competition_code));
            accordionButton.addEventListener('click', openAccordionClubs.bind(null, params.local_competition_code));
            let flagImg = document.createElement('img');
            flagImg.classList.add('img', 'me-2', 'custom-rounded-0_5');
            flagImg.src = getFlagOf(params.local_competition_code);
            flagImg.style.height = '1.2rem';
            accordionButton.appendChild(flagImg);
            spanTitle.innerText = getNationNameOf(params.local_competition_code);
            accordionButton.appendChild(spanTitle);
            collapseDiv.id = String(params.local_competition_code);
            break;
        case 'player_valuation':
            break;
        default:
            break;
    }
}

function getClubById(id) {  // @todo remove it
    // @todo maybe insert a spinning element
    console.log('Club called with id: ', id);
}

function extractFormData(formId) {
    let formElements = document.getElementById(formId).children;
    let formData={};
    for (let ix = 0; ix < formElements.length; ix++) {
        if (formElements[ix].name) {
            formData[formElements[ix].name] = formElements[ix].type === 'checkbox' ? formElements[ix].checked :  formElements[ix].value;
        }
    }
    return formData;
}

/** This function creates a HTMLElement to moderate the result deployment.
 * @param parentList {HTMLElement} The {@link HTMLElement} to which add the item created.
 * @param partialId {string} The **PARTIAL** id of the element container,
 * useful to retrieve the element and remove it if necessary.
 * @param loadMoreFunction {() => any} A function *pointer* to set the listener of the _"load more"_.
 * @throws Typeerror if one or more arguments are _null_ or _undefined_. */
function createLoadMoreElement(parentList, partialId, loadMoreFunction) {
    if(!parentList || !partialId || !loadMoreFunction) {
        console.error('', parentList, '\n', partialId, '\n', loadMoreFunction);
        throw TypeError('Invalid argument(s) passed to \'createLoadMoreElement()\'!');
    }
    let loadMoreContainer, innerLoadMore;
    if(parentList.tagName !== 'DIV'){
        loadMoreContainer = document.createElement('li');
        loadMoreContainer.classList.add('nav-item', 'mx-auto', 'py-2');
        innerLoadMore = document.createElement('span');
        innerLoadMore.classList.add('text-center', 'px-5');
    } else {
        /* Assertion: inside these brackets, the parentList is a <div> having the 'row' class. */
        loadMoreContainer = document.createElement('div');
        loadMoreContainer.classList.add('col-12', 'd-flex', 'justify-content-center', 'mb-4');
        innerLoadMore = document.createElement('a');
        innerLoadMore.classList.add('py-1', 'px-5', 'more-players-link');
    }
    loadMoreContainer.id =  String(partialId) + 'Loader';
    innerLoadMore.innerText = 'Load more...';
    innerLoadMore.style.textDecoration = 'underline';
    innerLoadMore.addEventListener('click', loadMoreFunction);
    loadMoreContainer.appendChild(innerLoadMore);
    parentList.appendChild(loadMoreContainer);
}

/** This function displays a **modal** to give a feedback of an unsuccessful search.
 * @param unfounded {boolean} If set to `true`, this method will return a message of _**unfounded content**_,
 * otherwise it will display a message of _**too few letters**_ in the input string. */
function showModalMessage(unfounded) {
    if(unfounded) {
        document.getElementById('unfoundedModalLabel').innerText = 'No Player Found';
        document.getElementById('modal-body').innerHTML =
            'The search has found <b>0 players</b>. Please, check the syntax and retry.';
    } else {
        document.getElementById('unfoundedModalLabel').innerText = 'Invalid Input';
        document.getElementById('modal-body').innerHTML =
            'At least <b>3 letters</b> are required for a search.';
    }
    document.getElementById('unfoundedModalTrigger').click();
}
