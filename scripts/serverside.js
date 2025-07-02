
const userInfo = $.getJSON('https://ipapi.co/json/', data => {
    $("#ip").text(data.ip);
    $('#isp').text(data.org);
    $('#country').text(data.country_name);
    $('#city').text(data.region);
    $("#gmaps").attr("src", "https://www.google.com/maps?q="+data.latitude+","+data.longitude+"&output=embed");

    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        ip: data.ip,
        isp: data.org,
        country: data.country_name,
        city: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date().toISOString()
      }),
      success: function(response) {
        console.log('Data successfully sent to server');
      },
      error: function(xhr, status, error) {
        console.error('Error sending data:', error);
      }
    });
  });
  