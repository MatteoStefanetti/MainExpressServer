const urlParams = new URLSearchParams(window.location.search);
const typeParams = urlParams.get('type');
const idParams = urlParams.get('id');

async function initSinglePage() {
    let infoTitle = document.getElementById('infoTitle');
    let info1 = document.getElementById('info1');
    let imgContainer = document.createElement('div');
    let singlePageImg = document.createElement('img');
    let titleDiv = document.createElement('div');
    let singlePageTitle = document.createElement('p');

    singlePageTitle.classList.add('h1');


    singlePageImg.classList.add('img-fluid', 'd-block', 'border', 'border-5', 'border-darkgreen', 'rounded-4', 'player-img-size');
    singlePageImg.alt = 'image not found';
    titleDiv.classList.add('align-self-center');
    infoTitle.appendChild(imgContainer);
    imgContainer.appendChild(singlePageImg);
    imgContainer.classList.add('m-2', 'mx-md-5')
    infoTitle.appendChild(titleDiv);
    titleDiv.appendChild(singlePageTitle);
    showChargingSpinner(null, true);
    switch (typeParams) {
        case 'player':
            if (idParams) {
                await makeAxiosGet(`/get_players_by_id/${idParams}`)
                    .then(async data => {
                        console.log(data.data);
                        //TODO: build the rest of the page using the data retrieved

                        singlePageImg.src = data.data.image_url;
                        singlePageTitle.innerText = data.data.player_name;

                        await makeAxiosGet(`/clubs/get_club_name_by_id/${data.data.current_club_id}`)
                            .then(dataClub => {
                                let playerClub = document.createElement('a');
                                let playerClubString = document.createElement('p');
                                playerClubString.classList.add('p');
                                playerClubString.innerHTML = '<b>Current Club:</b> ';
                                playerClub.innerText = dataClub.data.clubName;

                                playerClub.href = getUrlForSinglePage({type: 'club', id: data.data.current_club_id});
                                titleDiv.appendChild(playerClubString);
                                playerClubString.appendChild(playerClub);
                            })
                            .catch(err => console.error(err));
                        let dobString = document.createElement('p');
                        dobString.classList.add('p');
                        dobString.innerHTML = '<b>Birth:</b> ' + new Date(data.data.date_of_birth).toLocaleDateString() + ' - ' + data.data.city_of_birth + ', ' + data.data.country_of_birth;
                        titleDiv.appendChild(dobString);

                        let lastSeason = document.createElement('p');
                        lastSeason.classList.add('p');
                        lastSeason.innerHTML = '<b>Last Season:</b> ' + data.data.last_season;
                        info1.appendChild(lastSeason);

                        let countryOfCitizenship = document.createElement('p');
                        countryOfCitizenship.classList.add('p');
                        countryOfCitizenship.innerHTML = '<b>Country of citizenship:</b> ' + data.data.country_of_citizenship;
                        info1.appendChild(countryOfCitizenship);

                        let position = document.createElement('p');
                        position.classList.add('p');
                        position.innerHTML = '<b>Position:</b> ' + data.data.position;
                        info1.appendChild(position);

                        let foot = document.createElement('p');
                        foot.classList.add('p');
                        foot.innerHTML = '<b>Foot:</b> ' + data.data.foot;
                        info1.appendChild(foot);

                        let height = document.createElement('p');
                        height.classList.add('p');
                        height.innerHTML = '<b>Height:</b> ' + data.data.height_in_cm + ' cm';
                        info1.appendChild(height);

                        let marketValue = document.createElement('p');
                        marketValue.classList.add('p');
                        if (data.data.value_eur < 0) {
                            marketValue.innerHTML = '<b>Market Value:</b> N/A';
                        } else {
                            marketValue.innerHTML = '<b>Market Value:</b> ' + data.data.value_eur + ' €';
                        }
                        info2.appendChild(marketValue);

                        let highestMarketValue = document.createElement('p');
                        highestMarketValue.classList.add('p');
                        if (data.data.top_value_eur < 0) {
                            highestMarketValue.innerHTML = '<b>Highest Market Value:</b> N/A';
                        } else {
                            highestMarketValue.innerHTML = '<b>Highest Market Value:</b> ' + data.data.top_value_eur + ' €';
                        }
                        info2.appendChild(highestMarketValue);

                        let contractExpirationDate = document.createElement('p');
                        contractExpirationDate.classList.add('p');
                        if (new Date(data.data.contract_expiration_date).getTime() === new Date(0).getTime()) {
                            contractExpirationDate.innerHTML = '<b>Contract Expiration Date:</b> ---';
                        } else {
                            contractExpirationDate.innerHTML = '<b>Contract Expiration Date:</b> ' + new Date(data.data.contract_expiration_date).toLocaleDateString();
                        }
                        info2.appendChild(contractExpirationDate);

                        let agentName = document.createElement('p');
                        agentName.classList.add('p');
                        if (data.data.agent_name) {
                            agentName.innerHTML = '<b>Agent Name:</b> ' + data.data.agent_name;
                        } else {
                            agentName.innerHTML = '<b>Agent Name:</b> N/A';
                        }

                        info2.appendChild(agentName);

                        // The following line creates the valuation button:
                        await createAccordion('single_page/pl/player_valuations', 'accordions',
                            {id: 'valAccordItem_' + idParams})
                        // The following line creates the appearances button:
                        await createAccordion('single_page/pl/last_appearances', 'accordions',
                            {id: 'appearAccordItem_' + idParams})
                    })
                    .catch(err => console.error(err));
            }
            break;
        case 'club':
            if (idParams) {
                await makeAxiosGet(`/clubs/get_club_by_id/${idParams}`)
                    .then(data => {
                        console.log(data.data);
                        //TODO: build the rest of the page using the data retrieved
                    })
                    .catch(err => console.error(err));
            }
            break;
        case 'game':
            //TODO: single_page initialization for game
            break;
        case 'competition':
            //TODO: single_page initialization for competition
            break;
        default:
            //TODO: error type not supported
            break;
    }
    adjustHRHeight()
    window.addEventListener('resize', adjustHRHeight)
    showChargingSpinner(null, false)
}

