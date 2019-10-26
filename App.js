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
import { BleManager } from 'react-native-ble-plx';
import { Platform, View, Text } from 'react-native';

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
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            const readCharacteristic = device.readCharacteristicForService("00001800-0000-1000-8000-00805f9b34fb", "00001800-0000-1000-8000-00805f9b34fb");
            console.log('then2', readCharacteristic)
            manager.servicesForDevice("00:1C:97:19:10:A0")
              .then(data => {
                console.log('data:', data)
                manager.readCharacteristicForDevice("00:1C:97:19:10:A0", "00001800-0000-1000-8000-00805f9b34fb", "00001800-0000-1000-8000-00805f9b34fb")
                  .then(data => console.log('dataChats:', data))
              })
              .catch(err => console.log('err on device:', err))
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
