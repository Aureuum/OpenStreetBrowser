var start_location_toolbox;
var start_location_form;

function start_location_options() {
  var form=document.getElementById("startform");
  var start_value=null;
  for(var i=0; i<form.elements["start_value"].length; i++) {
    if(form.elements["start_value"][i].checked) {
      start_value=form.elements["start_value"][i].value;
    }
  }
  if((form.elements["start_save"].checked)&&(start_value!=null)) {
    cookie_write("start_value",start_value);
  } else {
    cookie_delete("start_value");
  }
  start_location_start(start_value);
  start_location_toolbox.deactivate();
}

function start_location_start(start_value) {
  switch (start_value) {
    case "geolocation":
      geo_init();
      break;
    case "lastview":
      set_location(lastview);
      break;
    case "savedview":
      set_location(cookie_read("_osb_permalink"));
      break;
    case "startnormal":
      break;
    default:
      call_hooks("start_location_start", start_value);
  }
}

function start_location_options_list() {
  var text="";
  var opt=cookie_read('start_value');
  if(!opt)
    opt="startnormal";

  text += "<div id='start_location_list'>\n";
  if(lastview=cookie_read("_osb_location")) {
    text += "<input type=\"radio\" name=\"start_value\" id=\"lastview\" value=\"lastview\" "+(opt=="lastview"?"checked":"")+"><label for=\"lastview\">"+lang("start_location:lastview")+"</label></br>";
  }
  if (navigator.geolocation) {
    text += "<input type=\"radio\" name=\"start_value\" id=\"geolocation\" value=\"geolocation\" "+(opt=="geolocation"?"checked":"")+"><label for=\"geolocation\">"+lang("start_location:geolocation")+"</label></br>";
  }
  if(cookie_read("_osb_permalink")) {
    text += "<input type=\"radio\" name=\"start_value\" id=\"savedview\" value=\"savedview\" "+(opt=="savedview"?"checked":"")+"><label for=\"savedview\">"+lang("start_location:savedview")+"</label></br>";
  }
  text += "<input type=\"radio\" name=\"start_value\" id=\"startnormal\" value=\"startnormal\" "+(opt=="startnormal"?"checked":"")+"><label for=\"startnormal\">"+lang("start_location:startnormal")+"</label></br>";
  text += "</div>\n";

  return text;
}

function start_location_activate() {
  var text = "<i>"+lang("start_location:choose")+":</i><br><form id=\"startform\" style=\"margin-bottom:3px;\">";
  text += start_location_options_list();
  text += "</br><input type=\"button\" name=\"start\" value=\""+lang("ok")+"\" onclick=\"start_location_options()\"><input type=\"checkbox\" name=\"start_save\" id=\"save\" value=\"save\"><label for=\"save\">"+lang("start_location:remember")+"</label></br></form>";

  start_location_toolbox.content.innerHTML=text;
  start_location_form=document.getElementById("startform");

  call_hooks("start_location_activate", start_location_form);

  var c=cookie_read('start_value');
  if(c) {
    document.getElementById('save').checked=true;
  }
}

function start_location_permalink_update(link) {
  cookie_write("_osb_location", hash_to_string(link));
}

function start_location_recv_permalink(hash) {
  cookie_write("_osb_permalink", hash);
}

function start_location_init() {
  start_location_toolbox=new toolbox({
    icon: "plugins/start_location/icon.png",
    icon_title: lang("start_location:name"),
    weight: -5,
    callback_activate: start_location_activate
  });
  register_toolbox(start_location_toolbox);

  lastview=cookie_read("_osb_location");

  if(((location.hash=="") || (location.hash=="#")) && (cookie_read("start_value")==null)) {
    start_location_toolbox.activate();
  }
}

function start_location_post_init() {
  if((location.hash=="") || (location.hash=="#")) {
    start_location_start(cookie_read("start_value"));
  }
}

function start_location_options_show(list) {
  var ret1;

  ret1 ="<h4>"+lang("start_location:name")+"</h4>\n";
  ret1+="<div class='options_help'>"+lang("start_location:options_help")+"</div>\n";
  ret1+= start_location_options_list();

  var d=document.createElement("div");
  d.innerHTML=ret1;

  list.push([ 0, d ]);
}

function start_location_options_save() {
  options_set("start_value", options_radio_get("start_value"));
}

register_hook("init", start_location_init);
register_hook("post_init", start_location_post_init);
register_hook("permalink_update", start_location_permalink_update);
register_hook("recv_permalink", start_location_recv_permalink);
register_hook("options_show", start_location_options_show);
register_hook("options_save", start_location_options_save);
