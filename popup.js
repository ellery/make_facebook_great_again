
function refresh_local_storage(){
  
  
  chrome.storage.local.get('tics', function (result) {
    var tags = ''
    if(result.tics != undefined){
      jQuery.each(result.tics,function(index, value){
        tags += "<a class='remove-tag-click' href='#' data-keyword='"+value+"'>"+value+"</a>"
        if(index != result.tics.length -1){
          tags += ", "
        }
          
      })
  
      jQuery("#tic-tag-cloud").html(tags)
      jQuery(".remove-tag-click").click(function(){
        remove_keyword(jQuery(this).data('keyword'))
        jQuery(this).remove()
  
      });
    }
  });
 
  
}

$(document).ready(function() {
  refresh_local_storage()
});



jQuery("#add_keyword_button").click(function(){
  if(jQuery("#add_keyword_text").val().length >0 ){
    add_keyword(jQuery("#add_keyword_text").val() );
    jQuery("#add_keyword_text").val("")
    jQuery("#error").html("")
  }else{
    jQuery("#error").html("Please enter a keyword")
    
  }
  
  
})

function remove_keyword(keyword){
  
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    //tabs is an array even if there is only one result
    var message = {};
    message.type = "removeKeyword";
    message.keyword = keyword;
    chrome.tabs.sendMessage(tabs[0].id, message, function(response){
      refresh_local_storage() 
    });
  })
}


function add_keyword(keyword){
  
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    //tabs is an array even if there is only one result
    var message = {};
    message.type = "addKeyword";
    message.keyword = keyword;
    chrome.tabs.sendMessage(tabs[0].id,message, function(response){
      refresh_local_storage() 
    });
  })
}