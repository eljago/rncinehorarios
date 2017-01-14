function getVideoHtml (video) {
  const {
    name,
    video_type: videoType,
    code
  } = video
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${name ? name : 'Video'}</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=320, user-scalable=no">
        <style type="text/css">
          body {
            margin: 0;
            padding: 0;
            background: #000;
          }
          .videoContainer {

          }
        </style>
      </head>
      <body>
        <div class="videoContainer">
          ${videoType === 'youtube' ? getYoutube(code) : ''}
        </div>
      </body>
    </html>
  `
}

function getYoutube (code) {
  return `
    <iframe
      width="200"
      height="100"
      src="https://www.youtube.com/embed/${code}?rel=0&autoplay=1"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `
}

export {getVideoHtml}