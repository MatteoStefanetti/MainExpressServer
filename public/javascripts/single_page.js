const urlParams = new URLSearchParams(window.location.search);
const typeParams = urlParams.get('type');
const idParams = urlParams.get('id');
const MAX_ELEMENTS_TO_SHOW = 12;

async function initSinglePage() {
    let infoTitle = document.getElementById('infoTitle');
    let info1 = document.getElementById('info1');
    let info2 = document.getElementById('info2');
    let imgContainer = document.createElement('div');
    let singlePageImg = document.createElement('img');
    let titleDiv = document.createElement('div');
    let singlePageTitle = document.createElement('p');

    singlePageTitle.classList.add('h1');

    singlePageImg.classList.add('img-fluid', 'd-block', 'player-img-size');
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
                await makeAxiosGet(`/single_page/get_player_by_id/${idParams}`)
                    .then(async data => {
                        console.log(data.data);
                        //TODO: build the rest of the page using the data retrieved
                        singlePageImg.classList.add('border', 'border-5', 'border-darkgreen', 'rounded-4')
                        singlePageImg.src = data.data.image_url;
                        singlePageTitle.innerText = data.data.player_name;

                        await makeAxiosGet(`/single_page/get_club_name_by_id/${data.data.current_club_id}`)
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
                await makeAxiosGet(`/single_page/get_club_by_id/${idParams}`)
                    .then(async data => {
                        console.log(data.data);

                        singlePageImg.src = 'https://tmssl.akamaized.net/images/wappen/head/' +
                            data.data.club_id + '.png';
                        singlePageTitle.innerText = data.data.club_name;

                        let nationalityAnchor = document.createElement('a');
                        let nationalityLabel = document.createElement('p');
                        nationalityAnchor.style.textDecoration = 'underline'
                        nationalityLabel.classList.add('p');
                        nationalityLabel.innerHTML = '<b>Nationality:</b> ';
                        await makeAxiosGet('/single_page/get_nation_name_by_code/' + data.data.local_competition_code)
                            .then(nation => {
                                nation.data = nation.data[0]
                                if (nation.data.flag_url)
                                    data.data.flag_url = nation.data.flag_url
                                data.data.country_name = nation.data.country_name
                            })
                            .catch(err => console.error(err))
                        nationalityAnchor.innerText = data.data.country_name;
                        nationalityAnchor.href = 'competitions.html'
                        titleDiv.appendChild(nationalityLabel);
                        nationalityLabel.appendChild(nationalityAnchor);
                        if (data.data.flag_url) {
                            let nationFlag = document.createElement('img')
                            nationFlag.classList.add('img-fluid', 'mx-1', 'rounded-1')
                            nationFlag.style.width = '1.6rem'
                            nationFlag.style.height = '1rem'
                            nationFlag.src = data.data.flag_url
                            nationalityLabel.appendChild(nationFlag)
                        }

                        let last_season = document.createElement('p');
                        last_season.classList.add('p');
                        last_season.innerHTML = '<b>Last Season:</b> ' + data.data.last_season;
                        info1.appendChild(last_season);

                        let stadiumName = document.createElement('p');
                        stadiumName.classList.add('p');
                        stadiumName.innerHTML = '<b>Stadium:</b> ' + data.data.stadium_name;
                        info1.appendChild(stadiumName);

                        let stadiumSeats = document.createElement('p');
                        stadiumSeats.classList.add('p');
                        stadiumSeats.innerHTML = '<b>Stadium Seats:</b> ' + data.data.stadium_seats;
                        info1.appendChild(stadiumSeats);

                        let transferRecord = document.createElement('p');
                        transferRecord.classList.add('p');
                        transferRecord.innerHTML =
                            '<b>Net Transfer Record:</b> ' + data.data.net_transfer_record + ' (€)';
                        info1.appendChild(transferRecord);

                        let AverAge = document.createElement('p');
                        AverAge.classList.add('p');
                        AverAge.innerHTML = '<b>Average Age:</b> ' + data.data.average_age;
                        info1.appendChild(AverAge);

                        let squadSize = document.createElement('p');
                        squadSize.classList.add('p');
                        squadSize.innerHTML = '<b>Squad Size:</b> ' + data.data.squad_size;
                        info2.appendChild(squadSize);

                        let nationalTeamPlayers = document.createElement('p');
                        nationalTeamPlayers.classList.add('p');
                        nationalTeamPlayers.innerHTML =
                            '<b>National Team Players:</b> ' + data.data.national_team_players;
                        info2.appendChild(nationalTeamPlayers);

                        let foreignersNumber = document.createElement('p');
                        foreignersNumber.classList.add('p');
                        foreignersNumber.innerHTML = '<b>Foreigner Number:</b> ' + data.data.foreigners_number;
                        info2.appendChild(foreignersNumber);

                        let foreignersPerc = document.createElement('p');
                        foreignersPerc.classList.add('p');
                        foreignersPerc.innerHTML =
                            '<b>Foreigners Percentage:</b> ' + data.data.foreigners_percentage + '%';
                        info2.appendChild(foreignersPerc);

                        await createAccordion('single_page/cl/last_games', 'accordions',
                            {id: 'lastGames_' + idParams});

                        await createAccordion('single_page/cl/players', 'accordions',
                            {id: 'clubPlayers_' + idParams});

                        await createAccordion('single_page/cl/past_players', 'accordions',
                            {id: 'pastPlayers_' + idParams});
                        // @todo insert accordions
                    })
                    .catch(err => console.error(err));
            }
            break;
        case 'game':
            if (idParams) {
                makeAxiosGet('/single_page/get_game_by_id/' + String(idParams))
                    .then(async data => {
                        console.log(data.data)
                    })
                    .catch(err => console.error(err))
            }
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

async function openAccordionPastMember(id) {
    if (!id) {
        console.log(id);
        throw TypeError('Invalid argument passed to \'openAccordionPastMember(\'' + id + '\')');
    }

    console.log('id', id); //FOR DEBUG ONLY -> @TODO: remember to remove;
    const club_id = id.slice(id.indexOf('_') + 1);

    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        let playerList = document.createElement('div');
        playerList.classList.add('row', 'w-100', 'px-0', 'px-md-3', 'mb-4', 'justify-content-center-below-sm');

        let dataResponse;

        await makeAxiosGet('/clubs/get_past_players/' + club_id)
            .then(data => {
                dataResponse = Array(data.data)[0];

                playerList.replaceChildren();

                dataResponse.forEach((player) => {
                    const playerContainer = document.createElement('div');
                    playerContainer.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-xxl-2', 'justify-content-center', 'align-items-center', 'mb-4', 'px-1');

                    let clickableContent = document.createElement('a');
                    clickableContent.href = getUrlForSinglePage({type: 'player', id: String(player.playerId)});
                    clickableContent.classList.add('text-dark');
                    clickableContent.innerHTML =
                        '<img src="' + player.imageUrl + '" class="img-fluid d-block border border-5 ' +
                        'border-darkgreen rounded-4 player-img-size" alt="image not found"/>' +
                        '<div class="d-flex justify-content-center align-items-center w-100 my-2 p-0">' +
                        '   <span class="h6 text-center p-0">' + player.playerName + '</span>' +
                        '</div>';

                    playerContainer.appendChild(clickableContent);

                    if (playerList.children.length >= MAX_ELEMENTS_TO_SHOW) {
                        playerContainer.classList.add('d-none');
                    }

                    playerList.appendChild(playerContainer);
                });

                if (dataResponse.length > MAX_ELEMENTS_TO_SHOW)
                    createLoadMoreElement(playerList, 'morePlayers', showMore.bind(null, playerList, MAX_ELEMENTS_TO_SHOW));
            })
            .catch(err => {
                console.log(err);
                throw new TypeError('Error occurred during \'get_past_players\' GET');
                //TODO: check errors
            });

        document.getElementById(id).firstElementChild.appendChild(playerList);
        showChargingSpinner(null, false);
    }
}

/**
 * Function to generate the content of the active players accordion.
 *
 * @param id {string} The **id** used as id of the accordion button
 * @throws TypeError If id is null or undefined
 * */
async function openAccordionClubMember(id) {
    if (!id) {
        console.log(id);
        throw TypeError('Invalid argument passed to \'openAccordionClubMember(\'' + id + '\')');
    }

    console.log('id', id); //FOR DEBUG ONLY -> @TODO: remember to remove;
    const club_id = id.slice(id.indexOf('_') + 1);

    if (document.getElementById(id).firstElementChild.children.length === 0) {

        showChargingSpinner(null, true);

        let playerList = document.createElement('div');
        playerList.classList.add('row', 'w-100', 'px-0', 'px-md-3', 'mb-4', 'justify-content-center-below-sm');

        let dataResponse;

        await makeAxiosGet('/clubs/get_current_players/' + club_id)
            .then(data => {
                dataResponse = Array(data.data)[0];

                playerList.replaceChildren();

                dataResponse.forEach((player) => {
                    const playerContainer = document.createElement('div');
                    playerContainer.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-xxl-2', 'justify-content-center', 'align-items-center', 'mb-4', 'px-1');

                    let clickableContent = document.createElement('a');
                    clickableContent.href = getUrlForSinglePage({type: 'player', id: String(player.playerId)});
                    clickableContent.classList.add('text-dark');
                    clickableContent.innerHTML =
                        '<img src="' + player.imageUrl + '" class="img-fluid d-block border border-5 ' +
                        'border-darkgreen rounded-4 player-img-size" alt="image not found"/>' +
                        '<div class="d-flex justify-content-center align-items-center w-100 my-2 p-0">' +
                        '   <span class="h6 text-center p-0">' + player.playerName + '</span>' +
                        '</div>';

                    playerContainer.appendChild(clickableContent);

                    if (playerList.children.length >= MAX_ELEMENTS_TO_SHOW) {
                        playerContainer.classList.add('d-none');
                    }

                    playerList.appendChild(playerContainer);
                });

                if (dataResponse.length > MAX_ELEMENTS_TO_SHOW)
                    createLoadMoreElement(playerList, 'morePlayers', showMore.bind(null, playerList, MAX_ELEMENTS_TO_SHOW));
            })
            .catch(err => {
                console.log(err);
                throw new TypeError('Error occurred during \'get_current_players\' GET');
                //TODO: check errors
            });

        document.getElementById(id).firstElementChild.appendChild(playerList);
        showChargingSpinner(null, false);
    }
}

/**
 * Function called to generate the internal info block of the valuation accordion.
 *
 * @param id {string} The **id** used as id of the accordion button.
 * @throws TypeError If id is null or undefined.
 * */
async function openAccordionPlayerValuation(id) {
    this.disabled = true;
    if (!id) {
        console.error(id);
        this.disabled = false;
        throw TypeError('Invalid argument passed to \'openAccordionPlayerValuation\'!');
    }

    console.log('id', id); //FOR DEBUG ONLY -> @TODO: remember to remove;
    const player_id = id.slice(id.indexOf('_') + 1);

    if (document.getElementById(id).firstElementChild.children.length === 0) {

        showChargingSpinner(null, true);

        let canvasContainer = document.createElement('div')
        if(window.innerWidth > 768 ) {
                canvasContainer.classList.add('d-flex', 'justify-content-center', 'w-100', 'ratio', 'ratio-16x9')
        }
        else {
                canvasContainer.classList.add('d-flex', 'justify-content-center', 'w-100', 'ratio', 'ratio-4x3')
        }
      
        let canvasElem = document.createElement('canvas')
        canvasElem.classList.add('w-100', 'h-100', 'border', 'rounded-2')
      
        await makeAxiosGet('/single_page/get_valuations_of_player/' + player_id)
            .then(data => {

                let dataResponse = Array(data.data)[0];
                dataResponse.forEach(el => el.date = new Date(el.date).toLocaleDateString('en-GB',{day: 'numeric', year:'2-digit', month: 'numeric'}));
                drawChart(dataResponse, canvasElem)
             })
            .catch(err => {
                console.error(err);
                throw new TypeError('Error occurred during \'/get_valuations_of_player\' GET');
                //TODO: check errors
            });

        canvasContainer.appendChild(canvasElem);
        document.getElementById(id).firstElementChild.appendChild(canvasContainer);

        showChargingSpinner(null, false);
    }
}

/**
 * Function called to generate the internal info block of the Last Games accordion.
 *
 * @param id {string} The **id** used as id of the accordion button
 * @throws TypeError If id is null or undefined
 * */
async function openAccordionClubLastGames(id) {
    if (!id) {
        console.error(id);
        throw TypeError('Invalid argument passed to \'openAccordionClubLastGames\'!');
    }

    console.log('id', id);
    const club_id = id.slice(id.indexOf('_') + 1);

    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        let dataResponse;

        await makeAxiosGet('/single_page/get_last_games_by_club/' + club_id)
            .then(data => {
                dataResponse = Array(data.data)[0];

                let unList = document.createElement('ul');
                unList.classList.add('nav', 'flex-column');

                let alternatorCounter = 0;

                dataResponse.forEach(el => {
                    createDynamicListItem(window, 'game', dataResponse.length, unList, {
                        counter: alternatorCounter++,
                        data: el
                    }, {type: 'games', id: String(el.game_id)});
                })

                if (dataResponse.length > 20) {
                    createLoadMoreElement(unList, 'gamesId', showMore.bind(null, unList, 20));
                }

                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                console.error(err);
                throw new Error('Error occurred during \'/get_last_games_by_club\' GET');
                //TODO: check errors
            });

        showChargingSpinner(null, false);
    }
}

