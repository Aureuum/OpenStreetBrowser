//Karte, Haus, Zielflagge, Marker, Lineal, (Hilfe)

var timer, i=0, details_style, search_style, toolbox_style, details_top, oldtop=180, lastview, toolbox_active, toolbox_locked=0;

function toolbox_navigation() {
  if((toolbox_active=="navigation")||(toolbox_locked==1)){
    toolbox_hide();
    return;
  }
  toolbox_active="navigation";
  document.getElementById("toolbox1").className="toolboxbutton";
  document.getElementById("toolbox2").className="toolboxbutton_active";
  document.getElementById("toolbox3").className="toolboxbutton";
  document.getElementById("toolbox4").className="toolboxbutton";

  var text = "<i>Navigation</i><br/><br/>At first select your home and your destination on the map.<br/><br/><img src='img/toolbox_home.png'> home<br/><img src='img/toolbox_destination.png'> destination<br/><br/>";
  toolbox_fillwithtext(text);
}

function toolbox_favorites(update) {
  if(!update && ((toolbox_active=="favorites")||(toolbox_locked==1))){
    toolbox_hide();
    return;
  }
  toolbox_active="favorites";
  document.getElementById("toolbox1").className="toolboxbutton";
  document.getElementById("toolbox2").className="toolboxbutton";
  document.getElementById("toolbox3").className="toolboxbutton_active";
  document.getElementById("toolbox4").className="toolboxbutton";

  var text="<i>Favorites</i><br/><br/>";
  var nbrfav=0;
  for(var i in favorites_list) {
    text+="favorite "+(nbrfav+1)+": "+favorites_list[i].lon +", "+favorites_list[i].lat+"<br/>";
    nbrfav++;
  }
  if (nbrfav==0) {
    text += "Set favorites by clicking on the map...";
  }
  text += "<br/><br/>";
  toolbox_fillwithtext(text);
}

function toolbox_measure() {
  if((toolbox_active=="measure")||(toolbox_locked==1)){
    toolbox_hide();
    return;
  }
  toolbox_active="measure";
  document.getElementById("toolbox1").className="toolboxbutton";
  document.getElementById("toolbox2").className="toolboxbutton";
  document.getElementById("toolbox3").className="toolboxbutton";
  document.getElementById("toolbox4").className="toolboxbutton_active";

  var text = "<i>Measurements</i><br/><br/>At first set measure points on the map.<br/><br/>distance: 0m<br/>area: 0m²<br/><br/>";
  toolbox_fillwithtext(text);
}

function toolbox_fillwithtext(text) {
  return;
  if(toolbox_locked==0){
    toolbox_locked=1;
    document.getElementById("toolbox").innerHTML=text;
    details_style=document.getElementById("details").style;
    document.getElementById("toolbox").style.display="block"
    details_top=document.getElementById("toolbox").offsetHeight + 180;
    details_style.top=details_top+"px";

    toolbox_style=document.getElementById("toolbox").style;
    search_style=document.getElementById("search").style;
    if(oldtop<details_top) {
      timer = window.setInterval("toolbox_slide(oldtop,details_top,1)",10);
    } else {
      timer = window.setInterval("toolbox_slide(oldtop,details_top,-1)",10);
    }
  }
}

function toolbox_hide() {
  if(toolbox_locked==0){
    toolbox_locked=1;
    details_style=document.getElementById("details").style;
    search_style=document.getElementById("search").style;
    //document.getElementById("toolbox").style.display = "none";
    timer = window.setInterval("toolbox_slide(details_top,180,-1)",10);
    document.getElementById("toolbox1").className="toolboxbutton";
    document.getElementById("toolbox2").className="toolboxbutton";
    document.getElementById("toolbox3").className="toolboxbutton";
    document.getElementById("toolbox4").className="toolboxbutton";
    toolbox_active="";
  }
}

function toolbox_slide(from, to, direction) {
  var top = from+(direction*10*i);
  details_style.top=top+"px";
  search_style.top=top-37+"px";

  if(direction==1) {
    toolbox_style.clip="rect(0px, 250px, "+(top-from+oldtop-180)+"px, 0px)";
    if(top>=to) {
      window.clearInterval(timer);
      i=0;
      details_style.top=to+"px";
      search_style.top=to-37+"px";
      toolbox_style.clip="rect(0px, 250px, "+(to-from+oldtop-180)+"px, 0px)";
      oldtop=to;
      toolbox_locked=0;
    }
  } else if(direction==-1) {
    toolbox_style.clip="rect(0px, 250px, "+(top-180)+"px, 0px)";
    if(top<=to) {
      window.clearInterval(timer);
      i=0;
      details_style.top=to+"px";
      search_style.top=to-37+"px";
      toolbox_style.clip="rect(0px, 250px, "+(to-180)+"px, 0px)";
      oldtop=to;
      toolbox_locked=0;
    }
  } else {
    window.clearInterval(timer); //just to prevent running timers on wrong direction-input
    i=0;
  }
  i++;
}

function toolbox_old_init() {
}

register_hook("init", toolbox_old_init);
