
/** Called by the competitions.html page. */
function initCompetitions() {
    initChat()
    setButtonsListener()
    setCarouselPageHeight()
    startCompetitionClassesObserver()
}

/** Setting the listeners of the form buttons */
function setButtonsListener() {
    let clubsBtn = document.getElementById('selectionByClubsBtn')
    let dateBtn = document.getElementById('selectionByDateBtn')
    document.getElementById('searchGameBy').addEventListener('submit', (ev) => ev.preventDefault())
    document.getElementById('submitGameForm_Club').addEventListener('click', sendCompetitionQuery
        .bind(document.getElementById('submitGameForm_Club')))
    document.getElementById('submitGameForm_Date').addEventListener('click', sendCompetitionQuery
        .bind(document.getElementById('submitGameForm_Date')))
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
        for (let elem of document.getElementsByClassName('game-search-elements')) {
            if (elem.classList.contains('d-none'))
                elem.classList.remove('d-none')
            else
                elem.classList.add('d-none')
        }
    }
}

async function sendCompetitionQuery(ev) {
    let formData = extractFormData('searchGameBy', true)
    if (this.id === 'submitGameForm_Club') {
        if (formData.gameSearchClub1 || formData.gameSearchClub2) {
            let route = (formData.gameSearchClub1 !== '' && formData.gameSearchClub2 !== '') ?
                'competitions/query_games_by_double_name' : 'competitions/query_games_by_name'
            route += formData.gameSearchClub1 ? '/' + formData.gameSearchClub1 : ''
            route += formData.gameSearchClub2 ? '/' + formData.gameSearchClub2 : ''
            console.log(route)
            await makeAxiosGet(''+route)
                .then(data => {
                    if(!data.data) {
                        console.log(data)
                        throw Error("games not found")
                    }
                    let dataList = data.data;

                    // @todo: hide elements
                    document.getElementById('clubAccordion').classList.add('d-none');

                    // fill ul
                    let unList = document.getElementById('gamesResults');
                    unList.replaceChildren();
                    unList.classList.add('nav', 'px-2', 'flex-column');
                    unList.classList.remove('d-none');
                    let elementCounter = 0;
                    dataList.forEach(element => {
                        createDynamicListItem(window, 'game', dataList.size, unList, {
                                counter: elementCounter++, data: element
                            },
                            {type: 'game', id: element.gameId});
                    })
                    // Adding the 'load more...' element
                    if (dataList.size > 30)
                        createLoadMoreElement(unList, unList.id, showMore.bind(null, unList, 30));
                })
                .catch(err => {
                    console.log('axiousGet went wrong', err)
                    showModalMessage(true, 'game');
                })
        } else
            showModalMessage(false, 'game')
    } else {
        if (formData.gameSearchDate) {
            // @todo await makeAxiosGet()

        } else
            showModalMessage(false, 'game')
    }
    ev.preventDefault();
}

/** This method sets an observer to the button used to trigger the data of the national Section.
 *  When the button gets the 'send-get' class added to its classList,
 *  the observer checks whether to send or not the axios get. */
function startCompetitionClassesObserver() {
    let collapseBtn = document.getElementById('btn-collapser')
    // Create a new MutationObserver instance to see mutations
    const observer = new MutationObserver(async (mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.target.classList.contains('send-get')) {
                const domestic_league_code = document.getElementById('nationalSection').name
                await makeAxiosGet('/competitions/get_competitions/' + String(domestic_league_code))
                    .then(data => {
                        let competitionList = data.data
                        if(!competitionList || competitionList.length === 0)
                            console.error('Error! Invalid competitions list returned:', competitionList)
                        try {
                            competitionList.forEach(val => {
                                getLastSeasonYear(val.competition_id)
                                    .then(season => {
                                        createAccordion('competition_nation', 'gamesAccordion', {
                                            competition_id: val.competition_id,
                                            competition_name: retrieveCompetitionName(val.competition_name),
                                            competition_season: season.data})
                                    })
                                    .catch(err => {
                                        console.error('Error occurred retrieving last season of competition:', val.competition_id, '\n', err)
                                    })
                            })
                        } catch (err) {
                            console.error(err)
                        }
                    })
                    .catch(err => console.error('Error! \'/get_competition/:code\' went wrong:', err))
                showChargingSpinner(null, false)
                mutation.target.classList.remove('send-get')
            }
        }
    })
    observer.observe(collapseBtn, {attributeFilter: ['class']}) // Start observing the target element
}
