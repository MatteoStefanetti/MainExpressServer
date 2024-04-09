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
 * @throws TypeError if catch case of the axios GET occurs.
 * */
function openAccordionClubs(id) {
    // @todo maybe insert a spinning element
    axios.get(`/get_clubs_by_local_competition_code/${id}`, {
        headers: {'Content-Type': 'application/json'},
        method: 'get'
    })
        .then(data => {
            let dataResponse = Array(data.data)[0];
            let dataList = new Map();
            for(let i in dataResponse) {
                dataList.set(dataResponse[i].clubId, String(dataResponse[i].clubName));
            }
            // @todo - uses the list to generate the HTML elements via function call
            let unList = document.createElement('ul');
            unList.classList.add('nav', 'px-2', 'flex-column');
            let alternatorCounter = 0;
            dataList.forEach((value, key) => {
                let listItem = document.createElement('li');
                if(alternatorCounter) {
                    listItem.classList.add('bg-warning');
                }
                listItem.classList.add('nav-item', 'd-flex', 'align-items-center', 'py-2',
                    'border-black', 'border-1', 'border-bottom', 'border-opacity-25');
                listItem.id = String(key);
                let imgContainer = document.createElement('div')
                imgContainer.classList.add('rounded-3');
                imgContainer.style.width = '2.75rem';
                imgContainer.style.height = '2.75rem';
                imgContainer.style.backgroundColor = 'gray';
                imgContainer.style.backgroundImage = 'linear-gradient(45deg, gray 2%, lightgray 55%, white)';
                let clubLogoImg = document.createElement('img');
                imgContainer.appendChild(clubLogoImg);
                listItem.appendChild(imgContainer);
                let nameSpan = document.createElement('span');
                nameSpan.classList.add('ms-3');
                nameSpan.innerText = String(value);
                listItem.appendChild(nameSpan);
                listItem.addEventListener('click', (ev, id) => {
                    console.log('club called with id: ', id);
                })
                unList.appendChild(listItem);
            });
            console.log('body: ', document.getElementById(id).firstElementChild)
            document.getElementById(id).firstElementChild.appendChild(unList);
        })
        .catch(err => {
            console.log(err);
            throw new TypeError('Error occurred during \'clubs_by_local_competition_code\' GET');
        })
}
