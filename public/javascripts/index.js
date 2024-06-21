/** Called by the index.html page. */
function initHome() {
    setCarouselPageHeight();
    initChat()
}

/** Function called by the `init()` of the **pages that are using the _iframe_ tags**.
 * This means that, for example, the initHome will call this function. */
function setCarouselPageHeight() {
    window.addEventListener('load', setIframesHeight.bind(null, true))
    window.addEventListener('resize', setIframesHeight.bind(null, true))
    for (let iframe of window.document.getElementsByTagName('iframe')) {
        iframe.addEventListener('load', setIframesHeight.bind(null, false))
        iframe.addEventListener('resize', setIframesHeight.bind(null, false))
    }
    setIframesHeight(true);
    // setting a timeout to give the time to load every image from the web:
    setTimeout(setIframesHeight.bind(null, true), 500);
}

/* -------- End of init()s -------- */

/** It returns a {@link Promise} to check with the `.then() / .catch()` block.
 * @param url {string} the url of the axios GET route. */
async function makeAxiosGet(url) {
    return axios.get(url, {headers: {'Content-Type': 'application/json'}, method: 'get'});
}

/** This is an EXPRESS GET function:
 * @returns {Promise} a promise from the Axios GET.
 * The promise will return a {@link Map} to take trace of flags and nations.
 * @throws Error if the Axios GET fails. */
async function getAllFlags() {
    return axios.get('/get_flags')
        .then(data => {
            const dataR = data.data;
            let flagList = new Map();
            for (let i in dataR) {
                flagList.set(dataR[i].domestic_league_code, {
                    'countryName': String(dataR[i].country_name),
                    'flagURL': String(dataR[i].flag_url)
                });
            }
            return flagList;
        })
        .catch(err => {
            console.error(err);
            throw new Error('Error occurred during \'flags\' GET');
        })
}

/* -------------- Accordion functions -------------- */

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
 *  - 'single_page/pl/player_valuations'
 *  - 'single_page/pl/last_appearances'
 *  - 'single_page/cl/players'
 *  - 'single_page/cl/past_players'
 *  - 'single_page/cl/last_games'
 * @param fatherId {string} is the accordion *id* to which bind the accordion-item to
 * @param params {object} is the structure containing the values to use in the accordion.
 * All the parameters passed as argument shall use the **snake_case** to define the names of the variables
 * *(e.g. `{parameter_1: 'par1'}` to be referred to as params.parameter_1)* */
