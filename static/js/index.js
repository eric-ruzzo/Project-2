var today = new Date();

function init() {
    
    console.log('beginning')
    var today = new Date();
    var monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    d3.select("#report-date").text(date);
    console.log(date);
    

}    
                             


var comp_profiles = d3.select("#comp_profiles");

comp_profiles.on("click", function() {

      // Prevent the page from refreshing
      d3.event.preventDefault();
      location.replace("../comp_profiles")
      console.log('comp_profiles -click');
});



init();


