package uk.ac.kcl.ioppn.flare;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioDeviceCallback;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import static android.content.Context.AUDIO_SERVICE;


public class AudioSensor extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {
    private static ReactApplicationContext reactContext;
    private VolumeBroadcastReceiver volumeBR;
    private AudioManager am;

    AudioSensor(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addLifecycleEventListener(this);

        // Create an audio instance
        am = (AudioManager) context.getSystemService(AUDIO_SERVICE);

        // Listen to volume changes
        volumeBR = new VolumeBroadcastReceiver();

        // Listen to changes in audio routes
        am.registerAudioDeviceCallback(new AudioDeviceCallback() {
            @Override
            public void onAudioDevicesAdded(AudioDeviceInfo[] addedDevices) {
                AudioSensor.this.onDevicesChange();
            }

            @Override
            public void onAudioDevicesRemoved(AudioDeviceInfo[] removedDevices) {
                AudioSensor.this.onDevicesChange();
            }
        }, null);
    }

    @ReactMethod
    // Get the current volume and return it (Exposed to JS using Promises)
    public void getCurrentVolume(Promise promise) {
        promise.resolve(this.getCurrentVolume());
    }

    @ReactMethod
    // Check if headphones are the primary audio output (Exposed to JS using Promises)
    public void isHeadphonesConnected(Promise promise) {
        promise.resolve(this.isHeadphonesConnected());
    }

    public float getCurrentVolume() {
        int mediaVolume = am.getStreamVolume(AudioManager.STREAM_MUSIC);
        return mediaVolume * (float) 1/15;
    }

    public Boolean isHeadphonesConnected() {
        return this.isWiredHeadphonesConnected() || am.isBluetoothA2dpOn();
    }

    public boolean isWiredHeadphonesConnected(){
        AudioDeviceInfo[] audioDevices = am.getDevices(AudioManager.GET_DEVICES_ALL);
        for(AudioDeviceInfo deviceInfo : audioDevices){
            if(
                deviceInfo.getType() == AudioDeviceInfo.TYPE_WIRED_HEADPHONES ||
                deviceInfo.getType() == AudioDeviceInfo.TYPE_WIRED_HEADSET
            ){
                return true;
            }
        }
        return false;
    }

    private void onDevicesChange() {
        if (reactContext.hasCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("OutputChange", this.isHeadphonesConnected());
        }
    }

    private void onVolumeChange() {
        if (reactContext.hasCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("VolumeChange", this.getCurrentVolume());
        }
    }

    @Override
    public String getName() {
        return "AudioSensor";
    }

    private class VolumeBroadcastReceiver extends BroadcastReceiver {

        private boolean isRegistered = false;

        public void setRegistered(boolean registered) {
            isRegistered = registered;
        }

        public boolean isRegistered() {
            return isRegistered;
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals("android.media.VOLUME_CHANGED_ACTION")) {
                AudioSensor.this.onVolumeChange();
                Log.d("Volume", "Volume Changed!");
            }
        }
    }

    // -- Methods used to attach VolumeBroadcastReceiver to Volume intents
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {}

    @Override
    public void onNewIntent(Intent intent) {}

    @Override
    public void onHostResume() {
        if (!volumeBR.isRegistered()) {
            IntentFilter filter = new IntentFilter("android.media.VOLUME_CHANGED_ACTION");
            reactContext.registerReceiver(volumeBR, filter);
            volumeBR.setRegistered(true);
        }
    }

    @Override
    public void onHostPause() {
        if (volumeBR.isRegistered()) {
            reactContext.unregisterReceiver(volumeBR);
            volumeBR.setRegistered(false);
        }
    }

    @Override
    public void onHostDestroy() {
        if (volumeBR.isRegistered()) {
            reactContext.unregisterReceiver(volumeBR);
            volumeBR.setRegistered(false);
        }
    }
}
