$.domReady(function () {
  $('body')
    .append('<div id="octo_gallery_overlay"></div>')
    .append('<div id="octo_gallery_image_container"><img id="octo_gallery_image" src="" alt=""></div>')

  $(window)
    .bind('resize', function (e) {
      console.log('hello')
      set_image_dimension()
    })

  $(document)
    .bind('keydown', function (e) {
      if (e.keyCode === 27 && $('#octo_gallery_overlay').css('display') !== 'none') {
        e.preventDefault()
        console.log(e.keyCode)
        console.log(e.keyIdentifier)
        $('#octo_gallery_overlay').css('display', 'none')
        $('#octo_gallery_image_container').css('display', 'none')
      }
    })

  $('a.octo_gallery')
    .bind('click', function (e) {
      e.preventDefault()
      $('#octo_gallery_image').attr('src', $(this).attr('href')).load(function() {
        $(this).attr('data-width',  $(this).width())
        $(this).attr('data-height', $(this).height())
        set_image_dimension()
      })
      $('#octo_gallery_image_container').css('display', 'block')
      $('#octo_gallery_overlay').css('display', 'block')
    })

  function set_image_dimension() {
    var body_w     = $('body').width()
    var body_h     = $('body').height()
    var original_w = $('#octo_gallery_image').attr('data-width')
    var original_h = $('#octo_gallery_image').attr('data-height')
    var current_w  = $('#octo_gallery_image_container').width()
    var current_h  = $('#octo_gallery_image_container').height()

    var calculated_w = body_w - parseInt($('#octo_gallery_image').css('margin'))*2

    if(body_w >= current_w) {
      if (current_w < original_w) {
        $('#octo_gallery_image').css('width', calculated_w)
      }
      $('#octo_gallery_image_container').css('left', (body_w - current_w) / 2)
    } else {
      $('#octo_gallery_image_container').css('left', 0)
      $('#octo_gallery_image').css('width', calculated_w)
    }
  }
})
