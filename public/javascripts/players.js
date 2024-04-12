
/** Function used to generate and display players,
 * triggered when the **searchBar** is used in the _player.html_ page. */
function searchPlayer(event) {
    document.getElementById('submitPlayerForm').disabled = true;
    document.getElementById('chatPage').classList.add('d-md-flex');
    let formData = extractFormData("searchPlayer");
    let player = formData.player ? formData.player : false;
    if (player) {
        axios.get(`/get_players_by_name/${player}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(data => {
                let dataResponse = Array(data.data)[0];
                document.getElementsByClassName('body-bg').item(0).style.background = 'none';
                document.getElementById('form-div').classList.add('d-none');
                let contentDiv = document.getElementById('playerContentFlex');
                contentDiv.classList.add('col-lg-9');
                contentDiv.classList.remove('align-items-center');
                let playerList = document.getElementById('playersList')
                playerList.parentElement.classList.remove('d-none');
                dataResponse.forEach((player) => {
                    const playerContainer = document.createElement('div');
                    playerContainer.classList.add('col-8', 'col-6', 'col-sm-3', 'col-md-2', 'justify-content-center',
                        'align-items-center', 'mb-4');
                    let clickableContent = document.createElement('a');
                    clickableContent.href = 'single_page/player/' + String(player.playerId);
                    clickableContent.classList.add('text-dark');
                    clickableContent.innerHTML =
                        '<img src="'+player.imageUrl+'" class="img-fluid d-block border border-5 ' +
                            'border-darkgreen rounded-4 player-img-size" alt="image not found"/>' +
                        '<div class="d-flex justify-content-center align-items-center w-100 my-2 p-0">' +
                        '   <span class="h6 text-center p-0">' + player.playerName + '</span>' +
                        '</div>';
                    playerContainer.appendChild(clickableContent);
                    playerList.appendChild(playerContainer);
                })
            })
            .catch(err => console.log(err));
    }
    event.preventDefault();
    document.getElementById('submitPlayerForm').disabled = false;
}
