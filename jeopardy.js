

const width = 6;
const height = 6;
let categories = [];
let start = []
let questionBoard = [];
let answerBoard = [];


//get 30API, shuffle, return 6 category IDs
async function getCategoryIds() {
    let categories = [];
    //call a number of categories
    let res = await axios.get("http://jservice.io//api/categories?count=100")
    // console.log(res.data)

    //create an array containing the id of the categories
    res.data.map(function (val) {
        categories.push(val.id)
    })
        //randomly pick 6 IDs in a new array (use Fisher-Yates Shuffle)
        for (var i = categories.length - 1; i > 0; i--){
            const swapIndex = Math.floor(Math.random() * i )
            const currentIdx = categories[i];
            const IdxtoSwap = categories[swapIndex]
            categories[i] = IdxtoSwap;
            categories[swapIndex] = currentIdx
        }
        
        let categoryIDs = categories.slice(0, 6)
        return categoryIDs
}


//return data about a category 
async function getCategory(results) {
    categories = []
    console.log(`results from getCategory ${results}`)
    for (let result of results) {
        let res = await axios.get(`http://jservice.io/api/category/?id=${result}`)
        let { clues, title} = res.data
            let cluesArr = [];
            for (let clue of clues) {
                let { question, answer} = clue;
                cluesArr.push({question, answer})
            }
        categories.push({title, clues: cluesArr})
    }
    return categories
}

//Use jquery to create elements for table
let $div = $(document.createElement('div')).addClass('gameBoard')
let $h1 = $(document.createElement('h1')).text('Jeopardy')
$div.append($h1)

let $table = $(document.createElement('table'))
let $category = $(document.createElement('thead'))
let $category_tr = $(document.createElement('tr'))
let $category_td = $(document.createElement('td'))

$('body').append($div)

//fill the table with cells and '?' for each cell
//make starter array with same '?' values 
async function makeTable() {
    $('.gameBoard').append($table)
    
    // The <thead> should be filled w/a <tr>, and a <td> for each category
    $table.append($category)
    $category.append($category_tr)

    let $body = $(document.createElement('tbody'))
    $table.append($body)

    // make category row 
    for (let y = 0; y < width; y++) {
        let $category_td = $(document.createElement('td'))
        $category_td.addClass(`category C-${y}`).text('Category')
        $category_tr.append($category_td)
    }
    
        //make # of <tr> equal to height -1 for the body  
        for (let y = 0; y < height - 1; y++) {
        let $body_tr = $(document.createElement('tr'))
            $body.append($body_tr)
            //make empty array for every 'category' 
            start.push([])

        //make # of cell equal to the # of questions/ category
        for (let x = 0; x < width; x++) {
            let $body_td = $(document.createElement('td'))
            $body_tr.append($body_td)
            $body_td.attr("id",`${x}-${y}`)
            $body_td.text('?')
            //push a '?' for every cell there is for each caftegory
            start[y].push('?')
        }
    }
}

//fill category with actual names from API data
function fillCategories(categories) {
    for (let y = 0; y < width; y++) {
        let category = $(`.C-${y}`)
        category.text(`${categories[y].title}`)
    }
}

makeTable()   
//creates button for New Category
let $btnDiv = $(document.createElement('div')).addClass('button')
$btn = $('<button>Get Categories</button>')
$div.append($btnDiv)
$btnDiv.append($btn)

// //make reset button
// let $resetDiv = $(document.createElement('div')).addClass('restart')
// $resetBtn = $('<button>Restart</button>')
// $div.append($resetDiv)
// $resetDiv.append($resetBtn)

//click creates new categories upon button click
$btn.on('click', async function getResults(evt) {
    
    $btn.text('Restart!')

    let results = await getCategoryIds();
    categories = await getCategory(results)
    
    fillCategories(categories)
    fillData(categories)

    
    $('tbody td').text('?')
})

//render data into an array of questions and answers separately 
async function fillData(categories) {
    console.log(categories)
    questionBoard = [];
    answerBoard = [];
    //get the clues of all categories. cut down to 5 clues only
    let data = categories.map(function (val) {      
        return val.clues.splice(0,5)
    })

    //fill questionBoard & answerBoard with respective Q & A data 
    async function QA_data(data) {
        for (let i = 0; i <= height - 1; i++) {
            questionBoard.push([])
            answerBoard.push([])
            for (let j = 0; j < width ; j++) {
                let { question } = data[i][j] || {}
                let { answer } = data[i][j] || {}
                answerBoard[i].push(answer)
                questionBoard[i].push(question)
            }
        }    
    }
    QA_data(data)
    }
 

//implement click event on <td> 
let $td = $('tbody td')
$td.on('click', function (evt) {
    
    //set cell index for x & y
    let y = (this.parentNode.rowIndex) - 1
    let x = (this.cellIndex)
    
    //if clicked on ? then append question
    if (evt.target.innerText === '?') {
        evt.target.innerHTML = `${questionBoard[x][y]}`
    } else {
        //if targeted <td> is not a '?' then append answer
        evt.target.innerHTML = `${answerBoard[x][y]}`
    }

})


/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {

    
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

