import { Component, OnInit, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthServiceProvider } from 'src/app/providers/auth-service/auth-service';
import { RecordRTCPromisesHandler, RecordRTC, MediaStreamRecorder } from 'recordrtc';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import Peer from 'peerjs';

const constraints: MediaStreamConstraints = { video: true, audio: false };

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.page.html',
  styleUrls: ['./video-call.page.scss'],
})
export class VideoCallPage implements OnInit {
  localVideo: HTMLMediaElement;
  remoteVideo: HTMLMediaElement;
  peer: Peer = null;
  connectedSession: Peer.DataConnection = null;
  currentCall: Peer.MediaConnection = null;
  dataConn: Peer.DataConnection = null;
  options: Peer.PeerJSOption;
  localStream: MediaStream = null;
  remoteStream: MediaStream = null;
  onRecording = false;
  onCall: boolean;
  opponentId: string = '';
  infoLabel: string;
  stream: any;
  recorder: RecordRTCPromisesHandler;
  videoStream: any;
  user: any;
  
  
  constructor(
    public auth: AuthServiceProvider,
    public elementRef: ElementRef,
    public platform: Platform
  ) {
    this.auth.setTitle('화상통화');
    this.onCall = false;
    this.onRecording = false;
    this.infoLabel = 'Initializing...';

    this.platform.ready().then(async () => {
      if (this.platform.is('ios')) {
        //cordova.plugins.iosrtc.registerGlobals();
      }
    });
  }

  async ngOnInit() {
  }

  ngAfterViewInit() {
    this.localVideo  = this.elementRef.nativeElement.querySelector('#local-video');
    this.remoteVideo = this.elementRef.nativeElement.querySelector('#remote-video');
  }

  ionViewDidEnter() {
    this.startApp();
  }
  
  ionViewWillLeave() {
    this.clearStreams(true);
    try { this.peer.disconnect(); } catch (e) { }
    this.peer = null
  }

  handleSuccess(stream: MediaStream) {
    this.localStream = stream;
    this.localVideo.srcObject = stream;
    
  }

  handleError(error: any) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
      // this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
      this.auth.presentAlert('The resolution px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
      this.auth.presentAlert('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    } else {
      this.auth.presentAlert(`getUserMedia error: ${error.name} : ` + error);
    }
  }

  async getMedia() {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
        if(stream) {
          this.handleSuccess(stream);
        } else {
          this.auth.presentAlert('내 카메라 스트림을 가져오지 못합니다.');
        }
      }).catch(error => {
        this.handleError(error);
      });
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true, video: true }, (stream) => {
        if(stream) {
          this.handleSuccess(stream);
        } else {
          this.auth.presentAlert('내 카메라 스트림을 가져오지 못합니다.');
        }
      }, (error) => {
        this.handleError(error);
      });
    } else {
      this.auth.presentAlert('미디어 디바이스를 찾을 수 없습니다.');
    }
  }

  wait() {

    this.peer.on('connection', (conn) => {
      this.connectedSession = conn ;

    });

    this.peer.on('disconnected', () => {
      this.onClickHangUp();
    })

    this.peer.on('call', (call) => {
      this.currentCall = call;
      this.onCall = true;
      this.onRecording = false;
      this.currentCall.answer(this.localStream);
      this.currentCall.on('stream', (stream) => {
          this.remoteStream = stream;
          this.setCallListeners();
      });
    });
  }

  startApp() {
    console.log('startApp');

    this.auth.getUser().then(user => {
      this.user = user ;
      try {
        this.getMedia();
      } catch (e) {
        this.handleError(e);
      }
      
      this.peer = new Peer(this.user.email.split('@')[0]);
      this.peer.on('open', () => {
        this.wait();
      });

      this.peer.on('close', () => {
        this.onClickHangUp();
        this.peer = null;
      });

      // this.peer.on('error', (err) => {
      //   this.auth.presentAlert('webrtc 연결 오류가 발생하였습니다. : '+ JSON.stringify(err));
      //   this.onClickHangUp();
      //   this.peer = null;
      // });
    });
  }

  async clearStreams(all: boolean = false) {

    if (all && this.localStream) {
      const tracks = this.localStream.getTracks();
      await tracks.forEach((track) => {
        track.stop();
      });
      this.localStream = null;
      this.localVideo.srcObject = null;
    }

    if (this.remoteStream) {
      const tracks = this.remoteStream.getTracks();
      await tracks.forEach((track) => {
        track.stop();
      });
      this.remoteStream = null;
      this.remoteVideo.srcObject = null;
    }

    try { this.currentCall.close(); } catch (e) { }
    try { this.connectedSession.close(); } catch (e) { }
    this.currentCall = null;
    this.connectedSession = null;
    //try { this.peer.disconnect(); } catch (e) { }
    // if (all) {
    //   try { this.peer.destroy(); } catch (e) { }
    //   this.peer = null;
    // }
  }

  setCallListeners() {

      if(this.localStream) {
        this.localVideo.srcObject = this.localStream;
      }

      if(this.remoteStream) {
        this.remoteVideo.srcObject = this.remoteStream;
      }
  }

  onClickCall = () => {
    if (!this.opponentId || this.opponentId.trim() === '') {
      console.warn('Opponent id is null');
      return;
    }

    if (this.onCall) {
      console.warn('Call is already started');
      return;
    }

    if(!this.peer) {
      
      this.peer = new Peer(this.user.email.split('@')[0]);
      this.peer.on('open', () => {
        this.wait();
      });

      this.peer.on('close', () => {
        this.onClickHangUp();
        this.peer = null;
      });

      // this.peer.on('error', (err) => {
      //   this.auth.presentAlert('webrtc 연결 오류가 발생하였습니다. : '+ JSON.stringify(err));
      //   this.onClickHangUp();
      //   this.peer = null;
      // });
    }

    this.currentCall = this.peer.call(this.opponentId.split('@')[0], this.localStream);
    if (!this.currentCall) {
      console.warn('Cannot establish the call');
      return;
    }
    this.currentCall.on('stream', (stream) => {
      this.remoteStream = stream;
      this.setCallListeners();
      this.onCall = true;
    });

    this.currentCall.on('close', () => {
      if(this.onCall) {
        this.onClickHangUp();
      }
    });
  };

  onClickHangUp = () => {
    this.clearStreams();
    this.onCall = false;
    if (this.onRecording) {
      this.onClickRecordEnd();
    }
  };

  onClickRecordStart() {
    this.onRecording = true;
    // this.videoStream = this.remoteStream.data.getVideoTracks();
    // this.remoteStream.data.getAudioTracks().forEach((audioTrack) => {
    //   this.videoStream.addTrack(audioTrack);
    // });

    this.recorder = new RecordRTCPromisesHandler(this.remoteStream, {
      type: 'video',
      recorderType: MediaStreamRecorder,
      mimeType: 'video/mp4'
    });

    this.recorder.startRecording();
  }

  download(filename, blob) {
    const pom = document.createElement('a');
    const url = URL.createObjectURL(blob);
    pom.setAttribute('href', url);
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    }
    else {
      pom.click();
    }
  }

  async onClickRecordEnd() {
    this.onRecording = false;
    await this.recorder.stopRecording();
    const blob = await this.recorder.getBlob();
    blob.lastModifiedDate = new Date();
    blob.name = new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString() + '-record.mp4';
    this.download(blob.name, blob);
  }
}
