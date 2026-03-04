async function checkNBACountry() {
    const sparql = `
    SELECT ?p ?pLabel ?o ?oLabel WHERE {
      wd:Q191331 ?p ?o .
      FILTER(?p = wdt:P17 || ?p = wdt:P495 || ?p = wdt:P1532)
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }`;

    const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(sparql) + '&format=json';
    const res = await fetch(url, { headers: { 'Accept': 'application/sparql-results+json', 'User-Agent': 'SportVizion/1.1' } });
    const data = await res.json();
    const results = data.results.bindings;

    console.log(`NBA (Q191331) Country Properties:`);
    results.forEach(b => {
        console.log(`- ${b.pLabel.value} (${b.p.value}) -> ${b.oLabel.value} (${b.o.value})`);
    });
}

checkNBACountry();
