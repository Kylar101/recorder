import Recorder from './recorder'

var rec = new Recorder('gUMArea', 0, 5)
// rec.setMediaType('video')
// alert(rec.getMediaType())
rec.initialiseMedia()

document.getElementById('toggle').addEventListener('click', () => {
	rec.toggleMediaType()
	rec.initialiseMedia()
})