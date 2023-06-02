const API_KEY = 'b12229ad-6c43-4ed9-983e-6f37c214c2df'
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api'
const API_URL_POPULAR = BASE_URL + '/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page='
const API_URL_SEARCH = BASE_URL + '/v2.1/films/search-by-keyword?keyword='
const API_DETAILS = BASE_URL + '/v2.2/films/'
const SIMILARS = '/similars'


const output = document.querySelector('.output')
const paginationWrap = document.querySelector('.paginationWrap')
const form = document.querySelector('form')
const input = document.querySelector('input')


//states
let activeBtn = 1
let state = ''
let stranitsa
//states

form.addEventListener('submit', (e) => {
    e.preventDefault()
    valueState = input.value
    getMovies(API_URL_SEARCH + input.value)
})

const conditionalRenderOfPagination = (pagesCount) => {
    const limit = 20
    if (pagesCount === 1) {
        paginationWrap.innerHTML = ''
    } else if (pagesCount <= limit) {
        pagination(pagesCount)
    } else {
        pagination(limit)
    }
}


const getMovies = async (url) => {
    try {
        const request = await fetch(url, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const response = await request.json()
        console.log(response);
        renderMovies(response.films);
        
        pagination(response.pagesCount)
    } catch (e) {
        console.log(e)
    }
}
getMovies(API_URL_POPULAR)


const renderMovies = (data) => {
    output.innerHTML = ''
    data.forEach(el => {
        const result = el.genres.map(el => {
            return el.genre
        })
        const res = result.join(' ')
        
        const div = document.createElement('div')
        div.className = 'film'
        const krug = document.createElement('div')
        krug.className = 'krug'
        const img = document.createElement('img')
        const text = document.createElement('h6')
        text.className = 'janr'
        const name = document.createElement('p')
        text.textContent = res
        name.textContent = el.nameRu
        img.src = el.posterUrl
        krug.append()
        div.append(img, name, text)
        output.append(div)
        div.addEventListener('click', () => {
            output.innerHTML = ''
            getDetails(el.filmId)
        })
    })

}

const pagination = (num) => {
    paginationWrap.innerHTML = ''
    const paginationNumbers = []
    for (let i = 1; i <= num; i++) {
        paginationNumbers.push(i)
    }
    paginationNumbers.forEach(el => {
        const button = document.createElement('button')
        button.className = el === activeBtn ? 'active' : ''
        button.textContent = el
        button.addEventListener('click', () => {

            activeBtn = el


            state ? getMovies(API_URL_SEARCH + state + '&page=' + el)
                : getMovies(API_URL_POPULAR + el)
        })
        paginationWrap.append(button)
    })

}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    state = input.value

    getMovies(API_URL_SEARCH + input.value)
})

const getDetails = async (id) => {
    try {
        const request = await fetch(API_DETAILS + id, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const response = await request.json()
        console.log(id);
        console.log(response);
        renderDetails(response.description, response.posterUrl)



    } catch (e) {
        console.log(e)
    }
}

const renderDetails = (text, image) => {
    const p = document.createElement('p')
    const img = document.createElement('img')
    const btn = document.createElement('button')
    const tops = document.createElement('button')

    tops.className = 'tops'
    btn.className = 'btn'
    img.className = 'image'

    btn.textContent = 'back'
    img.src = image
    p.textContent = text
    

    btn.addEventListener('click', () => {
        if (input.value) {
            getMovies(API_URL_SEARCH + input.value + '&page=' +activeBtn);
          } else {
            getMovies(API_URL_POPULAR + activeBtn);
          }
    })


    output.append(p, img, btn)
}


