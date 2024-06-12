let flags;

/** Called by the clubs.html page. */
async function initClubs() {
    await getAllFlags()
        .then(res => {
            flags = res;
        })
        .catch(err => console.error(err))
    flags.forEach((value, key) => {
        createAccordion('club_nation', 'clubAccordion', {local_competition_code: key});
    })
    document.getElementById('submitClubForm').addEventListener('click', searchClubs);
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
 * @param fatherId {string} is the accordion *id* to which bind the accordion-item to
 * @param localCompetitionCode {string} is the code used to bind the button to the country */
/*function createAccordion(fatherId, localCompetitionCode) {
    let wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('accordion-item', 'rounded-1', 'mb-1');
    let header = document.createElement('h2');
    header.classList.add('accordion-header');
    wrapperDiv.appendChild(header);
    let accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion-button', 'custom-accordion', 'collapsed');
    accordionButton.type = "button";
    accordionButton.setAttribute('data-bs-toggle', 'collapse')
    accordionButton.setAttribute('aria-expanded', 'false');
    accordionButton.setAttribute('aria-controls', '#' + String(localCompetitionCode));
    accordionButton.setAttribute('data-bs-target', '#' + String(localCompetitionCode));
    accordionButton.addEventListener('click', openAccordionClubs.bind(null, localCompetitionCode));
    header.appendChild(accordionButton);
    let flagImg = document.createElement('img');
    flagImg.classList.add('img', 'me-2', 'custom-rounded-0_5');
    flagImg.src = getFlagOf(localCompetitionCode);
    flagImg.style.height = '1.2rem';
    accordionButton.appendChild(flagImg);
    let spanTitle = document.createElement('span');
    spanTitle.innerText = getNationNameOf(localCompetitionCode);
    accordionButton.appendChild(spanTitle);
    let collapseDiv = document.createElement('div');
    collapseDiv.classList.add('accordion-collapse', 'collapse');
    collapseDiv.setAttribute('data-bs-parent', '#' + String(fatherId));
    collapseDiv.id = String(localCompetitionCode);
    wrapperDiv.appendChild(collapseDiv);
    let accBody = document.createElement('div');
    accBody.classList.add('accordion-body');
    collapseDiv.appendChild(accBody);
    document.getElementById(fatherId).appendChild(wrapperDiv);
}*/

function getFlagOf(localCompetitionCode) {
    return flags.get(localCompetitionCode).flagURL;
}

function getNationNameOf(localCompetitionCode) {
    return flags.get(localCompetitionCode).countryName;
}

/** Function that sends a SPRINGBOOT GET to retrieve the data about clubs of a localCompetitionCode.
 * @param id {string} is the localCompetitionCode used as ID of the accordion button.
 * @throws Error if catch case of the axios GET occurs. */
async function openAccordionClubs(id) {
    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true)
        await makeAxiosGet(`/clubs/get_clubs_by_local_competition_code/${id}`)
            .then(data => {
                let dataResponse = data.data;
                dataResponse.sort((st, nd) => {
                    return String(st.clubName).localeCompare(String(nd.clubName))
                });
                let dataList = new Map();
                for (let i in dataResponse) {
                    dataList.set(dataResponse[i].clubId, String(dataResponse[i].clubName));
                }
                let unList = document.createElement('ul');
                unList.classList.add('nav', 'flex-column');
                let alternatorCounter = 0;
                dataList.forEach((value, key) => {
                    createDynamicListItem(window, 'club', dataList.size, unList,
                        {counter: alternatorCounter++, data: {id: key, text: value}},
                        {type: 'club', id: String(key)});
                });
                // Adding the 'load more...' element
                if(dataList.size > 30)
                    createLoadMoreElement(unList, id, showMore.bind(null, unList, 30));
                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                console.error(err);
                throw new Error('Error occurred during \'/clubs_by_local_competition_code\' GET');
            })
        showChargingSpinner(null, false)
    }
}

/** It sends a GET extracting the form data and retrieving a club list as an {@link array}.
 * @param event - event fired when the form is submitted. */
