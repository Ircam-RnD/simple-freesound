# simple-freesound

Simple library for Node.js and the browser which provides an intuitive
interface to access the basic functionalities of freesound's RESTful api v2.

Its main goal is to ease the process of querying sounds from a few search terms
and filters, and to download their hq mp3 previews right away.

It is composed of two classes, `client/SimpleFreesound` and `server/SimpleFreesound`.
Both are very similar, except the download methods which keeps the resulting audio
buffers as local variables of the class in the client class, and downloads the mp3
files on the hard drive in the server class.
