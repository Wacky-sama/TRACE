const fs = require("fs");
const path = require("path");
const { Country, State, City } = require("country-state-city");

async function main() {
  const outDir = path.join(__dirname, "src", "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "otherCountriesProvincesCities.json");

  const countries = Country.getAllCountries();
  const result = {};

  for (const c of countries) {
    if (c.name.toLowerCase() === "philippines") continue;

    const states = State.getStatesOfCountry(c.isoCode);
    const countryObj = {};

    for (const s of states) {
      const cities = City.getCitiesOfState(c.isoCode, s.isoCode) || [];
      countryObj[s.name] = cities.map((ci) => ci.name);
    }

    result[c.name] = countryObj;
  }

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  console.log(
    `Done! ${Object.keys(result).length} countries written to ${outPath}`
  );
}

main().catch((e) => console.error("Error:", e));
