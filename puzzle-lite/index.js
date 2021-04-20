// Disp new game depending on level i
function nuG(i) {
  var obj={};
  // Visually refresh level, indicate current
  $(".btnlvlcurr").removeClass("btnlvlcurr");
  $("#btn"+i).addClass("btnlvlcurr");
  $("#imgct").addClass("hid");
  $("#cvs").removeClass("hid");
  /* Set important values for the level's puzzle picture,
    currently all hardcoded:
    .siz is size in grid units
    .excIntArr is integer array of grid positions excluded
      because appear completely empty, indistinguishable
    .dnbl is art ID at source http://dan-ball.jp
    .fracX, .fracY are dimensions per 'puzzle piece'
    .cvsW, .cvsH are canvas dimensions */
  switch(i){
    case 1:
      obj.siz=6;
      obj.excIntArr=[0,1,5,6,11,24,29,30,31,35];
      obj.picId="renvori";
      obj.dnbl=75663;
      obj.filnam="ren_village.png";
      obj.fracX=370;
      obj.fracY=212;
      obj.cvsW=740;
      obj.cvsH=424;
      break;
    case 2:
      obj.siz=10;
      obj.excIntArr=[0,1,8,9,10,19,20,29,70,79,80,89,90,91,98,99];
      obj.picId="cosbori";
      obj.dnbl=75292;
      obj.filnam="cosy_bedroom.png";
      obj.fracX=176;
      obj.fracY=150;
      obj.cvsW=587;
      obj.cvsH=500;
      break;
  }
  baseNuG(obj);
}
/* Generate puzzle to be displayed using nuG() given
  properties (see above) */
function baseNuG(obj) {
  // Durstenfeld shuffle, to apply to 'puzzle piece' array
  function sA(x) {
    for (let i=x.length-1; i>0; i--) {
      const j = ~~(Math.random()*(i+1));
      [x[i],x[j]] = [x[j],x[i]];
    }
  }
  var img=new Image(),
    x,y,size=obj.siz,
    // Nested array of row and column coordinates for every grid unit
    n=[...Array(size**2)].map((e,i)=>[i/size|0,i%size]),
    exc=obj.excIntArr,
    cou=0,
    saneScor=size**2-obj.excIntArr.length;
  img.id=obj.picId;
  img.src=obj.filnam;
  $("#imgctlk").empty();
  imgctlk.appendChild(img);
  imgctlk.href=`http://dan-ball.jp/en/javagame/dust2/${obj.dnbl}.html`;
  [x,y]=[obj.fracX,obj.fracY];
  // Shuffle grid coordinates; will be compared against sorted during play
  sA(n);
  cvs.width=obj.cvsW;
  cvs.height=obj.cvsH;
  // Check 'piece' positions, except exc, against correct ones
  function isSolved() {
    return n.map((e,i)=>e[0]*size+e[1]==i).filter((e,i)=>exc.indexOf(i)<0).reduce((a,b)=>a+b,0)==saneScor;
  }
  // Add functionality to image only when it's loaded
  img.onload=function() {
    var ctx = cvs.getContext("2d"), i,j, oIdeX, oIdeY;
    function drawPiece(a,b,c,d) {
      ctx.drawImage(window[obj.picId], x*a+3,y*b+3, x-3,y-3, (x*c+3)/3,(y*d+3)/3, (x-3)/3,(y-3)/3);
    }
    for(i=0;i<size;++i){
      for(j=0;j<size;++j){
        let a=n[i*size+j];
        drawPiece(a[0],a[1],i,j);
      }
    }
    /* Swop 'pieces' on mouse/finger event. Player
      clicks first 'piece', then its destination;
      they swop as follows */
    function mov(e) {
      var ex=e.pageX-(cvs.offsetLeft+cvs.clientLeft),
        ey=e.pageY-(cvs.offsetTop+cvs.clientTop),
        ideX=ex/x*3|0,
        ideY=ey/y*3|0;
      ++cou;
      if (cou%2) {
        [oIdeX,oIdeY]=[ideX,ideY];
      } else {
        let a=ideX*size+ideY,b=oIdeX*size+oIdeY;
        [n[a],n[b]]=[n[b],n[a]];
        drawPiece(n[a][0],n[a][1],ideX,ideY);
        drawPiece(n[b][0],n[b][1],oIdeX,oIdeY);
        // Handle solved state: currently must stop listening for events
        if(isSolved()){
          remHandler();
        }
      }
    }
    cvs.addEventListener("click", mov);
    function remHandler() {
      cvs.removeEventListener("click", mov);
      // Wait 3000 ms, replace solved grid by the image w/o grid lines
      setTimeout(function() {
        $("#cvs").addClass("hid");
        $("#imgct").removeClass("hid");
        img.style.height=obj.cvsH+"px";
        img.style.border="1px solid #ccc";
      }, 3e3);
    }
  }
}
nuG(1); // Run level 1 by default for player's convenience