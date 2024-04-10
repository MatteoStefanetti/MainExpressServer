let flags;

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
function createAccordion(fatherId, localCompetitionCode) {
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
    accordionButton.setAttribute('aria-controls', '#'+String(localCompetitionCode));
    accordionButton.setAttribute('data-bs-target', '#'+String(localCompetitionCode));
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
    collapseDiv.setAttribute('data-bs-parent', '#'+String(fatherId));
    collapseDiv.id = String(localCompetitionCode);
    wrapperDiv.appendChild(collapseDiv);
    let accBody = document.createElement('div');
    accBody.classList.add('accordion-body');
    collapseDiv.appendChild(accBody);
    document.getElementById(fatherId).appendChild(wrapperDiv);
}

function getFlagOf(localCompetitionCode) {
    return flags.get(localCompetitionCode).flagURL;
}

function getNationNameOf(localCompetitionCode) {
    return flags.get(localCompetitionCode).countryName;
}

/** Function that sends a SPRINGBOOT GET to retrieve the data about clubs of a localCompetitionCode.
 * @param id {string} is the localCompetitionCode used as ID of the accordion button.
 * @throws TypeError if catch case of the axios GET occurs. */
function openAccordionClubs(id) {
    // @todo maybe insert a spinning element
    if (document.getElementById(id).firstElementChild.children.length === 0) {
        axios.get(`/get_clubs_by_local_competition_code/${id}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(data => {
                let dataResponse = Array(data.data)[0];
                dataResponse.sort((st, nd) => { return String(st.clubName).localeCompare(String(nd.clubName)) });
                let dataList = new Map();
                for (let i in dataResponse) {
                    dataList.set(dataResponse[i].clubId, String(dataResponse[i].clubName));
                }
                let unList = document.createElement('ul');
                unList.classList.add('nav', 'px-2', 'flex-column');
                let alternatorCounter = 0;
                dataList.forEach((value, key) => {
                    let listItem = document.createElement('li');
                    if (alternatorCounter % 2 !== 0) {
                        listItem.classList.add('bg-light'); /* for browsers that don't support gradients */
                        listItem.style.backgroundImage =
                            'linear-gradient(90deg, white, rgba(var(--custom-accordion-lightgrey-rgb), 0.5)' +
                            ', rgba(var(--custom-accordion-lightgrey-rgb), 0.6), ' +
                            'rgba(var(--custom-accordion-lightgrey-rgb), 0.5), white)';
                    }
                    listItem.classList.add('nav-item', 'd-flex', 'align-items-center', 'py-2');
                    if(alternatorCounter !== (dataList.size - 1) )
                        listItem.classList.add('border-black', 'border-1', 'border-bottom', 'border-opacity-25');
                    if(alternatorCounter > Math.floor(dataList.size / 2))
                        listItem.classList.add('d-none');
                    alternatorCounter++;
                    listItem.id = String(key);
                    let imgContainer = document.createElement('div')
                    imgContainer.classList.add('d-flex', 'rounded-3', 'justify-content-center',
                        'align-items-center', 'ms-1');
                    imgContainer.style.width = '2.75rem';
                    imgContainer.style.minWidth = '2.75rem';
                    imgContainer.style.height = '2.75rem';
                    imgContainer.style.minHeight = '2.75rem';
                    imgContainer.style.backgroundColor = 'grey';
                    imgContainer.style.backgroundImage = 'linear-gradient(45deg, grey 2%, lightgrey 55%, white)';
                    let clubLogoImg = document.createElement('img');
                    clubLogoImg.alt = " ";
                    imgContainer.appendChild(clubLogoImg);
                    listItem.appendChild(imgContainer);
                    let nameSpan = document.createElement('span');
                    nameSpan.classList.add('ms-3', 'flex-grow-1');
                    nameSpan.innerText = String(value);
                    listItem.appendChild(nameSpan);
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
                    listItem.appendChild(desktopBtn);
                    listItem.addEventListener('click', getClubById.bind(null, key));
                    unList.appendChild(listItem);
                });
                // Adding the 'load more...' element
                let loadMoreElem = document.createElement('li');
                loadMoreElem.classList.add('nav-item', 'mx-auto', 'py-2');
                loadMoreElem.id = String(id + 'Loader');
                let loaderSpan = document.createElement('span');
                loaderSpan.classList.add('text-center', 'px-5');
                loaderSpan.innerText = 'Load more...';
                loadMoreElem.appendChild(loaderSpan);
                loadMoreElem.addEventListener('click', loadRemainingElements.bind(null, String(id + 'Loader')));
                unList.appendChild(loadMoreElem);
                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                console.log(err);
                throw new TypeError('Error occurred during \'clubs_by_local_competition_code\' GET');
            })
    }
}

/** Function that loads the remaining elements of the `<ul>` list.
 * @param id {string} the id attribute of the _'loadMore'_ {@link HTMLElement}*/
function loadRemainingElements(id) {
    const loader = document.getElementById(id);
    const clubsUnList = loader.parentElement;
    loader.remove();
    for(let i = Math.floor(clubsUnList.children.length / 2) + 1; i < clubsUnList.children.length; i++)
        clubsUnList.children.item(i).classList.remove('d-none');
}