async function createAccordion(visualize, fatherId, params) {
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

    const accordionElement = document.getElementById(fatherId)
    accordionElement.appendChild(wrapperDiv);

    let flagImg = document.createElement('img');
    flagImg.classList.add('img', 'me-2', 'custom-rounded-0_5');
    flagImg.style.height = '1.2rem';

    let strIdValue = '';

    switch (visualize) {
        case 'competition_nation':
            strIdValue = String(params.competition_id)
            spanTitle.innerText = params.competition_name;
            spanTitle.classList.add('flex-grow-1')
            accordionButton.classList.add('d-md-flex', 'p-md-1', 'px-md-3')
            const urlParams = {type: 'competition', id: params.competition_id, season: params.competition_season};
            // Adding the button to see the competition, shown only on "medium+" screens
            let goCompetitionBtn = document.createElement('button')
            goCompetitionBtn.classList.add('btn', 'btn-lightgreen', 'p-0', 'me-2', 'd-none', 'd-md-flex', 'align-items-center')
            goCompetitionBtn.type = 'button'
            goCompetitionBtn.tabIndex = 1
            goCompetitionBtn.innerHTML = '<img src="../images/stats_btn_img.svg" class="img p-1 mx-auto" alt=">">'
            goCompetitionBtn.firstElementChild.style.width = '2.2rem';
            // Setting the Event-Listener functions
            goCompetitionBtn.addEventListener('click', () => {
                window.location.href = getUrlForSinglePage(urlParams)})
            accordionButton.addEventListener('click', actionWrapper.bind(accordionButton, urlParams));
            accordionButton.appendChild(spanTitle);
            accordionButton.appendChild(goCompetitionBtn);
            break;
        case 'club_nation':
            strIdValue = String(params.local_competition_code)
            flagImg.src = getFlagOf(params.local_competition_code);
            spanTitle.innerText = getNationNameOf(params.local_competition_code);
            accordionButton.appendChild(flagImg);
            accordionButton.appendChild(spanTitle);
            accordionButton.addEventListener('click', openAccordionClubs.bind(accordionButton, params.local_competition_code));
            break;
        case 'single_page/ga/events':
            strIdValue = params.id
            spanTitle.innerText = 'Events Timeline';
            spanTitle.classList.add('h5');
            accordionButton.appendChild(spanTitle);
            accBody.classList.add('px-1', 'px-sm-2', 'px-md-4')
            accordionButton.addEventListener('click', openAccordionEvents.bind(accordionButton, params));
            break;
        case 'single_page/pl/player_valuations':
            strIdValue = params.id;
            spanTitle.innerText = 'Player valuations';
            accordionButton.appendChild(spanTitle);
            accordionButton.addEventListener('click', openAccordionPlayerValuation.bind(accordionButton, strIdValue));
            break;
        case 'single_page/pl/last_appearances':
            strIdValue = params.id;
            spanTitle.innerText = 'Last Appearances';
            accordionButton.appendChild(spanTitle);
            accordionButton.addEventListener('click', openAccordionPlayerAppearances.bind(accordionButton, strIdValue));
            break;
        case 'single_page/cl/last_games':
            strIdValue = params.id;
            spanTitle.innerText = 'Last Season Games';
            accordionButton.appendChild(spanTitle);
            accordionButton.addEventListener('click', openAccordionClubLastGames.bind(accordionButton, strIdValue));
            break;
        case 'single_page/cl/players':
            strIdValue = params.id;
            spanTitle.innerText = 'Active Squad';
            accordionButton.appendChild(spanTitle);
            accordionButton.addEventListener('click', openAccordionClubMember.bind(accordionButton, strIdValue));
            break;
        case 'single_page/cl/past_players':
            strIdValue = params.id;
            spanTitle.innerText = 'Past Players';
            accordionButton.appendChild(spanTitle);
            accordionButton.addEventListener('click', openAccordionPastMember.bind(accordionButton, strIdValue));
            break;
        case 'single_page/co/last_season_games':
            strIdValue = params.id;
            spanTitle.innerText = String(params.season) + ' Games';
            accordionButton.appendChild(spanTitle);
            accordionButton.addEventListener('click', openAccordionCompetitionLastGames.bind(null, strIdValue, params.season));
            break;
        default:
            console.error('Warning! index.js:createAccordion() called with invalid field \'visualize\':', visualize)
            break;
    }

    accordionButton.setAttribute('aria-controls', strIdValue);
    accordionButton.setAttribute('data-bs-target', '#' + strIdValue);
    collapseDiv.id = strIdValue;
}

/** Wrapper function called by the games/competition accordion that triggers the games or the competition page
 * @param params {object} the object with the params whether to call the `single_page` or to open the `games` */
function actionWrapper(params) {
    if (window.innerWidth < 768)
        window.location.href = getUrlForSinglePage(params);
    else
        openAccordionGames(window, params.id);
}

/**
 * Triggered when an accordion button is clicked.
 *
 * @param window {Window} the window into which create the elements
 * @param id {string} the id of a useless
 * @throws Error if the GET route fails. */
async function openAccordionGames(window, id) {
    if (window.document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(window, true)
        let currentSeason;
        await getLastSeasonYear(id)
            .then(data => {
                if (!data.data)
                    console.error('Error in \'getLastSeasonYear()\': data.data is empty!')
                currentSeason = Number(data.data)
            })
            .catch(err => {
                console.error('Error in \'getLastSeasonYear()\':', err)
                currentSeason = null;
            })
        await makeAxiosGet(`/competitions/get_games_by_league/${id}/` + currentSeason)
            .then(data => {
                let dataResponse = data.data;
                let unList = window.document.createElement('ul');
                unList.classList.add('nav', 'flex-column');
                window.document.getElementById('gamesAccordion').appendChild(unList)
                let alternatorCounter = 0;
                dataResponse.forEach(el => {
                    createDynamicListItem(window, 'game', dataResponse.length, unList,
                        {counter: alternatorCounter++, data: el},
                        {type: 'game', id: String(el.gameId)});
                });
                window.document.getElementById(id).firstElementChild.appendChild(unList);
                if (dataResponse.length > 20) {
                    createLoadMoreElement(unList, 'gamesId', showMore.bind(null, unList, 20))
                }
            })
            .catch(err => {
                if (err.response.status === 404)
                    window.document.getElementById(id).firstElementChild.innerHTML = '<span class="d-block text-center mx-auto p-1">No Games found.</span>'
                else {
                    console.error(err);
                    throw new Error('Error occurred during \'/get_games_by_league\' GET');
                }
            })
        showChargingSpinner(window, false)
    }
}

