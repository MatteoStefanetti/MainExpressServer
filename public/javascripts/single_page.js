const urlParams = new URLSearchParams(window.location.search);
const typeParams = urlParams.get('type');
const idParams = urlParams.get('id');
const MAX_ELEMENTS_TO_SHOW = 12;

async function initSinglePage() {
    initChat()
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
    titleDiv.classList.add('align-self-center', 'flex-grow-1');
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
                        let infoDiv = document.getElementById('info')
                        infoDiv.classList.add('bg-darkgreen', 'rounded-4', 'text-light', 'py-md-2', 'px-3')
                        infoDiv.previousElementSibling.remove()
                        singlePageImg.classList.add('border', 'border-5', 'border-darkgreen', 'rounded-4')
                        singlePageImg.src = data.data.image_url;
                        singlePageTitle.innerText = data.data.player_name;

                        await makeAxiosGet(`/single_page/get_club_name_by_id/${data.data.current_club_id}`)
                            .then(dataClub => {
                                const playerClubValue = '<a class="text-decoration-underline" href="' + getUrlForSinglePage({
                                        type: 'club',
                                        id: data.data.current_club_id
                                    })
                                    + '">' + dataClub.data.clubName + '</a>'
                                createParagraphForSP(titleDiv, true, 'Current Club', playerClubValue, 'p')
                            })
                            .catch(err => {
                                //DONE
                                if (err.response.status === 404) {
                                    createParagraphForSP(titleDiv, true, 'Current Club', 'N/A', 'p');
                                } else {
                                    console.error(err);
                                }
                            });

                        let dateAndLocationOfBirth = data.data.date_of_birth ? new Date(data.data.date_of_birth).toLocaleDateString() : 'N/A';
                        dateAndLocationOfBirth += ' - ' + ((data.data.city_of_birth) ?? 'No city') + ', ' + ((data.data.country_of_birth) ?? 'No country');
                        createParagraphForSP(titleDiv, true, 'Birth', dateAndLocationOfBirth, 'p');

                        createParagraphForSP(info1, data.data.last_season, 'Last Season', data.data.last_season, 'p', 'ms-1', 'ms-md-3');
                        createParagraphForSP(info1, data.data.country_of_citizenship, 'Country of citizenship', data.data.country_of_citizenship, 'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info1, data.data.position, 'Position', data.data.position, 'p', 'ms-1', 'ms-md-3');
                        createParagraphForSP(info1, data.data.foot, 'Foot', data.data.foot, 'p', 'ms-1', 'ms-md-3');
                        createParagraphForSP(info1, data.data.height_in_cm, 'Height', data.data.height_in_cm + ' cm', 'p', 'ms-1', 'ms-md-3')

                        createParagraphForSP(info2, data.data.value_eur > 0, 'Market Value', data.data.value_eur + ' €', 'p', 'ms-1', 'ms-md-3');
                        createParagraphForSP(info2, data.data.top_value_eur > 0, 'Highest Market Value', data.data.top_value_eur + ' €', 'p', 'ms-1', 'ms-md-3')

                        const conditionExpirationDate = new Date(data.data.contract_expiration_date).getTime() === new Date(0).getTime();
                        createParagraphForSP(info2, conditionExpirationDate, 'Contract Expiration Date', new Date(data.data.contract_expiration_date).toLocaleDateString(), 'p', 'ms-1', 'ms-md-3');
                        createParagraphForSP(info2, data.data.agent_name, 'Agent Name', data.data.agent_name, 'p', 'ms-1', 'ms-md-3');

                        // The following line creates the valuation button:
                        await createAccordion('single_page/pl/player_valuations', 'accordions',
                            {id: 'valAccordItem_' + idParams})
                        // The following line creates the appearances button:
                        await createAccordion('single_page/pl/last_appearances', 'accordions',
                            {id: 'appearAccordItem_' + idParams})
                    })
                    .catch(err => {
                        //DONE
                        if (err.response.status === 404)
                            notFoundPage('Player')
                        else
                            console.error(err)
                    });
            }
            break;
        case 'club':
            if (idParams) {
                await makeAxiosGet(`/single_page/get_club_by_id/${idParams}`)
                    .then(async data => {
                        console.log(data.data);
                        let infoDiv = document.getElementById('info')
                        infoDiv.classList.add('bg-darkgreen', 'rounded-4', 'text-light', 'py-md-2', 'px-3')
                        infoDiv.previousElementSibling.remove()

                        singlePageImg.src = 'https://tmssl.akamaized.net/images/wappen/head/' +
                            data.data.club_id + '.png';
                        singlePageTitle.innerText = data.data.club_name;

                        await makeAxiosGet('/single_page/get_nation_name_by_code/' + data.data.local_competition_code)
                            .then(nation => {
                                nation.data = nation.data[0]

                                const nationalityValue = nation.data.country_name +
                                    '<img class="img-fluid mx-1 rounded-1" src="' + nation.data.flag_url +
                                    '" alt=" " style="width: 1.6rem; height: 1rem">'
                                createParagraphForSP(titleDiv, true, 'Nationality', nationalityValue, 'p')
                            })
                            .catch(err => {
                                    //TODO revision
                                    if (err.response.status === 404)
                                        createParagraphForSP(titleDiv, true, 'Nationality', 'N/A', 'p')
                                    else
                                        console.error(err, ': No flag or name have been found for the nationality.')
                                }
                            )

                        createParagraphForSP(info1, true, 'Last Season', data.data.last_season,
                            'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info1, data.data.stadium_name, 'Stadium', data.data.stadium_name,
                            'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info1, data.data.stadium_seats > 0, 'Stadium Seats',
                            data.data.stadium_seats, 'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info1, true, 'Net Transfer Record',
                            data.data.net_transfer_record + ' (€)', 'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info1, data.data.average_age !== -1, 'Average Age',
                            data.data.average_age, 'p', 'ms-1', 'ms-md-3')

                        createParagraphForSP(info2, true, 'Squad Size', data.data.squad_size,
                            'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info2, data.data.national_team_players !== -1, 'National Team Players',
                            data.data.national_team_players, 'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info2, data.data.foreigners_number !== -1, 'Foreigners Number',
                            data.data.foreigners_number, 'p', 'ms-1', 'ms-md-3')
                        createParagraphForSP(info2, data.data.foreigners_percentage !== -1,
                            'Foreigners Percentage', data.data.foreigners_percentage + '%',
                            'p', 'ms-1', 'ms-md-3')

                        await createAccordion('single_page/cl/last_games', 'accordions',
                            {id: 'lastGames_' + idParams});

                        await createAccordion('single_page/cl/players', 'accordions',
                            {id: 'clubPlayers_' + idParams});

                        await createAccordion('single_page/cl/past_players', 'accordions',
                            {id: 'pastPlayers_' + idParams});
                        // @todo insert accordions
                    })
                    .catch(err => {
                        //DONE
                        if (err.response.status === 404)
                            notFoundPage('Club')
                        else
                            console.error(err)
                    });
            }
            break;
        case 'game':
            if (idParams) {
                await makeAxiosGet('/single_page/get_game_by_id/' + String(idParams))
                    .then(async data => {
                        delete data.data.date
                        await makeAxiosGet(`/single_page/get_visualize_game_by_id/${idParams}`)
                            .then(async res => {
                                let response = data.data
                                let resKeys = Object.keys(res.data)
                                for (let attr of resKeys) {
                                    const transformedKey = castCamelCaseToSneakCase(attr)
                                    if (!response[transformedKey])
                                        response[transformedKey] = res.data[attr]
                                }
                                // ----- here we put the output elements -----
                                // - Adding names and icon for the hosting club
                                singlePageTitle.innerHTML = '<span class="col-sm-5 club-name-span">' + response.club_name1 +
                                    '</span> <span class="col-sm-2 align-self-center text-darkgreen">vs</span> <span class="col-sm-5 club-name-span">'
                                    + response.club_name2 + '</span>';
                                singlePageTitle.classList.replace('h1', 'h3')
                                singlePageTitle.classList.add('fw-bold', 'text-center', 'w-100', 'd-flex', 'flex-column',
                                    'flex-sm-row', 'mb-3')
                                titleDiv.classList.add('w-100', 'mt-4')
                                infoTitle.nextElementSibling.remove()
                                if (response.hosting1 || response.hosting2) {
                                    let hostingIcon = document.createElement('span')
                                    hostingIcon.classList.add('bi', 'bi-house-fill', 'text-darkgreen', 'mx-1')
                                    if (response.hosting1)
                                        singlePageTitle.firstElementChild.insertAdjacentElement('afterbegin', hostingIcon)
                                    else
                                        singlePageTitle.lastElementChild.insertAdjacentElement('afterbegin', hostingIcon)
                                }
                                for (let title of document.getElementsByClassName('club-name-span'))
                                    title.style.textWrap = 'balance';

                                let datePar = document.createElement('p');
                                datePar.classList.add('p', 'fs-6', 'text-center', 'my-1')
                                datePar.innerText = new Date(response.game_date).toLocaleDateString()
                                singlePageTitle.insertAdjacentElement('beforebegin', datePar)

                                let infoDiv = document.getElementById('info')
                                infoDiv.classList.add('flex-column', 'flex-sm-row')
                                info1.classList.add('col-sm-6', 'justify-content-center', 'align-self-stretch', 'me-1')
                                info2.classList.add('col-sm-6', 'justify-content-center', 'align-self-stretch')
                                infoDiv.style.boxSizing = 'border-box !important'
                                // "generalInfo" div cloned HERE
                                let generalInfo = infoDiv.cloneNode(true)
                                // we modify the elements after the clone, so we have different styles
                                info1.classList.add('bg-light', 'border', 'rounded-4', 'p-1', 'py-md-2', 'px-md-3', 'mb-2', 'mb-sm-0')
                                info2.classList.add('bg-light', 'border', 'rounded-4', 'p-1', 'py-md-2', 'px-md-3')

                                // Setting the images and their containers
                                imgContainer.remove()
                                let imgContainer1 = document.createElement('a')
                                imgContainer1.classList.add('m-2', 'mx-auto')
                                imgContainer1.href = getUrlForSinglePage({type: 'club', id: response.club_id1})
                                singlePageImg.src = 'https://tmssl.akamaized.net/images/wappen/head/' +
                                    response.club_id1 + '.png';
                                singlePageImg.classList.remove('player-img-size')
                                imgContainer1.appendChild(singlePageImg)
                                info1.appendChild(imgContainer1)

                                let imgContainer2 = document.createElement('a')
                                imgContainer2.classList.add('m-2', 'mx-auto')
                                imgContainer2.href = getUrlForSinglePage({type: 'club', id: response.club_id2})
                                let singlePageImg2 = document.createElement('img')
                                singlePageImg2.classList.add('img-fluid', 'd-block')
                                singlePageImg2.alt = 'image not found';
                                singlePageImg2.src = 'https://tmssl.akamaized.net/images/wappen/head/' +
                                    response.club_id2 + '.png';
                                imgContainer2.appendChild(singlePageImg2);
                                info2.appendChild(imgContainer2)
                                singlePageImg.classList.add('mx-auto')
                                singlePageImg2.classList.add('mx-auto')

                                createParagraphForSP(info1, true, '', String(response.goal1), 'h2', 'fw-bold', 'text-center')
                                createParagraphForSP(info1, response.manager1, 'Manager', response.manager1,
                                    'p', 'ms-1', 'ms-md-2')
                                createParagraphForSP(info1, response.formation1, 'Formation', response.formation1,
                                    'p', 'ms-1', 'ms-md-2')

                                createParagraphForSP(info2, true, '', String(response.goal2), 'h2', 'fw-bold', 'text-center')
                                createParagraphForSP(info2, response.manager2, 'Manager', response.manager2,
                                    'p', 'ms-1', 'ms-md-2')
                                createParagraphForSP(info2, response.formation2, 'Formation', response.formation2,
                                    'p', 'ms-1', 'ms-md-2')

                                // Setting up general info about the match
                                generalInfo.id = 'generalInfo'
                                generalInfo.classList.add('bg-darkgreen', 'rounded-4', 'text-light', 'py-md-2', 'px-3')
                                generalInfo.children[0].id = 'genInfo1'
                                generalInfo.children[1].id = 'genInfo2'
                                infoDiv.insertAdjacentElement('beforebegin', generalInfo)
                                let genInfo1 = document.getElementById('genInfo1')
                                let genInfo2 = document.getElementById('genInfo2')
                                genInfo1.classList.add('col-12', 'col-sm-6', 'ps-2')
                                genInfo2.classList.add('col-12', 'col-sm-6', 'ps-2')

                                let competitionAnchor = document.createElement('a');
                                let competitionLabel = document.createElement('p');
                                competitionAnchor.classList.add('pe-5')
                                competitionAnchor.style.textDecoration = 'underline'
                                competitionLabel.classList.add('p', 'ms-1', 'ms-md-3');
                                competitionLabel.innerHTML = '<b>Competition:</b> ';
                                competitionAnchor.innerText = response.competition_id;
                                competitionAnchor.href = getUrlForSinglePage({
                                    type: 'competition',
                                    id: response.competition_id,
                                    season: response.season
                                })
                                competitionLabel.appendChild(competitionAnchor)
                                genInfo1.appendChild(competitionLabel)

                                createParagraphForSP(genInfo1, response.round, 'Match Round', response.round, 'p',
                                    'ms-1', 'ms-md-3')
                                createParagraphForSP(genInfo1, response.season, 'Season', response.season, 'p',
                                    'ms-1', 'ms-md-3')

                                createParagraphForSP(genInfo2, response.referee, 'Referee', response.referee, 'p',
                                    'ms-1', 'ms-md-3')
                                createParagraphForSP(genInfo2, response.stadium, 'Stadium', response.stadium, 'p',
                                    'ms-1', 'ms-md-3')
                                createParagraphForSP(genInfo2, (response.attendance !== -1), 'Attendance',
                                    response.attendance, 'p', 'ms-1', 'ms-md-3')

                                let substitutionsArray = [];
                                let cardsArray = [];

                                // Querying game_events
                                await makeAxiosGet('/single_page/get_events_of/' + String(response.game_id))
                                    .then(events => {
                                        if (events.data.length) {
                                            substitutionsArray = events.data.filter(element => String(element.event_type) === 'Substitutions')
                                            cardsArray = events.data.filter(element => String(element.event_type) === 'Cards')
                                            console.log('cards:', cardsArray)       // @todo remove: debug only
                                            console.log('substitutions:', substitutionsArray)       // @todo remove: debug only

                                            // Counting cards & substitutions of the clubs
                                            let countParam1 = cardsArray.filter((element) =>
                                                element.club_id === response.club_id1).length
                                            let countParam2 = cardsArray.length - countParam1;
                                            createParagraphForSP(info1, true, 'Cards', String(countParam1),
                                                'p', 'ms-1', 'ms-md-2')
                                            createParagraphForSP(info2, true, 'Cards', String(countParam2),
                                                'p', 'ms-1', 'ms-md-2')

                                            countParam1 = substitutionsArray.filter((element) =>
                                                element.club_id === response.club_id1).length
                                            countParam2 = substitutionsArray.length - countParam1;
                                            createParagraphForSP(info1, true, 'Substitutions',
                                                String(countParam1), 'p', 'ms-1', 'ms-md-2')
                                            createParagraphForSP(info2, true, 'Substitutions',
                                                String(countParam2), 'p', 'ms-1', 'ms-md-2')
                                            // @todo put info about game events

                                        } else
                                            console.log('game_events not found for game:', response.game_id)
                                    })
                                    .catch(err => {
                                        if (err.response.status === 404) {
                                            console.log('game_events not found for game:', response.game_id)
                                        } else
                                            console.error(err)
                                    })
                                // players section
                                let playersDivTitle = document.createElement('div')
                                playersDivTitle.classList.add('custom-section', 'rounded-2', 'm-1', 'py-2', 'px-3', 'fs-5')
                                playersDivTitle.innerText = 'Players'
                                let playersDiv = document.createElement('div')
                                playersDiv.classList.add('d-flex', 'flex-wrap', 'justify-content-center', 'align-items-start', 'py-2', 'px-2', 'px-lg-2', 'mb-3')
                                document.getElementById('accordions').insertAdjacentElement('afterend', playersDivTitle)
                                playersDivTitle.insertAdjacentElement('afterend', playersDiv)
                                await makeAxiosGet(`/single_page/get_appearances_of_game/${response.game_id}`)
                                    .then(async appearances => {
                                        const idsArray = appearances.data.map(el => el.player_id).join(',')
                                        // creating player cards
                                        await makeAxiosGet(`/single_page/get_players_by_ids/${idsArray}`)
                                            .then(player_cards => {
                                                if (player_cards.data.length && Array.isArray(player_cards.data)) {
                                                    // We create 2 containers for the squad players
                                                    playersDiv.classList.add('justify-content-sm-evenly', 'flex-column', 'flex-sm-row')
                                                    const playerCardsContainer1 = document.createElement('div')
                                                    const playerCardsContainer2 = document.createElement('div')
                                                    playerCardsContainer1.classList.add('d-flex', 'justify-content-center', 'align-items-start', 'flex-wrap', 'bg-light', 'border-start', 'border-4', 'border-darkgreen', 'rounded-3', 'col-12', 'col-sm-5', 'p-1', 'pt-3', 'm-0', 'mb-4', 'mb-sm-0')
                                                    playerCardsContainer2.classList.add('d-flex', 'justify-content-center', 'align-items-start', 'flex-wrap', 'bg-light', 'border-start', 'border-4', 'border-danger', 'rounded-3', 'col-12', 'col-sm-5', 'p-1', 'pt-3', 'm-0', 'ms-mb-2')
                                                    playersDiv.style.boxSizing = 'border-box !important';
                                                    const playerCardsSquad1 = document.createElement('div')
                                                    const playerCardsSquad2 = document.createElement('div')
                                                    playerCardsSquad1.classList.add('d-flex', 'flex-wrap', 'w-100', 'p-1', 'pt-3', 'px-md-3')
                                                    playerCardsSquad2.classList.add('d-flex', 'flex-wrap', 'w-100', 'p-1', 'pt-3', 'px-md-3')
                                                    playersDiv.append(playerCardsContainer1, playerCardsContainer2)
                                                    playerCardsContainer1.appendChild(playerCardsSquad1)
                                                    playerCardsContainer2.appendChild(playerCardsSquad2)
                                                    player_cards.data.forEach(elem => {
                                                        const playerContainer = document.createElement('div');
                                                        const playerClubId = appearances.data.filter(el => el.player_id === elem.playerId)[0].player_club_id
                                                        if (playerClubId === response.club_id1 || playerClubId === response.club_id2) {
                                                            playerContainer.classList.add('col-6', 'col-sm-4', 'justify-content-center', 'align-items-center', 'm-0', 'mb-4', 'px-sm-1');
                                                            let clickableContent = document.createElement('a');
                                                            clickableContent.href = getUrlForSinglePage({type: 'player', id: String(elem.playerId)});
                                                            clickableContent.classList.add('text-dark');
                                                            clickableContent.innerHTML =
                                                                '<img src="' + elem.imageUrl + '" class="img-fluid d-block border border-3 border-md-5 ' +
                                                                'border-darkgreen rounded-3 rounded-lg-4 player-img-size m-0 w-75" alt=" "/>' +
                                                                '<div class="d-flex justify-content-center align-items-center w-100 m-0 mt-2 p-0">' +
                                                                '   <span class="h6 text-center p-0">' + setReducedName(elem.playerLastName, elem.playerName)  +
                                                                '</span></div>';
                                                            playerContainer.appendChild(clickableContent);
                                                        }
                                                        if (playerClubId === response.club_id1)
                                                            playerCardsSquad1.appendChild(playerContainer)
                                                        else if (playerClubId === response.club_id2)
                                                            playerCardsSquad2.appendChild(playerContainer)
                                                        else
                                                            console.log('Found player with club_id:', playerClubId + '. instead of', response.club_id1, 'or', response.club_id2)
                                                    })
                                                } else
                                                    playersDiv.innerHTML = '<span class="h5 text-center">No players found.</span>'
                                            })
                                            .catch(err => {
                                                //DONE
                                                if (err.response.status === 404)
                                                    playersDiv.innerHTML = '<span class="h5 text-center">No players found.</span>'
                                                else console.error(err)
                                            })
                                    })
                                    .catch(err => {
                                        //DONE
                                        if (err.response.status === 404)
                                            playersDiv.innerHTML = '<span class="h5 text-center">No players found.</span>'
                                        else console.error(err)
                                    })
                            })
                            .catch(err => {
                                //DONE
                                if (err.response.status === 404)
                                    notFoundPage('Game')
                                else
                                    console.error(err)
                            })
                    })
                    .catch(err => {
                        //DONE
                        if (err.response.status === 404)
                            notFoundPage('Game')
                        else
                            console.error(err)
                    })
            }
            break;
        case 'competition':
            const seasonParams = urlParams.get('season');
            if (idParams) {
                let seasonForm = document.createElement('form');
                seasonForm.classList.add('mt-1');
                let seasonLabel = document.createElement('label');
                seasonLabel.classList.add('form-label');
                seasonLabel.innerText = 'Select Season:';
                seasonLabel.setAttribute('for', 'seasonSelect');
                seasonForm.appendChild(seasonLabel);
                let selectDiv = document.createElement('div');
                selectDiv.style.width = '95px';
                let seasonSelect = document.createElement('select');
                seasonSelect.id = 'seasonSelect';
                seasonSelect.name = 'seasonSelect';
                seasonSelect.classList.add('form-select');
                selectDiv.appendChild(seasonSelect);
                seasonForm.appendChild(selectDiv);

                await makeAxiosGet('/single_page/get_all_season/' + String(idParams))
                    .then(async seasons => {
                        if (seasons.data.length) {
                            seasons.data.forEach(season => {
                                let optionSeason = document.createElement('option');
                                optionSeason.value = season;
                                optionSeason.innerText = season;
                                seasonSelect.appendChild(optionSeason);
                                if (seasonParams === String(season)) {
                                    optionSeason.selected = true;
                                }
                            });
                        } else {
                            let optionSeason = document.createElement('option');
                            optionSeason.innerText = 'No season found.';
                            seasonSelect.appendChild(optionSeason);
                            optionSeason.selected = true;
                            seasonSelect.disabled = true;
                        }
                    })
                    .catch(err => {
                        //DONE
                        if (err.response.status === 404) {
                            let optionSeason = document.createElement('option');
                            optionSeason.innerText = 'No season found.';
                            seasonSelect.appendChild(optionSeason);
                            optionSeason.selected = true;
                            seasonSelect.disabled = true;
                        } else
                            console.error(err);
                    });

                seasonSelect.addEventListener('change', (event) => {
                    window.location.replace(getUrlForSinglePage({
                        type: 'competition',
                        id: idParams,
                        season: event.target.value
                    }));
                });

                await makeAxiosGet('/single_page/get_competition_by_id/' + String(idParams))
                    .then(async data => {
                        singlePageImg.src = 'https://tmssl.akamaized.net/images/logo/header/' + String(data.data.competition_id).toLowerCase() + '.png';
                        singlePageTitle.innerHTML = retrieveCompetitionName(data.data.competition_name);

                        let nationalityValue = null;
                        await makeAxiosGet('/single_page/get_nation_name_by_code/' + String(data.data.domestic_league_code))
                            .then(async nation => {
                                if (nation.data.length) {
                                    nation.data = nation.data[0];   // only element that has to be here!
                                    nationalityValue = nation.data.country_name + '<img class="img-fluid mx-1 rounded-1" src="' + nation.data.flag_url + '" alt=" " style="width: 1.6rem; height: 1rem">'
                                }
                            })
                            .catch(ignored => {
                            })
                        nationalityValue = nationalityValue ?? 'International <span class="bi bi-globe-americas"></span>';
                        createParagraphForSP(titleDiv, true, 'Nationality', nationalityValue, 'p')

                        titleDiv.appendChild(seasonForm);
                        document.getElementById('info').remove();

                        let placingDiv = document.createElement('div');
                        let accordionDiv = document.getElementById('accordions');
                        accordionDiv.appendChild(placingDiv);

                        placingDiv.classList.add('row', 'w-100', 'px-md-3', 'mb-4', 'justify-content-center-below-sm');

                        await makeAxiosGet('/single_page/get_competition_placing/' + String(idParams) + '/' + String(seasonParams))
                            .then(placing => {
                                console.log(placing.data);
                                placing.data.forEach(el => {
                                    let clubContainer = document.createElement('div');
                                    clubContainer.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-xxl-2', 'justify-content-center', 'align-items-center', 'my-4', 'px-1');

                                    let clubLink = document.createElement('a');
                                    clubLink.href = getUrlForSinglePage({type: 'club', id: String(el.clubId)});
                                    clubContainer.appendChild(clubLink);

                                    let clubImg = document.createElement('img');
                                    clubImg.src = 'https://tmssl.akamaized.net/images/wappen/head/' + el.clubId + '.png';
                                    clubImg.classList.add('img-fluid', 'd-block', 'club-img-size');
                                    clubImg.alt = el.clubName + ' logo';
                                    clubLink.appendChild(clubImg);

                                    let clubNameDiv = document.createElement('div');
                                    clubNameDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'w-100', 'my-2', 'p-0');
                                    clubLink.appendChild(clubNameDiv);

                                    let clubNameSpan = document.createElement('span');
                                    clubNameSpan.classList.add('h6', 'text-center', 'p-0');
                                    let icon = document.createElement('span');
                                    switch (el.clubPosition) {
                                        case 1:
                                            icon.classList.add('bi', 'bi-1-circle-fill', 'mx-1', 'text-warning');
                                            clubNameDiv.appendChild(icon);
                                            break;
                                        case 2:
                                            icon.classList.add('bi', 'bi-2-circle-fill', 'mx-1', 'text-silver');
                                            clubNameDiv.appendChild(icon);
                                            break;
                                        case 3:
                                            icon.classList.add('bi', 'bi-3-circle-fill', 'mx-1', 'text-bronze');
                                            clubNameDiv.appendChild(icon);
                                            break;
                                        default:
                                            break;
                                    }
                                    clubNameSpan.innerText = el.clubName;
                                    clubNameDiv.appendChild(clubNameSpan);

                                    placingDiv.appendChild(clubContainer);
                                })
                            })
                            .catch(err => {
                                //DONE
                                if (err.response.status === 404)
                                    placingDiv.innerHTML = '<span class="h6 text-center fw-bold">No clubs found...</span>';
                                else
                                    console.error(err);
                            });

                        await createAccordion('single_page/co/last_season_games', 'accordions', {
                            id: 'lastSeasonGames_' + idParams,
                            season: seasonParams
                        });
                    })
                    .catch(err => {
                        //DONE
                        if (err.response.status === 404)
                            notFoundPage('Competition')
                        else
                            console.error(err);
                    })
            }
            //TODO: single_page initialization for competition
            break;
        default:
            notFoundPage('Page');
            break;
    }
    showChargingSpinner(null, false)
}

