/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }


 */

const missing ='https://tinyurl.com/tv-missing'

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`
)
  
const inform = res.data.map(el => {
  let show = el.show
  return  {
        id: `${show.id}`,
        name: `${show.name}`,
        summary: `${show.summary}`,
        image: show.image ? show.image.medium : missing
    }

})
return inform;
  // const img = show.image.original
  // return [
  //   {
  //     id: `${res.data.id}`,
  //     name: `${res.data.name}`,
  //     summary: `${res.data.summary}`,
  //     image: img ? img : missing
  //   }
  // ]
  }



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
console.log(shows)
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id = "epBtn"> Episodes </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {

  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

console.log(response)

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));

  return episodes;
}

function populateEpisodes(episodes){
let list = document.querySelector('#episodes-list')
list.innerHTML = ''

for(let episode of episodes){
  const li = document.createElement('li')
  li.innerHTML = `${episode.name} (season${episode.season},number${episode.number})`
  list.append(li)
}
const area = document.querySelector('#episodes-area')
area.style.display = 'block'
}

$('#shows-list').on('click','#epBtn', async function(evt){
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episode = await getEpisodes(showId)
  populateEpisodes(episode)
})