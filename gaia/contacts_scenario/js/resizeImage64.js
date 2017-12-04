function resizeImage64(img, width, height, quality) {
    //console.log("resize image");
    if (img.indexOf("data:") === -1) {
        img = base64ToDataUri(img);
    }
    /// create an off-screen canvas
    var context = ctx.getContext('2d');
    var canvas = document.createElement('canvas'),
        context;
    /// set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    /// draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    /// encode image to data-uri with base64 version of compressed image
    //console.log("returning new image");
    return canvas.toDataURL('image/jpeg', quality); /// quality = [0.0, 1.0]
}

function base64ToDataUri(base64) {
    //console.log("change to data uri");
    return 'data:image/png;base64,' + base64;
}