/**openAccordion for the last games of a competition.
 *
 * @param id {string} The id of the competition that has the games.
 * @param season {number} The year of the season of the competition.
 * @throws Error if 'id' or 'season' are null or undefined.
 * @throws Error if GET route fails.*/
async function openAccordionCompetitionLastGames(id, season) {
    this.disabled = true
    if (!id || !season) {
        this.disabled = false
        throw new Error('Invalid argument to \'openAccordionCompetitionLastGames\' for \'' + id + '\' or \'' + season + '\'.');
    }

    const competition_id = id.slice(id.indexOf('_') + 1);
    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        await makeAxiosGet('/competitions/get_games_by_league/' + String(idParams) + '/' + String(season))
            .then(data => {
                let dataResponse = data.data;
                let unList = document.createElement('ul');
                unList.classList.add('nav', 'flex-column');

                let alternatorCounter = 0;
                dataResponse.forEach(el => {
                    createDynamicListItem(window, 'game', dataResponse.length, unList, {
                        counter: alternatorCounter++,
                        data: el
                    }, {type: 'game', id: String(el.gameId)});
                });

                if (dataResponse.length > 20)
                    createLoadMoreElement(unList, 'gamesId', showMore.bind(null, unList, 20));

                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                //DONE
                if (err.response.status === 404)
                    document.getElementById(id).firstElementChild.innerHTML = '<span>No Games found...</span>'
                else {
                    console.error(err);
                    this.disabled = false
                    throw new Error('Error occurred during \'/get_last_appearance\' GET');
                }
            })
        showChargingSpinner(null, false);
    }
    this.disabled = false;
}

