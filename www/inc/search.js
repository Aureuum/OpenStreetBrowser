var search_last;

function search_focus(ob) {
  if(ob.value==lang_str["search_field"]) {
    ob.value='';
  }
  else if((ob.value!="")) {
    document.getElementById("osb_search_form").brush.style.visibility = 'visible';
  }
  document.getElementById("osb_search_form").osb_search.style.borderColor = '#cc9900';
}

function search_clear(ob) {
  ob.value='';
  document.getElementById("osb_search_form").brush.style.visibility = 'hidden';
  ob.focus();
}

function search_brush(ob,e) {
  if((ob.value!="")) {
    document.getElementById("osb_search_form").brush.style.visibility = 'visible';
  }
  else {
    document.getElementById("osb_search_form").brush.style.visibility = 'hidden';
  }
  if(e.which==27) {
    ob.value='';
  }
}

function search_onblur(ob) {
  if((ob.value=='\0')||(ob.value=="")) {
    ob.value=lang_str["search_field"];
    document.getElementById("osb_search_form").brush.style.visibility = 'hidden';
  }
  document.getElementById("osb_search_form").osb_search.style.borderColor = '#999999';
}

function search() {
  var search_form=document.getElementById("osb_search_form");

  var details_content=document.getElementById("details_content");
  var details=document.getElementById("details");
  location.hash="#search_"+search_form.elements.osb_search.value;
}

function real_search(value, param) {
  if(!param)
    param={};

  param.value=value;

  var x=map.calculateBounds().transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
  var viewbox=[ x.left, x.top, x.right, x.bottom ];
  param.viewbox=viewbox.join(",");

  ajax("search", param, search_result);

  search_last=value;
  details_content.innerHTML="Loading ...";
  details.className="info_loading";
}

function search_result(data) {
  var details_content=document.getElementById("details_content");
  var details=document.getElementById("details");

  var text=data.responseXML.getElementsByTagName("result");
  details_content.innerHTML=text[0].textContent;
  details.className="info";

  var osm=data.responseXML.getElementsByTagName("osm");
  load_objects_from_xml(osm);
}

function search_more() {
  var details_content=document.getElementById("details_content");
  var as=details_content.getElementsByTagName("a");
  var ai;
  var id;
  var shown=[];

  for(ai=0; ai<as.length; ai++) {
    if(id=as[ai].getAttribute("nominatim_id")) {
      shown.push(id);
    }
  }

  return real_search(search_last, { shown: shown.join(",") });
}
