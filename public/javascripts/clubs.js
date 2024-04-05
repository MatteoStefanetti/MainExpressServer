let flags;




function createAccordion(fatherId, localCompetitionCode) {
    let wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('accordion-item rounded-1 mb-1');
    let header = document.createElement('h2');
    header.classList.add('accordion-header');
    wrapperDiv.appendChild(header);
    let accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion-button custom-accordion collapsed');
    accordionButton.type = "button";
    accordionButton.setAttribute('data-bs-toggle', 'collapse')
    accordionButton.setAttribute('aria-expanded', 'false');
    accordionButton.setAttribute('aria-controls', '#'+String(localCompetitionCode));
    accordionButton.setAttribute('data-bs-target', '#'+String(localCompetitionCode));
    header.appendChild(accordionButton);
    let flagImg = document.createElement('img');
    flagImg.classList.add('img');
    flagImg.src = getFlagOf(localCompetitionCode);
    accordionButton.appendChild(flagImg);
    let titleSpan = document.createElement('span');
    titleSpan.innerText = getNationNameOf(localCompetitionCode);
    accordionButton.appendChild(titleSpan);
    let collapseDiv = document.createElement('div');
    collapseDiv.classList.add('accordion-collapse collapse');
    collapseDiv.setAttribute('data-bs-parent', '#'+String(fatherId));
    collapseDiv.id = String(localCompetitionCode);
    wrapperDiv.appendChild(collapseDiv);
    let accBody = document.createElement('div');
    accBody.classList.add('accordion-body');
    collapseDiv.appendChild(accBody);
}

function getFlagOf(localCompetitionCode) {

}

function getNationNameOf(localCompetition) {
    return flags
}
