declare var MediaRecorder: any;

interface iConstructor {
    containerID: string
}

class Recorder {

    container: any
    start: any
    stop: any
    mediaOptions: {
        video: {
            tag: string,
            type: string,
            ext: string,
            gUM: { video: boolean, audio: boolean }
        },
        audio: {
            tag: string,
            type: string,
            ext: string,
            gUM: { audio: boolean }
        }
    }
    mediaType: {
        tag: string,
        type: string,
        ext: string,
        gUM: object
    }

    stream: any
    recorder: any
    chunks: any
    allRecorded: any
    counter: number

    constructor(constructor: iConstructor) {
        this.container = document.getElementById(`${constructor.containerID}`)
        this.mediaOptions = {
            video: {
                tag: 'video',
                type: 'video/mp4',
                ext: '.mp4',
                gUM: { video: true, audio: true }
            },
            audio: {
                tag: 'audio',
                type: 'audio/mp3',
                ext: '.mp3',
                gUM: { audio: true }
            }
        }
        this.mediaType = this.mediaOptions.audio
        this.counter = 0
        this.allRecorded = []
        this.container.insertAdjacentHTML('beforeend', '<button type="button" id="start">Start</button>')
        this.container.insertAdjacentHTML('beforeend', '<button type="button" id="stop">Stop</button>')
        // this.container.insertAdjacentHTML('beforeend', '<div id="countdownTimer"></div>')
        this.start = document.getElementById('start')
        this.stop = document.getElementById('stop')
    }

    /**
     * @function initialiseMedia
     * @description Generates the Recorder object
     */

    public initialiseMedia() {
        navigator.mediaDevices.getUserMedia(this.mediaType.gUM).then(_stream => {
            this.stream = _stream
            this.start.disabled = false
            this.recorder = new MediaRecorder(this.stream)
            this.recorder.ondataavailable = (e: any) => {
                this.chunks.push(e.data)
                this.allRecorded.push(e.data)
                // console.log(this.allRecorded)
                if (this.recorder.state == 'inactive') this.makeLink()
            }
            console.log('got media successfully')
        }).catch()

        this.start.addEventListener('click', () => {
            this.startRecording()
        })

        this.stop.addEventListener('click', () => {
            this.stopRecording()
        })
    }

    /**
     * @function setMediaType
     * @description Changes default media type to specified
     * 
     * @param type: string
     */
    public setMediaType(type: string) {
        if (type == 'video') {
            this.mediaType = this.mediaOptions.video
        } else {
            this.mediaType = this.mediaOptions.audio
        }
    }

    /**
     * @function toggleMediaType
     * @description toggles current media type
     */
    public toggleMediaType() {
        if (this.mediaType.tag == 'audio') {
            this.mediaType = this.mediaOptions.video
        } else {
            this.mediaType = this.mediaOptions.audio
        }
    }

    /**
     * @function changeFileType
     * @description changes export file type to specified
     * 
     * @param fileType string
     */
    public changeFileType(fileType: string) {
        this.mediaType.ext = fileType
    }

    /**
     * @function getMediaType
     * @description returns current media type
     * 
     * @returns string
     */
    public getMediaType(): string {
        return this.mediaType.tag
    }

    /**
     * @function startRecording
     * @description Starts the recording process
     */

    public startRecording() {
        this.start.disabled = true
        this.stop.disabled = false
        this.chunks = []
        this.recorder.start()
    }

    /**
     * @function stopRecording
     * @description Stops the recording process
     */

    public stopRecording() {
        this.stop.disabled = true
        this.recorder.stop()
        this.start.disabled = false
    }

    /**
     * @function getAllRecorded
     * @description returns all recorded media
     * 
     * @returns Array of media recordings
     */

    public getAllRecorded(): any {
        return this.allRecorded
    }

    /**
     * @function makeLink
     * @description prepares recorded media for download and shows downloadable link
     */

    private makeLink() {
        let blob = new Blob(this.chunks, { type: this.mediaType.type })
            , url = URL.createObjectURL(blob)
            , li = document.createElement('div')
            , mt: any = document.createElement(this.mediaType.tag)
            , bt = document.createElement('button')
            , hf = document.createElement('a')
            , dl = document.createElement('button')
        this.counter++
        mt.controls = true
        mt.src = url
        mt.id = 'media-file'

        hf.href = url
        hf.download = `${this.guid()}`

        li.id = `${hf.download}`

        bt.innerHTML = `download ${hf.download}${this.mediaType.ext}`
        hf.id = 'download-media-file'
        bt.classList.add('btn')

        dl.innerHTML = `delete media`
        dl.id = `delete-${this.counter}`
        dl.classList.add('btn')

        hf.appendChild(bt)
        li.appendChild(mt)
        li.appendChild(hf)
        li.appendChild(dl)
        this.container.appendChild(li)
        
        let dlBtn: any = document.getElementById(`delete-${this.counter}`)
        let outer: any = document.getElementById(hf.download)

        dlBtn.addEventListener('click', () => {
            outer.outerHTML = ''
        })
    }

    /**
     * @function guid
     * @description Generates a guid
     * 
     * @returns guid
     */

    private guid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
        this.s4() + '-' + this.s4() + this.s4() + this.s4()
    }

    /**
     * @function s4
     * @description builds part of a guid
     * 
     * @returns guid section as String
     */

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }
}

export default Recorder