let files;

$('input[type=file]').on('change', (e) => {
  files = e.target.files;
});

$('form').on('submit', (e) => {
  e.stopPropagation();
  e.preventDefault();

  $('.success, .error').hide();
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
      if (data2.status === 200) {
        $('.success').show();
      } else {
        $('.error').show();
      }
    },
  });
});
