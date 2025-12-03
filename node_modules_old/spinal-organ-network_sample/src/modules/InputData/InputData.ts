/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointGroup,
  InputDataEndpointDataType,
  InputDataEndpointType,
} from './InputDataModel/InputDataModel';

type onDataFunctionType = (obj: InputDataDevice) => void;

/**
 * Simulation Class to generate data from an extrenal source
 *
 * @class InputData
 */
class InputData {
  /**
   * @private
   * @type {onDataFunctionType}
   * @memberof InputData
   */
  private onData: onDataFunctionType;

  /**
   * @private
   * @type {InputDataDevice[]}
   * @memberof InputData
   */
  private devices: InputDataDevice[];

  /**
   *Creates an instance of InputData.
   * @memberof InputData
   */
  constructor() {
    const intervalTest = 2000;
    this.devices = [];
    this.onData = null;
    this.generateData();
    setInterval(this.onDataInterval.bind(this), intervalTest);
  }

  /**
   * @private
   * @memberof InputData
   */
  private onDataInterval() {
    if (this.onData !== null) {
      this.onData(this.getAndUpdateOneRandomDevice());
    }
  }

  /**
   * @param {onDataFunctionType} onData
   * @memberof InputData
   */
  public setOnDataCBFunc(onData: onDataFunctionType): void {
    this.onData = onData;
  }

  /**
   * @private
   * @memberof InputData
   */
  private generateData() {
    this.devices.push(this.generateDataDevice(1));
    this.devices.push(this.generateDataDevice(2));
    this.devices.push(this.generateDataDevice(3));
    this.devices.push(this.generateDataDevice(4));
    this.devices.push(this.generateDataDevice(5));
    this.devices.push(this.generateDataDevice(6));
    this.devices.push(this.generateDataDevice(7));
    this.devices.push(this.generateDataDevice(8));
    this.devices.push(this.generateDataDevice(9));
    this.devices.push(this.generateDataDevice(10));
    this.devices.push(this.generateDataDevice(11));
  }

  /**
   * @private
   * @returns {InputDataDevice}
   * @memberof InputData
   */
  private generateDataDevice(id: number): InputDataDevice {
    function createFunc(
      str: string,
      type: string,
      constructor: typeof InputDataDevice | typeof InputDataEndpointGroup,
    ): any {
      return new constructor(str, type, str, '');
    }

    const res: InputDataDevice = createFunc(
      `Automate ${id}`,
      'device',
      InputDataDevice,
    );

    const CHILD_3: InputDataEndpoint = new InputDataEndpoint(
      'Température',
      0,
      'Celsius',
      InputDataEndpointDataType.Double,
      InputDataEndpointType.Temperature,
      `DEVICE-${id} Temperature`,
      '',
    );
    const CHILD_4: InputDataEndpoint = new InputDataEndpoint(
      'Hydrometrie',
      0,
      '%',
      InputDataEndpointDataType.Integer,
      InputDataEndpointType.Hygrometry,
      `DEVICE-${id} Hydrometrie`,
      '',
    );
    const CHILD_5: InputDataEndpoint = new InputDataEndpoint(
      'Présence',
      false,
      '',
      InputDataEndpointDataType.Boolean,
      InputDataEndpointType.Occupation,
      `DEVICE-${id} Présence`,
      '',
    );
    res.children.push(CHILD_3, CHILD_4, CHILD_5);

    return res;
  }

  /**
   * @private
   * @param {(InputDataDevice|InputDataEndpointGroup)} deviceOrEnpointGroup
   * @memberof InputData
   */
  private updateDevice(
    deviceOrEnpointGroup: InputDataDevice | InputDataEndpointGroup,
  ): void {
    const maxTemp = 28;
    const minTemp = 16;
    const maxHydro = 100;
    const minHydro = 0;
    let randBool = 0;
    for (const child of deviceOrEnpointGroup.children) {
      if (child instanceof InputDataEndpoint) {
        child.idx += 1;
        // const nbr = Math.sin(child.idx * (Math.PI / 30));
        if (child.type === InputDataEndpointType.Temperature) {
          child.currentValue = Math.random() * (maxTemp - minTemp) + minTemp;
        } else if (child.type === InputDataEndpointType.Hygrometry) {
          child.currentValue = Math.random() * (maxHydro - minHydro) + minHydro;
        } else if (child.type === InputDataEndpointType.Occupation) {
          randBool = Math.random() * (2 - 0) + 0;
          if (randBool >= 1) {
            child.currentValue = true;
          } else {
            child.currentValue = false;
          }
        }
        // console.log(child);
        console.log(child.currentValue);
      } else if (
        child instanceof InputDataDevice ||
        child instanceof InputDataEndpointGroup
      ) {
        this.updateDevice(child);
      }
    }
  }

  /**
   * @private
   * @returns {InputDataDevice}
   * @memberof InputData
   */
  private getAndUpdateOneRandomDevice(): InputDataDevice {
    if (this.devices.length > 0) {
      const idx = Math.floor(Math.random() * this.devices.length);
      this.updateDevice(this.devices[idx]);
      return this.devices[idx];
    }
    this.generateData();
    return this.getAndUpdateOneRandomDevice();
  }
}

export { InputData };
