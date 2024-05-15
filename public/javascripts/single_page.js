const urlParams = new URLSearchParams(window.location.search);
const typeParams = urlParams.get('type');
const idParams = urlParams.get('id');

function openAccordionValuation(id){
    if (document.getElementById(id).firstChild.children.length === 0){

    }
}

function initSinglePage() {
    switch (typeParams) {
        case 'player':
            if (idParams) {
                makeAxiosGet(`/get_players_by_id/${idParams}`)
                    .then(async data => {
                        console.log(data.data);
                        //TODO: build the rest of the page using the data retrieved
                        let infoTitle = document.getElementById('infoTitle');
                        let info1 = document.getElementById('info1');
                        let playerImg = document.createElement('img');
                        playerImg.src = data.data.image_url;
                        playerImg.classList.add('img-fluid', 'd-block', 'border', 'border-5', 'border-darkgreen', 'rounded-4', 'player-img-size');
                        playerImg.alt = 'image not found';
                        infoTitle.appendChild(playerImg);

                        let playerName = document.createElement('p');
                        playerName.innerText = data.data.player_name;
                        playerName.classList.add('h1');
                        infoTitle.appendChild(playerName);

                        makeAxiosGet(`/clubs/get_club_name_by_id/${data.data.current_club_id}`)
                            .then(async dataClub => {
                                let playerClub = document.createElement('a');
                                let playerClubString = document.createElement('p');
                                playerClubString.classList.add('p');
                                playerClubString.innerHTML = '<b>Current Club:</b> ';
                                playerClub.innerText = dataClub.data.clubName;
                                let url = 'single_page.html';
                                let params = {
                                    type: 'club',
                                    id: data.data.current_club_id
                                };
                                let queryString = Object.keys(params)
                                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                                    .join('&');

                                if (queryString) {
                                    url += '?' + queryString;
                                }

                                playerClub.href = url;
                                infoTitle.appendChild(playerClubString);
                                playerClubString.appendChild(playerClub);
                            })
                            .catch(err => console.error(err));
                        let dobString = document.createElement('p');
                        dobString.classList.add('p');
                        dobString.innerHTML = '<b>Birth:</b> ' + new Date(data.data.date_of_birth).toLocaleDateString() + ' - ' + data.data.city_of_birth + ', ' + data.data.country_of_birth;
                        infoTitle.appendChild(dobString);

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

                        //TODO: Insert the graphic of the valuation

                        let accordions = document.getElementById('accordions');
                        createAccordion('player_appearance', 'accordions', {player_id: idParams});

                    })
                    .catch(err => console.error(err));
            }
            break;
        case 'club':
            if (idParams) {
                makeAxiosGet(`/clubs/get_club_by_id/${idParams}`)
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
}