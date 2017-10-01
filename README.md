# simple-freesound

Simple library for Node.js and the browser offering an intuitive interface to
access the basic functionalities of
[freesound api](http://freesound.org/docs/api/).

Its main goal is to ease the process of querying sounds from a few search terms
and filters, and to download their hq mp3 previews right away.

It is composed of two classes,
`client/SimpleFreesound` and `server/SimpleFreesound`.
Both are very similar, except the download methods which keep the resulting
audio buffers as local variables in the client class, and download the hq mp3
preview files on the hard drive in the server class.