/** This function creates HTML elements to display the game_events data passed in `params`.
 * @param params {object} The list of game_Events, **already retrieved by the single_page** to show some data.
 * The params passed has 2 fields:
 *      - `id` - a {@link string} representing the id of the accordion body in which the events are contained
 *      - `events` - an {@link array} of events.
 * @throws TypeError when the argument is null or undefined*/
function openAccordionEvents (params) {
    if (!params || !params.id)
        throw new TypeError('"null" or "undefined" parameter passed to \'openAccordionEvents\' function!')
    if (document.getElementById(params.id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true)
        console.log(params.events)
        if (params.events && Array.isArray(params.events) && params.events.length) {
            let unList = document.createElement('ul');
            unList.classList.add('nav', 'flex-column');
            document.getElementById(params.id).appendChild(unList)

            const size = new Set(params.events.map(el => el.minute)).size
            let alternatorCounter = 0;
            params.events.forEach(el => {
                createDynamicListItem(window, 'event', size, unList,
                    {counter: alternatorCounter++, data: el},
                    {type: 'player', id: String(el.player_id)});
            });
            document.getElementById(params.id).firstElementChild.appendChild(unList);
            if (size > 15)
                createLoadMoreElement(unList, params.id, showMore.bind(null, unList, 15))
        } else
            document.getElementById(params.id).firstElementChild.innerHTML = '<span class="d-block text-center mx-auto h6 p-1">No events found.</span>'
        showChargingSpinner(null, false)
    }
}

/** This function creates a listItem, filling it with dataList  to bind to {@link unorderedList}
 * @param window {Window} it is the window parameter to avoid iframes problem.
 * @param type {string} a string representing the type of the listItem:
 * - *`'game'`* - for games
 * - *`'club'`* - for clubs
 * @param size {number} The **size** of the set to show.
 *  This attribute is required to initially show only a part of the list.
 * @param unorderedList {HTMLElement} The {@link HTMLElement}, _usually an `<ul>` or `<ol>` type_,
 *  to which add item created.
 * @param item {object} The object filled with 3 fields:
 * - `counter`: the element-counter that provides features like the alternated color of the list items (must be >= 0)
 * - `data`: The data to show. It is another object which requires an internal *id* field.
 * @param params {object} the params for the single_page.html to link up to the listItem.
 * @example item = {counter: <number>, data: {id: <string>, text: <string>}}
 * @throws TypeError - When one or more arguments are _undefined_ or _null_. */
