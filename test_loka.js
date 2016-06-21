/*jshint esversion: 6 */
var fs = require('fs');
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
    transport: new Transport('http://localhost:8080/otp/routers/default/index/graphql')
});

var query = fs.readFileSync("./request.graphql", {'encoding':'utf-8'});

//TODO: this needs to be fixed but since we can't read maps on java side for
//now this is the best that is
const planConfig = {
    "directModes": "WALK,BICYCLE",
    "accessModes":"WALK",
    "egressModes":"WALK",
    "transitModes":"TRANSIT"
};

query = query.replace("DIRECTMODES", planConfig.directModes)
                .replace("ACCESSMODES", planConfig.accessModes)
                .replace("EGRESSMODES", planConfig.egressModes)
                .replace("TRANSITMODES", planConfig.transitModes);
const vars = {
  "fromLat": 46.5588307941309,
  "fromLon": 15.617108345031738,
  "toLat": 46.56080786072987,
  "toLon": 15.634145736694334,
  "wheelchair": false,
  "fromTime": "2015-02-05T07:30+02:00",
  "toTime": "2015-02-05T10:30+02:00"
};

/*console.log(query);*/

/*client.query(query, JSON.stringify(vars)).then(result => {*/
client.query(query, vars).then(result => {
    console.log("%j", result);
});
