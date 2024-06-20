let flags;

/** Called by the clubs.html page. */
async function initClubs() {
    initChat()
    await getAllFlags()
        .then(res => {
            flags = res;
        })
        .catch(err => console.error(err))
    flags.forEach((value, key) => {
        createAccordion('club_nation', 'clubAccordion', {local_competition_code: key});
    })
    document.getElementById('submitClubForm').addEventListener('click', searchClubs);
}

/**Function to get the URL to retrieve a nation flag image with a specified **competition code**
 *
 * @param localCompetitionCode The code that identifies a competition nation*/
function getFlagOf(localCompetitionCode) {
    return flags.get(localCompetitionCode).flagURL;
}

/**Function to retrieve the name of a country with a specified **competition code**
 *
 * @param localCompetitionCode The code that identifies a competition nation*/
function getNationNameOf(localCompetitionCode) {
    return flags.get(localCompetitionCode).countryName;
}

/** Function that sends a SPRINGBOOT GET to retrieve the data about clubs of a localCompetitionCode.
 * @param id {string} is the localCompetitionCode used as ID of the accordion button.
 * @throws Error if catch case of the axios GET occurs. */
async function openAccordionClubs(id) {
    if (document.getElementById(id).firstElementChild.children.length === 0) {
        showChargingSpinner(null, true)
        await makeAxiosGet(`/clubs/get_clubs_by_local_competition_code/${id}`)
            .then(data => {
                let dataResponse = data.data;
                dataResponse.sort((st, nd) => {
                    return String(st.clubName).localeCompare(String(nd.clubName))
                });
                let dataList = new Map();
                for (let i in dataResponse) {
                    dataList.set(dataResponse[i].clubId, String(dataResponse[i].clubName));
                }
                let unList = document.createElement('ul');
                unList.classList.add('nav', 'flex-column');
                let alternatorCounter = 0;
                dataList.forEach((value, key) => {
                    createDynamicListItem(window, 'club', dataList.size, unList,
                        {counter: alternatorCounter++, data: {id: key, text: value}},
                        {type: 'club', id: String(key)});
                });
                // Adding the 'load more...' element
                if (dataList.size > 30)
                    createLoadMoreElement(unList, id, showMore.bind(null, unList, 30));
                document.getElementById(id).firstElementChild.appendChild(unList);
            })
            .catch(err => {
                //DONE
                if (err.response.status === 404)
                    document.getElementById(id).firstElementChild.innerHTML = '<span class="text-center p-1 d-block mx-auto">No Clubs found...</span>'
                else {
                    console.error(err);
                    throw new Error('Error occurred during \'/clubs_by_local_competition_code\' GET');
                }
            })
        showChargingSpinner(null, false)
    }
}

/** It sends a GET extracting the form data and retrieving a club list as an {@link array}.
 *
 * @param event - event fired when the form is submitted.
 * */
function searchClubs(event) {
    document.getElementById('submitClubForm').disabled = true;
    let formData = extractFormData('searchClub', false);
    let club = formData.searchBar;
    if (club && club.length > 2) {
        axios.get(`/clubs/get_clubs_by_string/${club}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(data => {
                let dataResponse = data.data;
                dataResponse.sort((st, nd) => {
                    return String(st.clubName).localeCompare(String(nd.clubName))
                });
                let dataList = new Map();
                for (let i in dataResponse) {
                    dataList.set(dataResponse[i].clubId, {
                        'clubName': String(dataResponse[i].clubName),
                        'domesticLeagueCode': dataResponse[i].domesticLeagueCode
                    });
                }
                document.getElementById('clubAccordion').classList.add('d-none');

                let unList = document.getElementById('clubResults');
                unList.replaceChildren();
                unList.classList.add('nav', 'px-2', 'flex-column');
                unList.classList.remove('d-none');
                let elementCounter = 0;
                dataList.forEach((value, key) => {
                    createDynamicListItem(window, 'club', dataList.size, unList, {
                            counter: elementCounter++, data: {id: key, text: value.clubName}
                        },
                        {type: 'club', id: String(key)});
                })
                // Adding the 'load more...' element
                if (dataList.size > 30)
                    createLoadMoreElement(unList, unList.id, showMore.bind(null, unList, 30));
            })
            .catch(err => {
                showModalMessage(true, 'club');
            })
    } else {
        if (!club) {
            location.reload();
        } else
            showModalMessage(false, 'club');
    }
    event.preventDefault();
    document.getElementById('submitClubForm').disabled = false;
}