function createDynamicListItem(window, type, size, unorderedList, item, params) {
    if (!window || !type || !size || !unorderedList || !item || item.counter < 0 || !item.data) {
        console.error(type, '\n', size, '\n', unorderedList, '\n', item.counter, '\n', item.data);
        throw new TypeError('Invalid argument(s) passed to \'createDynamicListItem\'!');
    }
    let error = false;
    let listItem = window.document.createElement('li');
    let listItemLink = window.document.createElement('a');

    listItemLink.href = getUrlForSinglePage(params)
    listItem.appendChild(listItemLink);
    if (size === 1 || item.counter % 2 !== 0) {
        listItem.classList.add('bg-light'); /* for browsers that don't support gradients */
        listItem.style.backgroundImage =
            'linear-gradient(90deg, white, rgba(var(--custom-accordion-lightgrey-rgb), 0.5)' +
            ', rgba(var(--custom-accordion-lightgrey-rgb), 0.6), ' +
            'rgba(var(--custom-accordion-lightgrey-rgb), 0.5), white)';
    }
    listItem.classList.add('nav-item');
    if (item.counter !== (size - 1) && type !== 'event')
        listItem.classList.add('border-black', 'border-1', 'border-bottom', 'border-opacity-25');
    let desktopBtn = document.createElement('div');
    let rightDiv = window.document.createElement('div')
    rightDiv.classList.add('d-flex', 'align-items-center')
    let dateDiv = window.document.createElement('div')
    dateDiv.classList.add('mx-3', 'd-flex', 'justify-content-center')
    switch (type) {
        case 'event':
            // club ids are consistent with the clubs in the dataset!
            listItem.removeChild(listItemLink)
            // finding first club id
            const elementHREF = document.getElementById('info1').firstElementChild.href
            const club_id1 = Number(elementHREF.slice(elementHREF.indexOf('&id=') + 4))
            let squad1Div, squad2Div;
            // Create or attach to the listItem with id == item.data.minute
            if (!document.getElementById(item.data.minute)) {
                listItem.id = item.data.minute
                listItem.classList.add('d-flex', 'align-items-center', 'game-event-li');
                const containerDivElem = document.createElement('div');
                containerDivElem.classList.add('row', 'w-100', 'justify-content-between', 'align-items-stretch');

                // creating the central element (minute displayer)
                const minuteDiv = document.createElement('div');
                minuteDiv.classList.add('d-flex', 'col-1', 'justify-content-center', 'align-self-center', 'h5', 'my-1', 'p-1', 'px-sm-0', 'rounded-3', 'bg-secondary', 'bg-opacity-50');
                const minute =  item.data.minute > 90 ? '90+' + (item.data.minute-90) : item.data.minute;
                minuteDiv.innerHTML = '<span class="h5 fw-bold text-center">' + minute + '\'</span>'
                minuteDiv.style.boxSizing = 'border-box';

                // Creating the squad divs
                squad1Div = document.createElement('div');
                squad1Div.classList.add('d-flex', 'flex-wrap', 'col-5', 'p-0', 'flex-column');
                squad1Div.style.boxSizing = 'border-box';
                squad2Div = squad1Div.cloneNode(false);
                squad1Div.classList.add('align-items-end')
                squad2Div.classList.add('align-items-start')

                // Appending the new item
                containerDivElem.append(squad1Div, minuteDiv, squad2Div)
                listItem.appendChild(containerDivElem)
                unorderedList.appendChild(listItem)
                if (size !== unorderedList.children.length)
                    listItem.classList.add('border-black', 'border-1', 'border-bottom', 'border-opacity-25');
            } else {
                // the minute element has already been created.
                listItem = document.getElementById(item.data.minute)
                squad1Div = listItem.firstElementChild.firstElementChild
                squad2Div = listItem.firstElementChild.lastElementChild
            }
            const fatherDiv = (Number(item.data.club_id) === club_id1) ? squad1Div : squad2Div;
            retrievePlayerName(item.data.player_id)
                .then(player => {
                    if (player.data.last_name) {
                        item.data.player_name = setReducedName(player.data.last_name, player.data.player_name)
                        const firstSquad = fatherDiv === squad1Div;
                        switch (String(item.data.event_type)) {
                            case 'Cards':
                                fatherDiv.appendChild(createCardEvent(item.data, firstSquad))
                                break;
                            case 'Goals':
                                fatherDiv.appendChild(createGoalEvent(item.data, firstSquad))
                                break;
                            case 'Substitutions':
                                fatherDiv.appendChild(createSubstitutionEvent(item.data, firstSquad))
                                break;
                            default:
                                console.error('Found invalid event_type:', item.data.event_type)
                        }
                        if (unorderedList.children.length > 15)
                            listItem.classList.add('d-none')
                    } else {
                        console.log('Cannot retrieve data for an event.') // SIGNALING
                    }
                })
                .catch(err => {
                    if (err.response && err.response.status === 404)
                        console.log('Error occurred in retrieval of a player name.')
                    else console.error(err)
                })
            break;
        case 'game':
            listItem.id = item.data.gameId;
            listItem.classList.add('d-flex', 'align-items-center');
            listItemLink.classList.add('flex-grow-1');

            let containerDiv = document.createElement('div');
            containerDiv.classList.add('d-flex', 'flex-column', 'flex-sm-row', 'justify-content-between');

            let leftDiv = document.createElement('div');
            leftDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'w-100', 'p-2', 'flex-column', 'h5', 'text-center');
            let centerDiv = document.createElement('div');
            centerDiv.classList.add('d-flex', 'align-self-center', 'flex-column', 'p-1');
            let rightDiv = leftDiv.cloneNode(true);

            let dateSmDiv = document.createElement('div');
            dateSmDiv.classList.add('d-flex', 'flex-column', 'd-sm-none', 'justify-content-center', 'align-items-center', 'w-100', 'pt-2');

            containerDiv.appendChild(dateSmDiv);
            containerDiv.appendChild(leftDiv);
            containerDiv.appendChild(centerDiv);
            containerDiv.appendChild(rightDiv);

            let goal1Span = document.createElement('span');
            goal1Span.classList.add('d-none', 'd-sm-block', 'bg-secondary', 'bg-opacity-25', 'p-1', 'mb-1', 'rounded-2')
            goal1Span.innerText = item.data.goal1;
            leftDiv.appendChild(goal1Span);

            let clubSpanContainer1 = document.createElement('div');
            clubSpanContainer1.classList.add('flex-grow-1', 'd-flex', 'align-items-center');
            leftDiv.appendChild(clubSpanContainer1);

            let club1Span = document.createElement('span');
            club1Span.classList.add('fw-bold');
            club1Span.style.textWrap = 'balance';
            club1Span.innerText = item.data.clubName1;
            clubSpanContainer1.appendChild(club1Span);

            let dateSpan = document.createElement('span');
            dateSpan.innerText = new Date(item.data.gameDate).toLocaleDateString();

            let vsSpan = document.createElement('span');
            vsSpan.classList.add('d-flex', 'justify-content-center', 'text-darkgreen', 'h4', 'fw-bold');
            vsSpan.innerText = 'vs';

            let competitionSpan = document.createElement('span');
            competitionSpan.classList.add('text-uppercase', 'fs-7', 'text-center');
            competitionSpan.innerText = item.data.competitionId;

            let competitionSpan2 = competitionSpan.cloneNode(true);
            competitionSpan.classList.add('d-none', 'd-sm-block');
            competitionSpan2.classList.add('d-block', 'd-sm-none');

            centerDiv.appendChild(dateSpan);
            centerDiv.appendChild(vsSpan);
            centerDiv.appendChild(competitionSpan);

            dateSmDiv.appendChild(competitionSpan2);

            let dateSpan2 = dateSpan.cloneNode(true);
            dateSpan.classList.add('d-none', 'd-sm-block');
            dateSmDiv.appendChild(dateSpan2);

            let goal2Span = goal1Span.cloneNode(true);
            goal2Span.innerText = item.data.goal2;
            rightDiv.appendChild(goal2Span);

            let clubSpanContainer2 = document.createElement('div');
            clubSpanContainer2.classList.add('flex-grow-1', 'd-flex', 'align-items-center');
            rightDiv.appendChild(clubSpanContainer2);

            let club2Span = club1Span.cloneNode(true);
            club2Span.innerText = item.data.clubName2;
            clubSpanContainer2.appendChild(club2Span);

            listItemLink.appendChild(containerDiv);

            if (size > 20 && item.counter > 20)
                listItem.classList.add('d-none')
            if (!error)
                unorderedList.appendChild(listItem)
            break;
        case 'club':
            listItem.id = item.data.id
            listItemLink.classList.add('d-flex', 'align-items-center', 'py-2', 'mx-2');
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
            clubLogoImg.src = "https://tmssl.akamaized.net/images/wappen/head/" + String(item.data.id) + ".png";
            clubLogoImg.style.maxWidth = '2.75rem';
            clubLogoImg.style.maxHeight = '2.75rem';
            clubLogoImg.alt = " ";
            imgContainer.appendChild(clubLogoImg);
            listItemLink.appendChild(imgContainer);
            let nameSpan = document.createElement('span');
            nameSpan.classList.add('ms-3', 'flex-grow-1');
            nameSpan.innerText = item.data.text;
            listItemLink.appendChild(nameSpan);
            createStatsBtn(window, desktopBtn, listItemLink)
            if (size > 30 && item.counter > 30)
                listItem.classList.add('d-none')
            if (!error)
                unorderedList.appendChild(listItem)
            break;
        case 'appearance':
            listItem.id = item.data.game_id;
            listItem.classList.add('d-flex', 'py-2', 'mx-2', 'align-items-stretch', 'align-items-md-center')
            listItemLink.classList.add('d-none', 'd-md-flex', 'align-items-center', 'flex-grow-1', 'py-2', 'mx-2');
            let gameDiv = window.document.createElement('div');
            let lilGameDiv1 = window.document.createElement('div');
            let lilGameDiv2 = window.document.createElement('div');
            gameDiv.classList.add('row', 'align-content-between', 'd-none', 'd-md-block');
            lilGameDiv1.classList.add('w-100', 'd-md-none', 'my-2', 'not-hoverable', 'd-flex', 'flex-column', 'mb-3');
            lilGameDiv2.classList.add('w-100', 'd-md-none', 'my-2', 'not-hoverable', 'd-flex', 'flex-column', 'mb-3');
            let desktopAnchor = document.createElement('a');
            desktopAnchor.classList.add('m-0', 'p-0', 'd-flex', 'justify-content-center');
            desktopAnchor.setAttribute('role', 'button')
            desktopAnchor.setAttribute('data-bs-trigger', 'focus')
            desktopAnchor.setAttribute('data-bs-toggle', 'popover')
            desktopAnchor.setAttribute('container', 'body')
            desktopAnchor.setAttribute('data-bs-html', 'true')
            desktopAnchor.tabIndex = 1;

            if (item.data.player_club_id === item.data.clubId1)
                desktopAnchor.setAttribute('data-bs-title',
                    '<span class="bi bi-person-fill"></span> <b><a href="' + getUrlForSinglePage({
                        type: 'club',
                        id: item.data.clubId1
                    }) + '">' + item.data.clubName1 + '</b> vs <b><a href="' + getUrlForSinglePage({
                        type: 'club',
                        id: item.data.clubId2
                    }) + '">' + item.data.clubName2 + '</a></b>');
            else
                desktopAnchor.setAttribute('data-bs-title',
                    '<b><a href="' + getUrlForSinglePage({
                        type: 'club',
                        id: item.data.clubId1
                    }) + '">' + item.data.clubName1 + '</a></b> vs <b><a href="' + getUrlForSinglePage({
                        type: 'club',
                        id: item.data.clubId2
                    }) + '">' + item.data.clubName2 + '</a></b> <span class="bi bi-person-fill"></span>');

            let popOverContent = document.createElement('div')
            popOverContent.classList.add('d-flex', 'justify-content-around', 'position-relative')
            popOverContent.innerHTML =
                '<div>' +
                '<b>competition: </b><a href="' + getUrlForSinglePage({
                    type: 'competition',
                    id: item.data.competition_id,
                    season: item.data.season
                }) + '">' + item.data.competition_id + '</a>' +
                '<br><b>goals:</b> ' + item.data.goals +
                '<br><b>assists: </b>' + item.data.assists +
                '<br><b>minutes played:</b> ' + item.data.minutes_played +
                '<br><span class="bi bi-square-fill text-warning fs-7"></span>: ' + item.data.yellow_cards +
                '<br><span class="bi bi-square-fill text-danger fs-7"></span>: ' + ((item.data.red_cards) ? 1 : 0) +
                '</div>'

            desktopAnchor.setAttribute('data-bs-content', popOverContent.innerHTML);
            let containerOfDateAndButton = document.createElement('div');
            containerOfDateAndButton.classList.add('m-0', 'p-0', 'd-flex', 'flex-column', 'justify-content-evenly', 'justify-content-md-between', 'align-items-center', 'w-100', 'flex-grow-1', 'position-relative', 'responsive-flex-row');
            dateDiv.innerText = new Date(item.data.game_date).toLocaleDateString();
            createStatsBtn(window, desktopAnchor, containerOfDateAndButton);
            containerOfDateAndButton.appendChild(dateDiv);
            listItem.appendChild(lilGameDiv1);
            listItem.appendChild(containerOfDateAndButton);
            listItem.appendChild(lilGameDiv2);

            new bootstrap.Popover(desktopAnchor);
            gameDiv.innerHTML = '<div class="col-12 my-1 py-1">' +
                '<span class="bg-secondary bg-opacity-25 p-2 rounded-2 not-hoverable">' + item.data.goal1 +
                '</span><span class="ms-2 fs-6 p-1">' + item.data.clubName1 +
                '</span></div><div class="col-12 my-1 py-1">' +
                '<span class="bg-secondary bg-opacity-25 p-2 rounded-2 not-hoverable">' + item.data.goal2 +
                '</span><span class="ms-2 fs-6 p-1">' + item.data.clubName2 + '</span></div>';

            lilGameDiv1.innerHTML = '<a href="' + getUrlForSinglePage(params) + '"><div class="d-flex justify-content-center my-2"><img src="https://tmssl.akamaized.net/images/wappen/head/' + String(item.data.clubId1) + '.png" ' +
                'class="img" style="max-width: 3.5rem; max-height: 3.5rem" alt="' + String(item.data.clubName1) + ' logo"></div>' +
                '<div class="d-flex justify-content-center my-2"><span class="bg-secondary bg-opacity-25 p-2 rounded-2 not-hoverable fs-7">' + item.data.goal1 + '</span></div></a>';

            lilGameDiv2.innerHTML = '<a href="' + getUrlForSinglePage(params) + '"><div class="d-flex justify-content-center my-2"><img src="https://tmssl.akamaized.net/images/wappen/head/' + String(item.data.clubId2) + '.png" ' +
                'class="img" style="max-width: 3.5rem; max-height: 3.5rem" alt="' + String(item.data.clubName2) + ' logo"></div>' +
                '<div class="d-flex justify-content-center my-2"><span class="bg-secondary bg-opacity-25 p-2 rounded-2 not-hoverable fs-7">' + item.data.goal2 + '</span></div></a>';
            listItemLink.appendChild(gameDiv);

            if (size > 20 && item.counter > 20)
                listItem.classList.add('d-none')
            if (!error)
                unorderedList.appendChild(listItem)
            break;
        default:
            error = true
            throw new TypeError('Invalid argument(s) passed to \'createDynamicListItem\' type argument!')
    }
}

