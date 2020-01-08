/**
 *
 * @format
 * @flow
 */

/*
   id: "00:1C:97:19:10:A0"
   uuid: "00001820-0000-1000-8000-00805f9b34fb"
   isConnectable: null
   localName: "PROCHBT001"
   manufacturerData: null
   mtu: 23
   name: "PROCHBT001"
   overflowServiceUUIDs: null
   rssi: -62
   serviceData: null
   serviceUUIDs: ["00001820-0000-1000-8000-00805f9b34fb"]
   solicitedServiceUUIDs: null
   txPowerLevel: null
*/

import React from 'react';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import { Platform, View, Text } from 'react-native';
import { Buffer } from 'buffer'
const manager = new BleManager();
class App extends React.Component {

  scanAndConnect = async () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'PROCHBT001') {

        // Stop scanning as it's not necessary if you are scanning for one device.
        manager.stopDeviceScan();

        // Proceed with connection.
        device.connect()
          .then(device => {
            console.log('deviceChars:', device)
            return manager.discoverAllServicesAndCharacteristicsForDevice(device.id)
          })
          .then((device) => {
            console.log('device', device)
            device.readCharacteristicForService('00001820-0000-1000-8000-00805f9b34fb', '00002a80-0000-1000-8000-00805f9b34fb')
              .then(finalData => {
                console.log('finalDAta', finalData.value)
                let buff = new Buffer(finalData.value, 'base64');
                console.log('buff', buff)
              }).catch(err => console.log('errondevice:', err))
            // const readCharacteristic = device.readCharacteristicForService("1820", "2a80");
            // console.log('then2', readCharacteristic)
            // manager.servicesForDevice(device.id)
            //   .then(services => {
            //     console.log('services:', services)
            //     services.map((srvc) => {
            //       if (srvc.uuid === '00001820-0000-1000-8000-00805f9b34fb') {
            //         manager.characteristicsForDevice(device.id, srvc.uuid)
            //           .then(characteristics => {
            //             console.log('characteristics:', [srvc.uuid, characteristics[0].uuid])
            //             device.readCharacteristicForService(srvc.uuid, characteristics[0].uuid)
            //               .then(finalData => {
            //                 console.log('finalDAta', finalData)
            //               }).catch(err => console.log('errondevice:', err))
            //           })
            //           .catch(err => console.log('err on device:', err))
            //       }
            //     })

            //   })
            //   .catch(err => console.log('err on device:', err))
          })
          .catch((error) => {
            console.log('error:', error)
            // Handle errors
          });
      }

      console.log('dev', device.id)
    });
  }

  render() {
    return (
      <View>
        <Text>hello</Text>
      </View>
    );
  }

  UNSAFE_componentWillMount() {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      }
      else {
        alert('power on bluetooth module')
      }
    }, true);
  }

};

export default App;
