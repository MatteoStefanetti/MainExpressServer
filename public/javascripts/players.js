/** Function used to generate and display players,
 * triggered when the **searchBar** is used in the _player.html_ page. */
function searchPlayer(event) {
    document.getElementById('submitPlayerForm').disabled = true;
    let formData = extractFormData("searchPlayer");
    let player = formData.searchBar;
    if (player) {
        axios.get(`/get_players_by_name/${player}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(data => {
                let dataResponse = Array(data.data)[0];
                let index = 0;
                let playerList = document.getElementById('playersList')
                if (playerList.parentElement.classList.contains('d-none')) {
                    document.body.classList.remove('body-bg');
                    playerList.parentElement.classList.remove('d-none');
                    changePlayersFormPosition();
                    document.getElementById('chatPage').classList.add('d-lg-flex');
                }
                playerList.replaceChildren();
                dataResponse.forEach((player) => {
                    const playerContainer = document.createElement('div');
                    playerContainer.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-xxl-2', 'justify-content-center',
                        'align-items-center', 'mb-4', 'px-1');
                    let clickableContent = document.createElement('a');
                    index++;
                    clickableContent.href = 'single_page/player/' + String(player.playerId);
                    clickableContent.classList.add('text-dark');
                    clickableContent.innerHTML =
                        '<img src="' + player.imageUrl + '" class="img-fluid d-block border border-5 ' +
                        'border-darkgreen rounded-4 player-img-size" alt="image not found"/>' +
                        '<div class="d-flex justify-content-center align-items-center w-100 my-2 p-0">' +
                        '   <span class="h6 text-center p-0">' + player.playerName + '</span>' +
                        '</div>';
                    playerContainer.appendChild(clickableContent);
                    playerList.appendChild(playerContainer);
                    if (index > 24) {
                        playerContainer.classList.add('d-none');
                    }
                })
                createLoadMoreElement(playerList, showMore.bind(null, playerList));
            })
            .catch(err => {
                showUnfoundedMessage();
            });
    } else {
        showUnfoundedMessage();
    }
    event.preventDefault();
    document.getElementById('submitPlayerForm').disabled = false;
}

function createLoadMoreElement(playerList, loadMoreFunction) {
    //TODO: make the looking of the button good for the website
    let loadMoreDiv = document.createElement("div");
    let loadMoreButton = document.createElement('a');
    //loadMoreButton.classList.add('button');
    loadMoreDiv.id = 'loadMoreDiv';
    loadMoreDiv.classList.add('col-12', 'd-flex', 'justify-content-center', 'mb-2');
    loadMoreButton.innerText = 'Load more...';
    loadMoreButton.onmouseover = function () {
        loadMoreButton.style.textDecoration = 'underline';
        loadMoreButton.classList.add('text-darkgreen');
    }
    loadMoreButton.onmouseout = function (){
        loadMoreButton.style.textDecoration = 'none';
        loadMoreButton.classList.remove('text-darkgreen');
    }
    loadMoreDiv.appendChild(loadMoreButton);
    playerList.appendChild(loadMoreDiv);
    loadMoreButton.addEventListener('click', loadMoreFunction);
}


function showMore(listContainer) {
    let index = 0;
    let children = listContainer.querySelectorAll('*');

    for (let i = 0; index < 24 && i < children.length; i++) {
        let card = children[i];

        if (card.classList.contains('d-none')) {
            card.classList.remove('d-none');
            index++;
        }
    }

    if (areAllVisible(children)) {
        document.getElementById('loadMoreDiv').classList.add('d-none');
    }
}

function changePlayersFormPosition() {
    document.getElementById('formDiv').remove();
    let contentDiv = document.getElementById('playerContentFlex');
    contentDiv.classList.remove('align-items-center', 'd-flex');
    contentDiv.classList.add('col-lg-9');
    createPlayersForm();
}

function areAllVisible(children){
    for (let i = 0; i < children.length; i++){
        let card = children[i];
        if (card.classList.contains('d-none')){
            return false;
        }
    }
    return true;
}
/** The following code will be generated:
 * ```
 * <div class="d-block d-sm-flex position-sticky top-form-container pt-md-3 mb-md-1">
 *    <p class="h4 fw-bold p-0 ps-md-2 mb-2 mb-sm-0 me-3 text-center">Players</p>
 *    <hr class="d-none d-sm-flex bg-light opacity-75 me-3 vertical-separator">
 *    <form class="form d-flex justify-content-start align-items-center ms-3 ms-sm-0" id="searchPlayer">
 *        <label for="searchBar" class="d-none" aria-hidden="true">search</label>
 *        <input type="text" name="searchBar" id="searchBar" class="form-control rounded-4 w-75 py-1 px-2
 *          fst-italic" placeholder="Search a player..."/>
 *        <button type="submit" class="ms-2 btn rounded-circle btn-search" id="submitPlayerForm">
 *            <span class="bi bi-search text-lightgreen fs-5"></span>
 *        </button>
 *    </form>
 *</div>
 * ```
 * */
function createPlayersForm() {
    let formOnTopContainer = document.createElement('div');
    formOnTopContainer.classList.add('d-block', 'd-sm-flex', 'position-sticky', 'top-form-container',
        'pt-md-3', 'mb-md-1');
    let playersHeader = document.createElement('p');
    playersHeader.classList.add('h4', 'fw-bold', 'p-0', 'ps-md-2', 'mb-2', 'mb-sm-0', 'me-3', 'text-center');
    playersHeader.innerText = 'Players';
    formOnTopContainer.appendChild(playersHeader);
    let verticalSeparator = document.createElement('hr');
    verticalSeparator.classList.add('d-none', 'd-sm-flex', 'bg-light', 'opacity-75', 'me-3', 'vertical-separator');
    formOnTopContainer.appendChild(verticalSeparator);
    let form = document.createElement('form');
    form.classList.add('form', 'd-flex', 'justify-content-start', 'align-items-center', 'ms-3', 'ms-sm-0');
    form.id = 'searchPlayer';
    form.innerHTML =
        '<label for="searchBar" class="d-none" aria-hidden="true">search</label> ' +
        '   <input type="text" name="searchBar" id="searchBar" class="form-control rounded-4 w-75 py-1 ' +
        'px-2 fst-italic" placeholder="Search a player..."/> ' +
        '<button type="submit" class="ms-2 btn rounded-circle btn-search" id="submitPlayerForm"> ' +
        '   <span class="bi bi-search text-lightgreen fs-5"></span> ' +
        '</button>';
    formOnTopContainer.appendChild(form);
    let container = document.getElementById('playerContentFlex');
    container.insertBefore(formOnTopContainer, container.firstChild);
    container.classList.add('mx-md-4', 'px-md-4');
    document.getElementById('submitPlayerForm').addEventListener('click', searchPlayer);
}