/** openAccordion for the past members of a club.
 * @param id {string} the id of the club of which we are querying data.
 * @throws TypeError If 'id' is null or undefined.
 * @throws Error If GET route fails. */
async function openAccordionPastMember(id) {
    this.disabled = true
    if (!id) {
        console.log(id);
        this.disabled = false
        throw new TypeError('Invalid argument passed to \'openAccordionPastMember(\'' + id + '\')');
    }

    const club_id = id.slice(id.indexOf('_') + 1);
    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        let playerList = document.createElement('div');
        await makeAxiosGet('/single_page/get_past_players/' + club_id)
            .then(data => {
                playerList.classList.add('row', 'w-100', 'px-0', 'px-md-3', 'mb-4', 'justify-content-center-below-sm');
                let dataResponse = data.data;
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
                    if (playerList.children.length >= MAX_ELEMENTS_TO_SHOW)
                        playerContainer.classList.add('d-none');
                    playerList.appendChild(playerContainer);
                });

                if (dataResponse.length > MAX_ELEMENTS_TO_SHOW)
                    createLoadMoreElement(playerList, 'morePlayers', showMore.bind(null, playerList, MAX_ELEMENTS_TO_SHOW));
            })
            .catch(err => {
                //DONE
                if (err.response.status === 404) {
                    playerList.classList.add('d-flex', 'w-100', 'justify-content-center', 'align-items-center')
                    playerList.innerHTML = '<span class="text-center">No past players found...</span>'
                } else
                    console.error(err)
            });

        document.getElementById(id).firstElementChild.appendChild(playerList);
        showChargingSpinner(null, false);
    }
    this.disabled = false
}