/**
 * Function called to generate the internal info block of the Appearances accordion.
 *
 * @param id {string} The **id** used as id of the accordion button.
 * @throws TypeError If id is null or undefined. */
async function openAccordionPlayerAppearances(id) {
    if (!id) {
        console.error(id);
        throw TypeError('Invalid argument passed to \'openAccordionPlayerAppearances\'!');
    }

    console.log('id', id) // FOR DEBUG ONLY -> @todo remove it!
    const player_id = id.slice(id.indexOf('_') + 1);

    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        let dataResponse;

        await makeAxiosGet('/players/get_last_appearances/' + player_id)
            .then(data => {
                dataResponse = Array(data.data)[0];

                let unList = document.createElement('ul');
                unList.classList.add('nav', 'flex-column');

                let alternatorCounter = 0;

                dataResponse.forEach(el => {
                    createDynamicListItem(window, 'appearance', dataResponse.length, unList, {
                        counter: alternatorCounter++,
                        data: el
                    }, {type: 'games', id: String(el.game_id)});
                });

                if (dataResponse.length > 20) {
                    createLoadMoreElement(unList, 'gamesId', showMore.bind(null, unList, 20));
                }

                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                console.error(err);
                throw new TypeError('Error occurred during \'get_last_appearance\' GET');
                //TODO: check errors
            });
      
        showChargingSpinner(null, false);
    }
    this.disabled = false
}

function drawChart(dataResponse, canvasElem) {
    const ctx = canvasElem.getContext('2d');
    if (window.innerWidth > 768) {
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
        dataResponse = dataResponse.slice(-15)
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
                maintainAspectRatio: false,
                indexAxis: 'x',
                interaction: {mode: 'nearest', intersect: false},
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Market Value (€)'
                    },
                },
                scales: {
                    x: { display: true },
                    y: {
                        display: true,
                        beginAtZero: true,
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value, index, ticks) {
                                if(value > 500000)
                                    return value/1000000+ " M"
                                else if(value >= 1000)
                                    return value / 1000 + " K"
                                else
                                    return value
                            }
                        }
                    }
                }
            }
        });
    }
}
