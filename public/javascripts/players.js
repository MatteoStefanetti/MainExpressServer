function searchPlayer(event) {
    document.getElementById('submitPlayerForm').disabled = true;
    let formData = extractFormData("searchPlayer");
    let player = formData.player ? formData.player : false;
    if (player) {
        axios.get(`/get_players_by_name/${player}`, {
            headers: {'Content-Type': 'application/json'},
            method: 'get'
        })
            .then(data => console.log(data))
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