/**
 * Function to create a not found content for a single page.
 *
 * @param sp {string} indicate the single page type.*/
function notFoundPage(sp) {
    let containerDiv = document.getElementById('contentHeight').firstElementChild
    containerDiv.innerHTML = '<div class="row d-flex align-items-center justify-content-center"><span class="h1 col-12 text-center">No ' + sp + ' found. </span></div>';
    let goBackButton = document.createElement('button');
    goBackButton.classList.add('d-flex', 'btn', 'btn-lightgreen', 'rounded-4', 'text-center', 'align-content-center');
    goBackButton.innerText = 'Go Back';
    goBackButton.addEventListener('click', function () {
        history.back();
    })
    let buttonDiv = document.createElement('div');
    buttonDiv.appendChild(goBackButton);
    buttonDiv.classList.add('d-flex', 'justify-content-center');
    containerDiv.firstElementChild.appendChild(buttonDiv);
    containerDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center');
}

/**
 * Function to generate the content of the active players accordion.
 *
 * @param id {string} The **id** used as id of the accordion button
 * @throws TypeError If id is null or undefined.
 * @throws Error If GET route fails.
 * */
async function openAccordionClubMember(id) {
    this.disabled = true
    if (!id) {
        this.disabled = false
        throw new TypeError('Invalid argument passed to \'openAccordionClubMember(\'' + id + '\')');
    }

    const club_id = id.slice(id.indexOf('_') + 1);
    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        let playerList = document.createElement('div');
        playerList.classList.add('row', 'w-100', 'px-0', 'px-md-3', 'mb-4', 'justify-content-center-below-sm');
        await makeAxiosGet('/single_page/get_current_players/' + club_id)
            .then(data => {
                playerList.replaceChildren();
                data.data.forEach((player) => {
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
                    playerList.appendChild(playerContainer);
                });
            })
            .catch(err => {
                //DONE
                if (err.response.status === 404)
                    playerList.innerHTML = '<span class="text-center p-0">No active players found...</span>';
                else {
                    console.log(err);
                    this.disabled = false
                    throw new Error('Error occurred during \'/get_current_players\' GET');
                }
            });
        document.getElementById(id).firstElementChild.appendChild(playerList);
        showChargingSpinner(null, false);
    }
    this.disabled = false
}

