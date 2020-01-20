var devine;
var now = new Date();
var tableauMot = new Array();
var mots = new Array();
var tailleMot;
var coupsManques = 0;
var lettresTrouvees = 0;
var fini = false;

mots = [];
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyYONgnMSZoetwAi'}).base('appdRpWAoWEq1vHrC');

base('word_of_the_day').select().eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        var word = record.get('Word_of_the_day');
        var newWord = noAccent(word); //comme il n'existe pas de fonction pour transformer é en E on a du rajouter une étape (voir fonction noAccent ligne : 85)
        mots.push(newWord.toUpperCase());

    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
    // le choix du mot est en fonction du temps en secondes ca tourne a chaque fois
    devine = mots[now.getSeconds() % mots.length];
    tailleMot = devine.length;
        generateWordHtml();
        for (var i = 0; i < tailleMot; i++) tableauMot[i] = document.getElementById(i);
});

function changeCouleur(element, couleur) {
    element.style.backgroundColor = couleur;
};

function generateWordHtml(){
    var content = '';

    for (var i = 0; i < tailleMot; i++)
        content += "<td><p id=\"" + i + "\">" + devine.charAt(i) + "</p></td>";

    $('#mot').html('<tr>' + content + '</tr>');
}

function proposer(element) {
    console.log(tableauMot);
    if (element.style.backgroundColor == "#a6bdd6" || fini) return;
    var lettre = element.innerHTML;
    changeCouleur(element, "#a6bdd6");
    var trouve = false;

    for (var i = 0; i < tailleMot; i++) {
        if (tableauMot[i].innerHTML == lettre) {
            tableauMot[i].style.visibility = 'visible';
            trouve = true;
            lettresTrouvees++;
        };
    };

    // Si on trouve toujurs pas il faut relancer jusau'a 9 fois et changer l'image jpg pour que le bonhomme apparaisse
    if (!trouve) {
        coupsManques++;
        document.images['pendu'].src = "assets/images/pendu_" + coupsManques + ".jpg";
        if (coupsManques == 9) {
            alert("Désolé tu as perdu ;)");
            for (var i = 0; i < tailleMot; i++) tableauMot[i].style.visibility = 'visible';
            fini = true;
        };
    };
    if (lettresTrouvees == tailleMot) {
        alert("Bravo, tu as gagné ... Pour cette fois !");
        fini = true;
    };
};

//attention dans Artaible il y a des mots en minuscule et avec accent, il faut donc les convertir pour enlever les accents et ensuite mettre en toUpperCase
function noAccent(word)
{
    var tabLettre = [];

    for(var i = 0; i < word.length; i++)
    {
        tabLettre.push(word[i]);
    }

    for(var i = 0; i < tabLettre.length; i++)
    {
        if(tabLettre[i] == 'é'){
            tabLettre[i] = "e";
        }

        if(tabLettre[i] == "ï")
        {
            tabLettre[i] = "i";
        }

        if(tabLettre[i] == "è")
        {
            tabLettre[i] = "e";
        }
    }
    var newWord = "";
    for(var i = 0; i< tabLettre.length; i++)
    {
        newWord += tabLettre[i];
    }

    return newWord;
  

    
}