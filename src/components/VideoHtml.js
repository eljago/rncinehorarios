function getVideoHtml (params = {}) {
  const {
    title,
    videoType,
    code
  } = params
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title ? title : 'Hello Static World'}</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=320, user-scalable=no">
        <style type="text/css">
          body {
            margin: 0;
            padding: 0;
            background: #000;
            height: 100%;
          }
          .videowrapper{
            margin-top: 100px;
            position: relative;
            padding-top: 25px;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
          }
          .videowrapper iframe{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="videowrapper">
          ${videoType === 'youtube' ? getYoutube(code) : ''}
        </div>
      </body>
    </html>
  `
}

function getYoutube (code) {
  return `
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/${code}?rel=0&autoplay=1"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `
}

export {getVideoHtml}