/**
 * Function called to generate the internal info block of the valuation accordion.
 *
 * @param id {string} The **id** used as id of the accordion button.
 * @throws TypeError If id is null or undefined.
 * @throws Error If GET route fails.
 * */
async function openAccordionPlayerValuation(id) {
    this.disabled = true;
    if (!id) {
        console.error(id);
        this.disabled = false;
        throw new TypeError('Invalid argument passed to \'openAccordionPlayerValuation\'!');
    }

    const player_id = id.slice(id.indexOf('_') + 1);
    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        let canvasContainer = document.createElement('div')
        if (window.innerWidth > 768) {
            canvasContainer.classList.add('d-flex', 'justify-content-center', 'w-100', 'ratio', 'ratio-16x9')
        } else {
            canvasContainer.classList.add('d-flex', 'justify-content-center', 'w-100', 'ratio', 'ratio-4x3')
        }

        let canvasElem = document.createElement('canvas')
        canvasElem.classList.add('w-100', 'h-100', 'border', 'rounded-2')

        await makeAxiosGet('/single_page/get_valuations_of_player/' + player_id)
            .then(data => {
                let dataResponse = data.data;
                dataResponse.forEach(el => el.date = new Date(el.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    year: '2-digit',
                    month: 'numeric'
                }));
                drawChart(dataResponse, canvasElem)
                canvasContainer.appendChild(canvasElem);
                document.getElementById(id).firstElementChild.appendChild(canvasContainer);
            })
            .catch(err => {
                //DONE
                if (err.response.status === 404)
                    document.getElementById(id).firstElementChild.innerHTML = '<span class="text-center p-0">No valuations found...</span>'
                else {
                    console.error(err);
                    this.disabled = false
                    throw new Error('Error occurred during \'/get_valuations_of_player\' GET');
                }
            });


        showChargingSpinner(null, false);
    }
    this.disabled = false
}

