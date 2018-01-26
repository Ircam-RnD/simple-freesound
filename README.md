# simple-freesound

Simple library for Node.js and the browser offering an intuitive interface to
access the basic functionalities of
[freesound api](http://freesound.org/docs/api/).

Its main goal is to ease the process of querying sounds from a few search terms
and filters and downloading their hq mp3 previews.

It is composed of two classes,
`client/SimpleFreesound` and `server/SimpleFreesound`.
Both are very similar, except the download methods which keep the resulting
audio buffers as local variables in the client class, and download the hq mp3
preview files on the hard drive in the server class.

#### client example

```html5
<script type="text/javascript" src="simple-freesound.min.js"></script>

<script type="text/javascript">
  var apiKey = "your_freesound_api_key_goes_here";
  var sf = new simpleFreesound.SimpleFreesound(apiKey);

  sf.query({
    search: [ 'drum', 'bass' ],
    duration: [ 0.01, 1 ]
  });
</script>
```

#### server example

```javascript
import SimpleFreesound from 'simple-freesound';

const fs = new SimpleFreesound('your_freesound_api_key_goes_here', {
  destination: './downloads'
});
fs.query({
  search: [ 'space', 'insect' ],
  duration: [ 1, 20 ],
})
.then(() => fs.download())
.then(() => {
  console.log(fs.currentSoundsInfo);
});
```

#### @todo

* improve query parameter specification (or maybe just keep it simple)
* provide more varied example use cases and tests