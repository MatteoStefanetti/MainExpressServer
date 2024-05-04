
/** Called by the competitions.html page. */
function initCompetitions() {
    setButtonsListener();
    setCarouselPageHeight();
}

/* Adding the listener to the form buttons */
function setButtonsListener() {
    let clubsBtn = document.getElementById('SelectionByClubsBtn')
    let dateBtn = document.getElementById('SelectionByDateBtn')
    document.getElementById('searchGames').addEventListener('submit', sendCompetitionQuery.bind(this))
    clubsBtn.addEventListener('click', changeBtnColors.bind(clubsBtn, dateBtn))
    dateBtn.addEventListener('click', changeBtnColors.bind(dateBtn, clubsBtn))
}

/** If `this` is the green button, then nothing happens. Otherwise,
 * it will change the color of the buttons and the form inputs.
 * @param otherBtn {HTMLElement}  the other button of the group (will be modified). */
function changeBtnColors(otherBtn) {
    if(!this.classList.contains('btn-darkgreen')) {
        this.classList.replace('btn-light', 'btn-darkgreen')
        otherBtn.classList.replace('btn-darkgreen', 'btn-light')
        for (let child of document.getElementById('searchGames').children)
            if (child.tagName === 'INPUT' || (child.getAttribute('for') === 'club2SearchBar')) {
                if(child.classList.contains('d-none'))
                    child.classList.remove('d-none')
                else
                    child.classList.add('d-none')
            }
    }
}

async function sendCompetitionQuery(ev) {
    let formData = extractFormData('searchGames')
    const dateSearchBar = document.getElementById('dateSearchBar')
    if(formData.dateSearch && !dateSearchBar.classList.contains('d-none')) {
        // @todo await makeAxiosGet()
        ev.preventDefault();
    } else if ((formData.club1Search || formData.club2Search) && dateSearchBar.classList.contains('d-none')) {
        // @todo await makeAxiosGet()
        ev.preventDefault();
    } else {
        // Reload the page
    }
}

