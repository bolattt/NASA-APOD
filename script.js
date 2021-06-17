// NASA API 
const apiKey = 'DEMO_KEY';
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];

// Get 10 Images from NASA API 
async function getNasaPicutres(){
    try{
        const response = await fetch(apiUrl)
        resultsArray = response.json();
        console.log(resultsArray)
    }catch(err){
        console.log(err)
    }
}

getNasaPicutres();