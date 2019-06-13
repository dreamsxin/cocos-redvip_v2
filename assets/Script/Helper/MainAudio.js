
cc.Class({
    extends: cc.Component,
    properties: {
    	audioBackground: {
            default: null,
            type: cc.AudioClip
        },
    	audioClick: {
            default: null,
            type: cc.AudioClip
        },
        audioClick2: {
            default: null,
            type: cc.AudioClip
        },
    },
    onLoad(){
    	//cc.audioEngine.setMusicVolume(0.3);
        //this.playMusic();
    },
    playMusic: function() {
        cc.audioEngine.playMusic(this.audioBackground, true);
    },
    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },
    _playSFX: function(clip) {
        if (this.isSound){
            cc.audioEngine.playEffect(clip, false);
        }
    },

    // Audio Effect
    playClick: function(){
    	this._playSFX(this.audioClick);
    },
    playUnClick: function(){
        this._playSFX(this.audioClick2);
    },
});
