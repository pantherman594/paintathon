let files;

$('input[type=file]').on('change', (e) => {
  files = e.target.files;
});

$('form').on('submit', (e) => {
  e.stopPropagation();
  e.preventDefault();

  $('.success, .error').hide();
  $('.uploading').show();
  const data = new FormData();
  $.each(files, (key, val) => {
    data.append(key, val);
  });

  $.ajax({
    url: '/upload',
    type: 'POST',
    data: data,
    dataType: 'json',
    processData: false,
    contentType: false,
    complete: (data2) => {
      console.log(data2);
      $('.uploading').hide();
      if (data2.status === 200) {
        $('.success').show();
      } else {
        $('.error').show();
      }
    },
  });
});