/**
 *  Function to define the url {@link string} of the single_page.
 * @param params {object} It is a `{type: <string>, key: <value>, ...}` object element,
 * that defines how the *single_page.html* page shall load.
 * - **type**: can be one of the following: *'club'*, *'competition'*, *'game'*, *'player'*.
 * - **id**: the id of the entity to retrieve
 * - **season**: if `type` is 'competition', you must select a valid season.
 * @throws TypeError if the argument `params` is not defined. */
function getUrlForSinglePage(params) {
    if (!params)
        throw new TypeError('\'single_page.html\' badly called.')
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    return (!queryString) ? null :
        'single_page.html?' + queryString;
}

/** It will set the "stats Button" style to display a useless button.
 * @param window {Window} the window of the document in which create the elements.
 * @param statsBtn {HTMLElement} the `div` element that will be transformed in the statsBtn.
 * @param fatherElement the {@link HTMLElement} to which append the statsBtn as a child.
 * @throws TypeError when one or more arguments are invalid. */
function createStatsBtn(window, statsBtn, fatherElement) {
    if (!window || !statsBtn || !fatherElement)
        throw new TypeError('Invalid argument(s) passed to \'createStatsBtn()\' function.')
    statsBtn.classList.add('d-flex', 'justify-content-center', 'align-items-center',
        'bg-lightgreen', 'rounded-3', 'me-1', 'p-1', 'tuple-btn')
    statsBtn.style.width = '2.5rem'
    statsBtn.style.minWidth = '2.5rem'
    statsBtn.style.height = '2.5rem'
    statsBtn.style.minHeight = '2.5rem'
    let statsImg = window.document.createElement('img')
    statsImg.classList.add('img-fluid')
    statsImg.src = '../images/stats_btn_img.svg'
    statsBtn.appendChild(statsImg)
    fatherElement.appendChild(statsBtn)
}