function searchClubs(event) {
    document.getElementById('submitClubForm').disabled = true;
    let formData = extractFormData('searchClub');
    let club = formData.searchBar;
    if (club && club.length > 2) {
        axios.get(`/clubs/get_clubs_by_string/${club}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(data => {
                let dataResponse = data.data;
                dataResponse.sort((st, nd) => {
                    return String(st.clubName).localeCompare(String(nd.clubName))
                });
                let dataList = new Map();
                for (let i in dataResponse) {
                    dataList.set(dataResponse[i].clubId, {
                        'clubName': String(dataResponse[i].clubName),
                        'domesticLeagueCode': dataResponse[i].domesticLeagueCode
                    });
                }
                document.getElementById('clubAccordion').classList.add('d-none');
                let unList = document.getElementById('clubResults');
                unList.replaceChildren();
                unList.classList.add('nav', 'px-2', 'flex-column');
                unList.classList.remove('d-none');
                let elementCounter = 0;
                dataList.forEach((value, key) => {
                    createDynamicListItem(window, 'club', dataList.size, unList, {
                            counter: elementCounter++, data: { id: key, text: value.clubName }
                        },
                        {type: 'club', id: String(key)});
                })
                // Adding the 'load more...' element
                if (dataList.size > 30)
                    createLoadMoreElement(unList, unList.id, showMore.bind(null, unList, 30));
            })
            .catch(err => {
                showModalMessage(true, 'club');
            })
    } else {
        if (!club) {
            location.reload();
        } else
            showModalMessage(false, 'club');
    }
    event.preventDefault();
    document.getElementById('submitClubForm').disabled = false;
}

/** This function creates a listItem, filling it with dataList  to bind to {@link unorderedList}
 * @param size {number} The **size** of the set to show.
 *  This attribute is required to initially show only the first half of the data retrieved.
 * @param unorderedList {HTMLElement} The {@link HTMLElement}, _usually an `<ul>` or `<ol>` type_,
 *  to which add item created.
 * @param elementCounter {number} The counter that provides various features,
 *  as like the alternated color of the list items
 * @param id {string} The **id** set to the `<li>` element.
 * @param text {string} The text to show.
 * @param params {object} the params for the single_page.html to link up to the listItem.
 * @throws TypeError - When one or more arguments are _undefined_ or _null_. */
function createListItem(size, unorderedList, elementCounter, id, text, params) {
    if (!size || !unorderedList || elementCounter < 0 || !id || !text) {
        console.error('', size, '\n', unorderedList, '\n', elementCounter, '\n', id, '\n', text);
        throw new TypeError('Invalid argument(s) passed to \'createListItem\'!');
    }
    let listItem = document.createElement('li');
    let listItemLink = document.createElement('a');

    listItemLink.href = getUrlForSinglePage(params)

    listItem.appendChild(listItemLink);
    if (size === 1 || elementCounter % 2 !== 0) {
        listItem.classList.add('bg-light'); /* for browsers that don't support gradients */
        listItem.style.backgroundImage =
            'linear-gradient(90deg, white, rgba(var(--custom-accordion-lightgrey-rgb), 0.5)' +
            ', rgba(var(--custom-accordion-lightgrey-rgb), 0.6), ' +
            'rgba(var(--custom-accordion-lightgrey-rgb), 0.5), white)';
    }
    listItem.classList.add('nav-item');
    listItemLink.classList.add('d-flex', 'align-items-center', 'py-2', 'mx-2');
    if (elementCounter !== (size - 1))
        listItem.classList.add('border-black', 'border-1', 'border-bottom', 'border-opacity-25');
    if (size > 20 && elementCounter > Math.floor(size / 2))
        listItem.classList.add('d-none');
    listItem.id = String(id);
    let imgContainer = document.createElement('div')
    imgContainer.classList.add('d-flex', 'rounded-3', 'justify-content-center', 'align-items-center', 'ms-1');
    imgContainer.style.width = '2.75rem';
    imgContainer.style.minWidth = '2.75rem';
    imgContainer.style.height = '2.75rem';
    imgContainer.style.minHeight = '2.75rem';
    let clubLogoImg = document.createElement('img');
    clubLogoImg.classList.add('img');
    /* the following string refers to the 'transfer-market' website used by the teacher for the assignment.
     * It uses the ID of the club to which the image is referred to. */
    clubLogoImg.src = "https://tmssl.akamaized.net/images/wappen/head/" + String(id) + ".png";
    clubLogoImg.style.maxWidth = '2.75rem';
    clubLogoImg.style.maxHeight = '2.75rem';
    clubLogoImg.alt = " ";
    imgContainer.appendChild(clubLogoImg);
    listItemLink.appendChild(imgContainer);
    let nameSpan = document.createElement('span');
    nameSpan.classList.add('ms-3', 'flex-grow-1');
    nameSpan.innerText = text;
    listItemLink.appendChild(nameSpan);
    let desktopBtn = document.createElement('div');
    desktopBtn.classList.add('d-none', 'd-sm-flex', 'justify-content-center', 'align-items-center',
        'bg-lightgreen', 'rounded-3', 'me-1', 'p-1', 'tuple-btn');
    desktopBtn.style.width = '2.5rem';
    desktopBtn.style.minWidth = '2.5rem';
    desktopBtn.style.height = '2.5rem';
    desktopBtn.style.minHeight = '2.5rem';
    let statsImg = document.createElement('img');
    statsImg.classList.add('img-fluid');
    statsImg.src = '../images/stats_btn_img.svg';
    desktopBtn.appendChild(statsImg);
    listItemLink.appendChild(desktopBtn);
    unorderedList.appendChild(listItem);
    return listItem;
}
