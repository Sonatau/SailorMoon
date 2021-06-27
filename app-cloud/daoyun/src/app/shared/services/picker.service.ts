import { Injectable } from '@angular/core';
import { PickerController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PickerService {

  optionsList = {
    total: 0,
    options: []
  }
  public choosed = {
    name: "请选择",
    id: -1
  }

  constructor(public pickerController: PickerController) { }

  async createPicker(list) {
    this.optionsList = list;
    this.choosed = {
      name: "请选择",
      id: -1
    }
    console.log(this.optionsList);
    const picker = await this.pickerController.create({
      columns: this.getColumns(),
      buttons: [
          {
            text: '取消',
            role: 'cancel'
          },
          {
            text: '确认',
            handler: (value) => {
              var selected = this.getColumns();
              //console.log(value);
              this.choosed.name = selected[0].options[value.daoyun108.value].text;
              this.choosed.id = selected[0].options[value.daoyun108.value].id;
            }
          }
      ]
    });
    await picker.present();
    return this.choosed;
  }

  getColumns() {
    let options = [];
    for (let i = 0; i < this.optionsList.total; i++){
      options.push({
        text: this.optionsList.options[i].name,
        id: this.optionsList.options[i].id,
        value: i
      })
    }
    let columns = [];
    columns.push({
      name: `daoyun108`,
      options: options
    });
    //console.log(options);
    return columns;
  }
}
