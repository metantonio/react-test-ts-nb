async function checkLeagues() {
    const sparql = `
    SELECT ?item ?itemLabel ?country ?countryLabel WHERE {
      ?item wdt:P31/wdt:P279* wd:Q6230 .
      OPTIONAL { ?item wdt:P17 ?country . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    } LIMIT 20`;

    const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(sparql) + '&format=json';
    const res = await fetch(url, { headers: { 'Accept': 'application/sparql-results+json', 'User-Agent': 'SportVizion/1.1' } });
    const data = await res.json();
    const results = data.results.bindings;

    console.log(`Leagues globally:`);
    results.forEach(b => {
        console.log(`- ${b.itemLabel.value} (${b.item.value.split('/').pop()}) Country: ${b.countryLabel?.value || 'None'}`);
    });
}

checkLeagues();