/**
 * Function called to generate the internal info block of the Last Games accordion.
 *
 * @param id {string} The **id** used as id of the accordion button
 * @throws TypeError If id is null or undefined.
 * @throws Error If GET route fails. */
async function openAccordionClubLastGames(id) {
    if (!id) {
        console.error(id);
        throw new TypeError('Invalid argument passed to \'openAccordionClubLastGames\'!');
    }

    console.log('id', id);
    const club_id = id.slice(id.indexOf('_') + 1);

    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);
        await makeAxiosGet('/single_page/get_last_games_by_club/' + club_id)
            .then(data => {
                let dataResponse = data.data;

                let unList = document.createElement('ul');
                unList.classList.add('nav', 'flex-column');

                let alternatorCounter = 0;

                dataResponse.forEach(el => {
                    createDynamicListItem(window, 'game', dataResponse.length, unList, {
                        counter: alternatorCounter++,
                        data: el
                    }, {type: 'game', id: String(el.gameId)});
                })

                if (dataResponse.length > 20) {
                    createLoadMoreElement(unList, 'gamesId', showMore.bind(null, unList, 20));
                }

                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                //DONE
                if (err.response.status === 404)
                    document.getElementById(id).firstElementChild.innerHTML = '<span class="text-center p-0">No games found.</span>';
                else {
                    console.error(err);
                    throw new Error('Error occurred during \'/get_last_games_by_club\' GET');
                }
            });

        showChargingSpinner(null, false);
    }
}

