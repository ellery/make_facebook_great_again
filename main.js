var array_of_tics = ['trump','hillary']; // Sets default filter values

function load() {
    chrome.storage.local.get('tics', function (result) {
        if(result.tics != undefined){
          array_of_tics = result.tics;
        }else{
          chrome.storage.local.set( {'tics': array_of_tics} );                    
        }
    });
} 

// http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

// http://codereview.stackexchange.com/questions/83717/filter-out-duplicates-from-an-array-and-return-only-unique-value
var array_unique = function(xs) {
  var seen = {}
  return xs.filter(function(x) {
    if (seen[x])
      return
    seen[x] = true
    return x
  })
}

function remove_tic_keyword(keyword){
  lower_case_keyword = keyword.toLowerCase();
  array_of_tics = removeA(array_of_tics, lower_case_keyword)
  jQuery(".tic_keyword_" + lower_case_keyword).show().removeClass('no_tic');
  jQuery(".tic_keyword_link_" + lower_case_keyword).remove().removeClass('no_tic');
  chrome.storage.local.set({'tics': array_of_tics});

}

function reset_tic_keywords(){
  array_of_tics = ['trump','hillary'];
  chrome.storage.local.set({'tics': array_of_tics});
}


function add_tic_keyword(keyword){
  var temp = array_of_tics
  lower_case_keyword = keyword.toLowerCase();
  temp.push(lower_case_keyword)
  var array = array_unique(temp);
  chrome.storage.local.set({'tics': array});
  array_of_tics = array;
}


load()

var app_name = "Make Facebook Great Again"
var no_tic_id_counter = 0


$('<script>')
   .attr('type', 'text/javascript')
   .text('function show_ticed_post(tracking_id){var link_node = document.getElementsByClassName("no_tic_link_tracking_id_"+tracking_id)[0]; link_node.parentNode.removeChild(link_node); document.getElementsByClassName("no_tic_tracking_id_"+tracking_id)[0].style.display = null; }')
   .appendTo('head');

function get_tracking_id(){
  no_tic_id_counter = no_tic_id_counter +1
  return no_tic_id_counter
  
}

$()

function show_ticed_post(tracking_id){
  var classes = document.getElementsByClassName("no_tic_link_tracking_id_"+tracking_id);
  var no_tic_class = classes[0];
  no_tic_class.style.display = null;
}

function hide_tic() {
  load() // refresh tag data
  // Facebook Trending
  jQuery.each(array_of_tics, function(index, value){
    jQuery("#pagelet_trending_tags_and_topics li").not(".no_tic").each(function(){
      var raw_text = jQuery(this).text().toLowerCase();
      if( raw_text.indexOf(value) >= 0){
        var tracking_id = get_tracking_id()
        jQuery(this).hide().addClass("tic_keyword_"+value+" no_tic no_tic_tracking_id_"+tracking_id)
      }
    })
    
    // Facebook News Feed
    jQuery(".tickerFeedMessage").not(".no_tic").each(function(){
      var raw_text = jQuery(this).text().toLowerCase();
      if( raw_text.indexOf(value) >= 0){
        var tracking_id = get_tracking_id()
        jQuery(this).parent().hide().addClass("tic_keyword_"+value+" no_tic no_tic_tracking_id_"+tracking_id)
      }
    })
    // Facebook User Content work around
    
    jQuery(".userContentWrapper").not(".no_tic").each(function(){
      var raw_text = jQuery(this).text().toLowerCase();
      if( raw_text.indexOf(value) >= 0){
        var tracking_id = get_tracking_id()
        if(jQuery(this).is(":visible")){
        $( "<h5 class=\"tic_keyword_link_"+value+" no_tic_link no_tic_link_tracking_id_"+tracking_id+"\">Hidden by "+app_name+": <a href=\"javascript:show_ticed_post("+tracking_id+");\">Click to Show</a></h5>" ).insertBefore( this );
        }
        jQuery(this).hide().addClass("tic_keyword_"+value+" no_tic no_tic_tracking_id_"+tracking_id)
      }
    })    
  })  
}

// Clear the old timer if one is set
if (typeof NoTicTimer != 'number'){
  clearInterval(NoTicTimer);
  NoTicTimer = undefined;
}

var NoTicTimer = setInterval(function(){ hide_tic() }, 2000);



chrome.runtime.onMessage.addListener(
    function(message, sender, callback) {
        switch(message.type) {
            case "removeKeyword":
                remove_tic_keyword(message.keyword)
                callback('ok');
                break;
            case "addKeyword":
                add_tic_keyword(message.keyword)
                callback('ok');
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);


