import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.checkPermissions();
    });
  }

  checkPermissions() {
    // @ts-ignore
    const permissions = cordova.plugins.permissions,
        permissionList = [permissions.CAMERA, permissions.WRITE_EXTERNAL_STORAGE];
    function errorCallback() {
        console.warn("permissions is not turned on");
    }
    function checkPermissionCallback(status) {
        if(!status.hasPermission) {
            permissions.requestPermissions(
                permissionList,
                status => {
                    if(!status.hasPermission) errorCallback();
                },
                errorCallback);
        }
    }
    permissions.hasPermission(permissionList, checkPermissionCallback, null);
  }
}