/**
 * Function called to generate the internal info block of the Appearances accordion.
 *
 * @param id {string} The **id** used as id of the accordion button.
 * @throws TypeError If id is null or undefined.
 * @throws Error If GET route fails. */
async function openAccordionPlayerAppearances(id) {
    this.disabled = true
    if (!id) {
        console.error(id);
        this.disabled = false
        throw new TypeError('Invalid argument passed to \'openAccordionPlayerAppearances\'!');
    }

    const player_id = id.slice(id.indexOf('_') + 1);

    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true);

        await makeAxiosGet('/single_page/get_last_appearances/' + player_id)
            .then(async data => {
                let dataResponse = data.data;
                let unList = document.createElement('ul');
                unList.classList.add('nav', 'flex-column');

                let alternatorCounter = 0;
                for (const el of dataResponse) {
                    await makeAxiosGet(`/single_page/get_visualize_game_by_id/${el.game_id}`)
                        .then(visGame => {
                            let response = visGame.data;
                            let resKey = Object.keys(el);

                            for (let key of resKey) {
                                const transformedKey = castCamelCaseToSneakCase(key)
                                if (!response[transformedKey])
                                    response[transformedKey] = el[key];
                            }

                            createDynamicListItem(window, 'appearance', dataResponse.length, unList, {
                                counter: alternatorCounter++,
                                data: response
                            }, {type: 'game', id: String(el.game_id)});
                        })
                        .catch(err => {
                            //DONE
                            console.error(err);
                        })
                }

                if (dataResponse.length > 20)
                    createLoadMoreElement(unList, 'gamesId', showMore.bind(null, unList, 20));

                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                //DONE
                if (err.response.status === 404)
                    document.getElementById(id).firstElementChild.innerHTML = '<span class="text-center p-0">No appearances found...</span>';
                else {
                    console.error(err);
                    this.disabled = false
                    throw new Error('Error occurred during \'/get_last_appearance\' GET');
                }
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
                    x: {display: true},
                    y: {
                        display: true,
                        beginAtZero: true,
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value, index, ticks) {
                                if (value > 500000)
                                    return value / 1000000 + " M"
                                else if (value >= 1000)
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

/** function used when we want to cast camelCase format of attributes to sneak_case.
 * @param str {string} the string to transform. */
function castCamelCaseToSneakCase(str) {
    return str.split(/(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
}

/** It creates and appends a paragraph {@link Element} to the given spot (fatherElem).
 * @param fatherElem {HTMLElement} the {@link Document} element to which append the paragraph created.
 * @param condition {boolean} the condition whether to insert the value or "N/A" instead.
 * @param labelText {string} the string text of the label, an empty string can be passed to it.
 * @param value {any} it can be anything. MAKE SURE any "0" value number is passed as a **string**.
 * @param classList {...string[]} the **vararg (array)** of strings representing the class list to append to the element created.
 * @throws TypeError if fatherElem, value or classList are null or undefined. */
function createParagraphForSP(fatherElem, condition, labelText, value, ...classList) {
    if (!fatherElem || !classList)
        throw new TypeError('Invalid argument(s) for \'createParagraphForSP\' function!')
    let parElem = document.createElement('p')
    parElem.classList.add(...classList);
    const label = (!labelText) ? '' : '<b>' + labelText + ':</b> ';
    parElem.innerHTML = (condition) ? label + value : label + 'N/A';
    fatherElem.appendChild(parElem);
}
