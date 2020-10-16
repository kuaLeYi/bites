function sA(x) { // Durstenfeld-shuffle arr x in place; ES6 syntax
  for (let i = x.length-1; i > 0; --i) {
    const j = ~~(Math.random()*(i+1));
    [x[i], x[j]] = [x[j], x[i]];
  }
}
// show grid width chosen, responding to any slider change
wid.oninput = () => { $("#widv").text(wid.value); };
var q, qs = () => Math.sqrt(q.length), // grid | get its width via **.5
  qC, // var to be str to act as comparison standard for completion
  xPos, jc = n => $("#pos"+n), // gap pos | jQuery ele at pos n ltr ttb
  /* determine whether grid unsolvable ('insoluble') using formula at
   https://www.cs.bham.ac.uk/~mdr/teaching/
modules04/java2/TilesSolvability.html */
  notSolub = () => {
    var q_ = q.map(e => +e).filter(e => e), couInv = idx => q_
        .slice(idx+1).filter(e => e < q_[idx]).length,
      invList = q_.map((e, i) => couInv(i)),
      invTot = invList.reduce((a, b) => a+b, 0);
    if (q.length%2 > 0 || (q.indexOf("X")/qs()|0)%2 > 0)
      return invTot%2 > 0;
    else return invTot%2 < 1;
  }, t, updT, mc = "0"; /* time now | update elapsed time shown |
                         moves taken to complete */

function nugm() { // start new game
  $("#nugmbtn").blur(); // go out of focus on nugmbtn
  // reset vars
  mc = "0";
  t = new Date();
  clearInterval(updT);
  // restart timer method to show elapsed time for this new game
  updT = setInterval(function() {
    $("#faret").text(((new Date()-t)/1e3).toFixed(1))
  });
  // show real-time move counter, timer instead of data-when-complete
  $(".hid").removeClass("hid");
  $("#farec").addClass("hid");
  $("#farem,#faret").text("0");
  // new grid of width corr'ing to that selected by slider
  w = wid.value;
  q = [...Array(w*w-1)].map((e, i) => (i+1)+"").concat("X");
  qC = q.slice(0);
  do { // re-randomise grid till solvable
    sA(q);
  } while (notSolub());
  // remake actual HTML table to be populated
  $("#grid").html([...Array(qs())]
    .map(e => `<tr>${"<td></td>".repeat(qs())}</tr>`));
  // insert #s except at blank
  $('td').each(function(i) {
    this.id = "pos"+(i+1);
    var v = q[i];
    if (v == "X") xPos = i+1;
    else $(this).text(v);
  });
  $("#status").text("game started");
}
function uXP(n) { // change xPos to n & otherwise process it
  [q[n-1], q[xPos-1]] = [q[xPos-1], q[n-1]]; // update grid var
  xPos = n;
  var cmpBool = q.join`,` == qC; // simple completion bool
  if (cmpBool) {
    clearInterval(updT);
    // if haven't updated data-when-complete, do it
    if (mc == "0") {
      $("#fare,#farec").toggleClass("hid");
      mc = $("#farem").text();
      $("#faremc").text(mc);
      $("#faretc").text($("#faret").text());
    }
  }
  $("#status").html(cmpBool ? "<b>complete</b>" : "incomplete");
}
// move blank to pos n, process this, increment real-time move count
function swop(n) {
  c = jc(n);
  jc(xPos).text(c.text());
  c.text("");
  farem.innerHTML++;
  uXP(n);
}
/* attempt swop on arrow keys or WASD, except when rly using slider to
 select desired grid width; don't count move if can't swop anything */
$(document).keydown(function(e) {
  if ($("#wid").is(":focus")) return;
  switch (e.keyCode) {
    case 37:
    case 65:
      if (!(xPos%qs())) return;
      swop(xPos+1);
      break;
    case 38:
    case 87:
      if (((xPos-1)/qs()|0) == qs()-1) return;
      swop(xPos+qs());
      break;
    case 39:
    case 68:
      if (xPos%qs() == 1) return;
      swop(xPos-1);
      break;
    case 40:
    case 83:
      if (!((xPos-1)/qs()|0)) return;
      swop(xPos-qs());
      break;
  }
});