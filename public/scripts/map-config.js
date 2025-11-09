const map = L.map('map').setView([-14.235, -51.9253], 4);
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const regionColors = {
  "Norte": "#3CBC00",
  "Nordeste": "#266EFF",
  "Centro-Oeste": "#FFD901",
  "Sudeste": "#F5660B",
  "Sul": "#B90504"
};

const regionMap = {
  "Roraima": "Norte",
  "Amapá": "Norte",
  "Pará": "Norte",
  "Amazonas": "Norte",
  "Acre": "Norte",
  "Rondônia": "Norte",
  "Tocantins": "Norte",

  "Maranhão": "Nordeste",
  "Piauí": "Nordeste",
  "Ceará": "Nordeste",
  "Rio Grande do Norte": "Nordeste",
  "Paraíba": "Nordeste",
  "Pernambuco": "Nordeste",
  "Alagoas": "Nordeste",
  "Sergipe": "Nordeste",
  "Bahia": "Nordeste",

  "Distrito Federal": "Centro-Oeste",
  "Mato Grosso": "Centro-Oeste",
  "Goiás": "Centro-Oeste",
  "Mato Grosso do Sul": "Centro-Oeste",

  "Minas Gerais": "Sudeste",
  "São Paulo": "Sudeste",
  "Espírito Santo": "Sudeste",
  "Rio de Janeiro": "Sudeste",

  "Paraná": "Sul",
  "Santa Catarina": "Sul",
  "Rio Grande do Sul": "Sul"
};


function style(feature) {
  const estado = feature.properties.name;
  const regiao = regionMap[estado];
  const fillColor = regionColors[regiao] || "#ccc";
  return {
    fillColor,
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7
  };
}

// ====== EVENTOS DE INTERAÇÃO ======
function highlightFeature(e) {
  const layer = e.target;
  const estado = layer.feature.properties.name;
  const regiao = regionMap[estado];
  const hoverColors = {
    "Norte": "#2B8800",
    "Nordeste": "#163978",
    "Centro-Oeste": "#947F01",
    "Sudeste": "#9C430B",
    "Sul": "#820504"
  };
  layer.setStyle({
    weight: 2,
    color: "#000",
    fillColor: hoverColors[regiao] || "#999",
    fillOpacity: 0.9
  });
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
  layer.bindTooltip(feature.properties.name, { permanent: false });
}

// ====== GEOJSON DO BRASIL ======
fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson')
  .then(res => res.json())
  .then(data => {
    geojson = L.geoJson(data, {
      style,
      onEachFeature
    }).addTo(map);
  });