/** This function is called inside the `single_page.html` to vertically adjust the `<hr>` element. */
function adjustHRHeight() {
    let hrElem = (document.getElementById('info').children)[1]
    hrElem.style.width = (hrElem.parentElement.scrollHeight - 30) + 'px';
}

/** Function called to generate the internal info block about the accordion button that triggers it.
 * @param type {string} It defines if the accordion type to generate is a list or something else.
 * Should be specified as `'list'`, `'chart'`, etc.
 * @param id {string} The **id** used as id of the accordion button.
 * @throws TypeError If any of its argument is null or undefined. */
async function openAccordionPlayer(type, id){
    if (!type || !id) {
        console.error(type, '\n', id);
        throw TypeError('Invalid argument(s) passed to \'openAccordionPlayer\'!');
    }
    console.log('id', id) // FOR DEBUG ONLY -> @todo remove it!
    const player_id = id.slice(id.indexOf('_') + 1)
    if(document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);
        let dataResponse
        switch (type) {
            case 'list':
                await makeAxiosGet('/players/get_last_appearances/' +  player_id)
                    .then(data => {
                        dataResponse = Array(data.data)[0];
                        let unList = document.createElement('ul');
                        unList.classList.add('nav', 'flex-column');
                        let alternatorCounter = 0;
                        dataResponse.forEach(el => {
                            createDynamicListItem(window, 'appearance', dataResponse.length, unList,
                                {counter: alternatorCounter++, data: el}, {type: 'games', id: String(el.game_id)});
                        })
                        if(dataResponse.length > 20){
                            createLoadMoreElement(unList, 'gamesId', showMore.bind(null, unList, 20));
                        }
                        document.getElementById(id).firstElementChild.appendChild(unList);
                    })
                    .catch(err => {
                        console.error(err);
                        throw new TypeError('Error occurred during \'get_last_appearance\' GET');
                    });
                break;
            case 'chart':
                let canvasContainer = document.createElement('div')
                canvasContainer.classList.add('d-flex', 'justify-content-center', 'w-100', 'ratio', 'ratio-16x9')
                let canvasElem = document.createElement('canvas')
                canvasElem.classList.add('w-100', 'h-100', 'border', 'rounded-2')
                await makeAxiosGet('/valuation/get_valuations_of_player/' + player_id)
                    .then(data => {
                        let dataResponse = Array(data.data)[0]
                        dataResponse.forEach(el => el.date = new Date(el.date).toLocaleDateString())
                        drawChart(dataResponse, canvasElem)
                    }).catch(err => {
                        console.error(err);
                        throw new TypeError('Error occurred during \'get_valuations_of_player\' GET');
                    });
                canvasContainer.appendChild(canvasElem)
                document.getElementById(id).firstElementChild.appendChild(canvasContainer)
                break;
            default:
                console.error('Warning! openAccordionPlayer() called with invalid field \'type\':', type)
                break;
        }
        showChargingSpinner(null, false);
    }
}

function drawChart(dataResponse, canvasElem) {
    const ctx = canvasElem.getContext('2d');
    if (window.scrollWidth > 576) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataResponse.map(item => item.date),
                datasets: [{
                    label: 'Market Value (€)',
                    data: dataResponse.map(item => item.market_value_eur),
                    borderColor: 'green', borderWidth: 2, fill: false, backgroundColor: 'green'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {title: {display: true, text: 'Date'}},
                    y: {beginAtZero: true, title: {display: true, text: 'Value (€)'}}
                }
            }
        });
    } else {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dataResponse.map(item => item.date),
                datasets: [{
                    label: '',
                    data: dataResponse.map(item => item.market_value_eur),
                    borderColor: 'green', borderWidth: 1, fill: false, backgroundColor: 'green'
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Market Value (€)'
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