/** This function creates a HTMLElement to moderate the result deployment.
 * @param parentList {HTMLElement} The {@link HTMLElement} to which add the item created.
 * @param partialId {string} The **PARTIAL** id of the element container,
 * useful to retrieve the element and remove it if necessary.
 * @param loadMoreFunction {() => any} A function *pointer* to set the listener of the _"load more"_.
 * @throws Typeerror if one or more arguments are _null_ or _undefined_. */
function createLoadMoreElement(parentList, partialId, loadMoreFunction) {
    if (!parentList || !partialId || !loadMoreFunction) {
        console.error('Arguments:', parentList, '\n', partialId, '\n', loadMoreFunction);
        throw new TypeError('Invalid argument(s) passed to \'createLoadMoreElement()\'!');
    }
    let loadMoreContainer, innerLoadMore;
    if (parentList.tagName !== 'DIV') {
        loadMoreContainer = document.createElement('li');
        loadMoreContainer.classList.add('nav-item', 'mx-auto', 'py-2', 'load-more-element');
        innerLoadMore = document.createElement('span');
        innerLoadMore.classList.add('text-center', 'px-5');
    } else {
        /* Assertion: inside these brackets, the parentList is a <div> having the 'row' class. */
        loadMoreContainer = document.createElement('div');
        loadMoreContainer.classList.add('col-12', 'd-flex', 'justify-content-center', 'mb-4', 'load-more-element');
        innerLoadMore = document.createElement('a');
        innerLoadMore.classList.add('py-1', 'px-5');
    }
    loadMoreContainer.id = String(partialId) + 'Loader';
    innerLoadMore.innerText = 'Load more...';
    innerLoadMore.style.textDecoration = 'underline';
    innerLoadMore.addEventListener('click', loadMoreFunction);
    loadMoreContainer.appendChild(innerLoadMore);
    parentList.appendChild(loadMoreContainer);
}

