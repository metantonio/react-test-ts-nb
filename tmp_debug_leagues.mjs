const USA_QID = 'Q30';
const BASKETBALL_QID = 'Q5372';

async function findLeagues() {
    const sparql = `
    SELECT DISTINCT ?item ?itemLabel ?p ?pLabel ?o ?oLabel WHERE {
      ?item wdt:P641 wd:${BASKETBALL_QID} ;
            wdt:P17  wd:${USA_QID} ;
            wdt:P31/wdt:P279* wd:Q15089 .
      ?item rdfs:label ?itemLabel .
      FILTER(LANG(?itemLabel) = "en")
      ?item p:P31 ?statement .
      ?statement ps:P31 ?o .
      ?o rdfs:label ?oLabel .
      FILTER(LANG(?oLabel) = "en")
    } LIMIT 20`;

    const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(sparql) + '&format=json';
    const res = await fetch(url, { headers: { 'Accept': 'application/sparql-results+json', 'User-Agent': 'SportVizion/1.1' } });
    const data = await res.json();
    const results = data.results.bindings;

    console.log(`Leagues with types found: ${results.length}`);
    results.forEach(b => {
        console.log(`- League: ${b.itemLabel.value} (${b.item.value.split('/').pop()}) Type: ${b.oLabel.value}`);
    });
}

findLeagues();
