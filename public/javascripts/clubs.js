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
    accBody.innerText = 'try #1';   // @todo insert the inner part of the accordion
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
    console.log('entered')
    // @todo maybe insert a spinning element
    axios.get(`/get_clubs_by_local_competition_code/${id}`, {
        headers: {'Content-Type': 'application/json'},
        method: 'get'
    })
        .then(data => {
            console.log('then(data)')
            let dataResponse = Array(data.data)[0];
            let dataList = new Map();
            for(let i in dataResponse){
                dataList.set(dataResponse[i].clubId, String(dataResponse[i].clubName));
            }
            console.log('dataRes: ', dataResponse, 'dataList: ', dataList); // DEBUG PRINT
            // @todo - uses the list to generate the HTML elements via function call

        })
        .catch(err => {
            console.log(err);
            throw new TypeError('Error occurred during \'clubs_by_local_competition_code\' GET');
        })
    console.log('exited')
}
