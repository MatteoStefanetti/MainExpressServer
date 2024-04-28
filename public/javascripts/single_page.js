const urlParams = new URLSearchParams(window.location.search);
const typeParams = urlParams.get('type');
const idParams = urlParams.get('id');


function initSinglePage() {
    commonInitOfPage();
    switch (typeParams) {
        case 'player':
            if (idParams) {
                axios.get(`/get_players_by_id/${idParams}`, {
                    headers: {'Content-Type': 'application/json'},
                    method: 'get'
                })
                    .then(data => {
                        console.log(data.data);
                        //TODO: build the rest of the page using the data retrieved
                    })
                    .catch(err => console.log(err));
            }
            break;
        case 'club':
            if (idParams) {
                axios.get(`/clubs/get_club_by_id/${idParams}`, {
                    headers: {'Content-Type': 'application/json'},
                    method: 'get'
                })
                    .then(data => {
                        console.log(data.data);
                        //TODO: build the rest of the page using the data retrieved
                    })
                    .catch(err => console.log(err));
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