// ====== UNIVERSIDADES ======
const universidades = [
  // NORDESTE
  { nome: "UFMA - Universidade Federal do Maranhão", coords: [-2.55, -44.30], estado: "Maranhão" },
  { nome: "UFPI - Universidade Federal do Piauí", coords: [-5.09, -42.81], estado: "Piauí" },
  { nome: "UFDPar - Universidade do Delta do Parnaíba", coords: [-2.91, -41.77], estado: "Piauí" },
  { nome: "UFC - Universidade Federal do Ceará", coords: [-3.74, -38.54], estado: "Ceará" },
  { nome: "UFCA - Universidade Federal do Cariri", coords: [-7.23, -39.33], estado: "Ceará" },
  { nome: "Unilab - Universidade da Lusofonia Afro-Brasileira", coords: [-4.03, -38.63], estado: "Ceará" },
  { nome: "UFRN - Universidade Federal do Rio Grande do Norte", coords: [-5.84, -35.20], estado: "Rio Grande do Norte" },
  { nome: "UFERSA - Universidade Federal Rural do Semi-Árido", coords: [-5.20, -37.32], estado: "Rio Grande do Norte" },
  { nome: "UFPB - Universidade Federal da Paraíba", coords: [-7.13, -34.87], estado: "Paraíba" },
  { nome: "UFCG - Universidade Federal de Campina Grande", coords: [-7.23, -35.88], estado: "Paraíba" },
  { nome: "UFAPE - Universidade Federal do Agreste de Pernambuco", coords: [-8.89, -36.49], estado: "Pernambuco" },
  { nome: "UFAL - Universidade Federal de Alagoas", coords: [-9.65, -35.71], estado: "Alagoas" },
  { nome: "UFPE - Universidade Federal de Pernambuco", coords: [-8.05, -34.95], estado: "Pernambuco" },
  { nome: "UFRPE - Universidade Federal Rural de Pernambuco", coords: [-8.01, -34.95], estado: "Pernambuco" },
  { nome: "UNIVASF - Universidade Federal do Vale do São Francisco", coords: [-9.39, -40.50], estado: "Pernambuco" },
  { nome: "UFS - Universidade Federal de Sergipe", coords: [-10.91, -37.07], estado: "Sergipe" },
  { nome: "UFBA - Universidade Federal da Bahia", coords: [-12.97, -38.51], estado: "Bahia" },
  { nome: "UFOB - Universidade Federal do Oeste da Bahia", coords: [-12.15, -44.99], estado: "Bahia" },
  { nome: "UFRB - Universidade Federal do Recôncavo da Bahia", coords: [-12.82, -39.09], estado: "Bahia" },
  { nome: "UFSB - Universidade Federal do Sul da Bahia", coords: [-16.45, -39.09], estado: "Bahia" },

  // CENTRO-OESTE
  { nome: "UnB - Universidade de Brasília", coords: [-15.76, -47.87], estado: "Distrito Federal" },
  { nome: "UFMT - Universidade Federal de Mato Grosso", coords: [-15.61, -56.06], estado: "Mato Grosso" },
  { nome: "UFR - Universidade Federal de Rondonópolis", coords: [-16.47, -54.63], estado: "Mato Grosso" },
  { nome: "UFG - Universidade Federal de Goiás", coords: [-16.68, -49.25], estado: "Goiás" },
  { nome: "UFJ - Universidade Federal de Jataí", coords: [-17.88, -51.72], estado: "Goiás" },
  { nome: "UFCat - Universidade Federal de Catalão", coords: [-18.17, -47.94], estado: "Goiás" },
  { nome: "UFGD - Universidade Federal da Grande Dourados", coords: [-22.23, -54.81], estado: "Mato Grosso do Sul" },
  { nome: "UFMS - Universidade Federal de Mato Grosso do Sul", coords: [-20.47, -54.61], estado: "Mato Grosso do Sul" },

  // SUDESTE
  { nome: "UFMG - Universidade Federal de Minas Gerais", coords: [-19.87, -43.97], estado: "Minas Gerais" },
  { nome: "UFRJ - Universidade Federal do Rio de Janeiro", coords: [-22.84, -43.23], estado: "Rio de Janeiro" },
  { nome: "UFF - Universidade Federal Fluminense", coords: [-22.90, -43.10], estado: "Rio de Janeiro" },
  { nome: "UFRRJ - Universidade Federal Rural do Rio de Janeiro", coords: [-22.76, -43.68], estado: "Rio de Janeiro" },
  { nome: "UNIRIO - Universidade Federal do Estado do Rio de Janeiro", coords: [-22.92, -43.17], estado: "Rio de Janeiro" },
  { nome: "UFES - Universidade Federal do Espírito Santo", coords: [-20.31, -40.30], estado: "Espírito Santo" },
  { nome: "UFSCar - Universidade Federal de São Carlos", coords: [-21.98, -47.88], estado: "São Paulo" },
  { nome: "UNIFESP - Universidade Federal de São Paulo", coords: [-23.65, -46.63], estado: "São Paulo" },
  { nome: "UFABC - Universidade Federal do ABC", coords: [-23.64, -46.53], estado: "São Paulo" },
  { nome: "UFJF - Universidade Federal de Juiz de Fora", coords: [-21.76, -43.34], estado: "Minas Gerais" },
  { nome: "UFOP - Universidade Federal de Ouro Preto", coords: [-20.39, -43.50], estado: "Minas Gerais" },
  { nome: "UFLA - Universidade Federal de Lavras", coords: [-21.24, -45.00], estado: "Minas Gerais" },
  { nome: "UFV - Universidade Federal de Viçosa", coords: [-20.75, -42.87], estado: "Minas Gerais" },
  { nome: "UFTM - Universidade Federal do Triângulo Mineiro", coords: [-19.75, -47.93], estado: "Minas Gerais" },
  { nome: "UFSJ - Universidade Federal de São João del-Rei", coords: [-21.13, -44.25], estado: "Minas Gerais" },
  { nome: "UFU - Universidade Federal de Uberlândia", coords: [-18.91, -48.26], estado: "Minas Gerais" },
  { nome: "UNIFAL-MG - Universidade Federal de Alfenas", coords: [-21.43, -45.94], estado: "Minas Gerais" },
  { nome: "UNIFEI - Universidade Federal de Itajubá", coords: [-22.42, -45.45], estado: "Minas Gerais" },
  { nome: "UFVJM - Universidade Federal dos Vales do Jequitinhonha e Mucuri", coords: [-17.85, -41.51], estado: "Minas Gerais" },

  // SUL
  { nome: "UFPR - Universidade Federal do Paraná", coords: [-25.43, -49.27], estado: "Paraná" },
  { nome: "UTFPR - Universidade Tecnológica Federal do Paraná", coords: [-25.43, -49.27], estado: "Paraná" },
  { nome: "UNILA - Universidade Federal da Integração Latino-Americana", coords: [-25.43, -54.59], estado: "Paraná" },
  { nome: "UFSC - Universidade Federal de Santa Catarina", coords: [-27.60, -48.52], estado: "Santa Catarina" },
  { nome: "UFFS - Universidade Federal da Fronteira Sul", coords: [-27.10, -52.61], estado: "Santa Catarina" },
  { nome: "UFRGS - Universidade Federal do Rio Grande do Sul", coords: [-30.03, -51.22], estado: "Rio Grande do Sul" },
  { nome: "UFPel - Universidade Federal de Pelotas", coords: [-31.77, -52.34], estado: "Rio Grande do Sul" },
  { nome: "UFSM - Universidade Federal de Santa Maria", coords: [-29.71, -53.72], estado: "Rio Grande do Sul" },
  { nome: "UFCSPA - Universidade Federal de Ciências da Saúde de Porto Alegre", coords: [-30.03, -51.22], estado: "Rio Grande do Sul" },
  { nome: "FURG - Universidade Federal do Rio Grande", coords: [-32.03, -52.09], estado: "Rio Grande do Sul" },
  { nome: "UNIPAMPA - Universidade Federal do Pampa", coords: [-31.33, -54.10], estado: "Rio Grande do Sul" }
];

universidades.forEach(u => {
  L.marker(u.coords)
    .addTo(map)
    .bindPopup(`<b>${u.nome}</b><br>${u.estado}`);
});
