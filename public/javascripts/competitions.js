
/** Called by the competitions.html page. */
function initCompetitions() {
    setButtonsListener()
    setCarouselPageHeight()
}

/** Setting the listeners of the form buttons */
function setButtonsListener() {
    let clubsBtn = document.getElementById('selectionByClubsBtn')
    let dateBtn = document.getElementById('selectionByDateBtn')
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
        const formElem = document.getElementById('searchGames')
        if (this.id === 'selectionByClubsBtn') {
            formElem.classList.remove('col-sm-6', 'justify-content-sm-end')
            formElem.classList.add('px-1', 'px-md-3')
        } else {
            formElem.classList.add('col-sm-6', 'justify-content-sm-end')
            formElem.classList.remove('px-1', 'px-md-3')
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