/** It removes the `d-none` from a maximum of MAX_ELEMENTS_DISPLAYABLE elements, every time it is called.
 * @param listContainer {HTMLElement} The container in which the list-items are.
 * @param MAX_ELEMENTS_DISPLAYABLE {number} The interval number of elements to display. */
function showMore(listContainer, MAX_ELEMENTS_DISPLAYABLE) {
    let index = 0, i = MAX_ELEMENTS_DISPLAYABLE;
    let children = listContainer.children;
    while (index < MAX_ELEMENTS_DISPLAYABLE && i < children.length) {
        if (children[i].classList.contains('d-none'))
            index++;
        children[i++].classList.remove('d-none');
    }
    if (i >= children.length - 1)
        listContainer.lastChild.remove();
}

/* --------------------- Support Functions --------------------- */

/** It returns an {@link object} with many fields as *`{name: value}`* as much are the valid `<input>`s in the form.
 * @param formId {string} The id of the form to check.
 * @param deep {boolean} If `true`, the form will be mapped in children and in its nephews (just 1 level below).
 * In this way, a `<div>` with an input inside is scanned. */
function extractFormData(formId, deep) {
    let formElements = document.getElementById(formId).children;
    let formData = {};
    for (let ix = 0; ix < formElements.length; ix++) {
        if (formElements[ix].name) {
            formData[formElements[ix].name] = formElements[ix].type === 'checkbox' ? formElements[ix].checked : formElements[ix].value;
        } else if (deep) {
            for (let nephew of formElements[ix].children)
                if (nephew.name)
                    formData[nephew.name] = nephew.value;
        }
    }
    return formData;
}

