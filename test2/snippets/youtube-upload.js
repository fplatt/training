var file_reader = fs.createReadStream(file_path, {encoding: 'binary'});
var file_contents = '';
file_reader.on('data', function(data)
{
    file_contents += data;
});
file_reader.on('end', function()
{
    var xml =
        '<?xml version="1.0"?>' +
        '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:yt="http://gdata.youtube.com/schemas/2007">' +
        '   <media:group>' + 
        '       <media:title type="plain">' + title + '</media:title>' +
        '       <media:description type="plain">' + description + '</media:description>' +
        '       <media:category scheme="http://gdata.youtube.com/schemas/2007/categories.cat">' + category + '</media:category>' +
        '       <media:keywords>' + keywords + '</media:keywords>' + 
        '   </media:group>' + 
        '</entry>';

    var boundary = Math.random();
    var post_data = [];
    var part = '';

    part = "--" + boundary + "\r\nContent-Type: application/atom+xml; charset=UTF-8\r\n\r\n" + xml + "\r\n";
    post_data.push(new Buffer(part, "utf8"));

    part = "--" + boundary + "\r\nContent-Type: video/mp4\r\nContent-Transfer-Encoding: binary\r\n\r\n";
    post_data.push(new Buffer(part, 'ascii'));
    post_data.push(new Buffer(file_contents, 'binary'));
    post_data.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');

    var post_length = 0;
    for(var i = 0; i < post_data.length; i++)
    {
        post_length += post_data[i].length;
    }

    var options = {
      host: 'uploads.gdata.youtube.com',
      port: 80,
      path: '/feeds/api/users/default/uploads?alt=json',
      method: 'POST',
        headers: {
            'Authorization': 'GoogleLogin auth=' + auth_key,
            'GData-Version': '2',
            'X-GData-Key': 'key=' + exports.developer_key,
            'Slug': 'video.mp4',
            'Content-Type': 'multipart/related; boundary="' + boundary + '"',
            'Content-Length': post_length,
            'Connection': 'close'
        }
    }

    var req = http.request(options, function(res)
    {
        res.setEncoding('utf8');

        var response = '';
        res.on('data', function(chunk)
        {
            response += chunk;
        });
        res.on('end', function()
        {
            console.log(response);
            response = JSON.parse(response);

            callback(response);
        });
    });

    for (var i = 0; i < post_data.length; i++)
    {
        req.write(post_data[i]);
    }

    req.on('error', function(e) {
      console.error(e);
    });

    req.end();
});