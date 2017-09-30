import test from 'tape';
import SimpleFreesound from '../server/SimpleFreesound';

test('basic', (t) => {
  t.plan(1);

  const apiKey = 'your_api_key_here';
  const sf = new SimpleFreesound(apiKey, 'somewhere/to/download/files');

  sf.query({
    search: [ 'abstract' ],
    duration: [ 0, 1 ],
    users: [ 'joseph.larralde' ],
  })
  .then(() => sf.download())
  .then(() => {
    sf.writeToFile('soundsInfo.json');
    t.equal(true, true, 'true is true');
  });
});
