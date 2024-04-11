function searchPlayer(event) {
    document.getElementById('submitPlayerForm').disabled = true;
    let formData = extractFormData("searchPlayer");
    let player = formData.player ? formData.player : false;
    if (player) {
        axios.get(`/get_players_by_name/${player}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(data => {
                console.log(data);
                let dataResponse = Array(data.data)[0];
                console.log(JSON.stringify(dataResponse));
                document.getElementsByClassName('body-bg').item(0).style.background = 'none';
                document.getElementById('form-div').classList.add('d-none');
                let elements = document.getElementsByClassName('player-search-hide');
                for (let i = 0; i < elements.length; i++) {
                    elements.item(i).classList.remove('d-none');
                }
                document.getElementById('playersList').classList.remove('d-none');
                document.getElementById('playerContentFlex').classList.remove('align-items-center');
                document.getElementById('playerContentFlex').classList.remove('justify-content-center');
                document.getElementById('playerContentFlex').classList.add('col-lg-9');
                const cardContainer = document.getElementById('cardContainer');
                dataResponse.forEach((player) => {
                    const cardElement = document.createElement('div');
                    cardElement.classList.add('mb-3');

                    cardElement.innerHTML = '<div class="card">' +
                        '<img src="'+player.imageUrl+'" class="card-img-top" alt="immagine">' +
                        '                            <div class="card-body">' +
                        '                                <h5 class="card-title">'+player.playerName+'</h5>' +
                        '                                <a href="#" class="btn btn-primary">See profile</a>' +
                        '                            </div>' +
                        '                        </div>';
                    cardContainer.appendChild(cardElement);
                })
            })
            .catch(err => console.log(err));
    }
    event.preventDefault();
    document.getElementById('submitPlayerForm').disabled = false;
}

function extractFormData(formId) {
    let formElements = document.getElementById(formId).children;
    let formData = {};
    for (let ix = 0; ix < formElements.length; ix++) {
        if (formElements[ix].name) {
            formData[formElements[ix].name] = formElements[ix].value;
        }
    }
    return formData;
}