/** Function used to trigger the spinner while loading / fetching the page content.
 * @param window {Window | null} The window reference in which the spinner is contained.
 * @param toDisplay {boolean} If _true_, it shows the spinner. Otherwise, it will hide its content. */
function showChargingSpinner(window, toDisplay) {
    const elem = (!window) ? document.getElementById('spinner').classList :
        window.document.getElementById('spinner').classList;
    if (toDisplay)
        elem.remove('d-none')
    else
        elem.add('d-none')
}

/** This function displays a **modal** to give a feedback of an unsuccessful search.
 * @param unfounded {boolean} If set to `true`, this method will return a message of _**unfounded content**_,
 * @param type {String} Type of data searched,
 * otherwise it will display a message of _**too few letters**_ in the input string. */
function showModalMessage(unfounded, type) {
    if (unfounded) {
        const name = type[0].toUpperCase() + type.slice(1)
        document.getElementById('unfoundedModalLabel').innerText = 'No ' + name + ' Found';
        document.getElementById('modal-body').innerHTML =
            'The search has found <b>0 ' + type + 's</b>. Please, check the syntax and retry.';
    } else {
        document.getElementById('unfoundedModalLabel').innerText = 'Invalid Input';
        document.getElementById('modal-body').innerHTML = type !== 'game' ?
            'At least <b>3 letters</b> are required for a search.' : '<b>Empty</b> input cannot be used for a search.'
    }
    document.getElementById('unfoundedModalTrigger').click();
}

/** Returns the _fullName_, but if it is too long (more than 15 characters) it will **shorten** all the first names.
 * @param lastName {string} The string to try to maintain at the end.
 * @param fullName {string} The full name that will be truncated if necessary. */
function setReducedName(lastName, fullName) {
    if (!fullName || fullName.length === lastName.length)
        return lastName;
    if (fullName.length < 14)
        return fullName;
    let fullNArray = fullName.trim().split(' ')
    const lastNStart = lastName.trim().split(' ')[0]
    for (let i = 0; i < fullNArray.length; i++) {
        if (fullNArray[i] !== lastNStart)
            fullNArray[i] = String(fullNArray[i].trim().charAt(0) + '.')
        else
            i = fullNArray.length;
    }
    return fullNArray.join(' ');
}

/** Function made to transform names like _"premier-league"_ into _"Premier League"_
 * @param name {string} the string to transform. */
function retrieveCompetitionName(name) {
    let nameArr = name.split('-');
    for (let i = 0; i < nameArr.length; i++)
        if (nameArr[i].length <= 3 && nameArr[i] !== 'cup')
            nameArr[i] = nameArr[i].toUpperCase()
        else
            nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1)
    return nameArr.join(' ')
}

/** The following code returns the **current season year** for the competition given as argument.
 * @param competitionId {string} the competition id string of which to retrieve. */
async function getLastSeasonYear(competitionId) {
    return await makeAxiosGet('/retrieve_last_season/' + competitionId)
}
