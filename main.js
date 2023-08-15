import champions from './data.js';
let randomIndex = Math.floor(Math.random() * champions.length);
const randomChampion = champions[randomIndex];

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].championName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].championName.substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].championName.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i].championName + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }

  function compareArrays(array1, array2){
    let result = { exact: false, similar: false };
    if(array1.length === array2.length && array1.every((item, index) => item === array2[index])){
      result.exact = true;
    }
    const sharedItems = array1.filter(item => array2.includes(item));
    if(sharedItems.length > 0){
      result.similar = true;
    }
    return result;
  }

  autocomplete(document.getElementById("selected-champion"), champions);

  const tableBody = document.getElementById("champion-table-body");
  tableBody.innerHTML = "";

  const inputForm = document.getElementById("input-form");
  inputForm.addEventListener('submit', e => {
    e.preventDefault();
    const selectedChampionInput = document.getElementById("selected-champion").value;
    const selectedChampion = champions.find(c => c.championName === selectedChampionInput);
    const row = document.createElement('tr');
    const year = selectedChampion.release_date.slice(0, 4);

    const genderClass = randomChampion.gender === selectedChampion.gender? "cell-green": "cell-red";

    const positionText = selectedChampion.positions.join(", ");
    let positionsClass = "cell-red";
    const positionResult = compareArrays(randomChampion.positions, selectedChampion.positions);
    if(positionResult.similar)
      positionsClass = "cell-yellow";
    if(positionResult.exact)
      positionsClass = "cell-green";

    let speciesClass = "cell-red";
    const speciesResult = compareArrays(randomChampion.species, selectedChampion.species);
    if(speciesResult.similar)
      speciesClass = "cell-yellow";
    if(speciesResult.exact)
      speciesClass = "cell-green";

    const resourceClass = randomChampion.resource === selectedChampion.resource? "cell-green": "cell-red";

    let rangeClass = "cell-red";
    const rangeResult = compareArrays(randomChampion.range_type, selectedChampion.range_type);
    if(rangeResult.similar)
      rangeClass = "cell-yellow";
    if(rangeResult.exact)
      rangeClass = "cell-green";

    let regionClass = "cell-red";
    const regionResult = compareArrays(randomChampion.regions, selectedChampion.regions);
    if(regionResult.similar)
      regionClass = "cell-yellow";
    if(regionResult.exact)
      regionClass = "cell-green";

    let yearClass = "cell-red";
    let selectedYear = parseInt(year);
    let randomYear = parseInt(randomChampion.release_date.slice(0, 4));

    if(randomYear > selectedYear)
      yearClass = "cell-later";

    if(randomYear < selectedYear)
      yearClass = "cell-before";

    if(randomYear === selectedYear)
      yearClass = "cell-green";

    const nameClass = randomChampion.championName === selectedChampion.championName? "cell-green": "cell-blue";

    row.innerHTML = `
    <td class="${nameClass}">${selectedChampion.championName}</td>
    <td class="${genderClass}">${selectedChampion.gender}</td>
    <td class="${positionsClass}">${positionText}</td>
    <td class="${speciesClass}">${selectedChampion.species.join('\n')}</td>
    <td class="${resourceClass}">${selectedChampion.resource}</td>
    <td class="${rangeClass}">${selectedChampion.range_type.join('\n')}</td>
    <td class="${regionClass}">${selectedChampion.regions.join('\n')}</td>
    <td class="${yearClass}">${year}</td>`;
    tableBody.prepend(row);
    e.target.reset();
  });