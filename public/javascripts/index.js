
/** Called by the index.html page. */
function initHome() {
    // @todo initialize the GUI
    // Calling homepage routes
    commonInitOfPage();
}

function initPlayers(){
    commonInitOfPage();
    document.getElementById('submitPlayerForm').onclick = searchPlayer;
}

/* -------- End of init()s -------- */

/** Function called by the **main** *"init"* functions to set common attributes and features. */
function commonInitOfPage() {
    // @todo: check if can still be useful
}

/** This function assigns **ALL** the *'onclick'* attributes in the page. */
function addBtnFunctions() {
    // @todo: fill with index buttons
}

/** This is an EXPRESS GET function:
 * @returns {Promise} a promise from the Axios GET.
 * The promise will return a {@link Map} to take trace of flags and nations.
 * @throws TypeError if the Axios GET fails. */
async function getAllFlags() {
    return axios.get('/get_flags')
        .then(data => {
            const dataR = Array(data.data)[0];
            let flagList = new Map();
            for(let i in dataR){
                flagList.set(dataR[i].domestic_league_code, {
                    'countryName': String(dataR[i].country_name),
                    'flagURL': String(dataR[i].flag_url)
                });
            }
            return flagList;
        })
        .catch(err => {
            console.log(err);
            throw new TypeError('Error occurred during \'flags\' GET');
        })
}

function getClubById(id) {
    // @todo maybe insert a spinning element
    console.log('Club called with id: ', id);
}

function extractFormData(formId) {
    let formElements = document.getElementById(formId).children;
    let formData={};
    for (let ix = 0; ix < formElements.length; ix++) {
        if (formElements[ix].name) {
            formData[formElements[ix].name] = formElements[ix].type === 'checkbox' ? formElements[ix].checked :  formElements[ix].value;
        }
    }
    return formData;
}

/** This function displays a **modal** to give a feedback of an unsuccessful search.
 * @param unfounded {boolean} If set to `true`, this method will return a message of _**unfounded content**_,
 * otherwise it will display a message of _**too few letters**_ in the input string. */
function showModalMessage(unfounded) {
    if(unfounded) {
        document.getElementById('unfoundedModalLabel').innerText = 'No Player Found';
        document.getElementById('modal-body').innerHTML =
            'The search has found <b>0 players</b>. Please, check the syntax and retry.';
    } else {
        document.getElementById('unfoundedModalLabel').innerText = 'Invalid Input';
        document.getElementById('modal-body').innerHTML =
            'At least <b>3 letters</b> are required for a search.';
    }
    document.getElementById('unfoundedModalTrigger').click();
}
